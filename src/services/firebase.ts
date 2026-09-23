/**
 * ProfitNext — Firebase & Firestore Integration Service
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  getDocFromServer,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AppItem, AppState, Order, AffiliatePartner, SiteSettings, WithdrawalRequest } from '../core/types.ts';
import { INITIAL_STATE } from '../core/store.ts';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Must use firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'settings', 'global'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration or network connection.");
    }
  }
}

// Google Sign-In with Popup
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Save/update user profile in Firestore
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Customer',
      photoURL: user.photoURL || '',
      role: user.email === 'newlifebegin2026@gmail.com' ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    }, { merge: true });

    return user;
  } catch (err) {
    console.error('Google login error:', err);
    throw err;
  }
}

// Logout
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Logout error:', err);
  }
}

// Load AppState from Firestore or seed initial defaults
export async function loadAppStateFromFirestore(): Promise<AppState> {
  try {
    const productsColl = collection(db, 'products');
    const settingsRef = doc(db, 'settings', 'global');
    const ordersColl = collection(db, 'orders');
    const affiliatesColl = collection(db, 'affiliates');

    // Fetch Products
    let productsSnap;
    try {
      productsSnap = await getDocs(productsColl);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'products');
    }

    let products: AppItem[] = [];
    if (productsSnap && !productsSnap.empty) {
      productsSnap.forEach(d => {
        products.push(d.data() as AppItem);
      });
    } else {
      // Seed default products to Firestore
      products = INITIAL_STATE.products;
      for (const p of products) {
        await setDoc(doc(db, 'products', p.id), p).catch(err => 
          console.warn('Initial product seed note:', err)
        );
      }
    }

    // Fetch Settings
    let settingsSnap;
    try {
      settingsSnap = await getDoc(settingsRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'settings/global');
    }

    let settings: SiteSettings = INITIAL_STATE.settings;
    if (settingsSnap && settingsSnap.exists()) {
      settings = { ...INITIAL_STATE.settings, ...settingsSnap.data() } as SiteSettings;
    } else {
      // Seed initial settings
      await setDoc(settingsRef, INITIAL_STATE.settings).catch(err => 
        console.warn('Initial settings seed note:', err)
      );
    }

    // Fetch Orders
    const orders: Order[] = [];
    try {
      const ordersSnap = await getDocs(ordersColl);
      ordersSnap.forEach(d => {
        orders.push(d.data() as Order);
      });
    } catch {
      // Non-admins might not be allowed to list all orders, which is expected under strict ABAC rules
    }

    // Fetch Affiliates
    const affiliates: AffiliatePartner[] = [];
    try {
      const affiliatesSnap = await getDocs(affiliatesColl);
      affiliatesSnap.forEach(d => {
        affiliates.push(d.data() as AffiliatePartner);
      });
    } catch {
      // Fallback
    }

    return {
      settings,
      products: products.length > 0 ? products : INITIAL_STATE.products,
      affiliates: affiliates.length > 0 ? affiliates : INITIAL_STATE.affiliates,
      partners: INITIAL_STATE.partners,
      orders: orders.length > 0 ? orders : INITIAL_STATE.orders,
      withdrawals: INITIAL_STATE.withdrawals,
      coupons: INITIAL_STATE.coupons,
      auditLogs: ['Firestore connected successfully']
    };
  } catch (err) {
    console.warn('Using local fallback with Firestore sync:', err);
    return INITIAL_STATE;
  }
}

// Persist single order in Firestore
export async function saveOrderToFirestore(order: Order, userId?: string) {
  const path = `orders/${order.id}`;
  try {
    const orderDoc = {
      ...order,
      userId: userId || auth.currentUser?.uid || null,
      email: order.email || auth.currentUser?.email || ''
    };
    await setDoc(doc(db, 'orders', order.id), orderDoc);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// Update order status in Firestore
export async function updateOrderInFirestore(orderId: string, updates: Partial<Order>) {
  const path = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// Persist affiliate in Firestore
export async function saveAffiliateToFirestore(affiliate: AffiliatePartner) {
  const path = `affiliates/${affiliate.id}`;
  try {
    await setDoc(doc(db, 'affiliates', affiliate.id), affiliate, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

// Save product in Firestore
export async function saveProductToFirestore(product: AppItem) {
  const path = `products/${product.id}`;
  try {
    await setDoc(doc(db, 'products', product.id), product, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Save site settings to Firestore
export async function saveSettingsToFirestore(settings: SiteSettings) {
  const path = 'settings/global';
  try {
    await setDoc(doc(db, 'settings', 'global'), settings, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

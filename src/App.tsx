/**
 * ProfitNext — Digital Apps & Course Platform
 */

import React, { useState, useEffect } from 'react';
import { loadAppState, saveAppState, DEFAULT_CREDENTIALS } from './core/store.ts';
import { AppItem, AppState, Order, AffiliatePartner, PartnerLeader } from './core/types.ts';
import { Header } from './components/Header.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { SideDrawer } from './components/SideDrawer.tsx';
import { CredentialsModal } from './components/CredentialsModal.tsx';
import { VideoPlayerModal } from './components/VideoPlayerModal.tsx';
import { AiAssistant } from './components/AiAssistant.tsx';
import { HomePage } from './modules/catalog/HomePage.tsx';
import { AppsPage } from './modules/catalog/AppsPage.tsx';
import { CoursePage } from './modules/course/CoursePage.tsx';
import { CheckoutPage } from './modules/checkout/CheckoutPage.tsx';
import { CustomerPortal } from './modules/portal/CustomerPortal.tsx';
import { AffiliateAuthPage } from './modules/affiliate/AffiliateAuthPage.tsx';
import { AffiliateDashboard } from './modules/affiliate/AffiliateDashboard.tsx';
import { PartnerAuthPage } from './modules/affiliate/PartnerAuthPage.tsx';
import { AdminLoginPage } from './modules/admin/AdminLoginPage.tsx';
import { AdminPanel } from './modules/admin/AdminPanel.tsx';
import { ProUnlockPage } from './modules/pro-unlock/ProUnlockPage.tsx';
import { CourseraPlusPage } from './modules/course/CourseraPlusPage.tsx';
import { detectReferralCode } from './services/tracking.ts';
import { forwardOrderToTelegram } from './services/telegram.ts';
import { isAdminLoggedIn, setAdminLoggedIn, getActiveAffiliateId, setActiveAffiliateId, getActivePartnerId, setActivePartnerId } from './services/auth.ts';
import { 
  auth, 
  loginWithGoogle, 
  logoutUser, 
  testConnection, 
  loadAppStateFromFirestore, 
  saveOrderToFirestore,
  saveAffiliateToFirestore
} from './services/firebase.ts';
import { onAuthStateChanged, User } from 'firebase/auth';

// URL Path & Hash Routing Helpers
export function getPathForView(view: string): string {
  switch (view) {
    case 'home':
      return '/';
    case 'apps':
      return '/apps';
    case 'course_detail':
      return '/course';
    case 'pro-unlock':
      return '/pro-unlock';
    case 'coursera-plus':
      return '/coursera-plus';
    case 'checkout':
      return '/checkout';
    case 'portal':
      return '/portal';
    case 'affiliate-login':
      return '/affiliate-login';
    case 'affiliate-dashboard':
      return '/affiliate-dashboard';
    case 'partner-login':
      return '/partner-login';
    case 'admin-login':
      return '/admin-login';
    case 'admin-panel':
      return '/admin-panel';
    default:
      return `/${view}`;
  }
}

export function getHashForView(view: string): string {
  switch (view) {
    case 'home':
      return '';
    case 'apps':
      return '#apps';
    case 'course_detail':
      return '#course';
    case 'pro-unlock':
      return '#pro-unlock';
    case 'coursera-plus':
      return '#coursera-plus';
    case 'checkout':
      return '#checkout';
    case 'portal':
      return '#portal';
    case 'affiliate-login':
      return '#affiliate-login';
    case 'affiliate-dashboard':
      return '#affiliate-dashboard';
    case 'partner-login':
      return '#partner-login';
    case 'admin-login':
      return '#admin-login';
    case 'admin-panel':
      return '#admin-panel';
    default:
      return `#${view}`;
  }
}

export function getViewFromLocation(pathname: string, hash: string): string {
  // 1. First prioritize hash (e.g. #pro-unlock, #coursera-plus, #apps, #course)
  const cleanHash = (hash || '')
    .replace(/^#+/, '')
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase();

  // 2. Then check pathname (e.g. /pro-unlock, /coursera-plus)
  const cleanPath = (pathname || '')
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase();

  const candidate = cleanHash || cleanPath;

  if (!candidate || candidate === 'home') return 'home';
  if (candidate === 'apps') return 'apps';
  if (candidate === 'course' || candidate === 'course-detail' || candidate === 'course_detail' || candidate === 'courses') return 'course_detail';
  if (candidate === 'pro-unlock' || candidate === 'prounlock' || candidate === 'pro-unlock-method' || candidate === 'pro') return 'pro-unlock';
  if (candidate === 'coursera-plus' || candidate === 'courseraplus' || candidate === 'coursera') return 'coursera-plus';
  if (candidate === 'checkout') return 'checkout';
  if (candidate === 'portal') return 'portal';
  if (candidate === 'affiliate' || candidate === 'affiliate-login') return 'affiliate-login';
  if (candidate === 'affiliate-dashboard') return 'affiliate-dashboard';
  if (candidate === 'partner' || candidate === 'partner-login') return 'partner-login';
  if (candidate === 'admin' || candidate === 'admin-login') return 'admin-login';
  if (candidate === 'admin-panel') return 'admin-panel';
  return 'home';
}

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadAppState());
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return getViewFromLocation(window.location.pathname, window.location.hash);
    }
    return 'home';
  });

  const navigateToView = (view: string, replace = false) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      const targetPath = getPathForView(view);
      const targetHash = getHashForView(view);
      const search = window.location.search || '';

      // Form URL with both Path and Hash so #Pagename always appears in the browser link!
      // Example: "/pro-unlock#pro-unlock" or "/#pro-unlock"
      const newUrl = view === 'home'
        ? (search ? `/${search}` : '/')
        : `${targetPath}${search}${targetHash}`;
      
      try {
        if (replace) {
          window.history.replaceState({ view }, '', newUrl);
        } else {
          window.history.pushState({ view }, '', newUrl);
        }
      } catch (_) {
        // Fallback for sandboxed iframe
        if (view === 'home') {
          window.location.hash = '';
        } else {
          window.location.hash = targetHash;
        }
      }

      // Explicitly keep window.location.hash synchronized
      if (view === 'home') {
        if (window.location.hash) {
          try {
            window.history.replaceState({ view: 'home' }, '', '/' + search);
          } catch (_) {
            window.location.hash = '';
          }
        }
      } else if (window.location.hash !== targetHash) {
        try {
          window.location.hash = targetHash;
        } catch (_) {}
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sync with browser Back/Forward (popstate) and Hash changes (hashchange)
  useEffect(() => {
    const handleUrlChange = () => {
      const matchedView = getViewFromLocation(window.location.pathname, window.location.hash);
      setCurrentView(matchedView);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Sync browser document title based on current view
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const titleMap: Record<string, string> = {
        'home': 'ProfitNext — Digital Apps & Course Platform',
        'apps': 'All Premium Apps — ProfitNext',
        'course_detail': 'AI Video Earning Masterclass — ProfitNext',
        'pro-unlock': 'Pro Unlock Method (Secret Tricks) — ProfitNext',
        'coursera-plus': 'Coursera Plus (7000+ Courses & Certificates) — ProfitNext',
        'checkout': 'Secure Checkout & Payment — ProfitNext',
        'portal': 'Customer Portal — ProfitNext',
        'affiliate-login': 'Affiliate Program — ProfitNext',
        'affiliate-dashboard': 'Affiliate Dashboard — ProfitNext',
        'partner-login': 'Partner Portal — ProfitNext',
        'admin-login': 'Admin Login — ProfitNext',
        'admin-panel': 'Admin Dashboard — ProfitNext'
      };
      if (titleMap[currentView]) {
        document.title = titleMap[currentView];
      }
    }
  }, [currentView]);
  const [selectedProduct, setSelectedProduct] = useState<AppItem>(() => {
    return loadAppState().products.find(p => p.id === 'course_ai_bundle') || loadAppState().products[0];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

  // Firebase User Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Video modal
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; videoId: string; title?: string }>({
    isOpen: false,
    videoId: 'Hf0Mvc_eKos',
    title: 'AI Video Masterclass'
  });

  // Automated Credentials Modal state
  const [credentialsModal, setCredentialsModal] = useState<{
    isOpen: boolean;
    orderId?: string;
    amount?: number;
  }>({
    isOpen: false
  });

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string; icon?: string } | null>(null);

  // Active user sessions
  const [activeAffiliate, setActiveAffiliate] = useState<AffiliatePartner | null>(null);
  const [activePartner, setActivePartner] = useState<PartnerLeader | null>(null);
  const [adminAuth, setAdminAuth] = useState<boolean>(() => isAdminLoggedIn());

  const showToast = (message: string, icon: string = '✨') => {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3000);
  };

  // Sync state to localStorage & in-memory
  const handleUpdateState = (newState: AppState) => {
    setAppState(newState);
    saveAppState(newState);
  };

  // Firebase initialization & connection test
  useEffect(() => {
    testConnection();

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email === 'newlifebegin2026@gmail.com') {
        setAdminAuth(true);
        setAdminLoggedIn(true);
      }
    });

    // Load persisted data from Firestore
    loadAppStateFromFirestore().then((firestoreState) => {
      setAppState(prev => {
        const merged: AppState = {
          ...prev,
          settings: firestoreState.settings || prev.settings,
          products: firestoreState.products.length > 0 ? firestoreState.products : prev.products,
          orders: firestoreState.orders.length > 0 ? firestoreState.orders : prev.orders,
          affiliates: firestoreState.affiliates.length > 0 ? firestoreState.affiliates : prev.affiliates,
        };
        saveAppState(merged);
        return merged;
      });
    }).catch(err => {
      console.warn('Firestore load initial state notice:', err);
    });

    return () => unsubscribe();
  }, []);

  // Google Login handler
  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      showToast(`স্বাগতম, ${user.displayName || user.email}!`, '👋');
    } catch (err) {
      console.error(err);
      showToast('Google লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।', '⚠️');
    }
  };

  // Google Logout handler
  const handleGoogleLogout = async () => {
    await logoutUser();
    showToast('লগআউট সম্পন্ন হয়েছে', '👋');
  };

  // Referral tracking on mount
  useEffect(() => {
    const ref = detectReferralCode();
    if (ref) {
      // Find affiliate and increment clicks
      setAppState(prev => {
        const updated = prev.affiliates.map(a => {
          if (a.code.toUpperCase() === ref.toUpperCase()) {
            return { ...a, clicks: (a.clicks || 0) + 1 };
          }
          return a;
        });
        const next = { ...prev, affiliates: updated };
        saveAppState(next);
        return next;
      });
      showToast(`রেফারেল কোড ${ref} সক্রিয় হয়েছে!`, '🎟️');
    }
  }, []);

  // Restore logged-in affiliate or partner
  useEffect(() => {
    const affId = getActiveAffiliateId();
    if (affId) {
      const found = appState.affiliates.find(a => a.id === affId);
      if (found) setActiveAffiliate(found);
    }
    const pId = getActivePartnerId();
    if (pId) {
      const foundP = appState.partners.find(p => p.id === pId);
      if (foundP) setActivePartner(foundP);
    }
  }, [appState]);

  // Main Action: Trigger Course Transaction Page at 399 Taka
  const handleOpenCourseTransaction = () => {
    let courseBundle = appState.products.find(p => p.id === 'course_ai_bundle');
    if (!courseBundle) {
      courseBundle = {
        id: 'course_ai_bundle',
        type: 'course',
        title: 'AI Video Earning Masterclass + Gemini Pro + CapCut Pro',
        subTitle: 'Course + Gemini Pro + CapCut Pro Full Bundle Access',
        price: 399,
        rawPrice: 999,
        status: 'published',
        accessMode: 'credentials_auto',
        includesBundle: true,
        includedCredentials: DEFAULT_CREDENTIALS
      };
    } else {
      courseBundle.price = 399; // Ensure strictly 399 Taka
    }
    setSelectedProduct(courseBundle);
    navigateToView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger Combo Package (350 Taka) Transaction Page
  const handleOpenComboTransaction = () => {
    let comboProduct = appState.products.find(p => p.id === 'combo_apps_350');
    const comboPrice = appState.settings.courseConfig?.comboPackage?.price || 350;
    const comboTitle = appState.settings.courseConfig?.comboPackage?.title || 'Gemini Pro + CapCut Pro VIP Combo Package';
    const comboSubTitle = appState.settings.courseConfig?.comboPackage?.subTitle || 'Course Videos + Apps Combo (2 Apps Full Access)';

    if (!comboProduct) {
      comboProduct = {
        id: 'combo_apps_350',
        type: 'bundle',
        title: comboTitle,
        subTitle: comboSubTitle,
        price: comboPrice,
        rawPrice: 850,
        resellerPrice: 280,
        commission: 70,
        status: 'published',
        accessMode: 'credentials_auto',
        includesBundle: true,
        includedCredentials: DEFAULT_CREDENTIALS
      };
    } else {
      comboProduct = {
        ...comboProduct,
        price: comboPrice,
        title: comboTitle,
        subTitle: comboSubTitle
      };
    }
    setSelectedProduct(comboProduct);
    navigateToView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger App Transaction Page
  const handleOpenAppTransaction = (app: AppItem) => {
    setSelectedProduct(app);
    navigateToView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order Confirmed Callback with Firebase persistence
  const handleOrderConfirmed = (order: Order) => {
    // 1. Add order to store
    const updatedOrders = [order, ...appState.orders];

    // 2. Increment affiliate order count and pending balance if applicable
    let updatedAffiliates = appState.affiliates;
    if (order.affiliateCode && order.affiliateCode !== 'Direct') {
      updatedAffiliates = appState.affiliates.map(a => {
        if (a.code.toUpperCase() === order.affiliateCode.toUpperCase()) {
          const updatedA = {
            ...a,
            ordersCount: (a.ordersCount || 0) + 1,
            wallet: {
              ...a.wallet,
              pending: a.wallet.pending + (order.commission || 0)
            }
          };
          saveAffiliateToFirestore(updatedA).catch(e => console.warn('Affiliate save error:', e));
          return updatedA;
        }
        return a;
      });
    }

    const nextState: AppState = {
      ...appState,
      orders: updatedOrders,
      affiliates: updatedAffiliates,
      auditLogs: [
        `অর্ডার #${order.id} সম্পন্ন: ${order.productTitle} (৳${order.amount}) TrxID: ${order.trxId}`,
        ...appState.auditLogs
      ]
    };

    handleUpdateState(nextState);

    // Persist order in Firebase Firestore
    saveOrderToFirestore(order, currentUser?.uid).catch(e => 
      console.warn('Firestore order save error:', e)
    );

    // 3. Forward to Telegram
    forwardOrderToTelegram(order, appState.settings);

    // 4. Open automated credentials modal with Gemini Pro & CapCut Pro logins
    setCredentialsModal({
      isOpen: true,
      orderId: order.id,
      amount: order.amount
    });

    showToast('পেমেন্ট সফল! ক্রেডেনশিয়াল আনলক হয়েছে ও Firebase এ সংরক্ষিত হয়েছে।', '🎉');
  };

  const handleToggleLanguage = () => {
    const nextLang = language === 'bn' ? 'en' : 'bn';
    setLanguage(nextLang);
    showToast(`Language switched to ${nextLang === 'en' ? 'English' : 'বাংলা'}`, '🌐');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <span>{toast.icon}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <Header
        onLogoClick={() => navigateToView('home')}
        onOpenMenu={() => setIsDrawerOpen(true)}
        whatsappGroupLink={appState.settings.whatsappGroupLink}
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'affiliate-login') {
            navigateToView(activeAffiliate ? 'affiliate-dashboard' : 'affiliate-login');
          } else {
            navigateToView(view);
          }
        }}
        onCourseTransactionClick={handleOpenCourseTransaction}
        currentUser={currentUser}
        onLoginGoogle={handleGoogleLogin}
        onLogoutGoogle={handleGoogleLogout}
      />

      {/* Side Drawer strictly 5 items in English */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={(view) => {
          if (view === 'affiliate-login') {
            navigateToView(activeAffiliate ? 'affiliate-dashboard' : 'affiliate-login');
          } else if (view === 'partner-login') {
            navigateToView('partner-login');
          } else if (view === 'admin-login') {
            navigateToView(adminAuth ? 'admin-panel' : 'admin-login');
          } else {
            navigateToView(view);
          }
        }}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Content Area: Responsive max-w for Mobile & Computer */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-5 md:p-6 pb-24 md:pb-12">
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <HomePage
            products={appState.products}
            settings={appState.settings}
            onGetCourseClick={() => navigateToView('course_detail')}
            onAppBuyClick={handleOpenAppTransaction}
            onViewCourseDetail={() => navigateToView('course_detail')}
            onBecomeAffiliateClick={() => navigateToView('affiliate-login')}
            onPlayPreviewVideo={(ytId) => setVideoModal({ isOpen: true, videoId: ytId, title: 'AI Video Masterclass' })}
          />
        )}

        {/* VIEW 2: APPS */}
        {currentView === 'apps' && (
          <AppsPage
            products={appState.products}
            onBuyClick={(app) => {
              if (app.id === 'course_ai_bundle' || app.id === 'combo_apps_350') {
                handleOpenComboTransaction();
              } else {
                handleOpenAppTransaction(app);
              }
            }}
          />
        )}

        {/* VIEW 3: COURSE DETAIL & SYLLABUS (Free Course Page + 350 Taka Combo Apps) */}
        {currentView === 'course_detail' && (
          <CoursePage
            settings={appState.settings}
            onBuyCourseBundle={handleOpenComboTransaction}
            onBuyCombo={handleOpenComboTransaction}
            onBuyApp={(appId) => {
              const target = appState.products.find(p => p.id === appId);
              if (target) handleOpenAppTransaction(target);
            }}
            showToast={showToast}
          />
        )}

        {/* VIEW 4: TRANSACTION / CHECKOUT PAGE */}
        {currentView === 'checkout' && (
          <CheckoutPage
            product={selectedProduct}
            settings={appState.settings}
            affiliates={appState.affiliates}
            coupons={appState.coupons}
            onOrderSuccess={handleOrderConfirmed}
            onBackToCatalog={() => navigateToView('home')}
            showToast={showToast}
          />
        )}

        {/* VIEW 5: CUSTOMER PORTAL */}
        {currentView === 'portal' && (
          <CustomerPortal
            orders={appState.orders}
            onStartCourse={() => navigateToView('course_detail')}
            showToast={showToast}
            currentUser={currentUser}
            onLoginGoogle={handleGoogleLogin}
          />
        )}

        {/* VIEW 6: AFFILIATE AUTH & REGISTRATION */}
        {currentView === 'affiliate-login' && (
          <AffiliateAuthPage
            appState={appState}
            onUpdateState={handleUpdateState}
            onLoginSuccess={(aff) => {
              setActiveAffiliate(aff);
              setActiveAffiliateId(aff.id);
              navigateToView('affiliate-dashboard');
            }}
            showToast={showToast}
          />
        )}

        {/* VIEW 7: AFFILIATE DASHBOARD */}
        {currentView === 'affiliate-dashboard' && activeAffiliate && (
          <AffiliateDashboard
            affiliate={activeAffiliate}
            appState={appState}
            onUpdateState={handleUpdateState}
            onLogout={() => {
              setActiveAffiliate(null);
              setActiveAffiliateId('');
              navigateToView('home');
              showToast('অ্যাফিলিয়েট লগআউট সম্পন্ন!', '👋');
            }}
            showToast={showToast}
          />
        )}

        {/* VIEW 8: PARTNER LEADER AUTH */}
        {currentView === 'partner-login' && (
          <PartnerAuthPage
            appState={appState}
            onLoginSuccess={(partner) => {
              setActivePartner(partner);
              setActivePartnerId(partner.id);
              showToast(`স্বাগতম পার্টনার লিডার ${partner.name}!`, '👑');
            }}
            showToast={showToast}
          />
        )}

        {/* VIEW 9: ADMIN LOGIN PAGE */}
        {currentView === 'admin-login' && (
          <AdminLoginPage
            onSuccess={() => {
              setAdminAuth(true);
              setAdminLoggedIn(true);
              navigateToView('admin-panel');
              showToast('এডমিন লগইন সফল!', '🛡️');
            }}
            showToast={showToast}
          />
        )}

        {/* VIEW 10: ADMIN PANEL */}
        {currentView === 'admin-panel' && (
          <AdminPanel
            appState={appState}
            onUpdateState={handleUpdateState}
            onLogout={() => {
              setAdminAuth(false);
              setAdminLoggedIn(false);
              navigateToView('home');
              showToast('এডমিন লগআউট সম্পন্ন!', '👋');
            }}
            showToast={showToast}
          />
        )}

        {/* VIEW 11: PRO UNLOCK METHOD (SECRET TRICKS) */}
        {currentView === 'pro-unlock' && (
          <ProUnlockPage
            settings={appState.settings}
            onOrderSuccess={handleOrderConfirmed}
            showToast={showToast}
          />
        )}

        {/* VIEW 12: COURSERA PLUS COURSE PAGE (1499 BDT) */}
        {currentView === 'coursera-plus' && (
          <CourseraPlusPage
            settings={appState.settings}
            onOrderSuccess={handleOrderConfirmed}
            showToast={showToast}
            onNavigateHome={() => navigateToView('home')}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar (Screenshots 1-3) */}
      <BottomNav
        activeTab={currentView}
        onTabChange={(tab) => {
          if (tab === 'affiliate') {
            navigateToView(activeAffiliate ? 'affiliate-dashboard' : 'affiliate-login');
          } else {
            navigateToView(tab);
          }
        }}
        onCourseTransactionClick={handleOpenComboTransaction}
      />

      {/* Automated Credentials Modal for Gemini Pro & CapCut Pro */}
      <CredentialsModal
        isOpen={credentialsModal.isOpen}
        onClose={() => setCredentialsModal({ isOpen: false })}
        orderId={credentialsModal.orderId}
        credentials={DEFAULT_CREDENTIALS}
        amount={credentialsModal.amount}
        onGoToPortal={() => {
          setCredentialsModal({ isOpen: false });
          navigateToView('portal');
        }}
      />

      {/* Video Lecture Modal */}
      <VideoPlayerModal
        isOpen={videoModal.isOpen}
        videoId={videoModal.videoId}
        title={videoModal.title}
        onClose={() => setVideoModal({ ...videoModal, isOpen: false })}
      />

      {/* Floating Bengali AI Assistant */}
      <AiAssistant
        products={appState.products}
        whatsappNumber={appState.settings.whatsappNumber}
        onOpenCourseTransaction={handleOpenCourseTransaction}
        onOpenAppTransaction={handleOpenAppTransaction}
        onNavigateToApps={() => navigateToView('apps')}
        onNavigateToPortal={() => navigateToView('portal')}
        onNavigateToProUnlock={() => navigateToView('pro-unlock')}
        onNavigateToCourseraPlus={() => navigateToView('coursera-plus')}
      />
    </div>
  );
}

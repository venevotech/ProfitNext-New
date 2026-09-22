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
import { detectReferralCode } from './services/tracking.ts';
import { forwardOrderToTelegram } from './services/telegram.ts';
import { isAdminLoggedIn, setAdminLoggedIn, getActiveAffiliateId, setActiveAffiliateId, getActivePartnerId, setActivePartnerId } from './services/auth.ts';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadAppState());
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<AppItem>(() => {
    return loadAppState().products.find(p => p.id === 'course_ai_bundle') || loadAppState().products[0];
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

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

  // Sync state to localStorage
  const handleUpdateState = (newState: AppState) => {
    setAppState(newState);
    saveAppState(newState);
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
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger App Transaction Page
  const handleOpenAppTransaction = (app: AppItem) => {
    setSelectedProduct(app);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order Confirmed Callback
  const handleOrderConfirmed = (order: Order) => {
    // 1. Add order to store
    const updatedOrders = [order, ...appState.orders];

    // 2. Increment affiliate order count and pending balance if applicable
    let updatedAffiliates = appState.affiliates;
    if (order.affiliateCode && order.affiliateCode !== 'Direct') {
      updatedAffiliates = appState.affiliates.map(a => {
        if (a.code.toUpperCase() === order.affiliateCode.toUpperCase()) {
          return {
            ...a,
            ordersCount: (a.ordersCount || 0) + 1,
            wallet: {
              ...a.wallet,
              pending: a.wallet.pending + (order.commission || 0)
            }
          };
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

    // 3. Forward to Telegram
    forwardOrderToTelegram(order, appState.settings);

    // 4. Open automated credentials modal with Gemini Pro & CapCut Pro logins
    setCredentialsModal({
      isOpen: true,
      orderId: order.id,
      amount: order.amount
    });

    showToast('পেমেন্ট সফল! ক্রেডেনশিয়াল আনলক হয়েছে।', '🎉');
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
        onLogoClick={() => setCurrentView('home')}
        onOpenMenu={() => setIsDrawerOpen(true)}
        whatsappGroupLink={appState.settings.whatsappGroupLink}
      />

      {/* Side Drawer strictly 5 items in English */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={(view) => {
          if (view === 'home') setCurrentView('home');
          else if (view === 'affiliate-login') {
            setCurrentView(activeAffiliate ? 'affiliate-dashboard' : 'affiliate-login');
          } else if (view === 'partner-login') {
            setCurrentView('partner-login');
          } else if (view === 'admin-login') {
            setCurrentView(adminAuth ? 'admin-panel' : 'admin-login');
          }
        }}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-lg w-full mx-auto p-3 sm:p-4 pb-24">
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <HomePage
            products={appState.products}
            settings={appState.settings}
            onGetCourseClick={handleOpenCourseTransaction}
            onAppBuyClick={handleOpenAppTransaction}
            onViewCourseDetail={() => setCurrentView('course_detail')}
            onBecomeAffiliateClick={() => setCurrentView('affiliate-login')}
            onPlayPreviewVideo={(ytId) => setVideoModal({ isOpen: true, videoId: ytId, title: 'AI Video Masterclass' })}
          />
        )}

        {/* VIEW 2: APPS */}
        {currentView === 'apps' && (
          <AppsPage
            products={appState.products}
            onBuyClick={(app) => {
              if (app.id === 'course_ai_bundle') {
                handleOpenCourseTransaction();
              } else {
                handleOpenAppTransaction(app);
              }
            }}
          />
        )}

        {/* VIEW 3: COURSE DETAIL & SYLLABUS */}
        {currentView === 'course_detail' && (
          <CoursePage
            settings={appState.settings}
            onBuyCourseBundle={handleOpenCourseTransaction}
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
            onBackToCatalog={() => setCurrentView('home')}
            showToast={showToast}
          />
        )}

        {/* VIEW 5: CUSTOMER PORTAL */}
        {currentView === 'portal' && (
          <CustomerPortal
            orders={appState.orders}
            onStartCourse={() => setCurrentView('course_detail')}
            showToast={showToast}
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
              setCurrentView('affiliate-dashboard');
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
              setActiveAffiliateId(null);
              setCurrentView('home');
              showToast('অ্যাফিলিয়েট লগআউট সফল', '👋');
            }}
            showToast={showToast}
          />
        )}

        {/* VIEW 8: PARTNER ADMIN AUTH */}
        {currentView === 'partner-login' && (
          <PartnerAuthPage
            appState={appState}
            onLoginSuccess={(partner) => {
              setActivePartner(partner);
              setActivePartnerId(partner.id);
              showToast(`স্বাগতম পার্টনার অ্যাডমিন ${partner.name}!`, '👑');
              setCurrentView('admin-panel');
            }}
            showToast={showToast}
          />
        )}

        {/* VIEW 9: ADMIN LOGIN PANEL */}
        {currentView === 'admin-login' && (
          <AdminLoginPage
            onSuccess={() => {
              setAdminAuth(true);
              setCurrentView('admin-panel');
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
              setCurrentView('home');
              showToast('অ্যাডমিন প্যানেল থেকে লগআউট সফল', '👋');
            }}
            showToast={showToast}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <BottomNav
        activeTab={currentView === 'checkout' && selectedProduct.id === 'course_ai_bundle' ? 'checkout_course' : currentView}
        onTabChange={(tab) => {
          if (tab === 'home') setCurrentView('home');
          else if (tab === 'apps') setCurrentView('apps');
          else if (tab === 'portal') setCurrentView('portal');
        }}
        onCourseTransactionClick={handleOpenCourseTransaction}
      />

      {/* Automated Credentials Modal (Gemini Pro + CapCut Pro + Course Access) */}
      <CredentialsModal
        isOpen={credentialsModal.isOpen}
        onClose={() => setCredentialsModal({ isOpen: false })}
        credentials={selectedProduct.includedCredentials || DEFAULT_CREDENTIALS}
        orderId={credentialsModal.orderId}
        amount={credentialsModal.amount || 399}
        onGoToPortal={() => {
          setCredentialsModal({ isOpen: false });
          setCurrentView('portal');
        }}
      />

      {/* Video Masterclass Player Modal */}
      <VideoPlayerModal
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({ ...videoModal, isOpen: false })}
        videoId={videoModal.videoId}
        title={videoModal.title}
      />

      {/* AI Assistant with Bengali Greeting & Voice/Chat Support */}
      <AiAssistant
        products={appState.products}
        whatsappNumber={appState.settings.whatsappNumber}
        onOpenCourseTransaction={handleOpenCourseTransaction}
        onOpenAppTransaction={handleOpenAppTransaction}
        onNavigateToApps={() => {
          setCurrentView('apps');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToPortal={() => {
          setCurrentView('portal');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

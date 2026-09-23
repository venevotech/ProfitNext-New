import React, { useState } from 'react';
import { 
  Plus, 
  Download, 
  Send, 
  CheckCircle2, 
  DollarSign, 
  Film, 
  Trash2, 
  Save, 
  Sparkles, 
  ExternalLink,
  Video,
  ListPlus
} from 'lucide-react';
import { 
  AppState, 
  Order, 
  AppItem, 
  CoursePageConfig, 
  CourseVideoModule, 
  ComboAppItem 
} from '../../core/types.ts';
import { DEFAULT_COURSE_CONFIG } from '../../core/store.ts';
import { updateOrderInFirestore, saveProductToFirestore, saveSettingsToFirestore } from '../../services/firebase.ts';

interface AdminPanelProps {
  appState: AppState;
  onUpdateState: (newState: AppState) => void;
  onLogout: () => void;
  showToast: (msg: string, icon?: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  appState,
  onUpdateState,
  onLogout,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'course-apps' | 'affiliates' | 'settings' | 'audit'>('orders');
  const [generatedKey, setGeneratedKey] = useState('Profit-E1005');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('350');
  const [newType, setNewType] = useState<'app' | 'course' | 'bundle'>('app');

  // Course & Apps Editor state
  const [courseConfig, setCourseConfig] = useState<CoursePageConfig>(() => {
    return appState.settings.courseConfig || DEFAULT_COURSE_CONFIG;
  });

  const orders = appState.orders || [];
  const directOrders = orders.filter(o => !o.affiliateCode || o.affiliateCode === 'Direct');
  const affOrders = orders.filter(o => o.affiliateCode && o.affiliateCode !== 'Direct');

  const totalSale = orders.length;
  const directSale = directOrders.length;
  const affSale = affOrders.length;

  const directProfit = directOrders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  const affProfit = affOrders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + Math.max(0, (o.amount || 0) - (o.commission || 0)), 0);

  const handleApproveOrder = (orderId: string) => {
    const updatedOrders = appState.orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'completed' as const };
      }
      return o;
    });

    const target = appState.orders.find(o => o.id === orderId);
    let updatedAffiliates = appState.affiliates;
    if (target?.affiliateCode && target.affiliateCode !== 'Direct') {
      updatedAffiliates = appState.affiliates.map(a => {
        if (a.code === target.affiliateCode) {
          const comm = target.commission || 0;
          return {
            ...a,
            wallet: {
              ...a.wallet,
              available: a.wallet.available + comm,
              totalEarned: a.wallet.totalEarned + comm,
              pending: Math.max(0, a.wallet.pending - comm)
            }
          };
        }
        return a;
      });
    }

    const newState = {
      ...appState,
      orders: updatedOrders,
      affiliates: updatedAffiliates,
      auditLogs: [`অর্ডার #${orderId} অ্যাডমিন দ্বারা অনুমোদিত হয়েছে।`, ...appState.auditLogs]
    };

    onUpdateState(newState);
    updateOrderInFirestore(orderId, { status: 'completed' }).catch(err => 
      console.warn('Firestore order approval sync note:', err)
    );
    showToast(`অর্ডার #${orderId} অনুমোদিত হয়েছে!`, '✅');
  };

  const handleGenerateKey = () => {
    const key = `Profit-E${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedKey(key);
    showToast(`নতুন কি তৈরি হয়েছে: ${key}`, '🔑');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProd: AppItem = {
      id: `prod_${Date.now()}`,
      title: newTitle.trim(),
      subTitle: newType === 'course' ? 'Online Course' : 'Digital Tool',
      price: Number(newPrice) || 350,
      type: newType,
      status: 'published'
    };

    const newState = {
      ...appState,
      products: [newProd, ...appState.products],
      auditLogs: [`নতুন প্রোডাক্ট যোগ করা হয়েছে: ${newTitle} (৳${newPrice})`, ...appState.auditLogs]
    };

    onUpdateState(newState);
    saveProductToFirestore(newProd).catch(err => 
      console.warn('Firestore product sync note:', err)
    );
    setShowAddProductModal(false);
    setNewTitle('');
    setNewPrice('350');
    showToast(`প্রোডাক্ট তৈরি সফল ও Firebase এ সংরক্ষিত!`, '✅');
  };

  // Save Course & Apps Config
  const handleSaveCourseConfig = () => {
    const updatedSettings = {
      ...appState.settings,
      courseConfig,
      courseBundlePrice: courseConfig.comboPackage.price || 350,
      whatsappGroupLink: courseConfig.whatsappGroupLink || appState.settings.whatsappGroupLink
    };

    // Update matching bundle/combo products in catalog
    const updatedProducts = appState.products.map(p => {
      if (p.id === 'combo_apps_350' || p.id === 'course_ai_bundle') {
        return {
          ...p,
          price: courseConfig.comboPackage.price || 350,
          title: courseConfig.comboPackage.title,
          subTitle: courseConfig.comboPackage.subTitle
        };
      }
      return p;
    });

    const newState: AppState = {
      ...appState,
      settings: updatedSettings,
      products: updatedProducts,
      auditLogs: [
        `কোর্স ভিডিও ও ৩৫০ টাকা কম্বো অ্যাপস সেটিংস আপডেট করা হয়েছে।`,
        ...appState.auditLogs
      ]
    };

    onUpdateState(newState);
    saveSettingsToFirestore(updatedSettings).catch(err => 
      console.warn('Firestore settings sync note:', err)
    );
    showToast('কোর্স পেজ ও ৩৫০ টাকা কম্বো অ্যাপস সফলভাবে সেভ হয়েছে!', '💾');
  };

  // Add new module to course
  const handleAddModule = () => {
    const nextOrder = courseConfig.modules.length + 1;
    const newMod: CourseVideoModule = {
      id: `mod_${Date.now()}`,
      order: nextOrder,
      title: `Course Module - ${nextOrder}`,
      subTitle: 'AI Video Masterclass Lesson',
      videoUrl: 'https://youtu.be/8pZeSjg4ZLU',
      description: 'নতুন ভিডিও লেকচার বিবরণ দিন...',
      level: 'Free Module',
      topics: ['Introduction', 'Practical Workflow', 'Monetization']
    };

    setCourseConfig(prev => ({
      ...prev,
      modules: [...prev.modules, newMod]
    }));
    showToast(`মডিউল ${nextOrder} যোগ করা হয়েছে`, '🎬');
  };

  // Remove module
  const handleRemoveModule = (modId: string) => {
    setCourseConfig(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== modId)
    }));
    showToast('মডিউল মুছে ফেলা হয়েছে', '🗑️');
  };

  // Update specific module field
  const handleUpdateModule = (modId: string, updates: Partial<CourseVideoModule>) => {
    setCourseConfig(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.id === modId ? { ...m, ...updates } : m)
    }));
  };

  // Add app to combo
  const handleAddComboApp = () => {
    const newApp: ComboAppItem = {
      id: `app_${Date.now()}`,
      title: 'New VIP App',
      description: 'VIP License + Direct Access',
      link: 'https://wa.me/8801830086837',
      buttonText: 'Get VIP Access'
    };
    setCourseConfig(prev => ({
      ...prev,
      comboPackage: {
        ...prev.comboPackage,
        apps: [...prev.comboPackage.apps, newApp]
      }
    }));
    showToast('কম্বো প্যাকেজে নতুন অ্যাপ যোগ হয়েছে', '✨');
  };

  // Remove app from combo
  const handleRemoveComboApp = (appId: string) => {
    setCourseConfig(prev => ({
      ...prev,
      comboPackage: {
        ...prev.comboPackage,
        apps: prev.comboPackage.apps.filter(a => a.id !== appId)
      }
    }));
  };

  return (
    <div className="space-y-4 pb-4 max-w-5xl mx-auto">
      {/* Title & Logout */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-black italic text-slate-900 tracking-tight">
          Admin Panel
        </h1>
        <button
          onClick={onLogout}
          className="text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
        >
          🚪 Logout
        </button>
      </div>

      {/* Top Stats Row (Chart & Sales Counter) matching Screenshot 5 */}
      <div className="flex items-center gap-3">
        {/* Mini Chart */}
        <div className="w-1/2 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-xs flex flex-col justify-between h-24">
          <svg viewBox="0 0 100 65" className="w-full h-14" preserveAspectRatio="none">
            <line x1="5" y1="15" x2="95" y2="15" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="5" y1="35" x2="95" y2="35" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="5" y1="55" x2="95" y2="55" stroke="#cbd5e1" strokeWidth="1" />
            <polyline
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={totalSale === 0 ? "5,55 30,55 60,55 95,55" : "5,55 25,40 55,30 95,12"}
            />
          </svg>
          <div className="flex justify-between text-[8px] text-slate-400 px-1 font-mono">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        {/* Counter Box */}
        <div className="w-1/2 bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex items-center justify-between h-24">
          <div>
            <div className="text-xs font-bold text-slate-500">Total Sale</div>
            <div className="text-3xl font-black text-slate-900">{totalSale}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
            ৳
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-3 text-center">
          <div className="text-xs text-slate-600 font-semibold">Direct Sale</div>
          <div className="text-lg font-black text-slate-900">{directSale}</div>
        </div>
        <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-3 text-center">
          <div className="text-xs text-slate-600 font-semibold">Profit (BDT)</div>
          <div className="text-lg font-black text-emerald-700">৳{directProfit.toLocaleString()}</div>
        </div>
        <div className="bg-sky-50/70 border border-sky-300 rounded-2xl p-3 text-center">
          <div className="text-xs text-slate-600 font-semibold">Affiliate Sale</div>
          <div className="text-lg font-black text-slate-900">{affSale}</div>
        </div>
        <div className="bg-sky-50/70 border border-sky-300 rounded-2xl p-3 text-center">
          <div className="text-xs text-slate-600 font-semibold">Profit (BDT)</div>
          <div className="text-lg font-black text-sky-700">৳{affProfit.toLocaleString()}</div>
        </div>
      </div>

      {/* Affiliate Key Generator Row */}
      <div className="bg-white border-2 border-emerald-300 rounded-2xl p-2.5 flex items-center justify-between shadow-xs">
        <span className="font-mono font-bold text-slate-600 text-sm pl-2">
          {generatedKey}
        </span>
        <button
          onClick={handleGenerateKey}
          className="bg-emerald-200 hover:bg-emerald-300 text-emerald-950 font-bold text-xs py-1.5 px-3.5 rounded-full transition-colors cursor-pointer"
        >
          Generate Affiliate Key
        </button>
      </div>

      {/* Add Apps/Courses Row */}
      <div
        onClick={() => setShowAddProductModal(true)}
        className="bg-white border-2 border-emerald-300 rounded-2xl p-2.5 flex items-center justify-between shadow-xs cursor-pointer hover:border-emerald-400 transition-colors"
      >
        <span className="font-bold text-slate-500 text-sm pl-2">
          Add Apps/Courses
        </span>
        <div className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105">
          <Plus className="w-6 h-6" />
        </div>
      </div>

      {/* Navigation Sub Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-1.5 rounded-full shrink-0 cursor-pointer ${
            activeTab === 'orders' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('course-apps')}
          className={`px-3 py-1.5 rounded-full shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'course-apps' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Course & Apps Editor 🎬</span>
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-3 py-1.5 rounded-full shrink-0 cursor-pointer ${
            activeTab === 'products' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Products ({appState.products.length})
        </button>
        <button
          onClick={() => setActiveTab('affiliates')}
          className={`px-3 py-1.5 rounded-full shrink-0 cursor-pointer ${
            activeTab === 'affiliates' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Affiliates ({appState.affiliates.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3 py-1.5 rounded-full shrink-0 cursor-pointer ${
            activeTab === 'settings' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Payment & Telegram
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-full shrink-0 cursor-pointer ${
            activeTab === 'audit' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Audit Logs
        </button>
      </div>

      {/* TAB CONTENT 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Item</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">TrxID</th>
                  <th className="p-3">Affiliate</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-900">{o.id}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{o.customerName}</div>
                      <div className="text-[10px] text-slate-500">{o.phone}</div>
                    </td>
                    <td className="p-3 max-w-[150px] truncate">{o.productTitle}</td>
                    <td className="p-3 font-bold text-emerald-600">৳{o.amount}</td>
                    <td className="p-3 font-mono text-slate-600">{o.trxId}</td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {o.affiliateCode || 'Direct'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {o.status === 'pending' && (
                        <button
                          onClick={() => handleApproveOrder(o.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-md text-[10px] cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: COURSE & APPS EDITOR (Full Admin Control) */}
      {activeTab === 'course-apps' && (
        <div className="space-y-5">
          {/* Header Action Card */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-md">
            <div>
              <h2 className="text-base sm:text-lg font-black flex items-center gap-1.5">
                <Film className="w-5 h-5 text-amber-300" />
                <span>Course Videos + Apps Full Editor</span>
              </h2>
              <p className="text-xs text-emerald-100">
                কোর্সের ফ্রি ভিডিও মডিউল এবং ৩৫০ টাকার কম্বো অ্যাপস প্যাকেজ এখান থেকে সরাসরি এডিট করুন।
              </p>
            </div>
            <button
              onClick={handleSaveCourseConfig}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm py-2 px-5 rounded-full shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save Course & Apps Changes</span>
            </button>
          </div>

          {/* Section A: Course General Info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
              ১. কোর্স পেজ জেনারেল সেটিংস
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Main Headline:</label>
                <input
                  type="text"
                  value={courseConfig.headline}
                  onChange={(e) => setCourseConfig({ ...courseConfig, headline: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp VIP Community Link:</label>
                <input
                  type="text"
                  value={courseConfig.whatsappGroupLink}
                  onChange={(e) => setCourseConfig({ ...courseConfig, whatsappGroupLink: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section B: 350 Taka Combo Package Editor */}
          <div className="bg-white border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                  কম্বো অফার
                </span>
                <h3 className="font-extrabold text-sm text-slate-900">
                  ২. ৩৫০ টাকার কম্বো প্যাকেজ (Course Videos + Apps Combo)
                </h3>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                বর্তমান মূল্য: ৳{courseConfig.comboPackage.price}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Combo Package Title:</label>
                <input
                  type="text"
                  value={courseConfig.comboPackage.title}
                  onChange={(e) => setCourseConfig({
                    ...courseConfig,
                    comboPackage: { ...courseConfig.comboPackage, title: e.target.value }
                  })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Combo Package SubTitle:</label>
                <input
                  type="text"
                  value={courseConfig.comboPackage.subTitle}
                  onChange={(e) => setCourseConfig({
                    ...courseConfig,
                    comboPackage: { ...courseConfig.comboPackage, subTitle: e.target.value }
                  })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Combo Price (Taka):</label>
                <input
                  type="number"
                  value={courseConfig.comboPackage.price}
                  onChange={(e) => setCourseConfig({
                    ...courseConfig,
                    comboPackage: { ...courseConfig.comboPackage, price: Number(e.target.value) || 350 }
                  })}
                  className="w-full p-2 border border-emerald-400 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50/50"
                />
              </div>
            </div>

            {/* Apps inside Combo */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">কম্বোতে অন্তর্ভুক্ত অ্যাপস তালিকা (১ ও ২ নং অ্যাপস):</span>
                <button
                  onClick={handleAddComboApp}
                  className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>অ্যাপ যোগ করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {courseConfig.comboPackage.apps.map((app, idx) => (
                  <div key={app.id || idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        App {idx + 1}
                      </span>
                      {courseConfig.comboPackage.apps.length > 1 && (
                        <button
                          onClick={() => handleRemoveComboApp(app.id)}
                          className="text-rose-600 hover:text-rose-800 text-[11px] font-bold flex items-center gap-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">App Title:</label>
                      <input
                        type="text"
                        value={app.title}
                        onChange={(e) => {
                          const updated = [...courseConfig.comboPackage.apps];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setCourseConfig({
                            ...courseConfig,
                            comboPackage: { ...courseConfig.comboPackage, apps: updated }
                          });
                        }}
                        className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Activation / Download Link:</label>
                      <input
                        type="text"
                        value={app.link}
                        onChange={(e) => {
                          const updated = [...courseConfig.comboPackage.apps];
                          updated[idx] = { ...updated[idx], link: e.target.value };
                          setCourseConfig({
                            ...courseConfig,
                            comboPackage: { ...courseConfig.comboPackage, apps: updated }
                          });
                        }}
                        className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section C: Video Modules Editor (Module 1, Module 2, Module 3) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  ৩. ভিডিও মডিউলসমূহ (Module 1, Module 2, Module 3...)
                </h3>
                <span className="text-[11px] text-slate-500">
                  প্রতিটি মডিউলের ইউটিউব ভিডিও লিঙ্ক ও বিবরণ সরাসরি এডিট করতে পারেন।
                </span>
              </div>
              <button
                onClick={handleAddModule}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ নতুন মডিউল</span>
              </button>
            </div>

            <div className="space-y-4">
              {courseConfig.modules.map((mod, idx) => (
                <div key={mod.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-extrabold text-slate-900">{mod.title}</span>
                    </div>
                    {courseConfig.modules.length > 1 && (
                      <button
                        onClick={() => handleRemoveModule(mod.id)}
                        className="text-rose-600 hover:text-rose-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete Module</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Module Title:</label>
                      <input
                        type="text"
                        value={mod.title}
                        onChange={(e) => handleUpdateModule(mod.id, { title: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                        YouTube Video URL or ID:
                      </label>
                      <input
                        type="text"
                        value={mod.videoUrl}
                        onChange={(e) => handleUpdateModule(mod.id, { videoUrl: e.target.value })}
                        placeholder="https://youtu.be/8pZeSjg4ZLU"
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-emerald-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Description:</label>
                    <textarea
                      rows={2}
                      value={mod.description || ''}
                      onChange={(e) => handleUpdateModule(mod.id, { description: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Save Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveCourseConfig}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-2.5 px-6 rounded-full shadow-md flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes to Firebase</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-xs text-slate-800">ক্যাটালগ প্রোডাক্ট তালিকা</h3>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              + Add Product
            </button>
          </div>
          <div className="space-y-2">
            {appState.products.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div>
                  <span className="font-bold text-slate-900">{p.title}</span>
                  <div className="text-[10px] text-slate-500">{p.subTitle} • Type: {p.type}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-emerald-600">৳{p.price}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: AFFILIATES */}
      {activeTab === 'affiliates' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <h3 className="font-bold text-xs text-slate-800">অ্যাফিলিয়েট পার্টনার তালিকা ({appState.affiliates.length})</h3>
          <div className="space-y-2">
            {appState.affiliates.map((a) => (
              <div key={a.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{a.name} ({a.code})</div>
                  <div className="text-[10px] text-slate-500">Phone: {a.phone} • Email: {a.email}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-emerald-600">Available: ৳{a.wallet.available}</div>
                  <div className="text-[10px] text-slate-400">Total Earned: ৳{a.wallet.totalEarned} • Orders: {a.ordersCount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs text-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">
            পেমেন্ট ও টেলিগ্রাম কনফিগারেশন
          </h3>
          <div>
            <label className="text-slate-600 font-semibold block mb-1">Telegram Group Link:</label>
            <input
              type="text"
              defaultValue={appState.settings.telegramGroupLink}
              onChange={(e) => {
                const newSettings = { ...appState.settings, telegramGroupLink: e.target.value };
                const updated = { ...appState, settings: newSettings };
                onUpdateState(updated);
                saveSettingsToFirestore(newSettings).catch(err => console.warn('Settings firestore sync:', err));
              }}
              className="w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="text-slate-600 font-semibold block mb-1">Bkash/Nagad Payment Number:</label>
            <input
              type="text"
              defaultValue={appState.settings.paymentNumber}
              onChange={(e) => {
                const newSettings = { ...appState.settings, paymentNumber: e.target.value };
                const updated = { ...appState, settings: newSettings };
                onUpdateState(updated);
                saveSettingsToFirestore(newSettings).catch(err => console.warn('Settings firestore sync:', err));
              }}
              className="w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>
          <div className="pt-2">
            <a
              href={appState.settings.telegramGroupLink || 'https://t.me/+9EvZ7JHTIK4zZTk1'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Open Telegram Group (https://t.me/+9EvZ7JHTIK4zZTk1)</span>
            </a>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: AUDIT */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs text-xs space-y-1 max-h-64 overflow-y-auto font-mono text-slate-600">
          {appState.auditLogs.map((log, i) => (
            <div key={i} className="py-1 border-b border-slate-100">• {log}</div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 shadow-xl border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 mb-3">নতুন প্রোডাক্ট যোগ করুন</h3>
            <form onSubmit={handleCreateProduct} className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Product Title:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="যেমন: ChatGPT Plus"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Price (Taka):</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Category Type:</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="app">App</option>
                  <option value="course">Course</option>
                  <option value="bundle">Bundle</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

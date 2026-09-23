import React, { useState } from 'react';
import { Plus, Download, Send, CheckCircle2, DollarSign, LogOut, Key, Package, ShoppingCart, Users, Sliders, Shield } from 'lucide-react';
import { AppState, Order, AppItem } from '../../core/types.ts';

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
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'affiliates' | 'settings' | 'audit'>('orders');
  const [generatedKey, setGeneratedKey] = useState('Profit-E1005');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('399');
  const [newType, setNewType] = useState<'app' | 'course' | 'bundle'>('app');

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
      price: Number(newPrice) || 399,
      type: newType,
      status: 'published'
    };

    const newState = {
      ...appState,
      products: [newProd, ...appState.products],
      auditLogs: [`নতুন প্রোডাক্ট যোগ করা হয়েছে: ${newTitle} (৳${newPrice})`, ...appState.auditLogs]
    };

    onUpdateState(newState);
    setShowAddProductModal(false);
    setNewTitle('');
    setNewPrice('399');
    showToast(`প্রোডাক্ট তৈরি সফল!`, '✅');
  };

  return (
    <div className="space-y-6 pb-6 w-full max-w-7xl mx-auto">
      {/* Title & Logout */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black italic text-slate-900 tracking-tight">
            Admin Management Console
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">রিয়েল-টাইম সেলস, প্রোডাক্ট ও অর্ডার ম্যানেজমেন্ট</p>
        </div>
        <button
          onClick={onLogout}
          className="min-h-[44px] text-xs sm:text-sm font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Top Stats Row (Chart & Sales Counter) matching Screenshot 5 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Mini Chart */}
        <div className="md:col-span-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between h-32">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
            <span>Sales Activity Velocity</span>
            <span className="text-emerald-600">Live Trend</span>
          </div>
          <svg viewBox="0 0 100 45" className="w-full h-16" preserveAspectRatio="none">
            <line x1="5" y1="10" x2="95" y2="10" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="5" y1="25" x2="95" y2="25" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="5" y1="40" x2="95" y2="40" stroke="#cbd5e1" strokeWidth="1" />
            <polyline
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={totalSale === 0 ? "5,40 30,40 60,40 95,40" : "5,40 25,30 55,20 95,8"}
            />
          </svg>
          <div className="flex justify-between text-[10px] text-slate-400 px-1 font-mono">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        {/* Counter Box */}
        <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col items-center justify-center text-center h-32">
          <div className="border border-emerald-500 rounded-full px-3 py-1 text-xs font-bold text-slate-800 bg-emerald-50 mb-1">
            Today • Active Session
          </div>
          <div className="text-emerald-600 font-black text-2xl sm:text-3xl">
            Total Sale : {totalSale}
          </div>
        </div>
      </div>

      {/* 4 KPI Cards Grid (Responsive: 2 on xs/sm, 4 on md/lg) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-4 text-center">
          <div className="text-xs text-slate-600 font-semibold">Direct Sale</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{directSale}</div>
        </div>
        <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-4 text-center">
          <div className="text-xs text-slate-600 font-semibold">Direct Profit</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">৳{directProfit.toLocaleString()}</div>
        </div>
        <div className="bg-sky-50/80 border border-sky-300 rounded-2xl p-4 text-center">
          <div className="text-xs text-slate-600 font-semibold">Affiliate Sale</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{affSale}</div>
        </div>
        <div className="bg-sky-50/80 border border-sky-300 rounded-2xl p-4 text-center">
          <div className="text-xs text-slate-600 font-semibold">Affiliate Profit</div>
          <div className="text-xl sm:text-2xl font-black text-sky-700 mt-1">৳{affProfit.toLocaleString()}</div>
        </div>
      </div>

      {/* Actions Row: Affiliate Key Generator & Add Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Affiliate Key Generator */}
        <div className="bg-white border-2 border-emerald-300 rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-600" />
            <span className="font-mono font-bold text-slate-700 text-sm sm:text-base">
              {generatedKey}
            </span>
          </div>
          <button
            onClick={handleGenerateKey}
            className="min-h-[44px] bg-emerald-200 hover:bg-emerald-300 text-emerald-950 font-bold text-xs sm:text-sm py-2 px-4 rounded-xl transition-colors cursor-pointer"
          >
            Generate Key
          </button>
        </div>

        {/* Add Apps/Courses */}
        <div
          onClick={() => setShowAddProductModal(true)}
          className="bg-white border-2 border-emerald-300 rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-xs cursor-pointer hover:border-emerald-400 transition-colors"
        >
          <span className="font-bold text-slate-700 text-sm sm:text-base pl-2">
            Add New Apps or Courses
          </span>
          <div className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105">
            <Plus className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sub Tabs (Horizontal scroll on mobile, flex on desktop) */}
      <div className="flex gap-2 overflow-x-auto pb-2 text-xs sm:text-sm font-bold no-scrollbar">
        <button
          onClick={() => setActiveTab('orders')}
          className={`min-h-[44px] px-4 py-2 rounded-xl shrink-0 cursor-pointer transition-all ${
            activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`min-h-[44px] px-4 py-2 rounded-xl shrink-0 cursor-pointer transition-all ${
            activeTab === 'products' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Products ({appState.products.length})
        </button>
        <button
          onClick={() => setActiveTab('affiliates')}
          className={`min-h-[44px] px-4 py-2 rounded-xl shrink-0 cursor-pointer transition-all ${
            activeTab === 'affiliates' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Affiliates ({appState.affiliates.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`min-h-[44px] px-4 py-2 rounded-xl shrink-0 cursor-pointer transition-all ${
            activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Settings & Telegram
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`min-h-[44px] px-4 py-2 rounded-xl shrink-0 cursor-pointer transition-all ${
            activeTab === 'audit' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Audit Logs
        </button>
      </div>

      {/* Tab Panes */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs">
          <h2 className="font-extrabold text-base text-slate-900 mb-4">Customer Orders & Approvals</h2>
          {orders.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">কোনো অর্ডার নেই</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[600px] divide-y divide-slate-100">
                {orders.map((o) => (
                  <div key={o.id} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-slate-900 text-sm sm:text-base">{o.productTitle}</div>
                      <div className="text-slate-600">
                        Order #{o.id} • ৳{o.amount} • <span className="font-semibold">{o.customerName}</span> ({o.phone}) {o.email ? `• ${o.email}` : ''}
                      </div>
                      <div className="text-xs font-mono text-emerald-700">
                        Trx: {o.trxId} • Ref Code: {o.affiliateCode || 'Direct'}
                      </div>
                    </div>
                    <div className="ml-4 shrink-0">
                      {o.status === 'pending' ? (
                        <button
                          onClick={() => handleApproveOrder(o.id)}
                          className="min-h-[44px] bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-xs sm:text-sm cursor-pointer shadow-xs active:scale-95 transition-all"
                        >
                          Approve Order
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-bold text-xs sm:text-sm flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" /> Approved
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-3">
          <h2 className="font-extrabold text-base text-slate-900 mb-2">Active Catalog Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {appState.products.map(p => (
              <div key={p.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <strong className="text-slate-900 block text-sm font-extrabold">{p.title}</strong>
                  <div className="text-slate-500 text-xs">{p.type} • {p.status}</div>
                </div>
                <span className="font-black text-emerald-600 text-base">৳{p.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'affiliates' && (
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs space-y-3">
          <h2 className="font-extrabold text-base text-slate-900 mb-2">Registered Affiliates ({appState.affiliates.length})</h2>
          <div className="overflow-x-auto">
            <div className="min-w-[500px] divide-y divide-slate-100">
              {appState.affiliates.map(a => (
                <div key={a.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <div className="font-extrabold text-slate-900">{a.name} ({a.code})</div>
                    <div className="text-slate-500 text-xs">{a.phone} • Clicks: {a.clicks || 0}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-700">Balance: ৳{a.wallet.available}</div>
                    <div className="text-[11px] text-slate-400">Total: ৳{a.wallet.totalEarned}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-4 text-xs sm:text-sm max-w-2xl">
          <h2 className="font-black text-base sm:text-lg text-slate-900">Telegram & Gateway Settings</h2>
          <div>
            <label className="text-slate-700 font-bold block mb-1.5">Telegram Community Group Link:</label>
            <input
              type="text"
              defaultValue={appState.settings.telegramGroupLink}
              onChange={(e) => {
                const updated = { ...appState, settings: { ...appState.settings, telegramGroupLink: e.target.value } };
                onUpdateState(updated);
              }}
              className="w-full min-h-[48px] px-4 border border-slate-300 rounded-xl text-[16px] sm:text-sm font-medium outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-700 font-bold block mb-1.5">Bkash/Nagad Payment Number:</label>
            <input
              type="text"
              defaultValue={appState.settings.paymentNumber}
              onChange={(e) => {
                const updated = { ...appState, settings: { ...appState.settings, paymentNumber: e.target.value } };
                onUpdateState(updated);
              }}
              className="w-full min-h-[48px] px-4 border border-slate-300 rounded-xl text-[16px] sm:text-sm font-medium outline-none focus:border-emerald-500"
            />
          </div>
          <div className="pt-2">
            <a
              href={appState.settings.telegramGroupLink || 'https://t.me/+9EvZ7JHTIK4zZTk1'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Open Telegram Group ({appState.settings.telegramGroupLink || 'https://t.me/+9EvZ7JHTIK4zZTk1'})</span>
            </a>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 shadow-xs text-xs space-y-1 max-h-72 overflow-y-auto font-mono text-slate-700">
          {appState.auditLogs.map((log, i) => (
            <div key={i} className="py-1.5 border-b border-slate-100 flex items-center gap-2">
              <span className="text-slate-400">›</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-black text-base sm:text-lg text-slate-900">নতুন প্রোডাক্ট বা কোর্স যোগ করুন</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Product Title:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="যেমন: ChatGPT Plus & Claude Bundle"
                  className="w-full min-h-[44px] px-3.5 border border-slate-300 rounded-xl text-[16px] sm:text-sm font-medium outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Price (Taka):</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 border border-slate-300 rounded-xl text-[16px] sm:text-sm font-medium outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="min-h-[44px] px-5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

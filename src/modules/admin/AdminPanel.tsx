import React, { useState } from 'react';
import { Plus, Download, Send, CheckCircle2, DollarSign } from 'lucide-react';
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
    <div className="space-y-4 pb-4">
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

        {/* Counter Column */}
        <div className="flex-1 flex flex-col items-end gap-2 justify-center">
          <div className="border border-emerald-500 rounded-full px-3 py-1 text-xs font-bold text-slate-800 bg-white">
            Today ▼
          </div>
          <div className="text-emerald-600 font-black text-base sm:text-lg">
            Total Sale : {totalSale}
          </div>
        </div>
      </div>

      {/* 4 KPI Cards Grid matching Screenshot 5 */}
      <div className="grid grid-cols-2 gap-2.5">
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

      {/* Affiliate Key Generator Row matching Screenshot 5 */}
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

      {/* Add Apps/Courses Row with Blue Circle Plus matching Screenshot 5 */}
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

      {/* Sub Tabs */}
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
          Settings & Telegram
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

      {/* Tab Panes */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
          <h3 className="font-bold text-xs text-slate-900 mb-2">Customer Orders</h3>
          {orders.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">কোনো অর্ডার নেই</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.map((o) => (
                <div key={o.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{o.productTitle}</div>
                    <div className="text-[11px] text-slate-500">
                      Order #{o.id} • ৳{o.amount} • {o.customerName} ({o.phone}) {o.email ? `• ${o.email}` : ''}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-700">Trx: {o.trxId} • Code: {o.affiliateCode || 'Direct'}</div>
                  </div>
                  <div>
                    {o.status === 'pending' ? (
                      <button
                        onClick={() => handleApproveOrder(o.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1 rounded-full text-[11px] cursor-pointer"
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2">
          {appState.products.map(p => (
            <div key={p.id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
              <div>
                <strong className="text-slate-900">{p.title}</strong>
                <div className="text-slate-500 text-[11px]">৳{p.price} • {p.type}</div>
              </div>
              <span className="font-bold text-emerald-600">৳{p.price}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-sm text-slate-900">Telegram & Platform Settings</h3>
          <div>
            <label className="text-slate-600 font-semibold block mb-1">Telegram Group Link:</label>
            <input
              type="text"
              defaultValue={appState.settings.telegramGroupLink}
              onChange={(e) => {
                const updated = { ...appState, settings: { ...appState.settings, telegramGroupLink: e.target.value } };
                onUpdateState(updated);
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
                const updated = { ...appState, settings: { ...appState.settings, paymentNumber: e.target.value } };
                onUpdateState(updated);
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
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-lg cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="py-2 px-3 border border-slate-300 rounded-lg text-slate-700 cursor-pointer"
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

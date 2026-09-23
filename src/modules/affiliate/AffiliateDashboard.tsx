import React, { useState } from 'react';
import { Copy, Check, TrendingUp, DollarSign, Users, Award, ArrowUpRight } from 'lucide-react';
import { AffiliatePartner, AppState, WithdrawalRequest } from '../../core/types.ts';
import { forwardWithdrawalToTelegram } from '../../services/telegram.ts';

interface AffiliateDashboardProps {
  affiliate: AffiliatePartner;
  appState: AppState;
  onUpdateState: (newState: AppState) => void;
  onLogout: () => void;
  showToast: (msg: string, icon?: string) => void;
}

export const AffiliateDashboard: React.FC<AffiliateDashboardProps> = ({
  affiliate,
  appState,
  onUpdateState,
  onLogout,
  showToast
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [withdrawMethod, setWithdrawMethod] = useState('Bkash');
  const [withdrawNumber, setWithdrawNumber] = useState(affiliate.phone || '');

  const refUrl = `${window.location.origin}${window.location.pathname}?ref=${affiliate.code}`;

  const copyRefLink = () => {
    navigator.clipboard.writeText(refUrl);
    setCopiedLink(true);
    showToast('রেফারেল লিঙ্ক কপি করা হয়েছে!', '🔗');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (amt > affiliate.wallet.available) {
      showToast('পর্যাপ্ত ব্যালেন্স নেই!', '⚠️');
      return;
    }
    if (amt < (appState.settings.minWithdrawAmount || 500)) {
      showToast(`সর্বনিম্ন উইথড্র ৳${appState.settings.minWithdrawAmount || 500}`, '⚠️');
      return;
    }

    const newWd: WithdrawalRequest = {
      id: `WD-${Math.floor(1000 + Math.random() * 9000)}`,
      affiliateCode: affiliate.code,
      name: affiliate.name,
      amount: amt,
      method: withdrawMethod,
      number: withdrawNumber,
      status: 'pending',
      date: new Date().toLocaleDateString('en-GB')
    };

    const updatedAffiliates = appState.affiliates.map(a => {
      if (a.id === affiliate.id) {
        return {
          ...a,
          wallet: {
            ...a.wallet,
            available: a.wallet.available - amt,
            withdrawn: a.wallet.withdrawn + amt
          }
        };
      }
      return a;
    });

    const newState = {
      ...appState,
      affiliates: updatedAffiliates,
      withdrawals: [newWd, ...appState.withdrawals],
      auditLogs: [`উইথড্র রিকোয়েস্ট: ৳${amt} (${affiliate.code})`, ...appState.auditLogs]
    };

    onUpdateState(newState);
    forwardWithdrawalToTelegram(newWd, appState.settings);
    setShowWithdrawModal(false);
    showToast('উইথড্র রিকোয়েস্ট সাবমিট হয়েছে!', '💸');
  };

  return (
    <div className="space-y-4 pb-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            Affiliate Partner Portal
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-1">
            {affiliate.name}
          </h1>
        </div>
        <button
          onClick={onLogout}
          className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>

      {/* Referral Link Box */}
      <div className="bg-white border-2 border-emerald-300 rounded-2xl p-3.5 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">আপনার অ্যাফিলিয়েট কোড & লিংক:</span>
          <span className="font-mono font-black text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded">
            {affiliate.code}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={refUrl}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 select-all"
          />
          <button
            onClick={copyRefLink}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'কপি!' : 'কপি লিংক'}</span>
          </button>
        </div>
      </div>

      {/* Wallet Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-emerald-600 text-white rounded-2xl p-3.5 shadow-sm">
          <div className="text-[11px] text-emerald-100">উত্তোলনযোগ্য ব্যালেন্স</div>
          <div className="text-2xl font-black mt-0.5">৳{affiliate.wallet.available}</div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="mt-2 w-full py-1.5 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            উইথড্র রিকোয়েস্ট ↗
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] text-slate-500">মোট উপার্জিত কমিশন</div>
            <div className="text-xl font-black text-slate-900 mt-0.5">৳{affiliate.wallet.totalEarned}</div>
          </div>
          <div className="text-[10px] text-slate-400 mt-2">
            উত্তোলিত: ৳{affiliate.wallet.withdrawn}
          </div>
        </div>
      </div>

      {/* Commission Rates & Reseller Pricing */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-2">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>রিসেলার ও কমিশন রেট তালিকা</span>
        </h3>
        <p className="text-xs text-slate-500">
          আপনার রেফারেল লিংকে কেউ ৳৩৯৯ টাকার কোর্স বান্ডেল বা অ্যাপ কিনলে আপনি সরাসরি কমিশন পাবেন।
        </p>

        <div className="divide-y divide-slate-100 text-xs">
          {appState.products.map(p => (
            <div key={p.id} className="py-2 flex items-center justify-between">
              <div>
                <strong className="text-slate-800">{p.title}</strong>
                <div className="text-[10px] text-slate-500">রেগুলার মূল্য: ৳{p.price}</div>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-600">কমিশন: ৳{p.commission || Math.round((p.price * 20) / 100)}</span>
                <div className="text-[9px] text-slate-400">রিসেলার রেট: ৳{p.resellerPrice || (p.price - 50)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl p-4 shadow-xl border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 mb-2">কমিশন উত্তোলন (Withdrawal)</h3>
            <p className="text-xs text-slate-500 mb-3">
              উপলব্ধ ব্যালেন্স: <strong>৳{affiliate.wallet.available}</strong> (সর্বনিম্ন ৳{appState.settings.minWithdrawAmount})
            </p>
            <form onSubmit={handleWithdraw} className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">পরিমাণ (BDT):</label>
                <input
                  type="number"
                  required
                  min={appState.settings.minWithdrawAmount}
                  max={affiliate.wallet.available}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">পেমেন্ট মেথড:</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Bkash">bKash (Personal)</option>
                  <option value="Nagad">Nagad (Personal)</option>
                  <option value="Rocket">Rocket</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">আপনার একাউন্ট নাম্বার:</label>
                <input
                  type="tel"
                  required
                  value={withdrawNumber}
                  onChange={(e) => setWithdrawNumber(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-lg cursor-pointer"
                >
                  উইথড্র কনফার্ম
                </button>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="py-2 px-3 border border-slate-300 rounded-lg text-slate-700 cursor-pointer"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

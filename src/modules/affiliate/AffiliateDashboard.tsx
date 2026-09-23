import React, { useState } from 'react';
import { Copy, Check, TrendingUp, DollarSign, Users, Award, ArrowUpRight, LogOut, Wallet, CheckCircle2 } from 'lucide-react';
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
    <div className="space-y-6 pb-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Affiliate Partner Dashboard
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mt-1">
            {affiliate.name}
          </h1>
          <p className="text-xs text-slate-500">পার্টনার আইডি: <span className="font-mono font-bold text-slate-800">{affiliate.code}</span></p>
        </div>
        <button
          onClick={onLogout}
          className="min-h-[44px] text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Referral Link Share Box */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-md space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="font-bold text-sm sm:text-base flex items-center gap-2">
            <span>🔗 আপনার ব্যক্তিগত রেফারেল লিংক</span>
          </div>
          <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full text-emerald-100">
            প্রতি সফল অর্ডারে ২০% ইনস্ট্যান্ট কমিশন
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-950/40 p-2 rounded-xl sm:rounded-2xl border border-white/20">
          <input
            type="text"
            readOnly
            value={refUrl}
            className="flex-1 bg-transparent text-emerald-200 text-xs sm:text-sm px-3 py-2 outline-none font-mono truncate"
          />
          <button
            onClick={copyRefLink}
            className="min-h-[44px] px-5 py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'কপি হয়েছে!' : 'লিঙ্ক কপি করুন'}</span>
          </button>
        </div>
      </div>

      {/* 4 Wallet / Performance Cards (Responsive Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs text-center">
          <div className="text-xs text-slate-500 font-semibold">উইথড্রযোগ্য ব্যালেন্স</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
            ৳{affiliate.wallet.available}
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={affiliate.wallet.available < (appState.settings.minWithdrawAmount || 500)}
            className="mt-3 w-full min-h-[40px] text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer"
          >
            টাকা তুলুন ↗
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs text-center">
          <div className="text-xs text-slate-500 font-semibold">পেন্ডিং কমিশন</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
            ৳{affiliate.wallet.pending}
          </div>
          <span className="text-[11px] text-slate-400 block mt-2">অর্ডার ভেরিফিকেশনে আছে</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs text-center">
          <div className="text-xs text-slate-500 font-semibold">মোট আয় (Lifetime)</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            ৳{affiliate.wallet.totalEarned}
          </div>
          <span className="text-[11px] text-slate-400 block mt-2">ক্যাশআউট: ৳{affiliate.wallet.withdrawn}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs text-center">
          <div className="text-xs text-slate-500 font-semibold">মোট রেফারেল ক্লিক</div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
            {affiliate.clicks || 0}
          </div>
          <span className="text-[11px] text-slate-400 block mt-2">অর্ডার: {affiliate.ordersCount || 0} টি</span>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-black text-lg text-slate-900">টাকা তোলার আবেদন (Withdraw)</h3>
            <form onSubmit={handleWithdraw} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-bold mb-1">উইথড্র পরিমাণ (BDT):</label>
                <input
                  type="number"
                  required
                  min={appState.settings.minWithdrawAmount || 500}
                  max={affiliate.wallet.available}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full min-h-[48px] px-4 border border-slate-300 rounded-xl text-[16px] sm:text-sm font-semibold outline-none focus:border-emerald-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  সর্বনিম্ন উইথড্র ৳{appState.settings.minWithdrawAmount || 500}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">পেমেন্ট মেথড:</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full min-h-[48px] px-4 border border-slate-300 rounded-xl text-[16px] sm:text-sm font-medium outline-none focus:border-emerald-500 bg-white"
                >
                  <option value="Bkash">বিকাশ (Bkash)</option>
                  <option value="Nagad">নগদ (Nagad)</option>
                  <option value="Rocket">রকেট (Rocket)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">অ্যাকাউন্ট নাম্বার:</label>
                <input
                  type="tel"
                  required
                  value={withdrawNumber}
                  onChange={(e) => setWithdrawNumber(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full min-h-[48px] px-4 border border-slate-300 rounded-xl text-[16px] sm:text-sm font-medium outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  উইথড্র রিকোয়েস্ট পাঠান
                </button>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="min-h-[48px] px-5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer font-bold"
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

import React, { useState } from 'react';
import { Copy, Briefcase, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AffiliatePartner, AppState } from '../../core/types.ts';
import { forwardAffiliateToTelegram } from '../../services/telegram.ts';

interface AffiliateAuthPageProps {
  appState: AppState;
  onUpdateState: (newState: AppState) => void;
  onLoginSuccess: (affiliate: AffiliatePartner) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const AffiliateAuthPage: React.FC<AffiliateAuthPageProps> = ({
  appState,
  onUpdateState,
  onLoginSuccess,
  showToast
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login inputs
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTrxId, setRegTrxId] = useState('');

  const joiningFee = appState.settings.affiliateJoiningFee || 199;
  const paymentNumber = appState.settings.paymentNumber;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const aff = appState.affiliates.find(
      a => (a.phone === loginPhone.trim() || a.code === loginPhone.trim()) &&
           (a.password === loginPassword || !a.password)
    );

    if (aff) {
      onLoginSuccess(aff);
      showToast(`স্বাগতম ${aff.name}!`, '🎉');
    } else {
      showToast('ভুল ফোন নাম্বার বা পাসওয়ার্ড!', '❌');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regTrxId.trim()) {
      showToast('সব তথ্য সঠিকভাবে দিন!', '⚠️');
      return;
    }

    const code = `Profit-E${Math.floor(1000 + Math.random() * 9000)}`;
    const newAff: AffiliatePartner = {
      id: `aff_${Date.now()}`,
      code,
      name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim() || `${regPhone.trim()}@profitnext.com`,
      password: regPassword || '123456',
      trxId: regTrxId.trim(),
      status: 'approved',
      wallet: {
        available: 0,
        pending: 0,
        totalEarned: 0,
        withdrawn: 0
      },
      clicks: 0,
      ordersCount: 0,
      partnerId: 'partner_lead_1'
    };

    const newState = {
      ...appState,
      affiliates: [newAff, ...appState.affiliates],
      auditLogs: [`নতুন অ্যাফিলিয়েট রেজিস্টার: ${newAff.name} (${newAff.code})`, ...appState.auditLogs]
    };

    onUpdateState(newState);
    forwardAffiliateToTelegram(newAff, appState.settings);
    onLoginSuccess(newAff);
    showToast(`রেজিস্ট্রেশন সফল! আপনার কোড: ${code}`, '🎉');
  };

  return (
    <div className="w-full max-w-lg mx-auto py-4 sm:py-8 px-3 sm:px-4">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
          <Briefcase className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Affiliate Partner Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {mode === 'login' ? 'আপনার অ্যাফিলিয়েট ড্যাশবোর্ডে লগইন করুন' : 'অ্যাফিলিয়েট পার্টনার হিসেবে যোগ দিন ও প্রতি রেফারে ২০% কমিশন আয় করুন'}
        </p>

        {/* Tab Toggle (Min 44px height) */}
        <div className="flex bg-slate-100 p-1 rounded-xl mt-4 max-w-xs mx-auto">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 min-h-[44px] rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            লগইন (Login)
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 min-h-[44px] rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            রেজিস্ট্রেশন (৳১৯৯)
          </button>
        </div>
      </div>

      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
              অ্যাফিলিয়েট ফোন নাম্বার বা কোড:
            </label>
            <input
              type="text"
              required
              value={loginPhone}
              onChange={(e) => setLoginPhone(e.target.value)}
              placeholder="017xxxxxxxx বা Profit-E1001"
              className="w-full min-h-[48px] px-4 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-[16px] sm:text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
              পাসওয়ার্ড:
            </label>
            <input
              type="password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full min-h-[48px] px-4 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-[16px] sm:text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-sm sm:text-base rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer mt-2"
          >
            ড্যাশবোর্ডে প্রবেশ করুন ↗
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>পার্টনার ফি: মাত্র ৳{joiningFee} (এককালীন)</span>
            </div>
            <p className="text-emerald-700 leading-relaxed">
              বিকাশ/নগদ এ ৳{joiningFee} Send Money করুন এই নাম্বারে: <strong className="text-slate-900">{paymentNumber}</strong> এবং TrxID নিচে লিখুন।
            </p>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">আপনার নাম *</label>
            <input
              type="text"
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="আপনার পূর্ণ নাম"
              className="w-full min-h-[48px] px-4 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-[16px] sm:text-sm font-medium outline-none"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">ফোন নাম্বার (বিকাশ/নগদ) *</label>
            <input
              type="tel"
              required
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
              placeholder="017xxxxxxxx"
              className="w-full min-h-[48px] px-4 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-[16px] sm:text-sm font-medium outline-none"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">ইমেইল এড্রেস</label>
            <input
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="youremail@gmail.com"
              className="w-full min-h-[48px] px-4 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-[16px] sm:text-sm font-medium outline-none"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">পাসওয়ার্ড সেট করুন *</label>
            <input
              type="password"
              required
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="কমপক্ষে ৬ ডিজিটের পাসওয়ার্ড"
              className="w-full min-h-[48px] px-4 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-[16px] sm:text-sm font-medium outline-none"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Transaction ID (TrxID) *</label>
            <input
              type="text"
              required
              value={regTrxId}
              onChange={(e) => setRegTrxId(e.target.value.toUpperCase())}
              placeholder="যেমন: BL91X001"
              className="w-full min-h-[48px] px-4 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-[16px] sm:text-sm font-mono font-medium outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-sm sm:text-base rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer mt-2"
          >
            অ্যাফিলিয়েট একাউন্ট খুলুন ↗
          </button>
        </form>
      )}
    </div>
  );
};

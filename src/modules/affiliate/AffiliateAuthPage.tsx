import React, { useState } from 'react';
import { Copy, Briefcase } from 'lucide-react';
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
    <div className="max-w-md mx-auto py-2 px-1">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-2">
          <Briefcase className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Affiliate Partner Portal
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {mode === 'login' ? 'আপনার অ্যাফিলিয়েট ড্যাশবোর্ডে লগইন করুন' : 'অ্যাফিলিয়েট পার্টনার হিসেবে যোগ দিন ও আয় শুরু করুন'}
        </p>
      </div>

      <div className="flex bg-slate-200/70 p-1 rounded-xl mb-4 text-xs font-bold">
        <button
          onClick={() => setMode('login')}
          className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
            mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          লগইন (Login)
        </button>
        <button
          onClick={() => setMode('register')}
          className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
            mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          নতুন পার্টনার রেজিস্ট্রেশন (৳{joiningFee})
        </button>
      </div>

      {mode === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ফোন নাম্বার অথবা পার্টনার কোড:
            </label>
            <input
              type="text"
              required
              value={loginPhone}
              onChange={(e) => setLoginPhone(e.target.value)}
              placeholder="017XXXXXXXX বা Profit-E1005"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              পাসওয়ার্ড:
            </label>
            <input
              type="password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="পাসওয়ার্ড দিন (ডিফল্ট: 123456)"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
          >
            লগইন করুন ↗
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-500">ডেমো পার্টনার একাউন্ট: </span>
            <code className="text-[11px] font-bold text-blue-700">01789123456 / 123456</code>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          {/* Joining Fee Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 leading-relaxed">
            পার্টনার জয়েনিং ফি <strong>৳{joiningFee}</strong> এই নাম্বারে পাঠিয়ে TrxID দিন:
            <div className="flex items-center justify-between font-mono font-bold text-sm bg-white p-1.5 rounded-lg border border-amber-200 mt-1">
              <span>{paymentNumber} (Bkash/Nagad)</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(paymentNumber);
                  showToast('নাম্বার কপি হয়েছে!', '📋');
                }}
                className="text-slate-600 hover:text-black cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">আপনার পূর্ণ নাম:</label>
            <input
              type="text"
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="আপনার নাম"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">মোবাইল নাম্বার:</label>
            <input
              type="tel"
              required
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
              placeholder="017XXXXXXXX"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">পাসওয়ার্ড:</label>
            <input
              type="password"
              required
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="পাসওয়ার্ড নির্ধারণ করুন"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">bKash/Nagad TrxID (৳{joiningFee}):</label>
            <input
              type="text"
              required
              value={regTrxId}
              onChange={(e) => setRegTrxId(e.target.value)}
              placeholder="যেমন: BL92KD71"
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
          >
            অ্যাফিলিয়েট হিসেবে যোগ দিন ⚡
          </button>
        </form>
      )}
    </div>
  );
};

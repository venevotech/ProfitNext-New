import React, { useState } from 'react';
import { Users, ShieldCheck } from 'lucide-react';
import { AppState, PartnerLeader } from '../../core/types.ts';

interface PartnerAuthPageProps {
  appState: AppState;
  onLoginSuccess: (partner: PartnerLeader) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const PartnerAuthPage: React.FC<PartnerAuthPageProps> = ({
  appState,
  onLoginSuccess,
  showToast
}) => {
  const [phoneOrCode, setPhoneOrCode] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const partner = appState.partners.find(
      p => (p.phone === phoneOrCode.trim() || p.partnerCode === phoneOrCode.trim()) &&
           (p.password === password || !p.password)
    );

    if (partner) {
      onLoginSuccess(partner);
      showToast(`পার্টনার অ্যাডমিন হিসেবে স্বাগতম!`, '👑');
    } else {
      showToast('ভুল পার্টনার কোড বা পাসওয়ার্ড!', '❌');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-6 sm:py-10 px-3 sm:px-4">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Users className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Partner Leader Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          টিম লিডার ও পার্টনার ম্যানেজমেন্ট ড্যাশবোর্ড
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 bg-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
            পার্টনার কোড অথবা মোবাইল:
          </label>
          <input
            type="text"
            required
            value={phoneOrCode}
            onChange={(e) => setPhoneOrCode(e.target.value)}
            placeholder="LEAD101 বা 01789123456"
            className="w-full min-h-[48px] px-4 bg-slate-50 border border-slate-200 rounded-xl text-[16px] sm:text-sm font-semibold focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
            পাসওয়ার্ড:
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="পাসওয়ার্ড দিন"
            className="w-full min-h-[48px] px-4 bg-slate-50 border border-slate-200 rounded-xl text-[16px] sm:text-sm font-semibold focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        <button
          type="submit"
          className="w-full min-h-[48px] bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-sm sm:text-base rounded-xl shadow-md shadow-indigo-600/20 cursor-pointer transition-all mt-2"
        >
          পার্টনার প্যানেলে প্রবেশ করুন ↗
        </button>

        <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>সুরক্ষিত টিম লিডার অথেন্টিকেশন</span>
        </div>
      </form>
    </div>
  );
};

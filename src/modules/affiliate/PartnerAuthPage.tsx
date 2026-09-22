import React, { useState } from 'react';
import { Users } from 'lucide-react';
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
    <div className="max-w-md mx-auto py-2 px-1">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto mb-2">
          <Users className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Partner Admin Login
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          টিম লিডার ও পার্টনার ম্যানেজমেন্ট ড্যাশবোর্ড
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            পার্টনার কোড অথবা মোবাইল:
          </label>
          <input
            type="text"
            required
            value={phoneOrCode}
            onChange={(e) => setPhoneOrCode(e.target.value)}
            placeholder="LEAD101 বা 01789123456"
            className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            পাসওয়ার্ড:
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="পাসওয়ার্ড দিন"
            className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-indigo-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
        >
          পার্টনার লগইন ↗
        </button>

        <div className="text-center pt-2 text-xs text-slate-500">
          ডেমো পার্টনার: <code className="font-bold text-indigo-700">LEAD101 / 123456</code>
        </div>
      </form>
    </div>
  );
};

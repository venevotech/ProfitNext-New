import React, { useState } from 'react';
import { Lock, ShieldAlert, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { ADMIN_CREDENTIALS, setAdminLoggedIn } from '../../services/auth.ts';

interface AdminLoginPageProps {
  onSuccess: () => void;
  showToast: (msg: string, icon?: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, showToast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      username.trim() === ADMIN_CREDENTIALS.username &&
      password.trim() === ADMIN_CREDENTIALS.password
    ) {
      setAdminLoggedIn(true);
      showToast('অ্যাডমিন লগইন সফল!', '🛡️');
      onSuccess();
    } else {
      setError(true);
      showToast('ভুল ইউজারনেম বা পাসওয়ার্ড!', '❌');
    }
  };

  return (
    <div className="max-w-md mx-auto py-4 px-1">
      <div className="text-center mb-5">
        <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-2.5 shadow-lg">
          <Lock className="w-7 h-7 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Admin Login Panel
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          সুপার অ্যাডমিন সিকিউর কন্ট্রোল প্যানেল
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>ইউজারনেম বা পাসওয়ার্ড সঠিক নয়। পুনরায় চেষ্টা করুন।</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Admin Username:
          </label>
          <input
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(false); }}
            placeholder="Enter Admin Username"
            className="w-full h-12 px-3.5 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Admin Password:
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="••••••••••••"
              className="w-full h-12 pl-3.5 pr-10 bg-slate-50 border border-slate-200 focus:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl shadow-lg transition-all transform active:scale-98 cursor-pointer mt-2"
        >
          লগইন করুন (Admin Panel) ↗
        </button>

        <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>সুরক্ষিত এনক্রিপ্টেড অ্যাডমিন এক্সেস</span>
        </div>
      </form>
    </div>
  );
};

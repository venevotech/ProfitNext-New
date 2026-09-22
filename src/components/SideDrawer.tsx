import React from 'react';
import { X, Home, Briefcase, Users, Settings, Globe } from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onToggleLanguage: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onToggleLanguage
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 w-72 h-full bg-white z-50 shadow-2xl flex flex-col p-5 animate-in slide-in-from-right duration-250">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center text-xl font-extrabold tracking-tight">
            <span className="text-slate-900">Profit</span>
            <span className="text-emerald-600">Next</span>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close Drawer"
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Strictly only the 5 items in English */}
        <div className="flex flex-col gap-1 py-4 flex-1">
          <button
            onClick={() => { onNavigate('home'); onClose(); }}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-semibold text-sm transition-all text-left cursor-pointer"
          >
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700"><Home className="w-4 h-4" /></span>
            <span>Home Page</span>
          </button>

          <button
            onClick={() => { onNavigate('affiliate-login'); onClose(); }}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-semibold text-sm transition-all text-left cursor-pointer"
          >
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700"><Briefcase className="w-4 h-4" /></span>
            <span>Affiliate Login</span>
          </button>

          <button
            onClick={() => { onNavigate('partner-login'); onClose(); }}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-semibold text-sm transition-all text-left cursor-pointer"
          >
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700"><Users className="w-4 h-4" /></span>
            <span>Partner Admin Login</span>
          </button>

          <button
            onClick={() => { onNavigate('admin-login'); onClose(); }}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-semibold text-sm transition-all text-left cursor-pointer"
          >
            <span className="p-1.5 rounded-lg bg-slate-100 text-slate-800"><Settings className="w-4 h-4" /></span>
            <span>Admin Login Panel</span>
          </button>

          <button
            onClick={() => { onToggleLanguage(); onClose(); }}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-semibold text-sm transition-all text-left cursor-pointer border-t border-slate-100 mt-2 pt-4"
          >
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700"><Globe className="w-4 h-4" /></span>
            <span>Translate - English/Bangla</span>
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          ProfitNext Android & Mobile Platform
        </div>
      </div>
    </>
  );
};

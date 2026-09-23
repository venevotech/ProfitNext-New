import React, { useEffect } from 'react';
import { X, Home, Briefcase, Users, Settings, Globe, GraduationCap, Smartphone, ShieldCheck } from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onToggleLanguage: () => void;
  onCourseClick?: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onToggleLanguage,
  onCourseClick
}) => {
  // Accessible Keyboard Escape Listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay - tap outside to dismiss */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-label="Close backdrop"
      />

      {/* Off-canvas Drawer Panel */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className="relative w-[85vw] max-w-sm sm:max-w-md h-full bg-white z-50 shadow-2xl flex flex-col p-5 sm:p-6 overflow-y-auto animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-1 text-2xl font-black tracking-tight">
            <span className="text-slate-900">Profit</span>
            <span className="text-emerald-600">Next</span>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close Menu"
            className="min-h-[44px] min-w-[44px] rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Course Offer in Drawer */}
        {onCourseClick && (
          <div className="mt-4 p-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">স্পেশাল অফার</div>
            <div className="font-extrabold text-sm mt-0.5">AI কোর্স + Gemini Pro + CapCut Pro</div>
            <div className="text-xs text-emerald-100 mt-0.5">ফুল বান্ডেল মাত্র ৳৩৯৯ টাকায়!</div>
            <button
              onClick={() => {
                onCourseClick();
                onClose();
              }}
              className="mt-2.5 w-full min-h-[44px] bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>৳৩৯৯ এ অর্ডার করুন ↗</span>
            </button>
          </div>
        )}

        {/* Navigation Items (All touch targets >= 44px) */}
        <nav className="flex flex-col gap-1.5 py-4 flex-1">
          <button
            onClick={() => { onNavigate('home'); onClose(); }}
            className="min-h-[48px] flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-sm transition-all text-left cursor-pointer"
          >
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700"><Home className="w-4 h-4" /></span>
            <span>Home Page</span>
          </button>

          <button
            onClick={() => { onNavigate('apps'); onClose(); }}
            className="min-h-[48px] flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-sm transition-all text-left cursor-pointer"
          >
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700"><Smartphone className="w-4 h-4" /></span>
            <span>All Premium Apps</span>
          </button>

          <button
            onClick={() => { onNavigate('course_detail'); onClose(); }}
            className="min-h-[48px] flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-sm transition-all text-left cursor-pointer"
          >
            <span className="p-2 rounded-lg bg-purple-100 text-purple-700"><GraduationCap className="w-4 h-4" /></span>
            <span>Course Syllabus & Overview</span>
          </button>

          <button
            onClick={() => { onNavigate('portal'); onClose(); }}
            className="min-h-[48px] flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-sm transition-all text-left cursor-pointer"
          >
            <span className="p-2 rounded-lg bg-blue-100 text-blue-700"><ShieldCheck className="w-4 h-4" /></span>
            <span>Customer Learning Portal</span>
          </button>

          <button
            onClick={() => { onNavigate('affiliate-login'); onClose(); }}
            className="min-h-[48px] flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-sm transition-all text-left cursor-pointer"
          >
            <span className="p-2 rounded-lg bg-amber-100 text-amber-700"><Briefcase className="w-4 h-4" /></span>
            <span>Affiliate Partner Dashboard</span>
          </button>

          <button
            onClick={() => { onNavigate('partner-login'); onClose(); }}
            className="min-h-[48px] flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-sm transition-all text-left cursor-pointer"
          >
            <span className="p-2 rounded-lg bg-indigo-100 text-indigo-700"><Users className="w-4 h-4" /></span>
            <span>Partner Leader Login</span>
          </button>

          <button
            onClick={() => { onNavigate('admin-login'); onClose(); }}
            className="min-h-[48px] flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-sm transition-all text-left cursor-pointer"
          >
            <span className="p-2 rounded-lg bg-slate-100 text-slate-800"><Settings className="w-4 h-4" /></span>
            <span>Admin Control Panel</span>
          </button>

          <button
            onClick={() => { onToggleLanguage(); onClose(); }}
            className="min-h-[48px] flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-sm transition-all text-left cursor-pointer border-t border-slate-100 mt-2 pt-3"
          >
            <span className="p-2 rounded-lg bg-teal-100 text-teal-700"><Globe className="w-4 h-4" /></span>
            <span>Translate - English / বাংলা</span>
          </button>
        </nav>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          ProfitNext • Responsive & Touch-Optimized
        </div>
      </div>
    </div>
  );
};

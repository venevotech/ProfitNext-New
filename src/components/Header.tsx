import React from 'react';
import { Users, Menu, Sparkles, GraduationCap, Smartphone, Compass, ArrowRight } from 'lucide-react';

interface HeaderProps {
  onLogoClick: () => void;
  onOpenMenu: () => void;
  whatsappGroupLink: string;
  activeView?: string;
  onNavigate?: (view: string) => void;
  onCourseClick?: () => void;
  onToggleLanguage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLogoClick,
  onOpenMenu,
  whatsappGroupLink,
  activeView = 'home',
  onNavigate,
  onCourseClick,
  onToggleLanguage
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div 
          onClick={onLogoClick}
          className="flex items-center gap-1 text-2xl font-extrabold tracking-tight cursor-pointer select-none shrink-0"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onLogoClick()}
        >
          <span className="text-slate-900">Profit</span>
          <span className="text-emerald-600">Next</span>
          <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
            PRO PLATFORM
          </span>
        </div>

        {/* Desktop Navigation Links (Visible on Tablet/Laptop/Desktop >= 768px) */}
        {onNavigate && (
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onNavigate('home')}
              className={`min-h-[44px] px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer ${
                activeView === 'home'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              হোম
            </button>

            <button
              onClick={() => onNavigate('apps')}
              className={`min-h-[44px] px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer ${
                activeView === 'apps'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              প্রিমিয়াম অ্যাপস
            </button>

            {onCourseClick && (
              <button
                onClick={onCourseClick}
                className={`min-h-[44px] px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer relative flex items-center gap-1.5 ${
                  activeView === 'checkout'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>AI কোর্স বান্ডেল</span>
                <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  ৳৩৯৯
                </span>
              </button>
            )}

            <button
              onClick={() => onNavigate('portal')}
              className={`min-h-[44px] px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer ${
                activeView === 'portal'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              কাস্টমার পোর্টাল
            </button>

            <button
              onClick={() => onNavigate('affiliate-login')}
              className={`min-h-[44px] px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer ${
                activeView.startsWith('affiliate')
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              অ্যাফিলিয়েট
            </button>
          </nav>
        )}

        {/* Actions Zone */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Course Purchase CTA on Mobile and Desktop */}
          {onCourseClick && (
            <button
              onClick={onCourseClick}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold min-h-[44px] px-3 sm:px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>৳৩৯৯ কোর্স নিন</span>
            </button>
          )}

          {/* WhatsApp VIP Group Link (Desktop/Tablet) */}
          <a 
            href={whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl items-center gap-1.5 transition-all cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>VIP গ্রুপ</span>
          </a>

          {/* Accessible Hamburger Menu for Mobile Drawer & Extra Options */}
          <button 
            onClick={onOpenMenu}
            aria-label="Open Navigation Menu"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

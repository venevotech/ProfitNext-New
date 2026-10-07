import React from 'react';
import { Users, Menu, MoreVertical, LogIn, LogOut, User as UserIcon, Key } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  onLogoClick: () => void;
  onOpenMenu: () => void;
  whatsappGroupLink: string;
  currentView?: string;
  onNavigate?: (view: string) => void;
  onCourseTransactionClick?: () => void;
  currentUser?: User | null;
  onLoginGoogle?: () => void;
  onLogoutGoogle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onLogoClick, 
  onOpenMenu, 
  whatsappGroupLink,
  currentView = 'home',
  onNavigate,
  onCourseTransactionClick,
  currentUser,
  onLoginGoogle,
  onLogoutGoogle
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo */}
        <div 
          onClick={onLogoClick}
          className="flex items-center gap-0.5 text-2xl font-extrabold tracking-tight cursor-pointer select-none transition-transform active:scale-98"
        >
          <span className="text-slate-900">Profit</span>
          <span className="text-emerald-600">Next</span>
        </div>

        {/* Desktop Navigation Links (Responsive for Computer Screens) */}
        {onNavigate && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-full text-xs font-bold text-slate-700 shadow-inner">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                currentView === 'home'
                  ? 'bg-white text-emerald-600 shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => onNavigate('apps')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                currentView === 'apps'
                  ? 'bg-white text-emerald-600 shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Apps
            </button>
            <button
              onClick={() => {
                if (onCourseTransactionClick) {
                  onCourseTransactionClick();
                } else {
                  onNavigate('course_detail');
                }
              }}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                currentView === 'course_detail' || currentView === 'checkout_course'
                  ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                  : 'text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100/80'
              }`}
            >
              <span>Courses</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                currentView === 'course_detail' || currentView === 'checkout_course'
                  ? 'bg-amber-400 text-slate-900'
                  : 'bg-emerald-600 text-white'
              }`}>
                ৳৩৯৯
              </span>
            </button>
            <button
              onClick={() => onNavigate('portal')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                currentView === 'portal'
                  ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Portal ↗
            </button>
            <button
              onClick={() => onNavigate('affiliate-login')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                currentView.includes('affiliate')
                  ? 'bg-white text-emerald-600 shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Affiliate
            </button>
            <button
              onClick={() => onNavigate('pro-unlock')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                currentView === 'pro-unlock'
                  ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
                  : 'text-amber-800 bg-amber-100/90 hover:bg-amber-200 font-extrabold'
              }`}
              title="Pro Unlock Method (Secret Tricks)"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Pro Unlock</span>
              <span className="text-[9px] bg-amber-500 text-slate-950 px-1 rounded-sm font-black">299</span>
            </button>
            <button
              onClick={() => onNavigate('coursera-plus')}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                currentView === 'coursera-plus'
                  ? 'bg-blue-600 text-white shadow-xs font-black'
                  : 'text-blue-800 bg-blue-100/90 hover:bg-blue-200 font-extrabold'
              }`}
              title="Coursera Plus Course & Subscription (৳1499)"
            >
              <span>Coursera</span>
              <span className="text-[9px] bg-blue-700 text-white px-1 rounded-sm font-black">1499</span>
            </button>
          </nav>
        )}

        {/* Right Actions: Google Auth, WhatsApp Group CTA & Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Google Auth Button / User Profile */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 sm:px-2.5 py-1 rounded-full text-xs">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || 'User'} 
                  className="w-5 h-5 rounded-full object-cover border border-slate-300"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.displayName?.[0] || 'U'}
                </div>
              )}
              <span className="font-semibold text-slate-800 text-[11px] hidden sm:inline max-w-[90px] truncate">
                {currentUser.displayName?.split(' ')[0] || 'User'}
              </span>
              <button
                onClick={onLogoutGoogle}
                title="Google Logout"
                className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginGoogle}
              className="border border-slate-300 hover:border-emerald-500 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              title="Google Sign-In with Firebase"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="hidden xs:inline">Login</span>
            </button>
          )}

          <a 
            href={whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Join Group</span>
            <span className="xs:hidden sm:hidden">Group</span>
          </a>

          {/* Three dot menu button (Requested by User) */}
          <button 
            onClick={onOpenMenu}
            aria-label="Three dot menu"
            title="Three dot menu • Pro Unlock Method"
            className="p-1.5 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-200"
          >
            <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800 hover:text-emerald-600 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
};

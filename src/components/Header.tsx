import React from 'react';
import { Users, Menu } from 'lucide-react';

interface HeaderProps {
  onLogoClick: () => void;
  onOpenMenu: () => void;
  whatsappGroupLink: string;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick, onOpenMenu, whatsappGroupLink }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
      <div 
        onClick={onLogoClick}
        className="flex items-center gap-0.5 text-2xl font-extrabold tracking-tight cursor-pointer select-none"
      >
        <span className="text-slate-900">Profit</span>
        <span className="text-emerald-600">Next</span>
      </div>

      <div className="flex items-center gap-3">
        <a 
          href={whatsappGroupLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Join Group</span>
        </a>

        <button 
          onClick={onOpenMenu}
          aria-label="Open Menu"
          className="p-1.5 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

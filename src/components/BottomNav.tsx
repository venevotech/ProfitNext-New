import React from 'react';
import { LayoutGrid, Smartphone, GraduationCap, Compass } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCourseTransactionClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onCourseTransactionClick
}) => {
  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 flex justify-center pointer-events-none px-4 md:hidden">
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-full flex items-center p-1.5 gap-1 w-full max-w-md">
        {/* Tab 1: ALL (Home) */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'bg-emerald-50 text-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutGrid className="w-5 h-5 mb-0.5" />
          <span>ALL</span>
        </button>

        {/* Tab 2: Apps */}
        <button
          onClick={() => onTabChange('apps')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'apps'
              ? 'bg-emerald-50 text-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Smartphone className="w-5 h-5 mb-0.5" />
          <span>Apps</span>
        </button>

        {/* Tab 3: Courses -> Opens Free Course & Videos */}
        <button
          onClick={() => onTabChange('course_detail')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-full text-xs font-semibold transition-all cursor-pointer relative ${
            activeTab === 'course_detail'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100'
          }`}
          title="Free Course Videos & Combo Apps"
        >
          <span className="absolute -top-1.5 right-2 bg-emerald-600 text-white text-[9px] font-black px-1.5 rounded-full shadow-xs">
            FREE
          </span>
          <GraduationCap className="w-5 h-5 mb-0.5" />
          <span>Courses</span>
        </button>

        {/* Tab 4: Portal */}
        <button
          onClick={() => onTabChange('portal')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'portal' || activeTab.startsWith('admin') || activeTab.startsWith('affiliate') || activeTab.startsWith('partner')
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Portal ↗</span>
        </button>
      </nav>
    </div>
  );
};

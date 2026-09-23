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
    <div className="fixed bottom-3 left-0 right-0 z-40 flex justify-center pointer-events-none px-3 sm:px-4 lg:hidden">
      <nav 
        role="navigation"
        aria-label="Mobile Navigation"
        className="pointer-events-auto bg-white/95 backdrop-blur-lg border border-slate-200/90 shadow-2xl rounded-2xl sm:rounded-full flex items-center p-1.5 gap-1 w-full max-w-md"
      >
        {/* Tab 1: ALL (Home) */}
        <button
          onClick={() => onTabChange('home')}
          aria-label="Home page"
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center py-1.5 px-2 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'bg-emerald-50 text-emerald-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutGrid className="w-5 h-5 mb-0.5" />
          <span>ALL</span>
        </button>

        {/* Tab 2: Apps */}
        <button
          onClick={() => onTabChange('apps')}
          aria-label="Apps catalog"
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center py-1.5 px-2 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'apps'
              ? 'bg-emerald-50 text-emerald-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Smartphone className="w-5 h-5 mb-0.5" />
          <span>Apps</span>
        </button>

        {/* Tab 3: Courses -> Opens Transaction Page at 399 Taka */}
        <button
          onClick={onCourseTransactionClick}
          aria-label="Course Transaction at 399 Taka"
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center py-1.5 px-2 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer relative ${
            activeTab === 'checkout_course' || activeTab === 'course_detail'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-emerald-700 bg-emerald-50/90 hover:bg-emerald-100'
          }`}
          title="Course + Gemini Pro + CapCut Pro (399 Taka)"
        >
          <span className="absolute -top-2 right-1.5 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
            ৳৩৯৯
          </span>
          <GraduationCap className="w-5 h-5 mb-0.5" />
          <span>Courses</span>
        </button>

        {/* Tab 4: Portal */}
        <button
          onClick={() => onTabChange('portal')}
          aria-label="Customer portal"
          className={`flex-1 min-h-[48px] flex flex-col items-center justify-center py-1.5 px-2 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
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

import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { AppItem } from '../../core/types.ts';

interface AppsPageProps {
  products: AppItem[];
  onBuyClick: (app: AppItem) => void;
}

export const AppsPage: React.FC<AppsPageProps> = ({ products, onBuyClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter(
    (p) =>
      p.status !== 'archived' &&
      (p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.subTitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4 pb-4">
      {/* Title matching Screenshot 2 */}
      <h1 className="text-emerald-600 text-2xl font-black italic text-center tracking-tight mt-1">
        All Premium Apps
      </h1>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="সার্চ করুন অ্যাপ বা কোর্স..."
          className="w-full h-11 pl-9 pr-4 bg-white border border-slate-200 rounded-full text-xs sm:text-sm font-medium text-slate-800 shadow-xs outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-400"
        />
      </div>

      {/* List items matching Screenshot 2 */}
      <div className="space-y-3">
        {filtered.map((app) => {
          return (
            <div
              key={app.id}
              className="bg-white border border-slate-100 rounded-2xl p-2.5 flex items-center gap-3 shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Left Badge Column */}
              <div className="w-[45%] shrink-0">
                {app.id === 'course_ai_bundle' ? (
                  <div className="h-24 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-2 flex flex-col justify-center items-center text-center shadow-xs">
                    <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded-full mb-1">
                      SUPER BUNDLE
                    </span>
                    <div className="font-extrabold text-xs leading-tight line-clamp-2">
                      Course + Gemini + CapCut
                    </div>
                  </div>
                ) : app.id === 'gemini_pro' ? (
                  <div className="h-24 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 text-white p-2 flex flex-col justify-center items-center text-center shadow-xs">
                    <div className="flex items-center gap-1 font-bold text-sm">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Gemini</span>
                    </div>
                    <div className="text-[9.5px] opacity-90">Google Ai Pro</div>
                    <div className="bg-white/20 px-2 py-0.5 rounded-full text-[8px] font-semibold mt-1">
                      Personal Subscription
                    </div>
                  </div>
                ) : app.id === 'capcut_pro' ? (
                  <div className="h-24 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-2 flex flex-col justify-center items-center text-center border border-slate-700 shadow-xs">
                    <div className="flex items-center gap-1 font-black text-sm tracking-wide">
                      <span className="text-amber-400">👑</span> CAPCUT PRO
                    </div>
                    <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center mt-1">
                      <span className="text-slate-900 font-extrabold text-[10px]">⧉</span>
                    </div>
                  </div>
                ) : app.id === 'duolingo_max' ? (
                  <div className="h-24 rounded-xl bg-slate-900 text-white p-2 flex flex-col justify-center items-center text-center border border-slate-800 shadow-xs">
                    <div className="text-[10px] font-bold text-emerald-400">duolingo</div>
                    <div className="text-sm font-black text-sky-400 tracking-wider">MAX</div>
                    <div className="text-xs">🦉</div>
                  </div>
                ) : app.id === 'framer_pro' ? (
                  <div className="h-24 rounded-xl bg-slate-900 text-white p-2 flex flex-col justify-center items-center text-center border border-slate-800 shadow-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-xs">❖</span>
                      <span className="text-xs font-black text-sky-400">⚡</span>
                    </div>
                    <div className="text-[8px] bg-white text-slate-900 font-bold px-1.5 py-0.5 rounded mt-1">
                      Figma → Framer
                    </div>
                  </div>
                ) : (
                  <div className="h-24 rounded-xl bg-slate-900 text-white p-2 flex flex-col justify-center items-center text-center shadow-xs">
                    <div className="font-extrabold text-xs">{app.title}</div>
                  </div>
                )}
              </div>

              {/* Right Info Column */}
              <div className="flex-1 flex flex-col items-center text-center justify-center py-1">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 line-clamp-1">
                  {app.title}
                </h3>
                <div className="text-emerald-600 font-black text-lg my-0.5">
                  {app.price} <span className="text-sm font-bold">টাকা</span>
                </div>
                <button
                  onClick={() => onBuyClick(app)}
                  className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs py-1.5 px-6 rounded-full shadow-sm shadow-emerald-500/20 transition-all cursor-pointer mt-1"
                >
                  Buy Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

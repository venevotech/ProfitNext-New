import React, { useState } from 'react';
import { Search, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
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
    <div className="space-y-6 pb-6 w-full max-w-7xl mx-auto">
      {/* Header section with responsive fluid typography */}
      <div className="text-center space-y-2">
        <h1 className="text-emerald-600 text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tight">
          All Premium Apps & Digital Courses
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          আপনার কাজের গতি এবং ক্যারিয়ারের দক্ষতাকে এগিয়ে নিতে সেরা সফটওয়্যার ও কোর্সের সংগ্রহ
        </p>
      </div>

      {/* Search Input (100% width, min 48px height, 16px font on mobile to prevent iOS zoom) */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="সার্চ করুন অ্যাপ, কোর্স বা টুলস..."
            className="w-full min-h-[48px] pl-11 pr-4 bg-white border border-slate-200 rounded-2xl text-[16px] sm:text-sm font-medium text-slate-900 shadow-xs outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Responsive Grid: 1 col on xs, 2 on sm, 3 on md, 4 on lg/xl */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6">
          <p className="text-base text-slate-600 font-bold">"{searchTerm}" দিয়ে কোনো প্রোডাক্ট খুঁজে পাওয়া যায়নি</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-3 min-h-[44px] px-4 py-2 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full hover:bg-emerald-200 transition-colors"
          >
            সব প্রোডাক্ট দেখুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((app) => {
            const isBundle = app.id === 'course_ai_bundle';
            return (
              <div
                key={app.id}
                className={`bg-white border rounded-2xl sm:rounded-3xl p-4 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all group ${
                  isBundle ? 'border-2 border-emerald-400 ring-4 ring-emerald-50' : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Top Badge Column */}
                  <div className="mb-4">
                    {app.id === 'course_ai_bundle' ? (
                      <div className="h-32 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white p-3 flex flex-col justify-center items-center text-center shadow-sm relative overflow-hidden">
                        <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full mb-1 shadow-xs">
                          FULL MASTER BUNDLE
                        </span>
                        <div className="font-black text-sm leading-tight line-clamp-2">
                          Course + Gemini Pro + CapCut Pro
                        </div>
                        <span className="text-[10px] text-emerald-200 mt-1">সবকিছু একসাথে অ্যাক্সেস</span>
                      </div>
                    ) : app.id === 'gemini_pro' ? (
                      <div className="h-32 rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 text-white p-3 flex flex-col justify-center items-center text-center shadow-sm">
                        <div className="flex items-center gap-1.5 font-black text-base">
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Gemini</span>
                        </div>
                        <div className="text-xs opacity-90 mt-0.5">Google AI Pro</div>
                        <div className="bg-white/20 px-2.5 py-0.5 rounded-full text-[9px] font-semibold mt-2">
                          Personal Subscription
                        </div>
                      </div>
                    ) : app.id === 'capcut_pro' ? (
                      <div className="h-32 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-3 flex flex-col justify-center items-center text-center border border-slate-700 shadow-sm">
                        <div className="flex items-center gap-1.5 font-black text-base tracking-wide">
                          <span className="text-amber-400">👑</span> CAPCUT PRO
                        </div>
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mt-2 shadow-xs">
                          <span className="text-slate-900 font-black text-sm">⧉</span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1">VIP All Filters & Effects</span>
                      </div>
                    ) : app.id === 'duolingo_max' ? (
                      <div className="h-32 rounded-2xl bg-slate-900 text-white p-3 flex flex-col justify-center items-center text-center border border-slate-800 shadow-sm">
                        <div className="text-xs font-bold text-emerald-400">duolingo</div>
                        <div className="text-lg font-black text-sky-400 tracking-wider">MAX</div>
                        <div className="text-base mt-1">🦉</div>
                      </div>
                    ) : app.id === 'framer_pro' ? (
                      <div className="h-32 rounded-2xl bg-slate-900 text-white p-3 flex flex-col justify-center items-center text-center border border-slate-800 shadow-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">❖</span>
                          <span className="text-sm font-black text-sky-400">⚡</span>
                        </div>
                        <div className="text-[9px] bg-white text-slate-900 font-bold px-2 py-0.5 rounded mt-2">
                          Figma → Framer
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 rounded-2xl bg-slate-900 text-white p-3 flex flex-col justify-center items-center text-center shadow-sm">
                        <div className="font-extrabold text-sm line-clamp-1">{app.title}</div>
                        <div className="text-xs text-slate-300 mt-1">{app.subTitle}</div>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1 mb-4 text-center">
                    <h3 className="font-black text-base text-slate-900 line-clamp-2">
                      {app.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {app.subTitle}
                    </p>
                  </div>
                </div>

                {/* Price and CTA Button */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-baseline justify-center gap-1.5 text-emerald-600 font-black text-xl sm:text-2xl">
                    <span>{app.price}</span>
                    <span className="text-xs font-bold text-slate-500">টাকা</span>
                  </div>

                  <button
                    onClick={() => onBuyClick(app)}
                    className="w-full min-h-[44px] bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-sm shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

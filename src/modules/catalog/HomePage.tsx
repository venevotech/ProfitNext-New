import React from 'react';
import { Play, Sparkles, ArrowRight } from 'lucide-react';
import { AppItem, SiteSettings } from '../../core/types.ts';

interface HomePageProps {
  products: AppItem[];
  settings: SiteSettings;
  onGetCourseClick: () => void;
  onAppBuyClick: (app: AppItem) => void;
  onViewCourseDetail: () => void;
  onBecomeAffiliateClick: () => void;
  onPlayPreviewVideo: (ytId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  settings,
  onGetCourseClick,
  onAppBuyClick,
  onViewCourseDetail,
  onBecomeAffiliateClick,
  onPlayPreviewVideo
}) => {
  return (
    <div className="space-y-5 pb-4">
      {/* 1. HERO BANNER CARD */}
      <section className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 text-white group">
        <div className="relative p-5 sm:p-6 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 flex flex-col justify-between min-h-[190px]">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold mb-2">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>ডিজিটাল স্কিল • বেটার ইনকাম • ফ্রিল্যান্স লাইফ</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight max-w-sm">
              ডিজিটাল প্রোডাক্ট ও ইনকাম কোর্স — ঘরে বসেই শুরু করুন
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xs font-normal">
              কোর্স + জেমিনি প্রো + ক্যাপকাট প্রো ফুল বান্ডেল পান মাত্র <strong className="text-emerald-400 font-extrabold text-sm">৳৩৯৯</strong> টাকায়!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-1">
            <button
              onClick={onGetCourseClick}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-full shadow-md transition-all transform active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>কোর্স কিনুন (৳৩৯৯)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>WhatsApp চ্যাট</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. FEATURED COURSE PROMOTIONAL CARD (Matches Screenshot 1 Middle) */}
      <section className="bg-white border-2 border-emerald-300 rounded-2xl p-3.5 shadow-sm relative">
        <div className="flex items-center gap-3">
          {/* Video Thumbnail Box */}
          <div 
            onClick={() => onPlayPreviewVideo('Hf0Mvc_eKos')}
            className="w-[56%] aspect-video bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl relative overflow-hidden flex items-center justify-center shadow-md cursor-pointer group shrink-0"
          >
            <div className="absolute top-1.5 left-1.5 bg-white/95 px-1.5 py-0.5 rounded text-[8px] font-extrabold text-indigo-950 flex items-center gap-1 z-10">
              <span className="text-blue-600">✦</span> Gemini PRO
            </div>

            <div className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-10">
              <Play className="w-4 h-4 fill-emerald-600 text-emerald-600 ml-0.5" />
            </div>

            <div className="absolute left-2 bottom-1.5 text-left text-white z-10">
              <div className="text-[10px] font-extrabold text-amber-300 leading-tight">মাসে আয় করুন ৫০ হাজার টাকা</div>
              <div className="text-[7.5px] text-slate-300">✓ AI Tool • Easy Setup</div>
            </div>
          </div>

          {/* Course Text & "Get Course" Button */}
          <div className="w-[44%] flex flex-col items-center text-center justify-center py-1">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug mb-1">
              বিশেষ অফারে AI দিয়ে আর্নিং কোর্স নিন
            </h4>
            <div className="text-emerald-600 font-extrabold text-sm mb-1.5">
              মাত্র ৳৩৯৯
            </div>
            {/* User requirement: "on the home page on Get Course Button add the transaction page and make it 399 Taka" */}
            <button
              onClick={onGetCourseClick}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-xs py-2 px-2.5 rounded-full shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
            >
              Get Course ⚡
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="text-[10px] sm:text-[11px] font-bold text-emerald-700 text-center pt-2 mt-2 border-t border-dashed border-emerald-200">
          Course + Gemini Pro + Capcut pro (৳৩৯৯ টাকায় স্বয়ংক্রিয় ক্রেডেনশিয়াল অ্যাক্সেস)
        </div>
      </section>

      {/* 3. PREMIUM APPS GRID (Matches Screenshot 1 Bottom) */}
      <section>
        <h2 className="text-center text-emerald-600 font-black text-xl mb-3">
          Premium Apps
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {products.filter(p => p.id !== 'course_ai_bundle').map((app) => {
            return (
              <div
                key={app.id}
                onClick={() => onAppBuyClick(app)}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                {/* Visual badge matching screenshots */}
                {app.id === 'gemini_pro' ? (
                  <div className="w-full h-24 rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 text-white p-2.5 flex flex-col items-center justify-center shadow-xs transition-transform group-hover:-translate-y-0.5">
                    <div className="flex items-center gap-1 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Gemini</span>
                    </div>
                    <div className="text-[10px] opacity-90">Google Ai Pro</div>
                    <div className="bg-white/20 px-2 py-0.5 rounded-full text-[8px] font-semibold mt-1">
                      Personal Subscription
                    </div>
                  </div>
                ) : app.id === 'capcut_pro' ? (
                  <div className="w-full h-24 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-2.5 flex flex-col items-center justify-center border border-slate-700 shadow-xs transition-transform group-hover:-translate-y-0.5">
                    <div className="flex items-center gap-1 font-black text-sm tracking-wide">
                      <span className="text-amber-400">👑</span> CAPCUT PRO
                    </div>
                    <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center mt-1">
                      <span className="text-slate-900 font-extrabold text-xs">⧉</span>
                    </div>
                  </div>
                ) : app.id === 'duolingo_max' ? (
                  <div className="w-full h-24 rounded-2xl bg-slate-900 text-white p-2.5 flex flex-col items-center justify-center border border-slate-800 shadow-xs transition-transform group-hover:-translate-y-0.5">
                    <div className="text-[10px] font-bold text-emerald-400">duolingo</div>
                    <div className="text-base font-black text-sky-400 tracking-wider">MAX</div>
                    <div className="text-sm">🦉</div>
                  </div>
                ) : (
                  <div className="w-full h-24 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-2.5 flex flex-col items-center justify-center shadow-xs transition-transform group-hover:-translate-y-0.5">
                    <div className="font-extrabold text-sm text-center line-clamp-1">{app.title}</div>
                    <div className="text-[9px] text-slate-300 text-center mt-0.5">{app.subTitle}</div>
                  </div>
                )}

                {/* Price pill button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAppBuyClick(app);
                  }}
                  className="w-10/12 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold py-1.5 px-3 rounded-full shadow-sm transition-all transform active:scale-95 cursor-pointer text-center"
                >
                  {app.price} Taka
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. HOW IT WORKS 3-STEPS */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <h4 className="text-center font-bold text-slate-900 text-sm mb-3">সহজ ৩ ধাপে শুরু করুন</h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center mb-1.5">১</div>
            <strong className="text-[11px] text-slate-900">প্রোডাক্ট সিলেক্ট</strong>
            <span className="text-[9.5px] text-slate-500 mt-0.5">কোর্স বা অ্যাপ বেছে নিন</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center mb-1.5">২</div>
            <strong className="text-[11px] text-slate-900">পেমেন্ট কনফার্ম</strong>
            <span className="text-[9.5px] text-slate-500 mt-0.5">bKash/Nagad এ টাকা পাঠান</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center mb-1.5">৩</div>
            <strong className="text-[11px] text-slate-900">ইনস্ট্যান্ট অ্যাক্সেস</strong>
            <span className="text-[9.5px] text-slate-500 mt-0.5">স্বয়ংক্রিয় পাসওয়ার্ড ও ফাইল</span>
          </div>
        </div>
      </section>

      {/* 5. AFFILIATE PROGRAM BANNER */}
      <section className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-xs">
          <h3 className="font-extrabold text-base mb-1">অ্যাফিলিয়েট পার্টনার হয়ে ঘরে বসেই আয় করুন!</h3>
          <p className="text-xs text-emerald-100/90 mb-3">
            প্রতিটি সফল রেফারে পান আকর্ষণীয় ২০% সরাসরি কমিশন এবং নিয়মিত উইথড্র সুবিধা।
          </p>
          <button
            onClick={onBecomeAffiliateClick}
            className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs py-2 px-4 rounded-full shadow-md transition-all transform active:scale-95 cursor-pointer"
          >
            Become an Affiliate (৳১৯৯)
          </button>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 rounded-2xl p-4 text-xs">
        <div className="font-extrabold text-base text-white mb-1">
          Profit<span className="text-emerald-500">Next</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          বিশ্বস্ত ডিজিটাল প্রোডাক্ট ও প্রফেশনাল অনলাইন কোর্স প্ল্যাটফর্ম।
        </p>
        <div className="flex flex-wrap gap-3 my-2.5 text-[11px] text-slate-300">
          <button onClick={onViewCourseDetail} className="hover:text-emerald-400 cursor-pointer">কোর্স সিলেবাস</button>
          <button onClick={onBecomeAffiliateClick} className="hover:text-emerald-400 cursor-pointer">অ্যাফিলিয়েট জয়েন</button>
          <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">সাপোর্ট</a>
        </div>
        <div className="border-t border-slate-800 pt-2 text-[10px] text-slate-500">
          © 2026 ProfitNext Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

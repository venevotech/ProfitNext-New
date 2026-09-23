import React from 'react';
import { Play, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, Users, GraduationCap } from 'lucide-react';
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
    <div className="space-y-6 sm:space-y-8 md:space-y-10 pb-6 w-full max-w-7xl mx-auto">
      {/* 1. HERO BANNER CARD (Responsive: Mobile 1-col, Desktop 12-col grid) */}
      <section className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-slate-950 text-white">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-5 sm:p-8 md:p-10 lg:p-12 bg-gradient-to-br from-emerald-950/90 via-slate-950 to-teal-950/90">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left Column: Hero Text & Main CTAs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>ডিজিটাল স্কিল • হাই আর্নিং • প্রিমিয়াম টুলস</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                ডিজিটাল প্রোডাক্ট ও ইনকাম কোর্স — <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">ঘরে বসেই শুরু করুন</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                ফুল কোর্স + জেমিনি প্রো + ক্যাপকাট প্রো ভিআইপি বান্ডেল পান মাত্র{' '}
                <strong className="text-emerald-400 font-black text-base sm:text-xl">৳৩৯৯</strong> টাকায়! সাথে ইনস্ট্যান্ট লাইফটাইম অ্যাক্সেস ও সাপোর্ট।
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 py-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>১২,০০০+ সন্তুষ্ট শিক্ষার্থী</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>অটোমেটিক ক্রেডেনশিয়াল</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>১০০% নিরাপদ bKash/Nagad</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onGetCourseClick}
                  className="min-h-[48px] bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm sm:text-base px-6 py-3 rounded-xl sm:rounded-full shadow-lg shadow-emerald-500/30 transition-all transform active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <GraduationCap className="w-5 h-5 text-amber-300" />
                  <span>কোর্স কিনুন মাত্র ৳৩৯৯</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onViewCourseDetail}
                  className="min-h-[48px] bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl sm:rounded-full transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>সিলেবাস দেখুন</span>
                </button>

                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl sm:rounded-full transition-all cursor-pointer flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  <span>WhatsApp সাপোর্ট</span>
                </a>
              </div>
            </div>

            {/* Right Column: Hero Video Card Showcase */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md">
                <div 
                  onClick={() => onPlayPreviewVideo('Hf0Mvc_eKos')}
                  className="w-full aspect-video bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center shadow-inner cursor-pointer group"
                >
                  <div className="absolute top-2.5 left-2.5 bg-white/95 px-2 py-0.5 rounded text-[10px] font-extrabold text-indigo-950 flex items-center gap-1 z-10 shadow-xs">
                    <span className="text-blue-600">✦</span> Gemini PRO VIP Included
                  </div>

                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform z-10">
                    <Play className="w-6 h-6 fill-emerald-600 text-emerald-600 ml-1" />
                  </div>

                  <div className="absolute left-3 bottom-2.5 right-3 text-left text-white z-10">
                    <div className="text-xs sm:text-sm font-black text-amber-300 drop-shadow-md">
                      মাসে আয় করুন ৫০ হাজার+ টাকা (AI ভিডিও কোর্স)
                    </div>
                    <div className="text-[10px] text-slate-300 mt-0.5">
                      ✓ ফ্রি প্রিভিউ ভিডিও দেখুন • ক্লিক করে প্লে করুন
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">ইনক্লুডেড প্রিমিয়াম প্যাকেজ:</span>
                  <span className="text-emerald-400 font-black">Course + Gemini + CapCut</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED COURSE PROMOTIONAL CARD (Matches Screenshot 1 Middle & Standardizes ৳399 checkout) */}
      <section className="bg-white border-2 border-emerald-400 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
          {/* Video Thumbnail Box */}
          <div 
            onClick={() => onPlayPreviewVideo('Hf0Mvc_eKos')}
            className="md:col-span-6 lg:col-span-7 aspect-video bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl sm:rounded-2xl relative overflow-hidden flex items-center justify-center shadow-md cursor-pointer group"
          >
            <div className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded text-[9px] font-extrabold text-indigo-950 flex items-center gap-1 z-10 shadow-xs">
              <span className="text-blue-600">✦</span> Gemini PRO
            </div>

            <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-10">
              <Play className="w-5 h-5 fill-emerald-600 text-emerald-600 ml-0.5" />
            </div>

            <div className="absolute left-3 bottom-2 right-3 text-left text-white z-10">
              <div className="text-xs sm:text-sm font-extrabold text-amber-300 leading-tight">
                মাসে আয় করুন ৫০ হাজার টাকা
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-300">
                ✓ AI Tool • Easy Setup • Full Tutorial
              </div>
            </div>
          </div>

          {/* Course Text & "Get Course" Button */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-center items-center text-center p-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full mb-2">
              সবচেয়ে জনপ্রিয় বান্ডেল
            </span>
            <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 leading-snug mb-1">
              বিশেষ অফারে AI দিয়ে আর্নিং কোর্স নিন
            </h2>
            <div className="text-emerald-600 font-black text-2xl sm:text-3xl my-1.5">
              মাত্র ৳৩৯৯ <span className="text-sm line-through text-slate-400 font-semibold">৳৯৯৯</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 max-w-sm">
              পেমেন্টের পরপরই কোর্সের ফুল ভিডিও, Gemini Pro এবং CapCut Pro এর লাইফটাইম লগইন অ্যাক্সেস স্বয়ংক্রিয়ভাবে পেয়ে যাবেন।
            </p>

            <button
              onClick={onGetCourseClick}
              className="w-full max-w-xs min-h-[48px] bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-sm sm:text-base py-3 px-6 rounded-full shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Get Course ⚡ (৳৩৯৯)</span>
            </button>
          </div>
        </div>

        {/* Footer Guarantee Caption */}
        <div className="text-xs sm:text-sm font-bold text-emerald-800 text-center pt-3 mt-4 border-t border-dashed border-emerald-200">
          Course + Gemini Pro + CapCut Pro (৳৩৯৯ টাকায় স্বয়ংক্রিয় ক্রেডেনশিয়াল অ্যাক্সেস ও ফুল ভিডিও)
        </div>
      </section>

      {/* 3. PREMIUM APPS GRID (Fully Responsive: 1 col on xs, 2 on sm, 3 on md, 4 on lg) */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-emerald-600 font-black text-2xl sm:text-3xl tracking-tight">
            Premium Apps
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            সর্বোচ্চ বিশ্বস্ততায় প্রিমিয়াম সফটওয়্যার ও এআই টুলস পান নামমাত্র মূল্যে
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.filter(p => p.id !== 'course_ai_bundle').map((app) => {
            return (
              <div
                key={app.id}
                onClick={() => onAppBuyClick(app)}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-between text-center shadow-xs hover:shadow-md transition-all group cursor-pointer"
              >
                {/* Visual badge card matching screenshot aesthetics */}
                <div className="w-full mb-3">
                  {app.id === 'gemini_pro' ? (
                    <div className="w-full h-28 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 text-white p-3 flex flex-col items-center justify-center shadow-xs transition-transform group-hover:scale-[1.02]">
                      <div className="flex items-center gap-1.5 font-bold text-base">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Gemini</span>
                      </div>
                      <div className="text-xs opacity-90">Google Ai Pro</div>
                      <div className="bg-white/20 px-2.5 py-0.5 rounded-full text-[9px] font-semibold mt-1.5">
                        Personal Subscription
                      </div>
                    </div>
                  ) : app.id === 'capcut_pro' ? (
                    <div className="w-full h-28 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-3 flex flex-col items-center justify-center border border-slate-700 shadow-xs transition-transform group-hover:scale-[1.02]">
                      <div className="flex items-center gap-1.5 font-black text-base tracking-wide">
                        <span className="text-amber-400">👑</span> CAPCUT PRO
                      </div>
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mt-2 shadow-xs">
                        <span className="text-slate-900 font-extrabold text-sm">⧉</span>
                      </div>
                    </div>
                  ) : app.id === 'duolingo_max' ? (
                    <div className="w-full h-28 rounded-xl bg-slate-900 text-white p-3 flex flex-col items-center justify-center border border-slate-800 shadow-xs transition-transform group-hover:scale-[1.02]">
                      <div className="text-xs font-bold text-emerald-400">duolingo</div>
                      <div className="text-lg font-black text-sky-400 tracking-wider">MAX</div>
                      <div className="text-base mt-1">🦉</div>
                    </div>
                  ) : (
                    <div className="w-full h-28 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-3 flex flex-col items-center justify-center shadow-xs transition-transform group-hover:scale-[1.02]">
                      <div className="font-extrabold text-sm line-clamp-1">{app.title}</div>
                      <div className="text-[10px] text-slate-300 mt-1 line-clamp-1">{app.subTitle}</div>
                    </div>
                  )}
                </div>

                {/* App Info */}
                <div className="w-full space-y-1 mb-3">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 line-clamp-1">
                    {app.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {app.subTitle}
                  </p>
                </div>

                {/* Price button with min 44px height */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAppBuyClick(app);
                  }}
                  className="w-full min-h-[44px] bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-black py-2.5 px-4 rounded-xl shadow-sm transition-all transform active:scale-95 cursor-pointer text-center"
                >
                  {app.price} Taka
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. HOW IT WORKS 3-STEPS (Responsive: 1 col on xs, 3 cols on sm/md/lg) */}
      <section className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs">
        <h3 className="text-center font-black text-slate-900 text-base sm:text-xl mb-6">
          সহজ ৩ ধাপে শুরু করুন আপনার ডিজিটাল যাত্রা
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-black text-base flex items-center justify-center mb-2 shadow-xs">
              ১
            </div>
            <strong className="text-sm font-extrabold text-slate-900">প্রোডাক্ট সিলেক্ট</strong>
            <span className="text-xs text-slate-600 mt-1">কোর্স বা পছন্দের প্রিমিয়াম অ্যাপ বেছে নিন</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-black text-base flex items-center justify-center mb-2 shadow-xs">
              ২
            </div>
            <strong className="text-sm font-extrabold text-slate-900">পেমেন্ট কনফার্ম</strong>
            <span className="text-xs text-slate-600 mt-1">bKash/Nagad/Rocket এ সেন্ড মানি করুন</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-xl bg-slate-50">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-black text-base flex items-center justify-center mb-2 shadow-xs">
              ৩
            </div>
            <strong className="text-sm font-extrabold text-slate-900">ইনস্ট্যান্ট অ্যাক্সেস</strong>
            <span className="text-xs text-slate-600 mt-1">স্বয়ংক্রিয় পাসওয়ার্ড, আইডি ও ফুল ভিডিও ফাইল</span>
          </div>
        </div>
      </section>

      {/* 5. AFFILIATE PROGRAM BANNER (Responsive flex / grid) */}
      <section className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-300/30">
              পার্টনারশিপ প্রোগ্রাম
            </span>
            <h3 className="font-black text-xl sm:text-2xl lg:text-3xl text-white">
              অ্যাফিলিয়েট পার্টনার হয়ে ঘরে বসেই আয় করুন!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              প্রতিটি সফল রেফারে পান আকর্ষণীয় ২০% সরাসরি কমিশন, রিয়েল-টাইম ড্যাশবোর্ড এবং নিয়মিত bKash/Nagad উইথড্র সুবিধা।
            </p>
          </div>

          <button
            onClick={onBecomeAffiliateClick}
            className="min-h-[48px] bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm py-3 px-6 rounded-full shadow-lg transition-all transform active:scale-95 cursor-pointer shrink-0"
          >
            Become an Affiliate (৳১৯৯)
          </button>
        </div>
      </section>

      {/* 6. RESPONSIVE FOOTER */}
      <footer className="bg-slate-900 text-slate-400 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-slate-800">
          <div className="md:col-span-6 space-y-2">
            <div className="font-black text-xl text-white">
              Profit<span className="text-emerald-500">Next</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              বাংলাদেশের বিশ্বস্ত ডিজিটাল প্রোডাক্ট ও প্রফেশনাল অনলাইন কোর্স প্ল্যাটফর্ম। ইনস্ট্যান্ট ডেলিভারি ও ২৪/৭ ডেডিকেটেড সাপোর্ট।
            </p>
          </div>

          <div className="md:col-span-6 flex flex-wrap gap-4 sm:gap-6 items-center md:justify-end text-xs font-semibold text-slate-300">
            <button onClick={onViewCourseDetail} className="min-h-[44px] hover:text-emerald-400 cursor-pointer">
              কোর্স সিলেবাস
            </button>
            <button onClick={onBecomeAffiliateClick} className="min-h-[44px] hover:text-emerald-400 cursor-pointer">
              অ্যাফিলিয়েট জয়েন
            </button>
            <a 
              href={`https://wa.me/${settings.whatsappNumber}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="min-h-[44px] flex items-center hover:text-emerald-400"
            >
              WhatsApp হেল্পলাইন
            </a>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>© 2026 ProfitNext Inc. All rights reserved.</div>
          <div>Mobile, Tablet & Desktop Optimized Experience</div>
        </div>
      </footer>
    </div>
  );
};

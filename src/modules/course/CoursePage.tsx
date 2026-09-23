import React, { useState } from 'react';
import { Users, ChevronDown, CheckCircle2, Lock, Sparkles, ShoppingBag, ArrowRight, ShieldCheck, Play } from 'lucide-react';
import { SiteSettings } from '../../core/types.ts';

interface CoursePageProps {
  settings: SiteSettings;
  onBuyCourseBundle: () => void;
  onBuyApp: (appId: string) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const CoursePage: React.FC<CoursePageProps> = ({
  settings,
  onBuyCourseBundle,
  onBuyApp,
  showToast
}) => {
  const [showTopics1, setShowTopics1] = useState(false);
  const [showAppsAccordion, setShowAppsAccordion] = useState(false);
  const [moduleProgress, setModuleProgress] = useState<{ [key: number]: boolean }>({ 1: true });

  const toggleModuleComplete = (num: number) => {
    setModuleProgress(prev => {
      const next = { ...prev, [num]: !prev[num] };
      showToast(next[num] ? `মডিউল ${num} সম্পন্ন হয়েছে!` : `মডিউল ${num} অসম্পন্ন`, '📚');
      return next;
    });
  };

  return (
    <div className="space-y-6 pb-6 w-full max-w-7xl mx-auto">
      {/* Heading section with fluid typography */}
      <div className="text-center space-y-2">
        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
          প্রফেশনাল স্কিল ডেভেলপমেন্ট
        </span>
        <h1 className="text-emerald-600 font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center leading-snug tracking-tight">
          AI দিয়ে ভিডিও বানিয়ে ইনকামের যাত্রা শুরু করুন
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          সহজ বাংলায় সম্পূর্ণ প্র্যাকটিক্যাল গাইডলাইন। জেমিনি প্রো ও ক্যাপকাট প্রো ব্যবহার করে প্রফেশনাল কনটেন্ট তৈরি ও আর্নিং।
        </p>
      </div>

      {/* Responsive Main Layout: Desktop 2-Column, Mobile Stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* LEFT COLUMN: Video Modules & Interactive Syllabus (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-5">
          {/* MODULE 1 (Hands-on Video & Lessons) */}
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                  01
                </span>
                <span className="font-extrabold text-base text-slate-900">
                  Course Module - 1: AI Content & Video Creation
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Beginner to Advanced
              </span>
            </div>

            {/* Fluid Video Player */}
            <div className="w-full aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden mb-4 shadow-sm">
              <iframe
                src="https://www.youtube.com/embed/Hf0Mvc_eKos?rel=0"
                title="Module 1 Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              শিখুন Gemini Pro এবং CapCut Pro ব্যবহার করে AI দিয়ে আকর্ষণীয় ভিডিও তৈরি করে কিভাবে ঘরে বসেই আয় করবেন।
            </p>

            {/* Action Buttons (Min 44px touch targets) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setShowTopics1(!showTopics1)}
                className="min-h-[44px] py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>লেসন সিলেবাস দেখুন</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showTopics1 ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={() => toggleModuleComplete(1)}
                className={`min-h-[44px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  moduleProgress[1]
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{moduleProgress[1] ? 'মডিউল সম্পন্ন ✓' : 'সম্পন্ন মার্ক করুন'}</span>
              </button>
            </div>

            {/* Syllabus Breakdown */}
            {showTopics1 && (
              <div className="mt-4 pt-4 border-t border-dashed border-slate-200 space-y-2.5 text-xs sm:text-sm text-slate-700 animate-in fade-in duration-200">
                <div className="font-extrabold text-emerald-700 mb-2">মডিউল ১ এর অন্তর্ভুক্ত সকল লেসন:</div>
                {[
                  '1. How to create video with Google Flow Pro & AI prompts',
                  '2. How to find viral trending content to create',
                  '3. How to source high-res images to create content',
                  '4. Create viral videos and auto captions & SEO descriptions',
                  '5. Earning potential, YouTube/FB monetization & affiliate setup'
                ].map((lesson, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-800">{lesson}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Expandable Accordion for Apps inside Course */}
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-3.5">
              <div
                onClick={() => setShowAppsAccordion(!showAppsAccordion)}
                className="flex items-center justify-between cursor-pointer min-h-[36px]"
              >
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  ক্লিক করুন এবং জেমিনি প্রো ও ক্যাপকাট প্রো আলাদা নিন
                </span>
                <div className={`w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center transition-transform ${showAppsAccordion ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {showAppsAccordion && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200">
                  <div
                    onClick={() => onBuyApp('gemini_pro')}
                    className="bg-white border border-purple-200 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer shadow-xs hover:border-purple-400 transition-all"
                  >
                    <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-purple-700">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gemini Pro</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Google AI Pro সাবস্ক্রিপশন</div>
                    <div className="mt-2 bg-emerald-500 text-white text-xs font-black py-1.5 px-4 rounded-full">
                      350 টাকা
                    </div>
                  </div>

                  <div
                    onClick={() => onBuyApp('capcut_pro')}
                    className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer shadow-xs hover:border-slate-400 transition-all"
                  >
                    <div className="font-black text-xs sm:text-sm text-slate-900">👑 CAPCUT PRO</div>
                    <div className="text-[11px] text-slate-500">প্রফেশনাল ভিডিও এডিটিং</div>
                    <div className="mt-2 bg-emerald-500 text-white text-xs font-black py-1.5 px-4 rounded-full">
                      99 টাকা
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MODULE 2: CAPCUT VIDEO EDITING */}
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                  02
                </span>
                <span className="font-extrabold text-base text-slate-900">
                  Course Module - 2: CapCut Video Editing Masterclass
                </span>
              </div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Intermediate
              </span>
            </div>

            <div className="w-full aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden mb-4 shadow-sm">
              <iframe
                src="https://www.youtube.com/embed/EvpXW7qpong?rel=0"
                title="Capcut Video Editing Course"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              স্মার্টফোন ও পিসি দিয়ে প্রফেশনাল ক্যাপকাট ভিডিও এডিটিং এর পূর্ণাঙ্গ স্টেপ-বাই-স্টেপ হ্যান্ডস-অন টিউটোরিয়াল।
            </p>

            <button
              onClick={() => toggleModuleComplete(2)}
              className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                moduleProgress[2]
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{moduleProgress[2] ? 'মডিউল সম্পন্ন ✓' : 'সম্পন্ন মার্ক করুন'}</span>
            </button>
          </div>

          {/* MODULES 3: ADVANCED MONETIZATION (COMING SOON) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl p-5 text-center">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-slate-400 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                  03
                </span>
                <span className="font-extrabold text-sm sm:text-base text-slate-700">
                  Course Module - 3: Advanced AI Monetization
                </span>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Locked</span>
              </span>
            </div>

            <div className="h-24 bg-slate-900 text-white rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-inner">
              <div className="text-base sm:text-lg font-bold">ভিডিও ৩ — পরবর্তী আপডেটে উন্মুক্ত হবে</div>
              <span className="text-[10px] tracking-widest font-black text-slate-400 uppercase bg-slate-800 px-3 py-1 rounded-full">
                COMING SOON
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Bundle Offer Card (৳399) & VIP Community (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
          <div className="bg-white border-2 border-emerald-400 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>SPECIAL BUNDLE OFFER</span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              AI কোর্স + Gemini Pro + CapCut Pro
            </h2>

            <div className="my-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600">৳৩৯৯</span>
              <span className="text-sm line-through text-slate-400 font-semibold">৳৯৯৯</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                ৬০% ছাড়
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              পেমেন্ট কনফার্মেশনের পরপরই পাবেন পুরো কোর্স মেটেরিয়াল, Gemini Pro এবং CapCut Pro এর লাইফটাইম লগইন অ্যাক্সেস।
            </p>

            {/* Feature List */}
            <div className="space-y-2 mb-5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ফুল ভিডিও কোর্স ও মেটেরিয়ালস</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Gemini Pro পার্সোনাল সাবস্ক্রিপশন</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>CapCut Pro আনলিমিটেড ভিআইপি অ্যাক্সেস</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>স্বয়ংক্রিয় পাসওয়ার্ড ও কাস্টমার পোর্টাল</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>২৪/৭ ডেডিকেটেড সাপোর্ট</span>
              </div>
            </div>

            {/* Primary Buy CTA */}
            <button
              onClick={onBuyCourseBundle}
              className="w-full min-h-[48px] bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-sm sm:text-base py-3 px-6 rounded-xl sm:rounded-full shadow-lg shadow-emerald-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>৳৩৯৯ এ এখনই কিনুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* WhatsApp VIP Community Card */}
          <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Users className="w-4 h-4" />
              <span>VIP শিক্ষার্থী কমিউনিটি</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              সরাসরি মেন্টরদের সাথে প্রশ্ন ও ভিডিও সমস্যার সমাধান পেতে আমাদের অফিশিয়াল হোয়াটসঅ্যাপ গ্রুপে যুক্ত হোন।
            </p>
            <a
              href={settings.whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Join WhatsApp Group</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Users, ChevronDown, CheckCircle2, Lock, ExternalLink, Sparkles, ShoppingBag } from 'lucide-react';
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
    <div className="space-y-4 pb-4">
      {/* Heading matching Screenshot 3 */}
      <h1 className="text-emerald-600 font-extrabold text-base sm:text-lg text-center leading-snug tracking-tight px-2">
        AI দিয়ে ভিডিও বানিয়ে ইনকামের যাত্রা শুরু করুন।
      </h1>

      {/* WhatsApp VIP Community Button */}
      <div className="flex justify-center">
        <a
          href={settings.whatsappGroupLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-2 px-5 rounded-full flex items-center gap-2 shadow-sm transition-all transform active:scale-95"
        >
          <Users className="w-4 h-4" />
          <span>Join WhatsApp Group (VIP)</span>
        </a>
      </div>

      {/* Special Offer Sticky/Banner (399 Taka Bundle CTA) */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-3.5 rounded-2xl shadow-md flex items-center justify-between gap-2 border border-emerald-500">
        <div>
          <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full uppercase">
            SPECIAL BUNDLE OFFER
          </span>
          <div className="font-extrabold text-sm sm:text-base mt-1">
            কোর্স + জেমিনি প্রো + ক্যাপকাট প্রো
          </div>
          <div className="text-xs text-emerald-100">
            ফুল বান্ডেল মাত্র <strong>৳৩৯৯</strong> টাকায়!
          </div>
        </div>
        <button
          onClick={onBuyCourseBundle}
          className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs sm:text-sm py-2 px-4 rounded-full shadow-md shrink-0 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>৳৩৯৯ এ কিনুন</span>
        </button>
      </div>

      {/* MODULE 1 (Matches Screenshot 3) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded-md">
              01
            </span>
            <span className="font-bold text-sm text-slate-900">Course Module - 1</span>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            Beginner Level
          </span>
        </div>

        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-3 shadow-xs">
          <iframe
            src="https://www.youtube.com/embed/Hf0Mvc_eKos?rel=0"
            title="Module 1 Video"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          শিখুন Gemini Pro এবং CapCut Pro ব্যবহার করে AI দিয়ে ভিডিও তৈরি করে কিভাবে ইনকাম করবেন।
        </p>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowTopics1(!showTopics1)}
            className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>View Module</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTopics1 ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => toggleModuleComplete(1)}
            className={`flex-1 py-2 px-3 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              moduleProgress[1]
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{moduleProgress[1] ? 'Completed ✓' : 'Start Learning'}</span>
          </button>
        </div>

        {/* Syllabus Breakdown */}
        {showTopics1 && (
          <div className="mt-3 pt-3 border-t border-dashed border-slate-200 space-y-2 text-xs text-slate-700 animate-in fade-in duration-150">
            <div className="font-bold text-emerald-700 text-xs mb-1">মডিউল ১ সিলেবাস ও লেসনসমূহ:</div>
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg">
              <span className="text-emerald-600 font-bold">1.</span>
              <span>How to create video with Google Flow Pro</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg">
              <span className="text-emerald-600 font-bold">2.</span>
              <span>How to find viral content to create</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg">
              <span className="text-emerald-600 font-bold">3.</span>
              <span>How to find images to create content</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg">
              <span className="text-emerald-600 font-bold">4.</span>
              <span>Create viral videos and search captions & descriptions</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-lg">
              <span className="text-emerald-600 font-bold">5.</span>
              <span>Earning potential and monetization setup</span>
            </div>
          </div>
        )}

        {/* Expandable Accordion for Apps (Matching Screenshot 3) */}
        <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
          <div
            onClick={() => setShowAppsAccordion(!showAppsAccordion)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="text-xs font-bold text-slate-800">
              ক্লিক করুন এবং জেমিনি প্রো ও ক্যাপকাট প্রো নিন
            </span>
            <div className={`w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center transition-transform ${showAppsAccordion ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          {showAppsAccordion && (
            <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-200">
              <div
                onClick={() => onBuyApp('gemini_pro')}
                className="bg-white border border-purple-200 rounded-xl p-2 flex flex-col items-center justify-center text-center cursor-pointer shadow-xs hover:border-purple-400"
              >
                <div className="flex items-center gap-1 font-bold text-xs text-purple-700">
                  <Sparkles className="w-3 h-3" />
                  <span>Gemini Pro</span>
                </div>
                <div className="text-[10px] text-slate-500">Google AI Pro</div>
                <div className="mt-1.5 bg-emerald-500 text-white text-[11px] font-bold py-1 px-3 rounded-full">
                  350 টাকা
                </div>
              </div>

              <div
                onClick={() => onBuyApp('capcut_pro')}
                className="bg-white border border-slate-200 rounded-xl p-2 flex flex-col items-center justify-center text-center cursor-pointer shadow-xs hover:border-slate-400"
              >
                <div className="font-black text-xs text-slate-900">CAPCUT PRO</div>
                <div className="text-[10px] text-slate-500">Video Editing VIP</div>
                <div className="mt-1.5 bg-emerald-500 text-white text-[11px] font-bold py-1 px-3 rounded-full">
                  99 টাকা
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODULE 2: CAPCUT VIDEO EDITING */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded-md">
              02
            </span>
            <span className="font-bold text-sm text-slate-900">CapCut Video Editing Masterclass</span>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
            Intermediate
          </span>
        </div>

        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-3 shadow-xs">
          <iframe
            src="https://www.youtube.com/embed/EvpXW7qpong?rel=0"
            title="Capcut Video Editing Course"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          মোবাইল দিয়ে প্রফেশনাল ক্যাপকাট ভিডিও এডিটিং এর পূর্ণাঙ্গ হ্যান্ডস-অন টিউটোরিয়াল।
        </p>

        <button
          onClick={() => toggleModuleComplete(2)}
          className={`w-full py-2 px-3 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            moduleProgress[2]
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{moduleProgress[2] ? 'Completed ✓' : 'Mark as Watched'}</span>
        </button>
      </div>

      {/* MODULES 3 & 4 (COMING SOON) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="bg-slate-400 text-white text-xs font-black px-2 py-0.5 rounded-md">
              03
            </span>
            <span className="font-bold text-sm text-slate-700">Course Module - 3: Advanced AI Monetization</span>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Locked</span>
          </span>
        </div>

        <div className="h-20 bg-slate-900 text-white rounded-xl flex flex-col items-center justify-center gap-1">
          <div className="text-base font-bold">ভিডিও ৩ — শীঘ্রই আসছে</div>
          <span className="text-[10px] tracking-widest font-black text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded">
            COMING SOON
          </span>
        </div>
      </div>
    </div>
  );
};

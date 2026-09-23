import React, { useState } from 'react';
import { 
  Users, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles, 
  ShoppingBag, 
  Play, 
  ExternalLink, 
  Download, 
  Layers, 
  Gift, 
  Check, 
  Star,
  Film
} from 'lucide-react';
import { SiteSettings } from '../../core/types.ts';
import { DEFAULT_COURSE_CONFIG } from '../../core/store.ts';
import { getYouTubeEmbedUrl } from '../../services/youtube.ts';

interface CoursePageProps {
  settings: SiteSettings;
  onBuyCourseBundle?: () => void;
  onBuyCombo: () => void;
  onBuyApp?: (appId: string) => void;
  showToast: (msg: string, icon?: string) => void;
}

export const CoursePage: React.FC<CoursePageProps> = ({
  settings,
  onBuyCourseBundle,
  onBuyCombo,
  onBuyApp,
  showToast
}) => {
  const courseConfig = settings.courseConfig || DEFAULT_COURSE_CONFIG;
  const modules = courseConfig.modules || DEFAULT_COURSE_CONFIG.modules;
  const combo = courseConfig.comboPackage || DEFAULT_COURSE_CONFIG.comboPackage;

  // Track expanded topics per module
  const [expandedTopics, setExpandedTopics] = useState<{ [key: string]: boolean }>({});
  // Track completed modules
  const [completedModules, setCompletedModules] = useState<{ [key: string]: boolean }>({});

  const toggleTopics = (modId: string) => {
    setExpandedTopics(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const toggleComplete = (modId: string, modTitle: string) => {
    setCompletedModules(prev => {
      const next = { ...prev, [modId]: !prev[modId] };
      showToast(next[modId] ? `${modTitle} সম্পন্ন হয়েছে!` : `${modTitle} অসম্পন্ন চিহ্নিত`, '📚');
      return next;
    });
  };

  // Split modules into before combo (e.g. Module 1, 2) and after combo (e.g. Module 3)
  const modulesBeforeCombo = modules.slice(0, 2);
  const modulesAfterCombo = modules.slice(2);

  return (
    <div className="space-y-6 pb-6 max-w-4xl mx-auto">
      {/* 1. Header with FREE Course Banner */}
      <div className="text-center space-y-3 px-2 pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black shadow-xs animate-pulse">
          <Gift className="w-3.5 h-3.5 text-emerald-600" />
          <span>১০০% ফ্রি কোর্স — কোনো ফি ছাড়াই শিখুন</span>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-snug tracking-tight">
          {courseConfig.headline || 'AI দিয়ে ভিডিও বানিয়ে ইনকামের যাত্রা শুরু করুন। (সম্পূর্ণ ফ্রি কোর্স)'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          নিচের প্রতিটি ভিডিও লেকচার সম্পূর্ণ উন্মুক্ত। আপনি ফ্রিতে দেখে শিখতে পারেন। প্রফেশনাল কাজের সুবিধার্থে এআই অ্যাপসগুলোর ভিআইপি এক্সেস কম্বো প্যাকেজে নিতে পারেন।
        </p>

        {/* WhatsApp VIP Community Button */}
        <div className="flex justify-center pt-1">
          <a
            href={courseConfig.whatsappGroupLink || settings.whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-full flex items-center gap-2 shadow-sm transition-all transform active:scale-95"
          >
            <Users className="w-4 h-4" />
            <span>Join WhatsApp Group (VIP Community)</span>
          </a>
        </div>
      </div>

      {/* 2. MODULES BEFORE COMBO (Module 1 & Module 2) */}
      <div className="space-y-5">
        {modulesBeforeCombo.map((mod, index) => {
          const isExpanded = !!expandedTopics[mod.id];
          const isDone = !!completedModules[mod.id];
          const embedUrl = getYouTubeEmbedUrl(mod.videoUrl);

          return (
            <div 
              key={mod.id} 
              className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs transition-all hover:border-slate-300"
            >
              {/* Module Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-0.5 rounded-lg">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                      {mod.title}
                    </h3>
                    {mod.subTitle && (
                      <span className="text-[11px] text-slate-500 font-medium block">
                        {mod.subTitle}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                  {mod.level || 'Free Video'}
                </span>
              </div>

              {/* Free Responsive Video Player */}
              <div className="w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden mb-3 shadow-md border border-slate-900">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={mod.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Play className="w-8 h-8 opacity-50" />
                    <span className="text-xs">ভিডিও লিঙ্ক লোড হচ্ছে...</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {mod.description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                  {mod.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {mod.topics && mod.topics.length > 0 && (
                  <button
                    onClick={() => toggleTopics(mod.id)}
                    className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>সিলেবাস দেখুন ({mod.topics.length} পাঠ)</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                )}

                <button
                  onClick={() => toggleComplete(mod.id, mod.title)}
                  className={`flex-1 py-2 px-3 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isDone ? 'দেখা সম্পন্ন ✓' : 'দেখা শেষ হলে চাপুন'}</span>
                </button>
              </div>

              {/* Syllabus Breakdown Accordion */}
              {isExpanded && mod.topics && (
                <div className="mt-3 pt-3 border-t border-dashed border-slate-200 space-y-1.5 text-xs text-slate-700">
                  <div className="font-bold text-emerald-700 text-xs mb-1.5">এই মডিউলে যা শিখবেন:</div>
                  {mod.topics.map((topic, i) => (
                    <div key={i} className="flex items-start gap-2 p-1.5 bg-slate-50 rounded-lg">
                      <span className="text-emerald-600 font-bold shrink-0">{i + 1}.</span>
                      <span className="leading-snug">{topic}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. COMBO PACKAGE OF 350 TAKA (Course Videos + Apps) */}
      <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border-2 border-emerald-500/70 rounded-3xl p-4 sm:p-6 md:p-7 text-white shadow-xl relative overflow-hidden">
        {/* Glow ambient background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black tracking-wide uppercase mb-1.5">
              <Star className="w-3 h-3 fill-slate-950" />
              <span>{combo.badgeText || 'কম্বো অফার'}</span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight">
              {combo.title || 'Course Videos + Apps Combo Package'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-0.5">
              {combo.subTitle || '১ ও ২ নং প্রিমিয়াম অ্যাপস একসাথে মাত্র ৩৫০ টাকায় পান'}
            </p>
          </div>

          <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center gap-1 shrink-0">
            <span className="text-xs text-slate-400 line-through">
              ৳{combo.rawPrice || 850}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300">
              ৳{combo.price || 350}
            </div>
          </div>
        </div>

        {/* Apps List (1 & 2 Apps) */}
        <div className="relative z-10 py-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {combo.apps.map((app, idx) => (
            <div
              key={app.id || idx}
              className="bg-white/5 border border-white/10 hover:border-emerald-400/50 rounded-2xl p-3.5 sm:p-4 backdrop-blur-xs flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs flex items-center justify-center shrink-0 border border-emerald-500/30">
                    {idx + 1}
                  </span>
                  <h4 className="font-extrabold text-sm text-white leading-tight">
                    {app.title}
                  </h4>
                </div>

                {app.description && (
                  <p className="text-xs text-slate-300 pl-8 leading-relaxed mb-3">
                    {app.description}
                  </p>
                )}
              </div>

              {/* Direct Access Link / Button */}
              <div className="pl-8 pt-1">
                <a
                  href={app.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 underline underline-offset-4 transition-colors"
                >
                  <span>{app.buttonText || 'সরাসরি লিঙ্ক দেখুন'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Single Purchase Button (350 Taka Combo) */}
        <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-900/40 p-4 rounded-2xl border border-emerald-500/40">
          <div className="text-center sm:text-left">
            <span className="font-extrabold text-sm sm:text-base text-white block">
              উভয় অ্যাপস আনলক করতে চান?
            </span>
            <span className="text-xs text-emerald-200/80">
              এক ক্লিকে bKash/Nagad এ ৩৫০ টাকা পাঠিয়ে ফুল অ্যাক্সেস পান
            </span>
          </div>

          <button
            onClick={onBuyCombo}
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base py-3 px-6 rounded-full shadow-lg hover:shadow-amber-400/20 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-slate-950" />
            <span>{combo.buyButtonText || '৳৩৫০ টাকায় কম্বো প্যাকেজ কিনুন ⚡'}</span>
          </button>
        </div>
      </section>

      {/* 4. MODULES AFTER COMBO (Module 3 & Subsequent Modules) */}
      <div className="space-y-5">
        {modulesAfterCombo.map((mod, index) => {
          const isExpanded = !!expandedTopics[mod.id];
          const isDone = !!completedModules[mod.id];
          const embedUrl = getYouTubeEmbedUrl(mod.videoUrl);
          const moduleNumber = modulesBeforeCombo.length + index + 1;

          return (
            <div 
              key={mod.id} 
              className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs transition-all hover:border-slate-300"
            >
              {/* Module Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-white text-xs font-black px-2.5 py-0.5 rounded-lg">
                    {String(moduleNumber).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                      {mod.title}
                    </h3>
                    {mod.subTitle && (
                      <span className="text-[11px] text-slate-500 font-medium block">
                        {mod.subTitle}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                  {mod.level || 'Free Video'}
                </span>
              </div>

              {/* Free Responsive Video Player */}
              <div className="w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden mb-3 shadow-md border border-slate-900">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={mod.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Play className="w-8 h-8 opacity-50" />
                    <span className="text-xs">ভিডিও লিঙ্ক লোড হচ্ছে...</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {mod.description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                  {mod.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {mod.topics && mod.topics.length > 0 && (
                  <button
                    onClick={() => toggleTopics(mod.id)}
                    className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>সিলেবাস দেখুন ({mod.topics.length} পাঠ)</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                )}

                <button
                  onClick={() => toggleComplete(mod.id, mod.title)}
                  className={`flex-1 py-2 px-3 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isDone ? 'দেখা সম্পন্ন ✓' : 'দেখা শেষ হলে চাপুন'}</span>
                </button>
              </div>

              {/* Syllabus Breakdown Accordion */}
              {isExpanded && mod.topics && (
                <div className="mt-3 pt-3 border-t border-dashed border-slate-200 space-y-1.5 text-xs text-slate-700">
                  <div className="font-bold text-emerald-700 text-xs mb-1.5">এই মডিউলে যা শিখবেন:</div>
                  {mod.topics.map((topic, i) => (
                    <div key={i} className="flex items-start gap-2 p-1.5 bg-slate-50 rounded-lg">
                      <span className="text-emerald-600 font-bold shrink-0">{i + 1}.</span>
                      <span className="leading-snug">{topic}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

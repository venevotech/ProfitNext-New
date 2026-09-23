import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  Search, 
  GraduationCap, 
  CreditCard, 
  TrendingUp, 
  KeyRound, 
  MessageCircle, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export interface FaqItem {
  id: string;
  category: 'course' | 'payment' | 'credentials' | 'affiliate';
  question: string;
  questionEn: string;
  answer: string;
  answerPoints?: string[];
  badge?: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'course',
    question: '৩৯৯ টাকার এআই ভিডিও মাস্টারক্লাস বান্ডেলে আমি কী কী পাব?',
    questionEn: 'What is included in the 399 Taka AI Course Bundle?',
    answer: 'এটি একটি কমপ্লিট প্যাকেজ। আপনি একবার ৩৯৯ টাকা পেমেন্ট করলেই এক সাথে পাচ্ছেন:',
    answerPoints: [
      'ভিডিও এডিটিং ও এআই আর্নিং মাস্টারক্লাস (সম্পূর্ণ ফুল কোর্স ও প্রিমিয়াম ভিডিও লেকচার)',
      'Google Gemini Pro এর ১ মাসের আনলিমিটেড আল্ট্রা অ্যাক্সেস (2.5M Context Window)',
      'CapCut Pro Creator VIP এর লাইফটাইম মোড ও অল প্রিমিয়াম ফিল্টার/ইফেক্টস',
      'রেডিমেড প্রম্পট লাইব্রেরি ও গুগল ড্রাইভ রিসোর্স প্যাক',
      'প্রাইভেট ভিআইপি হোয়াটসঅ্যাপ সাপোর্ট গ্রুপে লাইফটাইম অ্যাক্সেস'
    ],
    badge: 'সেরা অফার'
  },
  {
    id: 'faq-2',
    category: 'course',
    question: 'কোর্সের ভিডিওগুলো কি মোবাইল এবং কম্পিউটার উভয় ডিভাইসেই দেখা যাবে?',
    questionEn: 'Can I watch the course on both Mobile and Computer?',
    answer: 'হ্যাঁ, ১০০% রেসপন্সিভ! আপনি আপনার স্মার্টফোন, ট্যাবলেট, ল্যাপটপ বা ডেস্কটপ কম্পিউটার যেকোনো ডিভাইস থেকে ব্রাউজারে লগইন করে সরাসরি ভিডিওগুলো দেখতে পারবেন এবং রিসোর্সগুলো ডাউনলোড করে ব্যবহার করতে পারবেন।'
  },
  {
    id: 'faq-3',
    category: 'payment',
    question: 'bKash বা Nagad এ কীভাবে টাকা পাঠাব এবং TrxID কোথায় দেব?',
    questionEn: 'How to pay via bKash/Nagad and where to submit TrxID?',
    answer: 'পেমেন্ট করা অত্যন্ত সহজ ও নিরাপদ:',
    answerPoints: [
      'ওয়েবসাইটের যেকোনো "Get Course" বা "কিনুন" বাটনে চাপ দিন।',
      'আমাদের অফিসিয়াল নম্বর 01625449778 (bKash / Nagad / Rocket) এ সেন্ড মানি (Send Money) করুন।',
      'আপনার পেমেন্ট রিসিট থেকে ৮-১০ ডিজিটের TrxID (Transaction ID) কপি করুন।',
      'চেকআউট পেজে আপনার নাম, মোবাইল নম্বর, ইমেইল ও TrxID লিখে সাবমিট করুন।'
    ]
  },
  {
    id: 'faq-4',
    category: 'credentials',
    question: 'পেমেন্ট করার পর Gemini Pro ও CapCut Pro ক্রেডেনশিয়াল কখন পাব?',
    questionEn: 'When will I get Gemini Pro and CapCut Pro credentials after payment?',
    answer: 'TrxID সাবমিট করার সাথে সাথেই সিস্টেম স্বয়ংক্রিয়ভাবে আপনাকে একটি পপ-আপ ক্রেডেনশিয়াল মোডালে আপনার আইডি, পাসকি ও ডাউনলোড লিংক প্রদর্শন করবে। এছাড়াও আপনি যেকোনো সময় উপরের "Portal ↗" মেন্যুতে গিয়ে আপনার সমস্ত ক্রেডেনশিয়াল দেখতে ও কপি করতে পারবেন।'
  },
  {
    id: 'faq-5',
    category: 'payment',
    question: 'পেমেন্ট সম্পন্ন হতে কতক্ষণ সময় লাগে এবং কোনো সমস্যা হলে কার সাথে কথা বলব?',
    questionEn: 'How long does verification take and how do I contact support?',
    answer: 'সিস্টেম ট্রানজেকশন স্বয়ংক্রিয়ভাবে প্রসেস করে। কোনো কারণে বিলম্ব হলে বা তথ্য সংশোধন করতে চাইলে আমাদের লাইভ হোয়াটসঅ্যাপ সাপোর্ট নম্বর (8801830086837) এ আপনার TrxID মেসেজ করলে এডমিন সরাসরি ভেরিফাই করে দেবে।'
  },
  {
    id: 'faq-6',
    category: 'affiliate',
    question: 'অ্যাফিলিয়েট প্রোগ্রাম কীভাবে কাজ করে এবং প্রতিটি রেফারে কত টাকা পাব?',
    questionEn: 'How does the affiliate program work and how much commission per sale?',
    answer: 'আপনি মাত্র ১৯৯ টাকা ওয়ান-টাইম ফি দিয়ে অ্যাফিলিয়েট পার্টনার হতে পারেন। এরপর আপনি একটি ইউনিক রেফারেল লিংক এবং প্রমো কোড পাবেন।',
    answerPoints: [
      'সরাসরি সেলসে পাচ্ছেন ২০% নিশ্চিত ক্যাশব্যাক/কমিশন।',
      'প্রতিটি ৩৯৯ টাকার সেলসে আপনার অ্যাকাউন্টে ৮০ টাকা ইনস্ট্যান্ট জমা হবে।',
      'MLM টিয়ার বোনাস: লেভেল-১ (২০%), লেভেল-২ (৫%), এবং লেভেল-৩ (২%) প্যাসিভ ইনকাম।',
      'রিয়েল-টাইম ক্লিক ও সেলস ট্র্যাকিং ড্যাশবোর্ড।'
    ],
    badge: '২০% কমিশন'
  },
  {
    id: 'faq-7',
    category: 'affiliate',
    question: 'অ্যাফিলিয়েট আয়ের টাকা কীভাবে উইথড্র (Withdraw) করতে পারব?',
    questionEn: 'How do I withdraw affiliate earnings?',
    answer: 'আপনার ড্যাশবোর্ডে যখন ন্যুনতম ৫০০ টাকা জমবে, তখন আপনি "Request Withdrawal" বাটনে চাপ দিয়ে আপনার bKash বা Nagad নম্বরে টাকা তোলার রিকোয়েস্ট পাঠাতে পারবেন। সাধারণত ২৪-৪৮ ঘণ্টার মধ্যে সরাসরি আপনার নম্বরে টাকা পৌঁছে যায়।'
  },
  {
    id: 'faq-8',
    category: 'course',
    question: 'আমি কি একদম নতুন (Beginner) হয়েও এই কোর্স করে কাজ শিখতে পারব?',
    questionEn: 'Can I learn from this course even if I am a complete beginner?',
    answer: 'অবশ্যই! কোর্সটি এমনভাবে সাজানো হয়েছে যাতে নতুনরা কোনো পূর্ব অভিজ্ঞতা ছাড়াই স্টেপ-বাই-স্টেপ এআই দিয়ে ভিডিও তৈরি, ভয়েসওভার জেনারেশন, সোশ্যাল মিডিয়া গ্রোথ এবং ফ্রিল্যান্সিং সার্ভিস দিয়ে অনলাইন থেকে আয় শুরু করতে পারেন।'
  }
];

interface FaqAccordionProps {
  onOpenCourseCheckout?: () => void;
  onOpenAffiliateRegister?: () => void;
  whatsappNumber?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  onOpenCourseCheckout,
  onOpenAffiliateRegister,
  whatsappNumber = '8801830086837'
}) => {
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-3']);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAccordion = (id: string) => {
    setOpenIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.question.toLowerCase().includes(q) ||
        item.questionEn.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 md:p-8 shadow-xs my-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>সাধারণ জিজ্ঞাসাসমূহ (FAQ)</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          যেকোনো প্রশ্ন? উত্তর জেনে নিন নিমিষেই
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
          কোর্স অ্যাক্সেস, bKash পেমেন্ট পদ্ধতি, ক্রেডেনশিয়াল আনলক ও অ্যাফিলিয়েট আর্নিং সংক্রান্ত যাবতীয় সমাধান।
        </p>
      </div>

      {/* Controls: Search + Category Filter */}
      <div className="space-y-3 mb-6">
        {/* Search input */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="প্রশ্ন খুঁজুন (যেমন: পেমেন্ট, কোর্স, কমিশন, Gemini...)"
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter categories */}
        <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            সকল প্রশ্ন ({FAQ_DATA.length})
          </button>
          <button
            onClick={() => setSelectedCategory('course')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'course'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>কোর্স ও ভিডিও</span>
          </button>
          <button
            onClick={() => setSelectedCategory('payment')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'payment'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>পেমেন্ট ও TrxID</span>
          </button>
          <button
            onClick={() => setSelectedCategory('credentials')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'credentials'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100/70'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>লগইন ক্রেডেনশিয়াল</span>
          </button>
          <button
            onClick={() => setSelectedCategory('affiliate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'affiliate'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100/70'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>অ্যাফিলিয়েট আর্নিং</span>
          </button>
        </div>
      </div>

      {/* Accordion List */}
      {filteredFaqs.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-xs sm:text-sm">
          আপনার অনুসন্ধানের সাথে মিল রেখে কোনো প্রশ্ন পাওয়া যায়নি। অন্য শব্দ দিয়ে চেষ্টা করুন।
        </div>
      ) : (
        <div className="space-y-2.5 max-w-3xl mx-auto">
          {filteredFaqs.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'border-emerald-300/80 bg-emerald-50/20 shadow-xs' 
                    : 'border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                }`}
              >
                {/* Accordion Question Trigger */}
                <button
                  onClick={() => toggleAccordion(item.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`p-1 rounded-lg shrink-0 mt-0.5 ${
                      isOpen ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {item.category === 'course' && <GraduationCap className="w-3.5 h-3.5" />}
                      {item.category === 'payment' && <CreditCard className="w-3.5 h-3.5" />}
                      {item.category === 'credentials' && <KeyRound className="w-3.5 h-3.5" />}
                      {item.category === 'affiliate' && <TrendingUp className="w-3.5 h-3.5" />}
                    </span>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 leading-snug flex items-center gap-2 flex-wrap">
                        <span>{item.question}</span>
                        {item.badge && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        {item.questionEn}
                      </span>
                    </div>
                  </div>

                  <div className={`shrink-0 p-1 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Answer Content */}
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 border-t border-emerald-100/60 leading-relaxed">
                    <p className="mt-2 text-slate-700">{item.answer}</p>
                    {item.answerPoints && (
                      <ul className="mt-2.5 space-y-1.5 pl-1">
                        {item.answerPoints.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-700 text-xs sm:text-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Contextual actions inside accordion */}
                    {item.category === 'course' && onOpenCourseCheckout && (
                      <div className="mt-3 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-700 font-medium">আজকের অফার মূল্য: মাত্র ৩৯৯ টাকা</span>
                        <button
                          onClick={onOpenCourseCheckout}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-1.5 px-3 rounded-full shadow-xs cursor-pointer transition-all active:scale-95"
                        >
                          কোর্স বান্ডেল কিনুন ⚡
                        </button>
                      </div>
                    )}
                    {item.category === 'affiliate' && onOpenAffiliateRegister && (
                      <div className="mt-3 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between">
                        <span className="text-[11px] text-amber-800 font-medium">জয়েনিং ফি মাত্র ১৯৯ টাকা (লাইফটাইম)</span>
                        <button
                          onClick={onOpenAffiliateRegister}
                          className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-[11px] py-1.5 px-3 rounded-full shadow-xs cursor-pointer transition-all active:scale-95"
                        >
                          অ্যাফিলিয়েট জয়েন করুন ↗
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Trust & Direct Support Footer Box */}
      <div className="mt-8 pt-6 border-t border-slate-200/90 max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">এখনও কোনো প্রশ্ন বা সাহায্য দরকার?</h4>
            <p className="text-[11px] sm:text-xs text-slate-500">আমাদের হোয়াটসঅ্যাপ সাপোর্ট টিম সর্বদা আপনার সহযোগিতায় প্রস্তুত।</p>
          </div>
        </div>
        <a
          href={`https://wa.me/${whatsappNumber}?text=Hello%20ProfitNext,%20I%20have%20a%20question%20regarding%20course%20access%20and%20payment.`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-all transform active:scale-95 shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>হোয়াটসঅ্যাপে কথা বলুন</span>
        </a>
      </div>
    </section>
  );
};

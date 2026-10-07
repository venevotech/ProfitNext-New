import React, { useState } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Play, 
  Send, 
  X, 
  AlertCircle, 
  Award, 
  BookOpen, 
  Globe, 
  Clock, 
  Phone,
  Flame,
  Star,
  Zap,
  ArrowRight
} from 'lucide-react';
import { SiteSettings, Order } from '../../core/types.ts';
import { saveOrderToFirestore } from '../../services/firebase.ts';

interface CourseraPlusPageProps {
  settings: SiteSettings;
  onOrderSuccess?: (order: Order) => void;
  showToast: (message: string, icon?: string) => void;
  onNavigateHome?: () => void;
}

const COURSERA_PRICE = 1499;
const REGULAR_PRICE = 3999;
const YOUTUBE_VIDEO_ID = 'ldduzkmASjU';
const ADMIN_WHATSAPP = '8801830086837';

export const CourseraPlusPage: React.FC<CourseraPlusPageProps> = ({
  settings,
  onOrderSuccess,
  showToast,
  onNavigateHome
}) => {
  // Modal state for purchase popup
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  
  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [senderPhone, setSenderPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const paymentNumber = settings.paymentNumber || '01625449778';

  // Handle Copy Number
  const handleCopyNumber = () => {
    navigator.clipboard.writeText(paymentNumber);
    setCopiedNumber(true);
    showToast(`পেমেন্ট নম্বর ${paymentNumber} কপি হয়েছে!`, '📋');
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  // Open Purchase Popup Modal
  const handleOpenPurchaseModal = () => {
    setIsPurchaseModalOpen(true);
    setCompletedOrder(null);
  };

  // Close Purchase Modal
  const handleClosePurchaseModal = () => {
    setIsPurchaseModalOpen(false);
    if (completedOrder) {
      setCompletedOrder(null);
      setSenderPhone('');
      setCustomerName('');
      setCustomerEmail('');
      setTrxId('');
    }
  };

  // Handle Submit Payment Details
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderPhone.trim()) {
      showToast('আপনার প্রেরক ফোন নম্বর প্রদান করুন', '⚠️');
      return;
    }
    if (!trxId.trim()) {
      showToast('Transaction ID (TrxID) প্রদান করুন', '⚠️');
      return;
    }
    if (!customerEmail.trim()) {
      showToast('আপনার ইমেইল অ্যাড্রেস প্রদান করুন (Coursera Activation-এর জন্য)', '⚠️');
      return;
    }

    setIsSubmitting(true);

    const orderId = `ORD-CRS-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: orderId,
      customerName: customerName.trim() || 'Coursera Learner',
      phone: senderPhone.trim(),
      email: customerEmail.trim(),
      productTitle: 'Coursera Plus Subscription (7,000+ Courses & Verified Certificates)',
      productId: 'coursera_plus_1499',
      amount: COURSERA_PRICE,
      rawPrice: REGULAR_PRICE,
      discount: REGULAR_PRICE - COURSERA_PRICE,
      trxId: trxId.trim(),
      affiliateCode: 'Direct',
      commission: 200,
      status: 'pending',
      date: new Date().toISOString()
    };

    try {
      await saveOrderToFirestore(newOrder);
      if (onOrderSuccess) {
        onOrderSuccess(newOrder);
      }
    } catch (err) {
      console.warn('Firestore order save error:', err);
    }

    // Build WhatsApp forwarding message to Admin
    const waMessage = `*🎓 নতুন Coursera Plus অর্ডার (৳${COURSERA_PRICE} BDT)*\n\n` +
      `🔖 *Order ID:* ${orderId}\n` +
      `👤 *নাম:* ${customerName.trim() || 'কাস্টমার'}\n` +
      `📞 *প্রেরক নম্বর:* ${senderPhone.trim()}\n` +
      `📧 *Coursera Email:* ${customerEmail.trim()}\n` +
      `💳 *পেমেন্ট মাধ্যম:* ${paymentMethod}\n` +
      `🔢 *TrxID:* ${trxId.trim()}\n` +
      `💰 *টাকার পরিমাণ:* ৳${COURSERA_PRICE} BDT\n` +
      `📅 *তারিখ:* ${new Date().toLocaleString('bn-BD')}\n\n` +
      `_আসসালামু আলাইকুম স্যার, আমি Coursera Plus-এর জন্য ১৪৯৯ টাকা পেমেন্ট করেছি। দয়া করে আমার Coursera ইমেইলে এক্সেস/ইনভাইটেশন পাঠিয়ে দিন।_`;

    const encodedWa = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedWa}`;

    setIsSubmitting(false);
    setCompletedOrder(newOrder);
    showToast('পেমেন্ট ডিটেইলস সফলভাবে গ্রহণ করা হয়েছে! 🎉', '✅');

    // Automatically open WhatsApp in background / popup
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* 1. HERO HEADER */}
      <div className="bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-900 border border-blue-900/60 rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3.5">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/40 text-blue-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>Coursera Plus Official Membership • 7,000+ Courses</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
            Coursera Plus — <span className="text-blue-400">৭,০০০+ প্রিমিয়াম কোর্স</span> ও গ্লোবাল সার্টিফিকেট আনলক করুন
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm font-normal max-w-3xl leading-relaxed">
            গুগল (Google), আইবিএম (IBM), মেটা (Meta), স্ট্যানফোর্ড (Stanford) এবং বিশ্বসেরা ৩৫০+ বিশ্ববিদ্যালয়ের অফিসিয়াল কোর্স, স্পেশালাইজেশন ও জব-রেডি প্রফেশনাল সার্টিফিকেট আনলিমিটেড এক্সেস করুন মাত্র <strong>১৪৯৯ BDT</strong> তে!
          </p>

          {/* Quick Badges & Shareable Link */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-400/30 text-blue-300 px-3 py-1 rounded-full font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>ভেরিফাইড অফিসিয়াল সার্টিফিকেট</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full font-semibold">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>৭,০০০+ কোর্স আনলিমিটেড</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full font-semibold">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>বিশেষ ছাড়: মাত্র ১৪৯৯ BDT</span>
              </span>
            </div>

            {/* Direct Link Badge */}
            <div className="flex items-center gap-1.5 bg-black/40 border border-blue-400/30 px-2.5 py-1 rounded-full text-xs">
              <span className="text-blue-300 font-bold text-[11px]">🔗 পেজ লিংক:</span>
              <code className="text-blue-200 font-mono text-[11px]">#coursera-plus</code>
              <button
                onClick={() => {
                  const url = typeof window !== 'undefined' ? `${window.location.origin}/#coursera-plus` : 'https://profitnext.com/#coursera-plus';
                  navigator.clipboard.writeText(url);
                  showToast('Coursera Plus পেজ লিংক কপি হয়েছে! 📋');
                }}
                className="ml-1 text-[11px] bg-blue-500 hover:bg-blue-400 text-white font-black px-2 py-0.5 rounded-full cursor-pointer transition-transform active:scale-95 flex items-center gap-1"
                title="কপি লিংক"
              >
                <Copy className="w-3 h-3" />
                <span>কপি</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FIRST: YOUTUBE VIDEO SECTION (Requested by User) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-slate-200 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <Play className="w-5 h-5 fill-current" />
            </span>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Coursera Plus কোর্স পরিচিতি ও টিউটোরিয়াল ভিডিও
              </h2>
              <p className="text-xs text-slate-500">
                ভিডিওটি দেখে বুঝে নিন কিভাবে Coursera Plus মেম্বারশিপে ৭০০০+ কোর্স ও সার্টিফিকেট ফ্রিতে নিবেন
              </p>
            </div>
          </div>

          <a
            href={`https://youtu.be/${YOUTUBE_VIDEO_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors self-start sm:self-auto"
          >
            <span>YouTube-এ দেখুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Embedded YouTube Player */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
          <iframe
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1&enablejsapi=1`}
            title="Coursera Plus Overview Video"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>

      {/* 3. PURCHASE OPTION BANNER & BUTTON (Purchase Coursera Plus - 1499 BDT) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border-2 border-blue-400/80 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>অফিসিয়াল প্রিমিয়াম মেম্বারশিপ অফার</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
              Coursera Plus Full Access Membership
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              একবার পেমেন্ট করলেই পাবেন ১ বছরের সম্পূর্ণ আনলিমিটেড Coursera Plus এক্সেস। গুগল, আইবিএম, মেটার সব ভেরিফাইড সার্টিফিকেট সরাসরি আপনার নামের লিংকডইন ও সিভি-তে যুক্ত করতে পারবেন!
            </p>

            {/* Price tag */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                ৳১৪৯৯ BDT
              </span>
              <span className="text-sm sm:text-base text-slate-400 line-through font-mono">
                ৳{REGULAR_PRICE} BDT
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md font-bold">
                ৬৩% ছাড়!
              </span>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={handleOpenPurchaseModal}
              className="py-4 px-8 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-amber-400/25 transition-all cursor-pointer flex items-center justify-center gap-2 btn-shimmer"
            >
              <GraduationCap className="w-5 h-5 text-slate-950" />
              <span>Purchase Coursera Plus</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <div className="text-center md:text-right text-[11px] text-slate-400 flex items-center justify-center md:justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>তাৎক্ষণিক ডেলিভারি ও ১০০% অফিশিয়াল গ্যারান্টি</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. WHAT YOU GET IN COURSERA PLUS (Features & Benefits) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-md border border-slate-200 space-y-5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
            Coursera Plus সাবস্ক্রিপশনে আপনি যা যা পাচ্ছেন
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">৭,০০০+ বিশ্বমানের কোর্স</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Python, AI & Machine Learning, Data Science, Cyber Security, Digital Marketing, Cloud Computing সহ যেকোনো স্কিল শিখুন।
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">অফিসিয়াল সার্টিফিকেট</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Google, IBM, Meta, Microsoft এর অফিসিয়াল ভেরিফাইড সার্টিফিকেট পাবেন যা লিঙ্কডইন প্রোফাইলে ও সিভিতে যুক্ত করা যায়।
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">প্রফেশনাল ক্যারিয়ার ট্র্যাক</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              হাতে-কলমে প্রজেক্ট এবং এসাইনমেন্ট সম্পন্ন করে সরাসরি আন্তর্জাতিক রিমোট জবের জন্য নিজেকে প্রস্তুত করুন।
            </p>
          </div>
        </div>

        {/* Step-by-Step Activation Guide */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4.5 space-y-2 text-xs text-blue-950">
          <div className="font-extrabold text-sm flex items-center gap-1.5 text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>কিভাবে Coursera Plus এক্সেস পাবেন? (৩টি সহজ ধাপ)</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-700 leading-relaxed">
            <li><strong>Purchase Coursera Plus</strong> বাটনে ক্লিক করে পেমেন্ট পপআপটি খুলুন।</li>
            <li>আমাদের বিকাশ, নগদ বা রকেট নম্বরে <strong>১৪৯৯ BDT</strong> Send Money করুন।</li>
            <li>আপনার TrxID এবং Coursera একাউন্টের ইমেইল সাবমিট করুন। সাথে সাথে আপনার ইমেইলে Coursera Plus মেম্বারশিপ একটিভ করে দেওয়া হবে!</li>
          </ol>
        </div>
      </div>

      {/* 5. POPUP MODAL: PAYMENT PAGE (Pay 1499 BDT & Submit Details) */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-amber-400 font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                    Purchase Coursera Plus
                  </h3>
                  <p className="text-xs text-blue-200">
                    নিরাপদ পেমেন্ট ও ইন্সট্যান্ট অ্যাক্টিভেশন
                  </p>
                </div>
              </div>

              <button
                onClick={handleClosePurchaseModal}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Scrollable Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* SUCCESS VIEW (If order submitted) */}
              {completedOrder ? (
                <div className="space-y-4 py-2 text-center animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-slate-900">
                      পেমেন্ট সাবমিট সম্পন্ন হয়েছে! 🎉
                    </h4>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      আপনার অর্ডারটি সফলভাবে সংরক্ষিত হয়েছে। আমরা আপনার দেওয়া ইমেইল <strong className="text-blue-600">{completedOrder.email}</strong>-এ দ্রুত Coursera Plus ইনভাইটেশন পাঠিয়ে দিচ্ছি।
                    </p>
                  </div>

                  {/* Order Summary Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Order ID:</span>
                      <span className="font-mono font-bold text-slate-800">{completedOrder.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">পরিশোধিত মূল্য:</span>
                      <span className="font-mono font-bold text-emerald-600">৳{completedOrder.amount} BDT</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">TrxID:</span>
                      <span className="font-mono font-bold text-slate-800 uppercase">{completedOrder.trxId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Coursera Email:</span>
                      <span className="font-bold text-slate-800">{completedOrder.email}</span>
                    </div>
                  </div>

                  {/* Direct WhatsApp contact button */}
                  <div className="space-y-2 pt-2">
                    <a
                      href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি Coursera Plus অর্ডার করেছি। Order ID: ${completedOrder.id}, TrxID: ${completedOrder.trxId}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                    >
                      <span>WhatsApp-এ সরাসরি কথা বলুন (+8801830086837)</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      onClick={handleClosePurchaseModal}
                      className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      সম্পন্ন করুন (Close)
                    </button>
                  </div>
                </div>
              ) : (
                /* PAYMENT INSTRUCTIONS & FORM */
                <>
                  {/* Amount & Instructions Card */}
                  <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">প্রদেয় মোট টাকা:</span>
                      <span className="text-lg font-black text-blue-700 font-mono">
                        ৳১৪৯৯ BDT
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-blue-200/80">
                      <div>
                        <span className="text-[11px] text-slate-500 block">Send Money পার্সোনাল নম্বর:</span>
                        <strong className="text-sm font-mono text-slate-900 font-black">
                          {paymentNumber}
                        </strong>
                        <span className="text-[10px] text-slate-500 block">(bKash / Nagad / Rocket Personal)</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyNumber}
                        className="py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1 shadow-2xs cursor-pointer transition-all active:scale-95"
                      >
                        {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedNumber ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Details Form */}
                  <form onSubmit={handleSubmitPayment} className="space-y-3.5 text-left">
                    
                    {/* Method Selector */}
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">
                        পেমেন্ট মাধ্যম সিলেক্ট করুন:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['bKash', 'Nagad', 'Rocket'] as const).map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setPaymentMethod(m)}
                            className={`py-2 px-3 rounded-xl font-bold border transition-all text-center cursor-pointer text-xs ${
                              paymentMethod === m
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sender Phone */}
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">
                        যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Number) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                      />
                    </div>

                    {/* Customer Email for Coursera Activation */}
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">
                        আপনার Coursera Email Address * (যেখানে মেম্বারশিপ দেওয়া হবে)
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                      />
                    </div>

                    {/* Customer Name */}
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">
                        আপনার নাম (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="আপনার নাম লিখুন"
                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                      />
                    </div>

                    {/* Transaction ID */}
                    <div>
                      <label className="text-slate-700 font-bold block mb-1">
                        Transaction ID (TrxID) *
                      </label>
                      <input
                        type="text"
                        required
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="যেমন: BL98A2K7..."
                        className="w-full bg-slate-50 border border-slate-300 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs uppercase"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 active:scale-98 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'পেমেন্ট ভেরিফাই হচ্ছে...' : 'পেমেন্ট সাবমিট করুন (Submit Payment) 🚀'}</span>
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-100 p-3 text-center text-[11px] text-slate-500">
              পেমেন্ট শেষে স্বয়ংক্রিয়ভাবে WhatsApp (+8801830086837)-এ ট্র্যাকিং নিশ্চিত করা হবে।
            </div>
          </div>
        </div>
      )}

      {/* 6. SUPPORT & FAQ */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
            Coursera Plus নিয়ে কোনো প্রশ্ন বা সরাসরি সাহায্য প্রয়োজন?
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            আমাদের অফিশিয়াল WhatsApp সাপোর্টে সরাসরি মেসেজ দিয়ে কথা বলুন।
          </p>
        </div>
        <a
          href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent('আসসালামু আলাইকুম স্যার, Coursera Plus কোর্স ও মেম্বারশিপ (৳১৪৯৯) সম্পর্কে জানতে যোগাযোগ করছি।')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-all"
        >
          <span>WhatsApp সাপোর্ট (+8801830086837)</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
};

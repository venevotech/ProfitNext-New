import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Lock, 
  Unlock, 
  Play, 
  ExternalLink, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Bot, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Video,
  Flame,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { SiteSettings, Order } from '../../core/types.ts';
import { saveOrderToFirestore } from '../../services/firebase.ts';

interface ProUnlockPageProps {
  settings: SiteSettings;
  onOrderSuccess?: (order: Order) => void;
  showToast: (message: string, icon?: string) => void;
}

const DEFAULT_SECRET_KEY = '151002055';
const STORAGE_KEY = 'profitnext_pro_unlock_status';
const ADMIN_WHATSAPP = '8801830086837';
const PRICE_TAKAS = 299;

export const ProUnlockPage: React.FC<ProUnlockPageProps> = ({
  settings,
  onOrderSuccess,
  showToast
}) => {
  const [enteredKey, setEnteredKey] = useState('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'unlocked_151002055';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<'key' | 'payment'>('key');
  const [keyError, setKeyError] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [senderPhone, setSenderPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [trxId, setTrxId] = useState('');

  const sendMoneyNumber = settings.paymentNumber || '01625449778';

  // Handle Key Verification
  const handleUnlockWithKey = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanKey = enteredKey.trim();

    if (!cleanKey) {
      setKeyError('অনুগ্রহ করে আপনার সিক্রেট কি লিখুন বা পেস্ট করুন।');
      return;
    }

    if (cleanKey === DEFAULT_SECRET_KEY) {
      setIsUnlocked(true);
      setKeyError('');
      try {
        localStorage.setItem(STORAGE_KEY, 'unlocked_151002055');
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
      showToast('অভিনন্দন! Pro Unlock Method সফলভাবে আনলক হয়েছে! 🔓', '🎉');
    } else {
      setKeyError('ভুল সিক্রেট কি! সঠিক কি দিন অথবা ২৯৯ টাকা পেমেন্ট করে এক্সেস নিন।');
      showToast('ভুল সিক্রেট কি! আবার চেষ্টা করুন', '⚠️');
    }
  };

  // Lock again function
  const handleLockAgain = () => {
    setIsUnlocked(false);
    setEnteredKey('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn(err);
    }
    showToast('পেজটি আবার লক করা হয়েছে', '🔒');
  };

  // Copy Payment Number
  const handleCopyNumber = () => {
    navigator.clipboard.writeText(sendMoneyNumber);
    setCopiedNumber(true);
    showToast('পেমেন্ট নম্বর কপি হয়েছে!', '📋');
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  // Handle Payment Submission -> Sends details to WhatsApp +8801830086837
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

    setIsSubmitting(true);

    const orderId = `PUNL_${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      customerName: customerName.trim() || 'Valued Customer',
      phone: senderPhone.trim(),
      productTitle: 'Pro Unlock Method (Secret Tricks) - ৳299 Access Key',
      productId: 'pro_unlock_method_299',
      amount: PRICE_TAKAS,
      rawPrice: 999,
      discount: 700,
      trxId: trxId.trim(),
      affiliateCode: '',
      commission: 0,
      status: 'pending',
      date: new Date().toISOString()
    };

    try {
      await saveOrderToFirestore(newOrder);
      if (onOrderSuccess) {
        onOrderSuccess(newOrder);
      }
    } catch (err) {
      console.warn('Order save notice:', err);
    }

    // Build WhatsApp message for Admin: +8801830086837
    const message = `*🔥 নতুন Pro Unlock Method এক্সেস রিকোয়েস্ট (৳${PRICE_TAKAS})*\n\n` +
      `👤 *নাম:* ${customerName.trim() || 'কাস্টমার'}\n` +
      `📞 *প্রেরক নম্বর:* ${senderPhone.trim()}\n` +
      `💳 *পেমেন্ট মাধ্যম:* ${paymentMethod}\n` +
      `🔖 *TrxID:* ${trxId.trim()}\n` +
      `💰 *টাকার পরিমাণ:* ৳${PRICE_TAKAS}\n` +
      `📅 *তারিখ ও সময়:* ${new Date().toLocaleString('bn-BD')}\n\n` +
      `_আসসালামু আলাইকুম স্যার, আমি Pro Unlock Method (Secret Tricks)-এর জন্য ২৯৯ টাকা পেমেন্ট করেছি। দয়া করে আমার পেমেন্ট ভেরিফাই করে আমাকে আনলক কি (Secret Key) প্রদান করুন।_`;

    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMsg}`;

    setIsSubmitting(false);
    setPaymentSuccess(true);
    showToast('পেমেন্ট রিকোয়েস্ট প্রস্তুত! হোয়াটসঅ্যাপে পাঠানো হচ্ছে...', '🚀');

    // Automatically forward user info to admin WhatsApp as requested
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 400);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* 1. TOP HEADER & MAIN HEADLINE */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>VIP Secret Tricks • Pro Unlock Method</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug">
            Pro Unlock Method. <span className="text-amber-400">নিজেই অফিসিয়ালভাবে আনলক করুন</span> Gemini Pro, Chatgpt Pro, Higgsfeild Pro, King Ai Pro, Canva pro, Capcut pro সাথে আরও অ্যাপস ও সফটওয়্যার।
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm font-normal max-w-3xl leading-relaxed">
            এই মেথডের মাধ্যমে আপনি অফিসিয়াল ট্রিকস ব্যবহার করে আনলিমিটেড এআই ও প্রিমিয়াম সফটওয়্যার আনলক করতে পারবেন অথবা অন্যদের কাছে রিসেল করে আকর্ষণীয় আয় করতে পারবেন।
          </p>

          {/* Quick status pill & Shareable Link */}
          <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {isUnlocked ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>স্ট্যাটাস: আনলকড (Unlocked) ✅</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>স্ট্যাটাস: লক করা (Locked) 🔒</span>
                </span>
              )}
              {isUnlocked && (
                <button
                  onClick={handleLockAgain}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer transition-colors"
                  title="লক করুন"
                >
                  আবার লক করুন
                </button>
              )}
            </div>

            {/* Direct Link Badge */}
            <div className="flex items-center gap-1.5 bg-black/40 border border-amber-400/30 px-2.5 py-1 rounded-full text-xs">
              <span className="text-amber-300 font-bold text-[11px]">🔗 পেজ লিংক:</span>
              <code className="text-amber-200 font-mono text-[11px]">#pro-unlock</code>
              <button
                onClick={() => {
                  const url = typeof window !== 'undefined' ? `${window.location.origin}/#pro-unlock` : 'https://profitnext.com/#pro-unlock';
                  navigator.clipboard.writeText(url);
                  showToast('Pro Unlock মেথড পেজ লিংক কপি হয়েছে! 📋');
                }}
                className="ml-1 text-[11px] bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-2 py-0.5 rounded-full cursor-pointer transition-transform active:scale-95 flex items-center gap-1"
                title="কপি লিংক"
              >
                <Copy className="w-3 h-3" />
                <span>কপি</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. INTRO VIDEO EMBED ON TOP (Playable right away) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <Video className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                Pro Unlock মেথড পরিচিতি ও ডেমো ভিডিও
              </h2>
              <p className="text-xs text-slate-500">
                ভিডিওটি দেখে বুঝে নিন কিভাবে মাত্র কয়েক ক্লিকে মেথডগুলো কাজে লাগাবেন
              </p>
            </div>
          </div>

          <a
            href="https://drive.google.com/drive/folders/1RIzesR7XkeqnB9PTiDfuybYIH992kpHS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95"
          >
            <span>গুগল ড্রাইভ ফোল্ডারে দেখুন ↗</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Embedded Video Player Container */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
          <iframe
            src="https://drive.google.com/embeddedfolderview?id=1RIzesR7XkeqnB9PTiDfuybYIH992kpHS#grid"
            title="Pro Unlock Intro Video"
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />

          {/* Quick launch overlay banner for mobile or restricted iframes */}
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-10">
            <a
              href="https://drive.google.com/drive/folders/1RIzesR7XkeqnB9PTiDfuybYIH992kpHS"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600/90 hover:bg-emerald-600 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Drive-এ ফুলস্ক্রিন প্লে করুন</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. ACCESS NOTICE & UNLOCK CONTROLS (Key & Payment) */}
      {!isUnlocked && (
        <div className="bg-slate-900 border-2 border-amber-400/80 rounded-3xl p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden">
          {/* Headline condition banner */}
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 mb-1 border border-amber-400/30">
              <Key className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-base sm:text-xl font-black text-amber-300">
              "access nie thakle key din, ar payment na kore thaklepayment kore access nin"
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              আপনার কাছে যদি ইতিমধ্যে সিক্রেট কি থাকে তবে তা নিচে বসিয়ে আনলক করুন, অথবা মাত্র <strong>৳২৯৯ টাকা</strong> পেমেন্ট করে এডমিনের কাছ থেকে তাৎক্ষণিক এক্সেস কি সংগ্রহ করুন।
            </p>
          </div>

          {/* Tab Selector: Secret Key vs Payment */}
          <div className="flex max-w-md mx-auto p-1 bg-slate-800/90 rounded-2xl mb-6 border border-slate-700">
            <button
              onClick={() => { setActiveTab('key'); setKeyError(''); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'key'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>১. সিক্রেট কি দিন</span>
            </button>
            <button
              onClick={() => { setActiveTab('payment'); setKeyError(''); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'payment'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>২. পেমেন্ট করুন (৳২৯৯)</span>
            </button>
          </div>

          {/* TAB A: SECRET KEY ENTRY */}
          {activeTab === 'key' && (
            <div className="max-w-lg mx-auto bg-slate-800/80 border border-slate-700 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="text-left space-y-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>সিক্রেট আনলক কি (Secret Login Key):</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={enteredKey}
                    onChange={(e) => {
                      setEnteredKey(e.target.value);
                      if (keyError) setKeyError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUnlockWithKey();
                    }}
                    placeholder="যেমন: 151002055"
                    className="flex-1 bg-slate-900 border border-slate-600 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 font-mono tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.readText().then(text => {
                        if (text) setEnteredKey(text.trim());
                      }).catch(() => {
                        setEnteredKey(DEFAULT_SECRET_KEY);
                      });
                    }}
                    className="px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    title="পেস্ট করুন"
                  >
                    Paste
                  </button>
                </div>
              </div>

              {keyError && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{keyError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleUnlockWithKey()}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 active:scale-98 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-400/20 transition-all cursor-pointer flex items-center justify-center gap-2 btn-shimmer"
              >
                <Unlock className="w-4 h-4" />
                <span>আনলক করুন (Unlock Access) ⚡</span>
              </button>

              <div className="text-center text-[11px] text-slate-400 pt-1">
                ডিফল্ট টেস্ট কি: <strong className="text-amber-400 font-mono">151002055</strong>
              </div>
            </div>
          )}

          {/* TAB B: PAYMENT FORM (৳299) */}
          {activeTab === 'payment' && (
            <div className="max-w-lg mx-auto bg-slate-800/80 border border-slate-700 rounded-2xl p-5 sm:p-6 space-y-4">
              {/* Payment Instructions */}
              <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">নির্ধারিত ফি:</span>
                  <span className="text-amber-400 font-extrabold text-sm">৳২৯৯ টাকা মাত্র</span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800">
                  <div className="text-xs">
                    <span className="text-slate-400">Send Money নম্বর: </span>
                    <strong className="text-emerald-400 font-mono text-sm">{sendMoneyNumber}</strong>
                    <span className="text-[10px] text-slate-500 block">(bKash / Nagad / Rocket পার্সোনাল)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-700 cursor-pointer"
                  >
                    {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber ? 'কপি হয়েছে' : 'কপি'}</span>
                  </button>
                </div>
              </div>

              {/* Payment Submission Form */}
              <form onSubmit={handleSubmitPayment} className="space-y-3.5 text-left text-xs">
                {/* Method selector */}
                <div>
                  <label className="text-slate-300 font-bold block mb-1.5">পেমেন্ট মাধ্যম সিলেক্ট করুন:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['bKash', 'Nagad', 'Rocket'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m)}
                        className={`py-2 px-3 rounded-xl font-bold border transition-all text-center cursor-pointer ${
                          paymentMethod === m
                            ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                            : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sender phone */}
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Phone):
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-900 border border-slate-600 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono text-xs"
                  />
                </div>

                {/* TrxID */}
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    Transaction ID (TrxID):
                  </label>
                  <input
                    type="text"
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="যেমন: BL98A2K7..."
                    className="w-full bg-slate-900 border border-slate-600 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-mono text-xs uppercase"
                  />
                </div>

                {/* Name / WhatsApp */}
                <div>
                  <label className="text-slate-300 font-bold block mb-1">
                    আপনার নাম / WhatsApp নম্বর:
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="আপনার নাম বা WhatsApp নম্বর"
                    className="w-full bg-slate-900 border border-slate-600 focus:border-emerald-400 rounded-xl px-3 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-emerald-600 active:scale-98 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'প্রসেসিং...' : 'সাবমিট করুন ও WhatsApp-এ এক্সেস নিন ↗'}</span>
                </button>
              </form>

              {paymentSuccess && (
                <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>পেমেন্ট তথ্য অ্যাডমিনের WhatsApp (+8801830086837)-এ পাঠানো হয়েছে!</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/90">
                    এডমিন আপনার TrxID ভেরিফাই করে সিক্রেট কি প্রদান করবেন। কি পেলে উপরে 'সিক্রেট কি দিন' ট্যাবে বসিয়ে পেজটি আনলক করুন।
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. UNLOCKED SUCCESS BANNER (When Unlocked) */}
      {isUnlocked && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-4 sm:p-6 text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-emerald-900">
                অভিনন্দন! Pro Unlock Method আনলকড হয়েছে 🔓
              </h3>
              <p className="text-xs text-emerald-700">
                নিচের সবকটি মেথড এবং রিসোর্স বাটনে ক্লিক করে সরাসরি অ্যাক্সেস করতে পারবেন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-200/80 text-emerald-800 font-bold px-3 py-1.5 rounded-full font-mono">
              Key: {DEFAULT_SECRET_KEY}
            </span>
            <button
              onClick={handleLockAgain}
              className="text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors shadow-2xs"
            >
              লক করুন
            </button>
          </div>
        </div>
      )}

      {/* 5. UNLOCKED METHODS & BUTTONS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
              Pro Unlock Methods & Resource Library
            </h2>
          </div>
          {!isUnlocked && (
            <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>লক করা</span>
            </span>
          )}
        </div>

        {/* METHOD 1: First Button (Highlighted) - Telegram Method */}
        <div className={`rounded-3xl p-5 sm:p-6 transition-all duration-300 ${
          isUnlocked 
            ? 'bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white border-2 border-amber-400 shadow-xl' 
            : 'bg-slate-100 border border-slate-300 opacity-80'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current text-rose-600" />
                  <span>First Button • VIP Highlighted</span>
                </span>
                <span className="text-xs text-amber-300 font-bold">মেথড ০১</span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-white">
                Telegram method
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                টেলিগ্রাম ও বিশেষ বট মেথড ব্যবহার করে অফিসিয়ালি প্রিমিয়াম অ্যাপস ও সার্ভিস নেওয়ার প্রাইমারি গাইড।
              </p>
            </div>

            {/* First button action */}
            {isUnlocked ? (
              <a
                href="https://drive.google.com/drive/folders/1RIzesR7XkeqnB9PTiDfuybYIH992kpHS"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-slate-950 font-black text-sm shadow-lg shadow-amber-400/25 transition-all cursor-pointer btn-shimmer"
              >
                <span>Telegram Method ওপেন করুন</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <button
                onClick={() => {
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                  showToast('আনলক করতে সিক্রেট কি দিন অথবা ২৯৯ টাকা পেমেন্ট করুন', '🔒');
                }}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-slate-800 text-slate-400 font-bold text-xs cursor-pointer hover:bg-slate-700"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>আনলক করে মেথড ১ দেখুন</span>
              </button>
            )}
          </div>

          {/* UNDERNEATH FIRST BUTTON: RESOURCE PART (Prodseller Link & Stock Lara) */}
          <div className="mt-5 pt-4 border-t border-slate-700/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2.5">
              <Bot className="w-4 h-4" />
              <span>Resource Part (প্রয়োজনীয় বট ও লিংক):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Resource 1: Prodseller Link */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div>
                  <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                    <span>Prodseller Link</span>
                  </div>
                  <div className="text-[11px] text-slate-400">অফিসিয়াল টেলিগ্রাম সেলার বট</div>
                </div>

                {isUnlocked ? (
                  <a
                    href="https://t.me/ProdSellerBot?start=ref_2101720092"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all"
                  >
                    <span>বট ওপেন করুন</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>লকড</span>
                  </span>
                )}
              </div>

              {/* Resource 2: Stock Lara */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div>
                  <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block"></span>
                    <span>Stock Lara.</span>
                  </div>
                  <div className="text-[11px] text-slate-400">টেলিগ্রাম স্টক লারা বট সার্ভিস</div>
                </div>

                {isUnlocked ? (
                  <a
                    href="https://t.me/STOCK_lara_bot?start=2101720092"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all"
                  >
                    <span>বট ওপেন করুন</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>লকড</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* GRID FOR REMAINING 3 METHODS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* METHOD 2: Second button - All Subscription Method (Free) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md flex flex-col justify-between space-y-4 hover:border-emerald-400 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Second button
                </span>
                <span className="text-emerald-600 font-extrabold text-xs">ফ্রি মেথড</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                All Subscription Method (Free)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                কোনো খরচ ছাড়াই বিভিন্ন প্রিমিয়াম সার্ভিস ও সাবস্ক্রিপশন বিনামূল্যে নেওয়ার এক্সক্লুসিভ মেথড গাইড।
              </p>
            </div>

            {isUnlocked ? (
              <a
                href="https://drive.google.com/drive/folders/1AXe0RLkm1rt-5BB6fw9GzX7gsiJ4lFc0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-sm transition-all"
              >
                <span>ফোল্ডার ওপেন করুন ↗</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                onClick={() => {
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                  showToast('আনলক করতে সিক্রেট কি দিন অথবা ২৯৯ টাকা পেমেন্ট করুন', '🔒');
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>আনলক করে দেখুন</span>
              </button>
            )}
          </div>

          {/* METHOD 3: Third button - Pro Methods */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md flex flex-col justify-between space-y-4 hover:border-purple-400 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Third button
                </span>
                <span className="text-purple-600 font-extrabold text-xs">প্রো মেথড</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Pro Methods.
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                উন্নতমানের এআই অ্যাপস, ক্যানভা প্রো, ক্যাপকাট প্রো ও হাই-এন্ড সফটওয়্যার আনলক করার প্রো টেকনিক।
              </p>
            </div>

            {isUnlocked ? (
              <a
                href="https://drive.google.com/drive/folders/1m1pSjrZeX4WJwqAuV79_YReaseBhuCbo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-xs shadow-sm transition-all"
              >
                <span>Pro Methods দেখুন ↗</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                onClick={() => {
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                  showToast('আনলক করতে সিক্রেট কি দিন অথবা ২৯৯ টাকা পেমেন্ট করুন', '🔒');
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>আনলক করে দেখুন</span>
              </button>
            )}
          </div>

          {/* METHOD 4: Fourth button - Business Methods */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md flex flex-col justify-between space-y-4 hover:border-blue-400 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Fourth button
                </span>
                <span className="text-blue-600 font-extrabold text-xs">বিজনেস মেথড</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Business Methods
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                এসব মেথড কাজে লাগিয়ে ফেসবুক বিজ্ঞাপনের মাধ্যমে অন্যদের কাছে অ্যাপস ও সফটওয়্যার সেল করে ব্যবসার উপায়।
              </p>
            </div>

            {isUnlocked ? (
              <a
                href="https://drive.google.com/drive/folders/17Nuc-C7RdL3EkErNtY1CSekb65iaz-3u"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs shadow-sm transition-all"
              >
                <span>Business Methods দেখুন ↗</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                onClick={() => {
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                  showToast('আনলক করতে সিক্রেট কি দিন অথবা ২৯৯ টাকা পেমেন্ট করুন', '🔒');
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>আনলক করে দেখুন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 6. SUPPORT & WHATSAPP CARD */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
            Pro Unlock সংক্রান্ত কোনো প্রশ্ন বা সরাসরি সাহায্য প্রয়োজন?
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            আমাদের অফিশিয়াল WhatsApp সাপোর্টে সরাসরি মেসেজ দিয়ে কথা বলুন।
          </p>
        </div>
        <a
          href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent('আসসালামু আলাইকুম স্যার, Pro Unlock Method সম্পর্কে জানতে যোগাযোগ করছি।')}`}
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

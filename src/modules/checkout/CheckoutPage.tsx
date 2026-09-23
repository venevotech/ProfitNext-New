import React, { useState } from 'react';
import { Copy, Star, ArrowLeft, ShieldCheck, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { AppItem, IncludedCredentials, Order, SiteSettings } from '../../core/types.ts';
import { calculateDiscount } from '../../services/affiliate.ts';
import { DEFAULT_CREDENTIALS } from '../../core/store.ts';

interface CheckoutPageProps {
  product: AppItem;
  settings: SiteSettings;
  affiliates: any[];
  coupons: any[];
  onOrderSuccess: (order: Order) => void;
  onBackToCatalog: () => void;
  showToast: (msg: string, icon?: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  product,
  settings,
  affiliates,
  coupons,
  onOrderSuccess,
  onBackToCatalog,
  showToast
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [trxId, setTrxId] = useState('');
  const [promoCode, setPromoCode] = useState(() => {
    try {
      return localStorage.getItem('profitnext_active_ref') || '';
    } catch {
      return '';
    }
  });

  const basePrice = product.price || 399;
  const discountResult = calculateDiscount(basePrice, promoCode, affiliates, coupons, settings);
  const finalPrice = discountResult.finalPrice;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(settings.paymentNumber);
    showToast(`নাম্বার ${settings.paymentNumber} কপি হয়েছে!`, '📋');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !trxId.trim()) {
      showToast('দয়া করে নাম, মোবাইল নাম্বার, ইমেইল এবং TrxID পূরণ করুন', '⚠️');
      return;
    }

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    // Prepare credentials if this is the course or bundle
    let orderCredentials: IncludedCredentials | undefined = undefined;
    if (product.id === 'course_ai_bundle' || product.includesBundle || product.type === 'course') {
      orderCredentials = product.includedCredentials || DEFAULT_CREDENTIALS;
    } else {
      orderCredentials = {
        geminiPro: DEFAULT_CREDENTIALS.geminiPro,
        capcutPro: DEFAULT_CREDENTIALS.capcutPro,
        courseMaterial: DEFAULT_CREDENTIALS.courseMaterial
      };
    }

    const newOrder: Order = {
      id: orderId,
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      productTitle: product.title,
      productId: product.id,
      amount: finalPrice,
      rawPrice: basePrice,
      discount: discountResult.discountAmount,
      trxId: trxId.trim(),
      affiliateCode: discountResult.appliedCode || 'Direct',
      commission: discountResult.appliedCode ? Math.round((finalPrice * (settings.l1Rate || 20)) / 100) : 0,
      status: 'pending',
      date: new Date().toLocaleString('en-GB'),
      credentials: orderCredentials
    };

    onOrderSuccess(newOrder);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-2 sm:py-4 px-2 sm:px-4 space-y-4 sm:space-y-6">
      {/* Back button (Min 44px tap target) */}
      <button
        onClick={onBackToCatalog}
        className="min-h-[44px] inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer px-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>ফিরে যান অ্যাপস ও কোর্স ক্যাটালগে</span>
      </button>

      {/* Main Grid: Desktop 2-column (5 cols summary / 7 cols form), Mobile stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* LEFT COLUMN: Payment Instructions & Amount (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Instructions header matching user mandatory requirement */}
          <div className="text-center bg-white border border-emerald-300 rounded-2xl sm:rounded-3xl p-5 shadow-xs">
            <p className="text-xs sm:text-sm font-bold text-emerald-800 mb-2 leading-snug">
              এই নাম্বারে ৯৯ টাকা Send Money করুন এবং আপনার Transection id/Number পাঠান :
            </p>
            <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug space-y-1">
              <div>
                Send Money of <span className="font-extrabold text-emerald-600">99 Taka</span> and send your
              </div>
              <div>
                Transection id/Number to this number :
              </div>
              <div className="font-black text-slate-900 text-xl sm:text-2xl tracking-tight text-emerald-700 py-1">
                {settings.paymentNumber}
              </div>
              <div className="text-xs text-slate-600 font-semibold">
                (Bkash/Nagad/ Rocket)
              </div>
            </div>
          </div>

          {/* Black pill copy button (48px height, easy touch target) */}
          <button
            onClick={handleCopyNumber}
            className="w-full min-h-[48px] bg-black hover:bg-slate-800 text-white font-bold text-sm sm:text-base py-3 px-6 rounded-full flex items-center justify-center gap-2.5 shadow-md transition-all transform active:scale-98 cursor-pointer"
          >
            <span>Copy : {settings.paymentNumber}</span>
            <Copy className="w-5 h-5" />
          </button>

          {/* Total banner matching screenshot style */}
          <div className="text-center bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4">
            <div className="text-xs font-semibold text-emerald-800 mb-0.5">পরিশোধযোগ্য সর্বমোট মূল্য:</div>
            <div className="text-emerald-600 text-3xl sm:text-4xl font-black tracking-tight">
              Total : {finalPrice} Taka
            </div>
            {discountResult.discountAmount > 0 && (
              <div className="text-xs text-emerald-700 font-bold mt-1">
                (৳{discountResult.discountAmount} ডিসকাউন্ট সক্রিয় কোড: {discountResult.appliedCode})
              </div>
            )}
          </div>

          {/* Package details / Included perks */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs text-slate-700">
            <div className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>প্যাকেজে যা যা পাচ্ছেন:</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{product.title}</span>
            </div>
            {(product.id === 'course_ai_bundle' || product.includesBundle) && (
              <>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Gemini Pro পার্সোনাল অ্যাকাউন্ট লগইন</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>CapCut Pro আনলিমিটেড প্রিমিয়াম পাসওয়ার্ড</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>কোর্স মেটেরিয়ালস ও ভিডিও ডাউনলোড লিঙ্ক</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-slate-500">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>পেমেন্ট ভেরিফাই হওয়ার পর অটোমেটিক এক্সেস পাবেন</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Transaction Form (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h2 className="font-black text-lg sm:text-xl text-slate-900">
              অর্ডার কনফার্মেশন ফর্ম
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              অনুগ্রহ করে নিচের তথ্যগুলো সঠিকভাবে পূরণ করে সাবমিট করুন
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input 1: Name */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                আপনার নাম (Full Name) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा. আবরার রহমান"
                className="w-full min-h-[48px] px-4 rounded-xl border border-slate-200 text-[16px] sm:text-sm font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Input 2: Phone */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                মোবাইল নাম্বার (Mobile Number) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full min-h-[48px] px-4 rounded-xl border border-slate-200 text-[16px] sm:text-sm font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Input 3: Email (Mandatory requirement) */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                ইমেইল এড্রেস (Email Address) *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full min-h-[48px] px-4 rounded-xl border border-slate-200 text-[16px] sm:text-sm font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                এই ইমেইলে আপনার কোর্স ও অ্যাকাউন্টের লগইন তথ্য ব্যাকআপ পাঠানো হবে
              </span>
            </div>

            {/* Input 4: TrxID */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                Transaction ID (TrxID) *
              </label>
              <input
                type="text"
                required
                value={trxId}
                onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                placeholder="যেমন: BL18X89KL..."
                className="w-full min-h-[48px] px-4 rounded-xl border border-slate-200 text-[16px] sm:text-sm font-mono font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Input 5: Promo / Referral Code */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                রেফারেল / প্রোমো কোড (যদি থাকে)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="রেফারেল কোড (যেমন: PROMO10)"
                  className="flex-1 min-h-[48px] px-4 rounded-xl border border-slate-200 text-[16px] sm:text-sm font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400 uppercase"
                />
              </div>
            </div>

            {/* Selected Product Pill (Read-only) */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <span className="text-slate-500">সিলেক্টেড প্রোডাক্ট:</span>
              <span className="font-extrabold text-slate-900 text-right line-clamp-1">{product.title}</span>
            </div>

            {/* Submit Button (Min 48px height, easy thumb target) */}
            <button
              type="submit"
              className="w-full min-h-[48px] bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-sm sm:text-base py-3 px-6 rounded-full shadow-lg shadow-emerald-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <span>পেমেন্ট কনফার্ম ও অর্ডার করুন</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

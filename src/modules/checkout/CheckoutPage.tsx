import React, { useState } from 'react';
import { Copy, Star, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
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
    <div className="max-w-xl mx-auto py-3 px-2 sm:px-4">
      {/* Back button */}
      <button
        onClick={onBackToCatalog}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-3 px-1 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>ফিরে যান অ্যাপস ও কোর্স ক্যাটালগে</span>
      </button>

      {/* Instructions header matching user requirement */}
      <div className="text-center mb-4 leading-relaxed bg-white border border-emerald-200 rounded-2xl p-3.5 sm:p-4 shadow-xs">
        <p className="text-xs sm:text-sm font-bold text-emerald-800 mb-1 leading-snug">
          এই নাম্বারে ৯৯ টাকা Send Money করুন এবং আপনার Transection id/Number পাঠান :
        </p>
        <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
          Send Money of <span className="font-extrabold text-emerald-600">99 Taka</span> and send your<br />
          Transection id/Number to this number :<br />
          <span className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">{settings.paymentNumber}</span> (Bkash/Nagad/ Rocket)
        </p>
      </div>

      {/* Black pill copy button matching Screenshot 4 */}
      <div className="flex justify-center mb-5">
        <button
          onClick={handleCopyNumber}
          className="bg-black hover:bg-slate-800 text-white font-bold text-base sm:text-lg py-3 px-6 rounded-full flex items-center justify-center gap-2.5 shadow-md transition-all transform active:scale-98 w-full max-w-sm cursor-pointer"
        >
          <span>Copy : {settings.paymentNumber}</span>
          <Copy className="w-5 h-5" />
        </button>
      </div>

      {/* Total banner matching Screenshot 4 */}
      <div className="text-center mb-5">
        <div className="text-emerald-500 text-3xl sm:text-4xl font-black tracking-tight">
          Total : {finalPrice} Taka
        </div>
        {discountResult.discountAmount > 0 && (
          <div className="text-xs text-emerald-700 font-semibold mt-1">
            (৳{discountResult.discountAmount} ডিসকাউন্ট সক্রিয় কোড: {discountResult.appliedCode})
          </div>
        )}
      </div>

      {/* Package Perks Badge */}
      {(product.id === 'course_ai_bundle' || product.includesBundle || product.type === 'course') && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 rounded-xl p-3 mb-4 text-xs shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>স্পেশাল প্যাকেজ অফার অন্তর্ভুক্ত (৳৩৯৯):</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px] text-emerald-800 font-medium">
            <li className="flex items-center gap-1">✓ AI Video Course</li>
            <li className="flex items-center gap-1">✓ Gemini Pro Subscription</li>
            <li className="flex items-center gap-1">✓ CapCut Pro VIP Access</li>
          </ul>
        </div>
      )}

      {/* Form matching Screenshot 4 */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full h-13 bg-white border-2 border-emerald-200 focus:border-emerald-500 rounded-xl px-4 text-sm font-semibold text-slate-900 shadow-xs outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
          />
        </div>

        <div>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your Number"
            className="w-full h-13 bg-white border-2 border-emerald-200 focus:border-emerald-500 rounded-xl px-4 text-sm font-semibold text-slate-900 shadow-xs outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
          />
        </div>

        {/* Email Submission Field */}
        <div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="w-full h-13 bg-white border-2 border-emerald-200 focus:border-emerald-500 rounded-xl px-4 text-sm font-semibold text-slate-900 shadow-xs outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
          />
        </div>

        <div>
          <input
            type="text"
            required
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
            placeholder="Transection ID"
            className="w-full h-13 bg-white border-2 border-emerald-200 focus:border-emerald-500 rounded-xl px-4 text-sm font-semibold text-slate-900 shadow-xs outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
          />
        </div>

        {/* Selected APP display matching Screenshot 4 */}
        <div className="w-full h-13 bg-white border-2 border-emerald-200 rounded-xl px-4 flex items-center justify-between shadow-xs">
          <span className="text-sm font-bold text-slate-800 truncate pr-2">
            Selected APP : {product.title}
          </span>
          <div className="flex items-center text-amber-500 shrink-0">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
          </div>
        </div>

        {/* Promo Code + Confirm button row matching Screenshot 4 */}
        <div className="flex gap-2.5 pt-1">
          <div className="flex-1 relative">
            <span className="absolute -top-2 right-3 bg-slate-200 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-full">
              Optional
            </span>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Promo Code"
              className="w-full h-13 bg-white border-2 border-emerald-200 focus:border-emerald-500 rounded-xl px-4 text-sm font-semibold text-slate-900 shadow-xs outline-none transition-all uppercase placeholder:text-slate-400 placeholder:font-normal placeholder:capitalize"
            />
          </div>

          <button
            type="submit"
            className="flex-1 h-13 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base rounded-full shadow-lg shadow-emerald-500/25 transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Confirm</span>
          </button>
        </div>
      </form>

      <div className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400 mt-4">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>100% সুরক্ষিত ও স্বয়ংক্রিয় ক্রেডেনশিয়াল ডেলিভারি</span>
      </div>
    </div>
  );
};

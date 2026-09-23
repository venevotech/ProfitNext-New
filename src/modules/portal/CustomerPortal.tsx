import React, { useState } from 'react';
import { GraduationCap, KeyRound, Sparkles, Copy, Check, ExternalLink, Download, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Order, IncludedCredentials } from '../../core/types.ts';
import { DEFAULT_CREDENTIALS } from '../../core/store.ts';

interface CustomerPortalProps {
  orders: Order[];
  onStartCourse: () => void;
  showToast: (msg: string, icon?: string) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  orders,
  onStartCourse,
  showToast
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Find latest credentials from orders or fallback to default credentials
  const latestOrderWithCredentials = orders.find(o => o.credentials);
  const activeCredentials: IncludedCredentials = latestOrderWithCredentials?.credentials || DEFAULT_CREDENTIALS;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast('কপি করা হয়েছে!', '✅');
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6 pb-6 w-full max-w-7xl mx-auto">
      {/* Header Profile */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-bold shrink-0">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-slate-900 text-lg sm:text-xl md:text-2xl">
                কাস্টমার লার্নিং ড্যাশবোর্ড
              </h1>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                Active VIP
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              আপনার সমস্ত কেনা কোর্স, রিসোর্স ও প্রিমিয়াম অ্যাপের অটোমেটেড লগইন ক্রেডেনশিয়াল
            </p>
          </div>
        </div>

        <button
          onClick={onStartCourse}
          className="min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer self-start sm:self-auto flex items-center gap-2"
        >
          <GraduationCap className="w-4 h-4" />
          <span>কোর্স ক্লাসে যান</span>
        </button>
      </div>

      {/* Responsive Main Layout: Desktop 2-Column, Mobile Stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* LEFT COLUMN: Credentials & Course Access (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-5">
          {/* AUTOMATED CREDENTIALS CARD */}
          <div className="bg-white border-2 border-emerald-300 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                  <KeyRound className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="font-extrabold text-base text-slate-900">
                    আনলকড প্রিমিয়াম ক্রেডেনশিয়াল
                  </h2>
                  <p className="text-xs text-emerald-700">Course + Gemini Pro + CapCut Pro (৳৩৯৯ ফুল বান্ডেল)</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-emerald-600 text-white px-3 py-1 rounded-full shadow-xs">
                Active VIP
              </span>
            </div>

            {/* Gemini Pro Creds */}
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-purple-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-purple-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Gemini Pro VIP লগইন তথ্য</span>
                </span>
                <a
                  href={activeCredentials.geminiPro.activationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[36px] px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <span>অ্যাক্টিভ করুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Username</span>
                    <span className="font-mono text-slate-800 text-xs sm:text-sm font-semibold truncate block">
                      {activeCredentials.geminiPro.username}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(activeCredentials.geminiPro.username, 'geminiUser')}
                    aria-label="Copy Gemini Username"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer shrink-0 ml-2"
                  >
                    {copiedField === 'geminiUser' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Password</span>
                    <span className="font-mono text-purple-700 text-xs sm:text-sm font-semibold truncate block">
                      {activeCredentials.geminiPro.passKey}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(activeCredentials.geminiPro.passKey, 'geminiPass')}
                    aria-label="Copy Gemini Password"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer shrink-0 ml-2"
                  >
                    {copiedField === 'geminiPass' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* CapCut Pro Creds */}
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
                  <span>👑 CapCut Pro VIP ক্রেডেনশিয়াল</span>
                </span>
                <a
                  href={activeCredentials.capcutPro.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[36px] px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ডাউনলোড APK</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Pro Account</span>
                    <span className="font-mono text-slate-800 text-xs sm:text-sm font-semibold truncate block">
                      {activeCredentials.capcutPro.username}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(activeCredentials.capcutPro.username, 'capcutUser')}
                    aria-label="Copy CapCut Username"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer shrink-0 ml-2"
                  >
                    {copiedField === 'capcutUser' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Password</span>
                    <span className="font-mono text-slate-800 text-xs sm:text-sm font-semibold truncate block">
                      {activeCredentials.capcutPro.passKey}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(activeCredentials.capcutPro.passKey, 'capcutPass')}
                    aria-label="Copy CapCut Password"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer shrink-0 ml-2"
                  >
                    {copiedField === 'capcutPass' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Course Material Link */}
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between flex-wrap gap-3">
              <div>
                <strong className="text-xs sm:text-sm text-emerald-900 block font-bold">
                  কোর্স রিসোর্স ড্রাইভ ও মেটেরিয়ালস
                </strong>
                <span className="text-xs text-emerald-700">সকল ভিডিও প্রম্পট ও প্রজেক্ট ফাইল</span>
              </div>
              <a
                href={activeCredentials.courseMaterial.drivePackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all"
              >
                <span>ফোল্ডার খুলুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* My Courses Card */}
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 shadow-xs">
            <h3 className="font-black text-base text-slate-900 mb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <span>আমার কোর্সসমূহ (My Enrolled Courses)</span>
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 gap-3">
              <div>
                <div className="font-black text-sm sm:text-base text-slate-900">
                  AI Video Earning Masterclass + Gemini Pro + CapCut Pro
                </div>
                <div className="text-xs text-emerald-700 font-semibold mt-1">
                  ফুল বান্ডেল অ্যাক্টিভ • প্রগ্রেস ১০০% • লাইফটাইম অ্যাক্সেস
                </div>
              </div>
              <button
                onClick={onStartCourse}
                className="min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold py-2 px-5 rounded-xl shadow-xs cursor-pointer self-start sm:self-auto"
              >
                কোর্স দেখুন ↗
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Order History & VIP Perks (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Order History */}
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 shadow-xs">
            <h3 className="font-black text-base text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              <span>অর্ডার হিস্ট্রি (Order History)</span>
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl">
                কোনো অর্ডার হিস্ট্রি পাওয়া যায়নি
              </div>
            ) : (
              <div className="divide-y divide-slate-100 space-y-2">
                {orders.map((o) => (
                  <div key={o.id} className="pt-2.5 pb-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{o.productTitle}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        o.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {o.status === 'completed' ? 'Approved ✓' : 'Processing'}
                      </span>
                    </div>
                    <div className="text-slate-500 mt-1 flex justify-between">
                      <span>Order #{o.id}</span>
                      <span className="font-bold text-slate-900">৳{o.amount}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {o.date} • Trx: {o.trxId}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Help & Support Assistance */}
          <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 shadow-xs space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>পাসওয়ার্ড সমস্যা হচ্ছে?</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              যেকোনো প্রিমিয়াম পাসওয়ার্ড রিসেট বা অ্যাকাউন্ট পরিবর্তনের প্রয়োজন হলে সরাসরি আমাদের হেল্পলাইন নম্বরে বা WhatsApp এ মেসেজ দিন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

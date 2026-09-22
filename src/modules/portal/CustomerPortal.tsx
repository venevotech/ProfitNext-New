import React, { useState } from 'react';
import { GraduationCap, KeyRound, Sparkles, Copy, Check, ExternalLink, Download, Clock } from 'lucide-react';
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
    <div className="space-y-4 pb-4">
      {/* Header Profile */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">
          🎓
        </div>
        <div>
          <h2 className="font-extrabold text-slate-900 text-base">কাস্টমার লার্নিং ড্যাশবোর্ড</h2>
          <p className="text-xs text-slate-500">আপনার সমস্ত কেনা কোর্স ও প্রিমিয়াম অ্যাপ ক্রেডেনশিয়াল</p>
        </div>
      </div>

      {/* AUTOMATED CREDENTIALS CARD */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white border-2 border-emerald-300 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600 text-white"><KeyRound className="w-4 h-4" /></span>
            <div>
              <h3 className="font-bold text-sm text-slate-900">আপনার আনলকড লগইন ক্রেডেনশিয়াল</h3>
              <p className="text-[10px] text-emerald-700">Course + Gemini Pro + CapCut Pro (৳৩৯৯)</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
            Active VIP
          </span>
        </div>

        {/* Gemini Pro Creds */}
        <div className="bg-white rounded-xl p-3 border border-purple-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-purple-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini Pro লগইন তথ্য</span>
            </span>
            <a
              href={activeCredentials.geminiPro.activationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-purple-700 hover:underline flex items-center gap-0.5"
            >
              <span>অ্যাক্টিভ করুন</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-[9px] text-slate-400 block">Username:</span>
                <span className="font-mono text-slate-800 text-[11px] font-semibold">{activeCredentials.geminiPro.username}</span>
              </div>
              <button
                onClick={() => handleCopy(activeCredentials.geminiPro.username, 'geminiUser')}
                className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
              >
                {copiedField === 'geminiUser' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-[9px] text-slate-400 block">Password:</span>
                <span className="font-mono text-purple-700 text-[11px] font-semibold">{activeCredentials.geminiPro.passKey}</span>
              </div>
              <button
                onClick={() => handleCopy(activeCredentials.geminiPro.passKey, 'geminiPass')}
                className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
              >
                {copiedField === 'geminiPass' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* CapCut Pro Creds */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-800 flex items-center gap-1">
              <span>👑 CapCut Pro VIP ক্রেডেনশিয়াল</span>
            </span>
            <a
              href={activeCredentials.capcutPro.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-slate-800 hover:underline flex items-center gap-0.5"
            >
              <Download className="w-3 h-3" />
              <span>ডাউনলোড APK</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-[9px] text-slate-400 block">Pro Account:</span>
                <span className="font-mono text-slate-800 text-[11px] font-semibold">{activeCredentials.capcutPro.username}</span>
              </div>
              <button
                onClick={() => handleCopy(activeCredentials.capcutPro.username, 'capcutUser')}
                className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
              >
                {copiedField === 'capcutUser' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-[9px] text-slate-400 block">Password:</span>
                <span className="font-mono text-slate-800 text-[11px] font-semibold">{activeCredentials.capcutPro.passKey}</span>
              </div>
              <button
                onClick={() => handleCopy(activeCredentials.capcutPro.passKey, 'capcutPass')}
                className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
              >
                {copiedField === 'capcutPass' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* My Courses Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-emerald-600" />
          <span>আমার কোর্সসমূহ (My Courses)</span>
        </h3>
        <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
          <div>
            <div className="font-bold text-xs sm:text-sm text-slate-900">
              AI Video Earning Masterclass + Gemini Pro + CapCut Pro
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
              ফুল বান্ডেল অ্যাক্টিভ • প্রগ্রেস ৮০%
            </div>
          </div>
          <button
            onClick={onStartCourse}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-xs cursor-pointer"
          >
            কোর্স দেখুন
          </button>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-slate-600" />
          <span>অর্ডার হিস্ট্রি (Order History)</span>
        </h3>
        {orders.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            এখনো কোনো অর্ডার নেই।
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((o) => (
              <div key={o.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">
                    {o.productTitle}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Order #{o.id} • ৳{o.amount} • Trx: {o.trxId}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  o.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

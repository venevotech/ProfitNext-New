import React, { useState } from 'react';
import { GraduationCap, KeyRound, Sparkles, Copy, Check, ExternalLink, Download, Clock, LogIn, ShieldCheck } from 'lucide-react';
import { Order, IncludedCredentials } from '../../core/types.ts';
import { DEFAULT_CREDENTIALS } from '../../core/store.ts';
import { User } from 'firebase/auth';

interface CustomerPortalProps {
  orders: Order[];
  onStartCourse: () => void;
  showToast: (msg: string, icon?: string) => void;
  currentUser?: User | null;
  onLoginGoogle?: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  orders,
  onStartCourse,
  showToast,
  currentUser,
  onLoginGoogle
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
    <div className="space-y-4 pb-4 max-w-4xl mx-auto">
      {/* Header Profile */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">
            🎓
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">কাস্টমার লার্নিং ড্যাশবোর্ড</h2>
            <p className="text-xs text-slate-500">আপনার সমস্ত কেনা কোর্স ও প্রিমিয়াম অ্যাপ ক্রেডেনশিয়াল</p>
          </div>
        </div>

        {/* Google User Status */}
        {currentUser ? (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium truncate max-w-[200px]">
              {currentUser.email}
            </span>
          </div>
        ) : (
          onLoginGoogle && (
            <button
              onClick={onLoginGoogle}
              className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-2 rounded-full flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google সাইন-ইন দিয়ে ব্যাকআপ রাখুন</span>
            </button>
          )
        )}
      </div>

      {/* AUTOMATED CREDENTIALS CARD */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
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
            <div className="flex items-center gap-1.5">
              <span className="text-purple-600 font-extrabold text-xs">✦ Google Gemini Pro</span>
              <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-semibold">১ মাস আনলিমিটেড</span>
            </div>
            <a
              href={activeCredentials.geminiPro.activationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1"
            >
              লগইন পেজ <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">USERNAME</span>
                <span className="font-mono font-bold text-slate-800 select-all">{activeCredentials.geminiPro.username}</span>
              </div>
              <button
                onClick={() => handleCopy(activeCredentials.geminiPro.username, 'gemini-user')}
                className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                title="Copy"
              >
                {copiedField === 'gemini-user' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">PASSKEY</span>
                <span className="font-mono font-bold text-slate-800 select-all">{activeCredentials.geminiPro.passKey}</span>
              </div>
              <button
                onClick={() => handleCopy(activeCredentials.geminiPro.passKey, 'gemini-pass')}
                className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                title="Copy"
              >
                {copiedField === 'gemini-pass' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">📌 {activeCredentials.geminiPro.instructions}</p>
        </div>

        {/* CapCut Pro Creds */}
        <div className="bg-white rounded-xl p-3 border border-slate-300 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-900 font-extrabold text-xs">👑 CapCut Pro Creator</span>
              <span className="text-[9px] bg-slate-100 text-slate-800 px-1.5 py-0.2 rounded font-semibold">লাইফটাইম VIP</span>
            </div>
            <a
              href={activeCredentials.capcutPro.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1"
            >
              অ্যাপ ডাউনলোড <Download className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">LOGIN ID</span>
                <span className="font-mono font-bold text-slate-800 select-all">{activeCredentials.capcutPro.username}</span>
              </div>
              <button
                onClick={() => handleCopy(activeCredentials.capcutPro.username, 'capcut-user')}
                className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                title="Copy"
              >
                {copiedField === 'capcut-user' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">SECURITY PIN</span>
                <span className="font-mono font-bold text-slate-800 select-all">{activeCredentials.capcutPro.passKey}</span>
              </div>
              <button
                onClick={() => handleCopy(activeCredentials.capcutPro.passKey, 'capcut-pass')}
                className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                title="Copy"
              >
                {copiedField === 'capcut-pass' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">📌 {activeCredentials.capcutPro.instructions}</p>
        </div>

        {/* Course Material Quick Launch */}
        <div className="bg-emerald-600 text-white rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
          <div>
            <div className="font-bold text-xs sm:text-sm">ভিডিও এডিটিং ও এআই মাস্টারক্লাস</div>
            <div className="text-[10px] text-emerald-100">সবগুলো প্রিমিয়াম ভিডিও লেকচার দেখতে কোর্স পেজে যান</div>
          </div>
          <button
            onClick={onStartCourse}
            className="bg-white hover:bg-emerald-50 text-emerald-700 font-extrabold text-xs py-2 px-4 rounded-full shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
          >
            কোর্সের ভিডিও দেখুন →
          </button>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-3">আপনার অর্ডার হিস্ট্রি</h3>
        {orders.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            এখনও কোনো অর্ডার পাওয়া যায়নি।
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">{o.productTitle}</div>
                  <div className="text-[10px] text-slate-500">
                    অর্ডার: #{o.id} • TrxID: {o.trxId} • {o.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-emerald-600">৳{o.amount}</div>
                  <span className="inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

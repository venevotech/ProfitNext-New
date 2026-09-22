import React, { useState } from 'react';
import { X, CheckCircle2, Copy, Check, ExternalLink, Download, KeyRound, Sparkles, Video } from 'lucide-react';
import { IncludedCredentials } from '../core/types.ts';

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: IncludedCredentials;
  orderId?: string;
  amount?: number;
  onGoToPortal: () => void;
}

export const CredentialsModal: React.FC<CredentialsModalProps> = ({
  isOpen,
  onClose,
  credentials,
  orderId,
  amount = 399,
  onGoToPortal
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-6 border border-emerald-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 sm:p-5 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">পেমেন্ট সফল ও স্বয়ংক্রিয় অ্যাক্সেস আনলক!</h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                {orderId ? `Order #${orderId} • ` : ''}মোট ৳{amount} পরিশোধিত
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
            🎉 অভিনন্দন! আপনার কেনা <strong>AI Course (৳৩৯৯)</strong> এর সাথে সম্পূর্ণ ফ্রি পাচ্ছেন <strong>Gemini Pro</strong> এবং <strong>CapCut Pro</strong> এর প্রিমিয়াম অ্যাক্সেস ক্রেডেনশিয়াল।
          </div>

          {/* 1. Gemini Pro Credentials */}
          <div className="border border-purple-200 rounded-xl p-3.5 bg-gradient-to-br from-purple-50/60 to-white shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-purple-600 text-white"><Sparkles className="w-4 h-4" /></span>
                <h4 className="font-bold text-sm text-slate-900">1. Gemini Pro লগইন ও অ্যাক্টিভেশন</h4>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                Google AI Pro
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[10px]">Login Email / Username:</span>
                  <span className="font-mono font-semibold text-slate-800">{credentials.geminiPro.username}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(credentials.geminiPro.username, 'geminiUser')}
                  className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedKey === 'geminiUser' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'geminiUser' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[10px]">Password / PassKey:</span>
                  <span className="font-mono font-semibold text-purple-700">{credentials.geminiPro.passKey}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(credentials.geminiPro.passKey, 'geminiPass')}
                  className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedKey === 'geminiPass' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'geminiPass' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <a
                href={credentials.geminiPro.activationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-1.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 text-xs transition-colors shadow-xs"
              >
                <span>WhatsApp এ ইনস্ট্যান্ট Gemini Pro অ্যাক্টিভ করুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 2. CapCut Pro Credentials */}
          <div className="border border-slate-300 rounded-xl p-3.5 bg-gradient-to-br from-slate-50 to-white shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-slate-900 text-white"><KeyRound className="w-4 h-4" /></span>
                <h4 className="font-bold text-sm text-slate-900">2. CapCut Pro ক্রেডেনশিয়াল ও APK</h4>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                Unlocked VIP
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[10px]">Pro Login Account:</span>
                  <span className="font-mono font-semibold text-slate-800">{credentials.capcutPro.username}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(credentials.capcutPro.username, 'capcutUser')}
                  className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedKey === 'capcutUser' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'capcutUser' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[10px]">Password:</span>
                  <span className="font-mono font-semibold text-slate-800">{credentials.capcutPro.passKey}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(credentials.capcutPro.passKey, 'capcutPass')}
                  className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedKey === 'capcutPass' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'capcutPass' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <a
                href={credentials.capcutPro.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-1.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 text-xs transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CapCut Pro VIP APK ডাউনলোড করুন (Google Drive)</span>
              </a>
            </div>
          </div>

          {/* 3. Course Material Access */}
          <div className="border border-emerald-200 rounded-xl p-3.5 bg-gradient-to-br from-emerald-50/50 to-white shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1 rounded-md bg-emerald-600 text-white"><Video className="w-4 h-4" /></span>
              <h4 className="font-bold text-sm text-slate-900">3. AI কোর্স মাস্টারক্লাস ও রিসোর্স ফাইল</h4>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <a
                href={credentials.courseMaterial.playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 text-xs transition-colors"
              >
                <span>কোর্স ভিডিও প্লেলিস্ট</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={credentials.courseMaterial.vipGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-emerald-100 text-emerald-800 rounded-lg font-semibold flex items-center justify-center gap-1.5 text-xs transition-colors border border-emerald-200"
              >
                <span>ভিআইপি স্টুডেন্ট গ্রুপ</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => {
              onClose();
              onGoToPortal();
            }}
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            আমার ড্যাশবোর্ড / কাস্টমার পোর্টালে যান ↗
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
};

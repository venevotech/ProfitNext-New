import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Copy, Check, ExternalLink, Download, KeyRound, Sparkles, Video, ArrowRight } from 'lucide-react';
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} aria-label="Dismiss modal backdrop" />
      <div className="relative bg-white w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 border border-emerald-100 animate-in zoom-in-95 duration-200 z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white p-4 sm:p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                পেমেন্ট সফল ও স্বয়ংক্রিয় অ্যাক্সেস আনলক!
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                {orderId ? `Order #${orderId} • ` : ''}মোট ৳{amount} পরিশোধিত
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close credentials popup"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
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
          <div className="border border-purple-200 rounded-2xl p-4 bg-gradient-to-br from-purple-50/60 to-white shadow-xs">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-600 text-white shadow-xs"><Sparkles className="w-4 h-4" /></span>
                <h4 className="font-bold text-sm text-slate-900">1. Gemini Pro লগইন ও অ্যাক্টিভেশন</h4>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full">
                Google AI Pro
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="overflow-hidden pr-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Login Email / Username:</span>
                  <span className="font-mono font-semibold text-slate-800 text-xs sm:text-sm truncate block">{credentials.geminiPro.username}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(credentials.geminiPro.username, 'geminiUser')}
                  className="min-h-[44px] min-w-[44px] px-3 py-1 text-xs rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors shrink-0"
                >
                  {copiedKey === 'geminiUser' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="overflow-hidden pr-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Password / PassKey:</span>
                  <span className="font-mono font-semibold text-purple-700 text-xs sm:text-sm truncate block">{credentials.geminiPro.passKey}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(credentials.geminiPro.passKey, 'geminiPass')}
                  className="min-h-[44px] min-w-[44px] px-3 py-1 text-xs rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors shrink-0"
                >
                  {copiedKey === 'geminiPass' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="pt-1">
                <a
                  href={credentials.geminiPro.activationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Gemini Pro ওয়েবসাইটে লগইন করুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 2. CapCut Pro Credentials */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-gradient-to-br from-slate-50 to-white shadow-xs">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-slate-900 text-white shadow-xs">👑</span>
                <h4 className="font-bold text-sm text-slate-900">2. CapCut Pro প্রিমিয়াম আনলক</h4>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 px-2.5 py-0.5 rounded-full">
                Video VIP
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="overflow-hidden pr-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Pro Account / Username:</span>
                  <span className="font-mono font-semibold text-slate-800 text-xs sm:text-sm truncate block">{credentials.capcutPro.username}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(credentials.capcutPro.username, 'capcutUser')}
                  className="min-h-[44px] min-w-[44px] px-3 py-1 text-xs rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors shrink-0"
                >
                  {copiedKey === 'capcutUser' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="overflow-hidden pr-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">PassKey:</span>
                  <span className="font-mono font-semibold text-slate-900 text-xs sm:text-sm truncate block">{credentials.capcutPro.passKey}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(credentials.capcutPro.passKey, 'capcutPass')}
                  className="min-h-[44px] min-w-[44px] px-3 py-1 text-xs rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors shrink-0"
                >
                  {copiedKey === 'capcutPass' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="pt-1">
                <a
                  href={credentials.capcutPro.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>CapCut Pro আনলকড ভার্সন ডাউনলোড করুন</span>
                </a>
              </div>
            </div>
          </div>

          {/* 3. Course Material Drive Link */}
          <div className="border border-emerald-200 rounded-2xl p-4 bg-emerald-50/70">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-emerald-600 text-white"><Video className="w-4 h-4" /></span>
              <h4 className="font-bold text-sm text-emerald-950">3. কোর্স প্র্যাকটিস মেটেরিয়ালস ও ভিডিও ডাউনলোড</h4>
            </div>
            <p className="text-xs text-emerald-800 mb-3 leading-relaxed">
              Google Drive ফোল্ডার থেকে সম্পূর্ণ প্রজেক্ট ফাইল ও হাই-রেজুলেশন রিসোর্স ডাউনলোড করুন।
            </p>
            <a
              href={credentials.courseMaterial.drivePackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Google Drive এ মেটেরিয়ালস দেখুন</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onGoToPortal}
            className="flex-1 min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span>কাস্টমার পোর্টালে যান</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="min-h-[48px] px-5 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * ProfitNext AI Assistant Component
 * Proactively greets user in Bengali on entering website:
 * "Assalamulaikum sir kivabe sahajjo korte pari?"
 * Answers any question regarding courses and digital apps.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  MessageSquare, 
  ChevronRight, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { 
  ChatMessage, 
  INITIAL_GREETING_TEXT, 
  SUGGESTED_QUESTIONS, 
  sendChatMessage, 
  speakText, 
  isSpeechRecognitionSupported 
} from '../services/assistantService.ts';
import { AppItem } from '../core/types.ts';

interface AiAssistantProps {
  products: AppItem[];
  whatsappNumber: string;
  onOpenCourseTransaction: () => void;
  onOpenAppTransaction: (app: AppItem) => void;
  onNavigateToApps: () => void;
  onNavigateToPortal: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  products,
  whatsappNumber,
  onOpenCourseTransaction,
  onOpenAppTransaction,
  onNavigateToApps,
  onNavigateToPortal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: INITIAL_GREETING_TEXT,
      timestamp: Date.now(),
      action: {
        type: 'course',
        label: '👉 ৩৯৯ টাকার কোর্স বান্ডেল কিনুন',
        productId: 'course_ai_bundle'
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    setSpeechSupported(isSpeechRecognitionSupported());
    
    // Auto-scroll on new message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Handle Voice Input with Web Speech API
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('আপনার ব্রাউজারে ভয়েস রিকগনিশন সাপোর্ট নেই। অনুগ্রহ করে ক্রোম ব্রাউজার ব্যবহার করুন।');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'bn-BD';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue(transcript);
          // Automatically send the voice input query
          handleSendQuery(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition could not start', err);
      setIsListening(false);
    }
  };

  // Speak message aloud
  const handleSpeak = (msgId: string, text: string) => {
    setSpeakingMsgId(msgId);
    speakText(text);
    setTimeout(() => {
      setSpeakingMsgId(null);
    }, 4000);
  };

  // Submit Query
  const handleSendQuery = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await sendChatMessage(text, messages);
      const assistantMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: result.reply,
        timestamp: Date.now(),
        action: result.action
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Assistant error:', err);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Handle Action Button Clicks
  const handleActionClick = (action: ChatMessage['action']) => {
    if (!action) return;

    if (action.type === 'course') {
      onOpenCourseTransaction();
      setIsOpen(false);
    } else if (action.type === 'app') {
      const targetApp = products.find(p => p.id === action.productId);
      if (targetApp) {
        onOpenAppTransaction(targetApp);
        setIsOpen(false);
      } else {
        onNavigateToApps();
        setIsOpen(false);
      }
    } else if (action.type === 'browse_apps') {
      onNavigateToApps();
      setIsOpen(false);
    } else if (action.type === 'portal') {
      onNavigateToPortal();
      setIsOpen(false);
    } else if (action.type === 'whatsapp') {
      window.open(`https://wa.me/${whatsappNumber}`, '_blank');
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: INITIAL_GREETING_TEXT,
        timestamp: Date.now(),
        action: {
          type: 'course',
          label: '👉 ৩৯৯ টাকার কোর্স বান্ডেল কিনুন',
          productId: 'course_ai_bundle'
        }
      }
    ]);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 md:right-8 z-40 flex flex-col items-end">
      {/* 1. CHAT WINDOW / MODAL (Appears when someone clicks on the bot) */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] max-w-md h-[520px] max-h-[78vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white p-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 text-white font-bold">
                  <Bot className="w-5 h-5 text-emerald-200" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-emerald-700 rounded-full animate-pulse"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  ProfitNext AI
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full text-emerald-100 font-normal">
                    Gemini 3.8
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block"></span>
                  অনলাইন • সর্বদা সাহায্যার্থে প্রস্তুত
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={handleResetChat}
                className="p-1.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="নতুন করে শুরু করুন"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="মিনিমাইজ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-xs font-medium'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  {/* Message Content */}
                  <div className="whitespace-pre-line leading-relaxed">
                    {msg.content}
                  </div>

                  {/* Contextual Action Button (e.g. Buy Course 399) */}
                  {msg.action && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleActionClick(msg.action)}
                        className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2 px-3 rounded-xl border border-emerald-200 transition-all flex items-center justify-between text-xs cursor-pointer shadow-xs active:scale-98"
                      >
                        <span>{msg.action.label}</span>
                        <ChevronRight className="w-4 h-4 text-emerald-600" />
                      </button>
                    </div>
                  )}

                  {/* Voice Speak TTS Button */}
                  {msg.role === 'assistant' && (
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className={`flex items-center gap-1 hover:text-emerald-600 cursor-pointer p-1 rounded transition-colors ${
                          speakingMsgId === msg.id ? 'text-emerald-600 font-bold' : ''
                        }`}
                        title="ভয়েসে শুনুন"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{speakingMsgId === msg.id ? 'বলছে...' : 'শুনুন'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2 items-center text-slate-500 text-xs italic pl-1">
                <div className="w-7 h-7 rounded-xl bg-emerald-600/20 text-emerald-700 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] text-slate-600 ml-1">উত্তর তৈরি হচ্ছে...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Prompts */}
          <div className="bg-white px-3 py-2 border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(q)}
                className="whitespace-nowrap bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] px-2.5 py-1 rounded-full transition-colors shrink-0 cursor-pointer border border-slate-200/60"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            {/* Microphone Voice Input */}
            {speechSupported && (
              <button
                onClick={toggleVoiceInput}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isListening 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
                title={isListening ? 'কথা বলা শেষ হলে চাপুন' : 'ভয়েস দিয়ে প্রশ্ন করুন'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendQuery();
              }}
              placeholder={isListening ? 'শুনছি... বলুন...' : 'অ্যাপ বা কোর্স সম্পর্কে লিখুন...'}
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <button
              onClick={() => handleSendQuery()}
              disabled={!inputValue.trim() || isLoading}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed"
              title="পাঠান"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. FLOATING TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative p-3 sm:p-3.5 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer border-2 ${
          isOpen
            ? 'bg-slate-900 text-white border-slate-700 scale-95'
            : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white border-emerald-300 hover:scale-105 active:scale-95'
        }`}
        title="ProfitNext AI Assistant (ক্লিক করে চ্যাট শুরু করুন)"
        aria-label="ProfitNext AI Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            {/* Sparkle badge */}
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white animate-pulse"></span>
            <Bot className="w-6 h-6 animate-pulse" />
          </>
        )}
      </button>
    </div>
  );
};

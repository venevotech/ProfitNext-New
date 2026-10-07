/**
 * ProfitNext AI Assistant Service
 * Handles server-side Gemini AI communication, intelligent Bengali domain knowledge fallback,
 * speech recognition (Voice input) and text-to-speech (Voice output).
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  action?: {
    type: 'course' | 'app' | 'browse_apps' | 'whatsapp' | 'portal' | 'pro-unlock' | 'coursera-plus';
    label: string;
    productId?: string;
  };
}

// Default initial greeting requested by user:
export const INITIAL_GREETING_TEXT = 
  "Assalamulaikum sir kivabe sahajjo korte pari? (আসসালামু আলাইকুম স্যার, কিভাবে সাহায্য করতে পারি?) \n\nআমি ProfitNext-এর অফিসিয়াল এআই অ্যাসিস্ট্যান্ট। আমাদের ৩৯৯ টাকার AI Video Earning Masterclass কোর্স বান্ডেল (কোর্স + Gemini Pro + CapCut Pro), কিংবা Pro Unlock Method (Secret Tricks) সম্পর্কে জানতে আমাকে প্রশ্ন করতে পারেন!";

// Quick question prompts
export const SUGGESTED_QUESTIONS = [
  '🔑 eta die ki chatgpt, gemini... nite parbo?',
  '💰 egula sell kivabe korbo?',
  '⚡ Pro Unlock Method (Secret Tricks) কী?',
  '🔥 ৩৯৯ টাকার কোর্স বান্ডেলে কী কী আছে?',
  '🤖 Gemini Pro ও CapCut Pro কিভাবে পাব?'
];

/**
 * Knowledge engine fallback for instant and accurate answers
 */
export function getBengaliDomainAnswer(query: string): { reply: string; action?: ChatMessage['action'] } {
  const q = query.toLowerCase().trim();

  // 1. SPECIFIC USER-REQUESTED QNA 1: eta die ki chatgpt, gemini.....other tools etc. nite parbo?
  if (
    q.includes('chatgpt') && (q.includes('nite') || q.includes('parbo') || q.includes('paoya') || q.includes('pabo')) ||
    q.includes('gemini') && q.includes('other tools') ||
    q.includes('eta die ki') ||
    q.includes('tools etc') ||
    q.includes('other tools etc') ||
    q.includes('অন্যান্য টুলস') ||
    q.includes('apps software nite')
  ) {
    return {
      reply: 'ji sir, apni paid method ar free method e jekono apps/software nite ba kinte parben sobche kom dam e. eto kome paben je sell o korte parben.',
      action: {
        type: 'pro-unlock',
        label: '👉 Pro Unlock Method (Secret Tricks) দেখুন (৳২৯৯)'
      }
    };
  }

  // 2. SPECIFIC USER-REQUESTED QNA 2: egula sell kivabe korbo?
  if (
    q.includes('sell kivabe') || 
    q.includes('sell korbo') || 
    q.includes('kivabe sell') || 
    q.includes('egula sell') || 
    q.includes('বিক্রি করব কিভাবে') || 
    q.includes('সেল করব কিভাবে') || 
    q.includes('ad chalie')
  ) {
    return {
      reply: 'apni facebook e ad chalie sell korte parben. amader Ai die video bananor course ta dekhun.',
      action: {
        type: 'course',
        label: '👉 AI Video Course ও ৩৯৯ বান্ডেল দেখুন',
        productId: 'course_ai_bundle'
      }
    };
  }

  // 3. Pro Unlock Method General Query
  if (
    q.includes('pro unlock') || 
    q.includes('secret trick') || 
    q.includes('secret tricks') || 
    q.includes('সিক্রেট') || 
    q.includes('151002055') || 
    q.includes('higgsfield') || 
    q.includes('king ai')
  ) {
    return {
      reply: 'ji sir! Pro Unlock Method (Secret Tricks)-এর মাধ্যমে আপনি নিজেই অফিসিয়ালভাবে আনলক করতে পারবেন Gemini Pro, ChatGPT Pro, Higgsfield Pro, King AI Pro, Canva Pro, CapCut Pro সহ আরও বহু অ্যাপস ও সফটওয়্যার। এর প্রাইস মাত্র ৳২৯৯ টাকা অথবা আপনার কাছে সিক্রেট কি (151002055) থাকলে সরাসরি পেজে বসিয়ে আনলক করতে পারেন।',
      action: {
        type: 'pro-unlock',
        label: '👉 Pro Unlock Method পেজ খুলুন (৳২৯৯)'
      }
    };
  }

  // 4. Coursera Plus Query
  if (
    q.includes('coursera') || 
    q.includes('কোর্সেরা') || 
    q.includes('1499') || 
    q.includes('১৪৯৯')
  ) {
    return {
      reply: 'ji sir! আমাদের নতুন Coursera Plus কোর্স ও মেম্বারশিপ পেজে আপনি পাচ্ছেন Google, Meta, IBM, Stanford-এর ৭,০০০+ অফিসিয়াল কোর্স ও ভেরিফাইড সার্টিফিকেট সম্পূর্ণ আনলিমিটেড এক্সেস মাত্র ১৪৯৯ BDT-তে! ভিডিও দেখে সরাসরি পপআপ থেকে বিকাশ/নগদে ১৪৯৯ টাকা পেমেন্ট করে অর্ডার করতে পারবেন।',
      action: {
        type: 'coursera-plus',
        label: '👉 Coursera Plus কোর্স পেজ দেখুন (৳১৪৯৯)'
      }
    };
  }

  // Greetings
  if (
    q.includes('assalam') || 
    q.includes('salam') || 
    q.includes('সালাম') || 
    q.includes('আসালামু') || 
    q.includes('hello') || 
    q.includes('hi') || 
    q.includes('হাই') || 
    q.includes('কেমন আছেন')
  ) {
    return {
      reply: 'ওয়ালাইকুমুস সালাম স্যার! Assalamulaikum sir kivabe sahajjo korte pari?\n\nআমি ProfitNext এআই অ্যাসিস্ট্যান্ট। আমাদের ৩৯৯ টাকার কোর্স বান্ডেল, জেমিনাই প্রো, ক্যাপকাট প্রো বা পেমেন্ট সংক্রান্ত যেকোনো বিষয়ে আমি আপনাকে বিস্তারিত তথ্য দিতে প্রস্তুত।',
      action: {
        type: 'course',
        label: '👉 ৩৯৯ টাকার কোর্স বান্ডেল দেখুন',
        productId: 'course_ai_bundle'
      }
    };
  }

  // Course / Masterclass / 399 bundle
  if (
    q.includes('course') || 
    q.includes('কোর্স') || 
    q.includes('399') || 
    q.includes('৩৯৯') || 
    q.includes('বান্ডেল') || 
    q.includes('bundle') || 
    q.includes('masterclass') || 
    q.includes('earning') || 
    q.includes('আর্নিং') ||
    q.includes('ভিডিও এডিটিং')
  ) {
    return {
      reply: `জি স্যার! আমাদের সবচেয়ে জনপ্রিয় অফার হলো **AI Video Earning Masterclass Bundle**, যা এখন বিশেষ ছাড়ে মাত্র **৳৩৯৯** টাকায় পাচ্ছেন (রেগুলার মূল্য ৳৯৯৯)!

🎁 **এই বান্ডেলে আপনি যা যা পাচ্ছেন:**
1. 🎬 **AI Video Masterclass**: মোবাইল ও পিসিতে এআই দিয়ে ভাইরাল ভিডিও বানিয়ে ইউটিউব/ফেসবুক থেকে ইনকাম শেখার সম্পূর্ণ ভিডিও কোর্স।
2. 🤖 **Gemini Pro VIP**: আল্ট্রা ফাস্ট গুগল এআই প্রো প্রিমিয়াম একাউন্ট অ্যাক্সেস।
3. ✨ **CapCut Pro VIP APK**: ওয়াটারমার্ক ছাড়া প্রিমিয়াম ট্রানজিশন ও ফিল্টার আনলকড এডিটিং অ্যাপ।
4. 📂 **রিসোর্স প্যাক**: গুগল ড্রাইভে ১০০+ এআই ভিডিও প্রম্পট ও সাউন্ড এফেক্টস।
5. 💬 **VIP WhatsApp Community**: লাইফটাইম সাপোর্ট ও আপডেট।

অর্ডার সম্পন্ন করার সাথে সাথে স্বয়ংক্রিয়ভাবে স্ক্রিনে আপনার লগইন ও ডাউনলোড ক্রেডেনশিয়াল চলে আসবে।`,
      action: {
        type: 'course',
        label: '👉 এখনই ৩৯৯ টাকায় কোর্স নিন',
        productId: 'course_ai_bundle'
      }
    };
  }

  // CapCut Pro
  if (q.includes('capcut') || q.includes('ক্যাপকাট')) {
    return {
      reply: `জি স্যার! **CapCut Pro VIP** আমাদের কাছে আলাদাভাবে মাত্র **৳৯৯** টাকায় পাওয়া যাচ্ছে।

✨ **CapCut Pro-এর সুবিধা:**
- কোনো ওয়াটারমার্ক থাকবে না।
- সব প্রিমিয়াম ফিল্টার, এফেক্টস ও ট্রানজিশন ১০০% আনলকড।
- 4K ও 60fps আল্ট্রা এইচডি এক্সপোর্ট সুবিধা।
- গুগল ড্রাইভ থেকে সরাসরি আনলকড প্রিমিয়াম এপিকে ডাউনলোড।

💡 **বিশেষ পরামর্শ:** আপনি যদি মাত্র **৳৩৯৯ টাকার কোর্স বান্ডেলটি** নেন, তবে পুরো এআই ভিডিও কোর্স + Gemini Pro + CapCut Pro সব একসাথে পেয়ে যাবেন!`,
      action: {
        type: 'app',
        label: '👉 ৯৯ টাকায় CapCut Pro নিন',
        productId: 'capcut_pro'
      }
    };
  }

  // Gemini Pro
  if (q.includes('gemini') || q.includes('জেমিনাই')) {
    return {
      reply: `জি স্যার! **Gemini Pro (Google AI)** সাবস্ক্রিপশন আলাদাভাবে মাত্র **৳৩৫০** টাকা।

🤖 **Gemini Pro-এর সুবিধা:**
- গুগলের সবচেয়ে শক্তিশালী অ্যাডভান্সড এআই মডেল।
- আনলিমিটেড কোডিং, কন্টেন্ট রাইটিং ও প্রম্পট সমাধান।
- ২.৫ মিলিয়ন টোকেন পর্যন্ত বিশাল কনটেক্সট ক্যাপাসিটি।

💡 **সেরা সুযোগ:** মাত্র **৳৩৯৯ টাকায়** আমাদের সম্পূর্ণ কোর্স বান্ডেল নিলে Gemini Pro + CapCut Pro + ভিডিও কোর্স সবই একসাথে পেয়ে যাবেন!`,
      action: {
        type: 'course',
        label: '👉 ৩৯৯ টাকায় ফুল বান্ডেল নিন',
        productId: 'course_ai_bundle'
      }
    };
  }

  // Duolingo
  if (q.includes('duolingo') || q.includes('ডুওলিঙ্গো') || q.includes('ইংরেজি') || q.includes('ভাষা')) {
    return {
      reply: `জি স্যার! **Duolingo Max** আমাদের কাছে মাত্র **৳১৯৯** টাকায় উপলব্ধ।

🦉 **Duolingo Max সুবিধা:**
- আনলিমিটেড হার্টস (কখনো লাইফ শেষ হবে না)।
- এআই রোলপ্লে ও রিয়েল-টাইম কনভারসেশন প্র্যাকটিস।
- ভুলের কারণ বিস্তারিত ব্যাখ্যার এআই ফিচার।`,
      action: {
        type: 'app',
        label: '👉 ১৯৯ টাকায় Duolingo Max নিন',
        productId: 'duolingo_max'
      }
    };
  }

  // Framer Pro
  if (q.includes('framer') || q.includes('ফ্রেমার') || q.includes('ওয়েবসাইট')) {
    return {
      reply: `জি স্যার! **Framer Pro** লাইসেন্স পাচ্ছেন মাত্র **৳২৯৯৯** টাকায়। ফিগমা ডিজাইন সরাসরি লাইভ প্রফেশনাল রেসপনসিভ ওয়েবসাইটে রূপান্তর করার সেরা টুল।`,
      action: {
        type: 'app',
        label: '👉 Framer Pro অর্ডার করুন',
        productId: 'framer_pro'
      }
    };
  }

  // Payment / How to order / bKash
  if (
    q.includes('payment') || 
    q.includes('পেমেন্ট') || 
    q.includes('bkash') || 
    q.includes('বিকাশ') || 
    q.includes('nagad') || 
    q.includes('নগদ') || 
    q.includes('rocket') || 
    q.includes('রকেট') || 
    q.includes('kivabe') || 
    q.includes('কিভাবে') || 
    q.includes('kinbo') || 
    q.includes('অর্ডার') || 
    q.includes('নম্বর')
  ) {
    return {
      reply: `স্যার, কেনা ও পেমেন্ট করার প্রক্রিয়া অত্যন্ত সহজ ও তাৎক্ষণিক:

1. আপনার পছন্দের কোর্স বা অ্যাপের নিচে থাকা বাটনে ক্লিক করুন।
2. আমাদের অফিসিয়াল বিকাশ/নগদ/রকেট পার্সোনাল নম্বর: **01625449778**-এ নির্ধারিত টাকা Send Money করুন।
3. পেমেন্ট শেষে Transaction ID (TrxID), আপনার ফোন নম্বর ও ইমেইল বসিয়ে সাবমিট করুন।
4. **স্বয়ংক্রিয় তাৎক্ষণিক ডেলিভারি**: পেমেন্ট নিশ্চিত করলেই স্ক্রিনে **Automated Credentials Modal** ভেসে উঠবে এবং আপনি Gemini Pro VIP ইউজারনেম/পাসকি, CapCut Pro APK ডাউনলোড লিংক এবং কোর্সের লিংক পেয়ে যাবেন!

কোনো সহায়তা লাগলে আমাদের WhatsApp (+8801830086837)-এ নক করতে পারেন।`,
      action: {
        type: 'course',
        label: '👉 ৩৯৯ টাকার চেকআউট পেজে যান',
        productId: 'course_ai_bundle'
      }
    };
  }

  // App list
  if (q.includes('app') || q.includes('অ্যাপ') || q.includes('সব') || q.includes('list') || q.includes('লিস্ট')) {
    return {
      reply: `জি স্যার! ProfitNext-এ বর্তমানে উপলব্ধ ডিজিটাল প্রডাক্ট ও কোর্স তালিকা:

1. 🌟 **AI Course + Gemini Pro + CapCut Pro Bundle** - মাত্র **৳৩৯৯** (সেরা ডিল!)
2. 🤖 **Gemini Pro** (Google AI সাবস্ক্রিপশন) - **৳৩৫০**
3. 🎬 **CapCut Pro** (আনলকড নো ওয়াটারমার্ক) - **৳৯৯**
4. 🦉 **Duolingo Max** (আনলিমিটেড এআই) - **৳১৯৯**
5. 🎨 **Framer Pro** (নো-কোড সাইট বিল্ডার) - **৳২৯৯৯**

আপনি কোনটি নিতে আগ্রহী স্যার?`,
      action: {
        type: 'browse_apps',
        label: '📱 সব অ্যাপস ব্রাউজ করুন'
      }
    };
  }

  // Affiliate
  if (q.includes('affiliate') || q.includes('অ্যাফিলিয়েট') || q.includes('ইনকাম') || q.includes('রেফার') || q.includes('কমিশন')) {
    return {
      reply: `জি স্যার! ProfitNext অ্যাফিলিয়েট প্রোগ্রামে যোগ দিয়ে প্রতি কোর্স বিক্রয়ে **৳৮০** সরাসরি কমিশন এবং ৩-স্তরীয় টিম কমিশন ইনকাম করতে পারবেন। মাত্র ৳১৯৯ এককালীন ফিতে পার্টনারশিপ শুরু করা যায়!`,
      action: {
        type: 'portal',
        label: '💼 অ্যাফিলিয়েট পোর্টাল দেখুন'
      }
    };
  }

  // General fallback
  return {
    reply: `জি স্যার, আপনার প্রশ্নের জন্য ধন্যবাদ! 

ProfitNext-এ আপনি পাচ্ছেন প্রিমিয়াম ডিজিটাল অ্যাপস এবং অনলাইন আর্নিং কোর্স। 
বর্তমানে আমাদের সবচেয়ে আকর্ষণীয় অফার হলো **৳৩৯৯ টাকার কোর্স বান্ডেল**, যাতে AI Masterclass-এর সাথে Gemini Pro এবং CapCut Pro দুটি প্রিমিয়াম অ্যাপই সম্পূর্ণ বিনামূল্যে অন্তর্ভুক্ত রয়েছে।

আপনি কি কোনো নির্দিষ্ট অ্যাপ বা কোর্স সম্পর্কে আরও বিস্তারিত জানতে চান স্যার?`,
    action: {
      type: 'course',
      label: '👉 ৩৯৯ টাকার বান্ডেল দেখুন',
      productId: 'course_ai_bundle'
    }
  };
}

/**
 * Send chat message to Gemini backend API with seamless local fallback
 */
export async function sendChatMessage(
  userText: string,
  history: ChatMessage[]
): Promise<{ reply: string; action?: ChatMessage['action'] }> {
  try {
    const response = await fetch('/api/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userText,
        history: history.map(h => ({ role: h.role, content: h.content }))
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.reply) {
        // Derive contextual action button if applicable
        const fallbackAction = getBengaliDomainAnswer(userText).action;
        return {
          reply: data.reply,
          action: fallbackAction
        };
      }
    }
  } catch (err) {
    console.warn('Network or server error, using domain assistant knowledge:', err);
  }

  // Reliable local fallback
  return getBengaliDomainAnswer(userText);
}

/**
 * Text-to-Speech function for speaking Bengali/English response aloud
 */
export function speakText(text: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // stop any ongoing speech

    // Clean markdown symbols for cleaner audio
    const clean = text
      .replace(/[*#_~`>]/g, '')
      .replace(/\n+/g, '. ')
      .slice(0, 300); // polite snippet length

    const utterance = new SpeechSynthesisUtterance(clean);
    
    // Pick Bengali voice if available
    const voices = window.speechSynthesis.getVoices();
    const bnVoice = voices.find(v => v.lang.includes('bn') || v.lang.includes('BD'));
    if (bnVoice) {
      utterance.voice = bnVoice;
      utterance.lang = 'bn-BD';
    } else {
      utterance.lang = 'bn-BD';
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.error('Speech synthesis error', e);
    return false;
  }
}

/**
 * Web Speech API Voice Recognition check
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

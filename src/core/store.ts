import { AppState, IncludedCredentials, Order, CoursePageConfig } from './types.ts';

export const DEFAULT_CREDENTIALS: IncludedCredentials = {
  geminiPro: {
    username: 'gemini.vip.profitnext@gmail.com',
    passKey: 'GeminiPro#2026VIP',
    instructions: '1. Visit gemini.google.com/advanced\n2. Message on WhatsApp with your email to activate Google Flow + 5000 GB Google Drive storage\n3. Enjoy Ultra & 2.5M Token Context.',
    activationLink: 'https://wa.me/8801830086837?text=Hello%20ProfitNext,%20I%20purchased%20the%20Combo%20Package%20for%20350%20Taka.%20Please%20activate%20my%20Gemini%20Pro%20+%20Google%20Flow%20+%205000GB%20Storage.'
  },
  capcutPro: {
    username: 'capcut.pro.member@profitnext.com',
    passKey: 'CapCutPRO#Access88',
    downloadUrl: 'https://drive.google.com/drive/folders/1bqr5ao8KPDWL05TjpffWz9A7wk96x84L',
    instructions: '1. Open CapCut Pro Google Drive VIP Folder\n2. Download and install on Android\n3. Enjoy lifetime VIP access with unlocked filters, transitions, and export.'
  },
  courseMaterial: {
    masterclassVideoId: '8pZeSjg4ZLU',
    playlistUrl: 'https://youtu.be/8pZeSjg4ZLU',
    drivePackUrl: 'https://drive.google.com/drive/folders/1bqr5ao8KPDWL05TjpffWz9A7wk96x84L',
    vipGroupLink: 'https://chat.whatsapp.com/JSVC1WgAjUoLDd7klDvRrv'
  }
};

export const DEFAULT_COURSE_CONFIG: CoursePageConfig = {
  headline: 'AI দিয়ে ভিডিও বানিয়ে ইনকামের যাত্রা শুরু করুন। (সম্পূর্ণ ফ্রি কোর্স)',
  whatsappGroupLink: 'https://chat.whatsapp.com/JSVC1WgAjUoLDd7klDvRrv',
  modules: [
    {
      id: 'mod_1',
      order: 1,
      title: 'Course Module - 1',
      subTitle: 'AI Video Creation & Monetization Basics',
      videoUrl: 'https://youtu.be/8pZeSjg4ZLU?si=_Ir1tLtGyzAcdyBi',
      description: 'শিখুন কিভাবে AI দিয়ে ভিডিও বানিয়ে প্রথম দিন থেকেই কন্টেন্ট ক্রিয়েশন শুরু করবেন। (সম্পূর্ণ ফ্রি)',
      level: 'Free Module 1',
      topics: [
        'How to create video with Google Flow Pro',
        'How to find viral content to create',
        'How to find images to create content',
        'Create viral videos and search captions & descriptions',
        'Earning potential and monetization setup'
      ]
    },
    {
      id: 'mod_2',
      order: 2,
      title: 'Course Module - 2',
      subTitle: 'CapCut Pro & Gemini Pro Advanced Editing',
      videoUrl: 'https://youtu.be/Hf0Mvc_eKos?si=b_VXukPVD6RN7a-X',
      description: 'Gemini Pro এবং CapCut Pro ব্যবহার করে মোবাইলেই প্রফেশনাল সিনেমাটিক ভিডিও তৈরি করুন। (সম্পূর্ণ ফ্রি)',
      level: 'Free Module 2',
      topics: [
        'CapCut Pro VIP Filters & Transitions Masterclass',
        'Gemini Pro High-Converting Prompt Engineering',
        'Audio mixing and AI voiceover sync'
      ]
    },
    {
      id: 'mod_3',
      order: 3,
      title: 'Course Module - 3',
      subTitle: 'Viral Video Scaling & Direct Monetization',
      videoUrl: 'https://youtu.be/zHQmXwLgKQo?si=22etV0HgyOoWWdGl',
      description: 'ইউটিউব ও ফেসবুকে ভাইরাল কন্টেন্ট তৈরি করে প্রতি মাসে আয় করার সিক্রেট স্ট্র্যাটেজি। (সম্পূর্ণ ফ্রি)',
      level: 'Free Module 3',
      topics: [
        'YouTube Shorts & Facebook Reels Algorithm Hacking',
        'Affiliate marketing with AI videos',
        'Withdrawing earnings directly to bKash/Nagad'
      ]
    }
  ],
  comboPackage: {
    enabled: true,
    title: 'Gemini Pro + CapCut Pro VIP Combo Package',
    subTitle: 'Course Videos + Apps Combo (2 Apps Full Access)',
    price: 350,
    rawPrice: 850,
    buyButtonText: '৳৩৫০ টাকায় কম্বো প্যাকেজ কিনুন ⚡',
    badgeText: 'কম্বো অফার',
    apps: [
      {
        id: 'app_1',
        title: 'Gemini Pro + Google Flow + 5000 GB google drive storage',
        description: 'Google AI Pro + 5000 GB Cloud Storage + VIP Activation',
        link: 'https://wa.me/8801830086837',
        buttonText: 'Get Gemini Pro & Drive'
      },
      {
        id: 'app_2',
        title: 'Capcut Pro (Lifetime)',
        description: 'CapCut VIP Full Android APK + Templates & Pro Filters',
        link: 'https://drive.google.com/drive/folders/1bqr5ao8KPDWL05TjpffWz9A7wk96x84L',
        buttonText: 'Download CapCut Pro VIP'
      }
    ]
  }
};

export const INITIAL_STATE: AppState = {
  settings: {
    paymentNumber: '01625449778',
    whatsappNumber: '8801830086837',
    whatsappGroupLink: 'https://chat.whatsapp.com/JSVC1WgAjUoLDd7klDvRrv',
    telegramGroupLink: 'https://t.me/+9EvZ7JHTIK4zZTk1',
    telegramBotToken: '',
    telegramChatId: '',
    telegramAutoForward: true,
    courseBundlePrice: 350, // 350 Taka Combo Package
    affiliateJoiningFee: 199,
    customerDiscountPercent: 10,
    minWithdrawAmount: 500,
    holdingPeriodDays: 7,
    mlmEnabled: true,
    l1Rate: 20,
    l2Rate: 5,
    l3Rate: 2,
    courseConfig: DEFAULT_COURSE_CONFIG
  },
  products: [
    {
      id: 'combo_apps_350',
      type: 'bundle',
      title: 'Gemini Pro + Google Flow + 5000 GB Drive + CapCut Pro (Lifetime)',
      subTitle: 'Combo Package (Gemini Pro + 5000GB Drive + Capcut Pro Lifetime)',
      price: 350,
      rawPrice: 850,
      resellerPrice: 280,
      commission: 70,
      badgeClass: 'badge-gemini',
      downloadUrl: 'https://drive.google.com/drive/folders/1bqr5ao8KPDWL05TjpffWz9A7wk96x84L',
      status: 'published',
      accessMode: 'credentials_auto',
      includesBundle: true,
      includedCredentials: DEFAULT_CREDENTIALS
    },
    {
      id: 'course_ai_bundle',
      type: 'course',
      title: 'AI Video Earning Masterclass + Gemini Pro + CapCut Pro',
      subTitle: 'Course + Gemini Pro + CapCut Pro Full Bundle Access',
      price: 350,
      rawPrice: 999,
      resellerPrice: 280,
      commission: 70,
      badgeClass: 'badge-gemini',
      downloadUrl: 'https://youtu.be/8pZeSjg4ZLU',
      status: 'published',
      accessMode: 'credentials_auto',
      includesBundle: true,
      includedCredentials: DEFAULT_CREDENTIALS
    },
    {
      id: 'gemini_pro',
      type: 'app',
      title: 'Gemini Pro + Google Flow + 5000 GB Storage',
      subTitle: 'Google Ai Pro + 5000 GB Drive',
      price: 350,
      rawPrice: 650,
      resellerPrice: 280,
      commission: 70,
      badgeClass: 'badge-gemini',
      downloadUrl: 'https://wa.me/8801830086837',
      status: 'published',
      accessMode: 'credentials_auto'
    },
    {
      id: 'capcut_pro',
      type: 'app',
      title: 'Capcut pro (Lifetime)',
      subTitle: 'Video Editing Pro License VIP',
      price: 99,
      rawPrice: 250,
      resellerPrice: 65,
      commission: 25,
      badgeClass: 'badge-capcut',
      downloadUrl: 'https://drive.google.com/drive/folders/1bqr5ao8KPDWL05TjpffWz9A7wk96x84L',
      status: 'published',
      accessMode: 'credentials_auto'
    },
    {
      id: 'duolingo_max',
      type: 'app',
      title: 'Duolingo MAX',
      subTitle: 'Personal Subscription',
      price: 150,
      rawPrice: 350,
      resellerPrice: 110,
      commission: 30,
      status: 'published',
      accessMode: 'direct',
      downloadUrl: 'https://drive.google.com'
    },
    {
      id: 'canva_pro',
      type: 'app',
      title: 'Canva Pro Lifetime',
      subTitle: 'Edu / Team Lifetime Invite',
      price: 199,
      rawPrice: 499,
      resellerPrice: 140,
      commission: 40,
      status: 'published',
      accessMode: 'direct'
    },
    {
      id: 'chatgpt_plus',
      type: 'app',
      title: 'ChatGPT Plus Shared',
      subTitle: 'GPT-4o & Canvas Access',
      price: 450,
      rawPrice: 850,
      resellerPrice: 380,
      commission: 60,
      status: 'published',
      accessMode: 'direct'
    },
    {
      id: 'prime_video',
      type: 'app',
      title: 'Prime Video 1 Month',
      subTitle: 'Private Profile UHD',
      price: 120,
      rawPrice: 250,
      resellerPrice: 90,
      commission: 20,
      status: 'published',
      accessMode: 'direct'
    }
  ],
  affiliates: [
    {
      id: 'aff_1',
      code: 'Profit-E1005',
      name: 'Rahim Ahmed',
      phone: '01711223344',
      email: 'rahim@profitnext.com',
      password: 'password123',
      paymentNumber: '01711223344',
      status: 'approved',
      wallet: {
        available: 640,
        pending: 160,
        totalEarned: 800,
        withdrawn: 0
      },
      clicks: 48,
      ordersCount: 8,
      partnerId: 'partner_lead_1'
    }
  ],
  partners: [
    {
      id: 'partner_lead_1',
      partnerCode: 'PARTNER-L1',
      name: 'Executive Partner Leader',
      phone: '01625449778',
      email: 'leader@profitnext.com',
      password: 'lead#partner2026',
      wallet: {
        available: 1250,
        withdrawn: 500
      },
      createdAt: '2026-01-15'
    }
  ],
  orders: [
    {
      id: 'PN-88910',
      customerName: 'Shakil Khan',
      phone: '01899001122',
      email: 'shakil@gmail.com',
      productTitle: 'AI Video Earning Masterclass + Gemini Pro + CapCut Pro',
      productId: 'course_ai_bundle',
      amount: 350,
      rawPrice: 850,
      discount: 0,
      trxId: 'BL98K21809',
      affiliateCode: 'Profit-E1005',
      commission: 70,
      status: 'completed',
      date: '2026-09-22 14:30',
      credentials: DEFAULT_CREDENTIALS
    }
  ],
  withdrawals: [],
  coupons: [
    {
      code: 'PROFIT20',
      type: 'percent',
      amount: 10,
      active: true
    },
    {
      code: 'SPECIAL50',
      type: 'fixed',
      amount: 50,
      active: true
    }
  ],
  auditLogs: [
    'সিস্টেম ইনিশিয়ালাইজেশন সফল হয়েছে।',
    'ডিফল্ট কোর্স ও ৩৫০ টাকা কম্বো অ্যাপস প্যাকেজ কনফিগার করা হয়েছে।'
  ]
};

const STORAGE_KEY = 'profitnext_app_state_v3';

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STATE,
      ...parsed,
      settings: {
        ...INITIAL_STATE.settings,
        ...(parsed.settings || {}),
        courseConfig: parsed.settings?.courseConfig || DEFAULT_COURSE_CONFIG
      },
      products: parsed.products && parsed.products.length > 0 ? parsed.products : INITIAL_STATE.products
    };
  } catch (e) {
    console.error('Error loading app state from localStorage:', e);
    return INITIAL_STATE;
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving app state to localStorage:', e);
  }
}

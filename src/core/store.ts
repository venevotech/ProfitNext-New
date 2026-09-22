import { AppState, IncludedCredentials, Order } from './types.ts';

export const DEFAULT_CREDENTIALS: IncludedCredentials = {
  geminiPro: {
    username: 'gemini.vip.profitnext@gmail.com',
    passKey: 'GeminiPro#2026VIP',
    instructions: '1. Visit gemini.google.com/advanced\n2. Sign in with the provided VIP account or activate with your email via WhatsApp\n3. Enjoy Ultra & 2.5M Token Context.',
    activationLink: 'https://wa.me/8801830086837?text=Hello%20ProfitNext,%20I%20purchased%20the%20AI%20Course%20Bundle%20for%20399%20Taka.%20Please%20activate%20my%20Gemini%20Pro%20access.'
  },
  capcutPro: {
    username: 'capcut.pro.member@profitnext.com',
    passKey: 'CapCutPRO#Access88',
    downloadUrl: 'https://drive.google.com/file/d/1iFvX4MEA7nXwkNvN2hPUSafCZK2y0t2W/view?usp=sharing',
    instructions: '1. Download CapCut Pro VIP APK from Google Drive\n2. Install on Android\n3. Log in with the provided credentials or unlock pro filters/transitions directly.'
  },
  courseMaterial: {
    masterclassVideoId: 'Hf0Mvc_eKos',
    playlistUrl: 'https://youtu.be/Hf0Mvc_eKos',
    drivePackUrl: 'https://drive.google.com/file/d/1iFvX4MEA7nXwkNvN2hPUSafCZK2y0t2W/view?usp=sharing',
    vipGroupLink: 'https://chat.whatsapp.com/JSVC1WgAjUoLDd7klDvRrv'
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
    courseBundlePrice: 399, // User requirement: 399 Taka for Course + Gemini Pro + CapCut Pro
    affiliateJoiningFee: 199,
    customerDiscountPercent: 10,
    minWithdrawAmount: 500,
    holdingPeriodDays: 7,
    mlmEnabled: true,
    l1Rate: 20,
    l2Rate: 5,
    l3Rate: 2
  },
  products: [
    {
      id: 'course_ai_bundle',
      type: 'course',
      title: 'AI Video Earning Masterclass + Gemini Pro + CapCut Pro',
      subTitle: 'Course + Gemini Pro + CapCut Pro Full Bundle Access',
      price: 399,
      rawPrice: 999,
      resellerPrice: 320,
      commission: 80,
      badgeClass: 'badge-gemini',
      downloadUrl: 'https://youtu.be/Hf0Mvc_eKos',
      status: 'published',
      accessMode: 'credentials_auto',
      includesBundle: true,
      includedCredentials: DEFAULT_CREDENTIALS
    },
    {
      id: 'gemini_pro',
      type: 'app',
      title: 'Gemini Pro',
      subTitle: 'Google Ai Pro Subscription',
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
      title: 'Capcut pro',
      subTitle: 'Video Editing Pro License',
      price: 99,
      rawPrice: 250,
      resellerPrice: 65,
      commission: 25,
      badgeClass: 'badge-capcut',
      downloadUrl: 'https://drive.google.com/file/d/1iFvX4MEA7nXwkNvN2hPUSafCZK2y0t2W/view?usp=sharing',
      status: 'published',
      accessMode: 'credentials_auto'
    },
    {
      id: 'duolingo_max',
      type: 'app',
      title: 'Duolingo Max',
      subTitle: 'AI Language Super',
      price: 199,
      rawPrice: 450,
      resellerPrice: 150,
      commission: 40,
      badgeClass: 'badge-duolingo',
      downloadUrl: 'https://wa.me/8801830086837',
      status: 'published'
    },
    {
      id: 'framer_pro',
      type: 'app',
      title: 'Framer Pro',
      subTitle: 'Figma to Web Builder',
      price: 2999,
      rawPrice: 5000,
      resellerPrice: 2400,
      commission: 500,
      badgeClass: 'badge-framer',
      downloadUrl: 'https://wa.me/8801830086837',
      status: 'published'
    }
  ],
  affiliates: [
    {
      id: 'aff_1',
      code: 'Profit-E1005',
      name: 'Mohammad Tanvir',
      phone: '01789123456',
      email: 'tanvir@example.com',
      password: '123456',
      status: 'approved',
      wallet: {
        available: 0,
        pending: 0,
        totalEarned: 0,
        withdrawn: 0
      },
      clicks: 0,
      ordersCount: 0,
      partnerId: 'partner_lead_1'
    }
  ],
  partners: [
    {
      id: 'partner_lead_1',
      partnerCode: 'LEAD101',
      name: 'Mohammad Tanvir (Lead Partner)',
      phone: '01789123456',
      email: 'tanvir@example.com',
      password: '123456',
      paymentNumber: '01789123456'
    }
  ],
  orders: [],
  withdrawals: [],
  coupons: [
    { code: 'SAVE50', type: 'fixed', amount: 50, active: true },
    { code: 'AI2026', type: 'percent', amount: 10, active: true }
  ],
  auditLogs: [
    'System initialized with ProfitNext Course Bundle set to 399 Taka (includes Course + Gemini Pro + CapCut Pro credentials).'
  ]
};

const STORAGE_KEY = 'PROFITNEXT_STORE_V4';

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure course price is updated to 399 Taka
      if (parsed.settings) {
        parsed.settings.courseBundlePrice = 399;
      }
      if (parsed.products) {
        const course = parsed.products.find((p: any) => p.id === 'course_ai_bundle');
        if (course) {
          course.price = 399;
          course.title = 'AI Video Earning Masterclass + Gemini Pro + CapCut Pro';
          course.includedCredentials = DEFAULT_CREDENTIALS;
        } else {
          parsed.products.unshift(INITIAL_STATE.products[0]);
        }
      }
      return { ...INITIAL_STATE, ...parsed };
    }
  } catch (err) {
    console.error('Failed to load state from localStorage', err);
  }
  return INITIAL_STATE;
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
}

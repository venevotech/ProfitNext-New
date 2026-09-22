export type AccessMode = 'direct' | 'affiliate_key' | 'credentials_auto' | 'free_sample';

export interface IncludedCredentials {
  geminiPro: {
    username: string;
    passKey: string;
    instructions: string;
    activationLink: string;
  };
  capcutPro: {
    username: string;
    passKey: string;
    downloadUrl: string;
    instructions: string;
  };
  courseMaterial: {
    masterclassVideoId: string;
    playlistUrl: string;
    drivePackUrl: string;
    vipGroupLink: string;
  };
}

export interface AppItem {
  id: string;
  type: 'app' | 'course' | 'bundle';
  title: string;
  subTitle: string;
  price: number;
  rawPrice?: number;
  resellerPrice?: number;
  commission?: number;
  badgeClass?: string;
  downloadUrl?: string;
  status: 'published' | 'coming_soon' | 'archived';
  accessMode?: AccessMode;
  includesBundle?: boolean;
  includedCredentials?: IncludedCredentials;
}

export interface AffiliatePartner {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  paymentNumber?: string;
  trxId?: string;
  partnerId?: string;
  status: 'approved' | 'pending_approval' | 'suspended';
  wallet: {
    available: number;
    pending: number;
    totalEarned: number;
    withdrawn: number;
  };
  clicks: number;
  ordersCount: number;
}

export interface PartnerLeader {
  id: string;
  partnerCode: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  paymentNumber?: string;
  wallet?: {
    available: number;
    withdrawn: number;
  };
  createdAt?: string;
}

export interface SiteSettings {
  paymentNumber: string;
  whatsappNumber: string;
  whatsappGroupLink: string;
  telegramGroupLink: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  telegramAutoForward?: boolean;
  courseBundlePrice: number; // 399 Taka
  affiliateJoiningFee: number;
  customerDiscountPercent: number;
  minWithdrawAmount: number;
  holdingPeriodDays: number;
  mlmEnabled: boolean;
  l1Rate: number;
  l2Rate: number;
  l3Rate: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  productTitle: string;
  productId: string;
  amount: number;
  rawPrice: number;
  discount: number;
  trxId: string;
  affiliateCode: string;
  commission: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  credentials?: IncludedCredentials;
}

export interface WithdrawalRequest {
  id: string;
  affiliateCode: string;
  name: string;
  amount: number;
  method: string;
  number: string;
  status: 'pending' | 'paid' | 'rejected';
  date: string;
}

export interface CouponItem {
  code: string;
  type: 'fixed' | 'percent';
  amount: number;
  active: boolean;
}

export interface AppState {
  settings: SiteSettings;
  products: AppItem[];
  affiliates: AffiliatePartner[];
  partners: PartnerLeader[];
  orders: Order[];
  withdrawals: WithdrawalRequest[];
  coupons: CouponItem[];
  auditLogs: string[];
}

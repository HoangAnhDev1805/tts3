// User types
export interface User {
  _id: string;
  username: string;
  email?: string;
  phone?: string;
  fullName?: string;
  avatar?: string;
  role: 'admin' | 'user' | 'trial';
  status: 'active' | 'expired' | 'locked';
  startDate: string;
  expiryDate: string;
  lastLogin?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Contact types
export interface Contact {
  _id: string;
  userId: string;
  fullName: string;
  phone: string;
  address?: string;
  notes?: string;
  status: 'active' | 'inactive';
  debt: number;
  pricingConfig: PricingConfig;
  createdAt: string;
  updatedAt: string;
}

export interface PricingConfig {
  [region: string]: {
    [betType: string]: {
      price: number;
      multiplier: number;
    };
  };
}

// Message types
export interface Message {
  _id: string;
  userId: string;
  contactId: string | Contact;
  content: string;
  date: string;
  regions: string[];
  parsed: ParsedMessage;
  result?: MessageResult;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ParsedMessage {
  lines: BetLine[];
  totalAmount: number;
}

export interface BetLine {
  type: string;
  numbers: string[];
  points: number;
  amount: number;
}

export interface MessageResult {
  processed: boolean;
  totalWin: number;
  totalLose: number;
  profit: number;
  details: any[];
}

// Lottery types
export interface LotteryResult {
  _id: string;
  date: string;
  mb?: RegionResult;
  mt?: RegionResult[];
  mn?: RegionResult[];
}

export interface RegionResult {
  province?: string;
  prizes: {
    [key: string]: string[];
  };
}

// Payment types
export interface PaymentPackage {
  _id: string;
  name: string;
  months: number;
  price: number;
  description?: string;
  isActive: boolean;
  order: number;
}

export interface PaymentMethod {
  _id: string;
  type: 'bank' | 'momo' | 'zalopay';
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  momoPhone?: string;
  zaloPayPhone?: string;
  transferContentTemplate: string;
  qrCode?: string;
  isActive: boolean;
  order: number;
}

export interface Transaction {
  _id: string;
  userId?: string;
  type: 'purchase' | 'renewal';
  packageId: PaymentPackage;
  paymentMethodId: PaymentMethod;
  amount: number;
  phone: string;
  transferContent: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'expired';
  expiresAt: string;
  confirmedBy?: string;
  confirmedAt?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Settings types
export interface WebsiteSetting {
  _id: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  faviconUrl?: string;
  logoUrl?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  customHeadScript?: string;
  customBodyScript?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpFromEmail?: string;
  smtpFromName?: string;
}

export interface TelegramSetting {
  _id: string;
  botToken?: string;
  botUsername?: string;
  webhookUrl?: string;
  isActive: boolean;
  lastTestedAt?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errorCode?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

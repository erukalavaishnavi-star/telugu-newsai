// ─── Auth ──────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  orgName?: string;
  role: 'admin' | 'editor' | 'viewer';
  plan: 'free' | 'pro' | 'enterprise';
  createdAt?: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
  user: User;
}

// ─── Article & Generation ──────────────────────────────────────────────────
export type Category =
  | 'general'
  | 'politics'
  | 'sports'
  | 'crime'
  | 'business'
  | 'entertainment'
  | 'technology'
  | 'weather';

export type Tone = 'formal' | 'casual' | 'breaking';

export interface GenerateRequest {
  articleText: string;
  category: Category;
  tone?: Tone;
}

export interface GeneratedContent {
  id: string;
  headline?: string;
  keyFacts?: string[];
  captionVariations?: string[];
  summary: string;
  facebookPost: string;
  instagramCaption: string;
  twitterPost: string;
  whatsappText: string;
  youtubeCommunity: string;
  breakingAlert: string;
  hashtags: string[];
  seoKeywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  generationMs: number;
  generatedAt: string;
}

// ─── History ───────────────────────────────────────────────────────────────
export interface HistoryItem {
  id: string;
  articleTitle: string;
  category: Category;
  postsGenerated: number;
  sentiment: string;
  createdAt: string;
}

export interface HistoryResponse {
  items: HistoryItem[];
  total: number;
  page: number;
  pages: number;
}

// ─── Stats ─────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalArticles: number;
  todayGenerations: number;
  timeSavedHours: number;
  avgGenerationTime: number;
  topCategory: string;
  weeklyChange: number;
  categories?: CategoryStat[];
  recent?: RecentGeneration[];
}

export interface CategoryStat {
  name: string;
  teluguName: string;
  count: number;
  color: string;
}

export interface RecentGeneration {
  id: string;
  title: string;
  category: string;
  posts: number;
  createdAt: string;
}

// ─── API Responses ────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
}

// ─── Platform Config ───────────────────────────────────────────────────────
export type PlatformContentKey =
  | 'summary'
  | 'facebookPost'
  | 'instagramCaption'
  | 'twitterPost'
  | 'whatsappText'
  | 'youtubeCommunity'
  | 'breakingAlert';

export interface PlatformConfig {
  key: PlatformContentKey;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  maxChars?: number;
}

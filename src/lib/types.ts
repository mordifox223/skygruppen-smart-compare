export type Language = 'nb' | 'en';
export type ProviderCategory = 'insurance' | 'electricity' | 'power' | 'mobile' | 'loan';

export interface Category {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  providers: number;
}

export interface Provider {
  id: string;
  name: string;
  category: ProviderCategory;
  logo: string;
  price: number;
  priceLabel: Record<Language, string>;
  rating: number;
  features: Record<Language, string[]>;
  url: string;
  offerUrl: string;
  lastUpdated: Date;
  isValidData?: boolean;
  validationStatus?: string;
  hasSpecificOffer?: boolean;
}

export interface ProviderData {
  name: string;
  price: number;
  offerUrl: string;
  lastUpdated: Date;
  features: Record<string, string | number>;
  logo?: string;
  rating?: number;
}

export interface ComparisonFilters {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy: 'price' | 'rating' | 'name';
  sortDirection: 'asc' | 'desc';
}

export interface AffiliateClick {
  provider_id: string;
  user_agent: string;
  referrer: string;
  timestamp: Date;
  target_url?: string;
}

export interface ErrorLog {
  id: string;
  provider: string;
  category: ProviderCategory;
  error_message: string;
  stack_trace?: string;
  timestamp: Date;
  resolved: boolean;
}

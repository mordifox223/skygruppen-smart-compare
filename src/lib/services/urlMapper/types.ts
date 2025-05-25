
export interface UrlTemplate {
  baseUrl: string;
  pattern: string;
  fallbackUrl: string;
  requiresProductId?: boolean;
  requiresSlug?: boolean;
  urlGenerator?: 'standard' | 'ice' | 'mycall' | 'talkmore' | 'onecall' | 'chilimobil' | 'happybytes' | 'plussmobil' | 'saga' | 'release';
}

export interface ProviderUrlTemplates {
  [providerName: string]: UrlTemplate;
}

export interface CategoryUrlTemplates {
  [category: string]: ProviderUrlTemplates;
}

export interface ProductInfo {
  id: string;
  name: string;
  provider_name: string;
  category: string;
  plan_name?: string;
  productId?: string;
  slug?: string;
  offer_url?: string;
  direct_link?: string;
  source_url?: string;
}


export interface ProviderConfig {
  id: string;
  provider_name: string;
  category: string;
  scrape_url: string;
  selectors?: {
    plan_selector?: string;
    name_selector?: string;
    price_selector?: string;
    link_selector?: string;
  };
  api_config?: {
    endpoint?: string;
    headers?: Record<string, string>;
    params?: Record<string, any>;
  };
  scrape_method: 'html' | 'api' | 'hybrid';
  is_enabled: boolean;
  last_successful_scrape?: string;
  consecutive_failures: number;
  needs_js?: boolean;
  url_generation_strategy?: string;
}

export interface ScrapingResult {
  provider_name: string;
  category: string;
  offers: ScrapedOffer[];
  success: boolean;
  error?: string;
  execution_time_ms: number;
  timestamp: string;
}

export interface ScrapedOffer {
  plan_name: string;
  monthly_price: number;
  offer_url: string;
  features?: Record<string, any>;
  data_allowance?: string;
  speed?: string;
  contract_length?: string;
}

export interface URLValidationResult {
  url: string;
  is_valid: boolean;
  status_code?: number;
  response_time_ms?: number;
  redirect_url?: string;
  error_message?: string;
}

export interface ScrapingJob {
  id: string;
  provider_name: string;
  category: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  offers_found: number;
  offers_updated: number;
  errors_count: number;
  started_at: string;
  completed_at?: string;
  error_details?: any;
}

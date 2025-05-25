
export interface BuifylOffer {
  id: string;
  provider_name: string;
  category: string;
  monthly_price: number;
  plan_name: string;
  product_id?: string;
  slug?: string;
  data_allowance?: string;
  speed?: string;
  contract_length?: string;
  features?: Record<string, any>;
  logo_url?: string;
  source_url: string;
  offer_url: string;
  direct_link?: string;
  manual_override_url?: string;
  scraped_at: string;
  is_active: boolean;
}

export interface SystemStatus {
  dataSources: any[];
  recentJobs: any[];
  lastUpdate: string | null;
  systemHealth: 'good' | 'degraded' | 'poor' | 'unknown';
}

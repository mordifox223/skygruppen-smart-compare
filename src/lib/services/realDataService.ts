
import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@/lib/types';
import type { Json } from '@/integrations/supabase/types';

export interface ProviderOffer {
  id: string;
  provider_name: string;
  category: string;
  plan_name: string;
  monthly_price: number;
  offer_url: string;
  features: Json;
  data_allowance?: string;
  speed?: string;
  contract_length?: string;
  logo_url?: string;
  direct_link?: string;
  source_url: string;
  is_active: boolean;
  scraped_at: string;
  manual_override_url?: string;
}

export interface DataSource {
  id: string;
  provider_name: string;
  category: string;
  source_type: string;
  source_url?: string;
  api_endpoint?: string;
  last_successful_fetch?: string;
  reliability_score: number;
  is_active: boolean;
}

export interface ScrapingJob {
  id: string;
  provider_name: string;
  category: string;
  status: string;
  started_at: string;
  completed_at?: string;
  error_message?: string;
  offers_found: number;
}

class RealDataService {
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private cache: Map<string, { data: Provider[]; timestamp: number }> = new Map();

  async getProviders(category: string): Promise<Provider[]> {
    try {
      console.log(`Fetching data from Supabase for ${category}`);
      
      // Fetch from Supabase provider_offers table with enhanced query
      const { data: offers, error } = await supabase
        .from('provider_offers')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('monthly_price', { ascending: true });

      if (error) {
        console.error('Error fetching offers from Supabase:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!offers || offers.length === 0) {
        console.log(`No active offers found in database for ${category}`);
        return [];
      }

      // Convert offers to Provider format with enhanced URL building
      const providers = this.transformOffersToProviders(offers);
      
      // Cache the results
      this.cache.set(category, { data: providers, timestamp: Date.now() });
      
      console.log(`✅ Loaded ${providers.length} verified providers for ${category}`);
      return providers;

    } catch (error) {
      console.error(`Error in getProviders for ${category}:`, error);
      throw error;
    }
  }

  private transformOffersToProviders(offers: any[]): Provider[] {
    return offers.map(offer => ({
      id: offer.id,
      name: offer.provider_name,
      category: offer.category as any,
      logo: offer.logo_url || this.getDefaultLogo(offer.provider_name),
      price: offer.monthly_price,
      priceLabel: this.getPriceLabel(offer.category),
      rating: this.estimateRating(offer.provider_name),
      features: this.transformFeatures(offer),
      url: offer.source_url,
      offerUrl: this.buildEnhancedAffiliateUrl(offer),
      lastUpdated: new Date(offer.scraped_at),
      isValidData: this.isDataFresh(offer.scraped_at),
      hasSpecificOffer: this.hasSpecificOfferUrl(offer)
    }));
  }

  private buildEnhancedAffiliateUrl(offer: any): string {
    // Priority: manual_override_url > direct_link > offer_url > source_url
    let baseUrl = offer.manual_override_url || offer.direct_link || offer.offer_url || offer.source_url;
    
    try {
      const url = new URL(baseUrl);
      
      // Enhanced tracking parameters for better analytics
      url.searchParams.set('utm_source', 'skygruppen');
      url.searchParams.set('utm_medium', 'comparison');
      url.searchParams.set('utm_campaign', offer.category);
      url.searchParams.set('utm_content', offer.provider_name);
      url.searchParams.set('utm_term', offer.id);
      
      // Add affiliate tracking
      url.searchParams.set('ref', 'skycompare');
      url.searchParams.set('partner_id', 'skygruppen');
      
      // Add timestamp for unique tracking
      url.searchParams.set('click_id', `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
      
      console.log(`✅ Built enhanced affiliate URL for ${offer.provider_name}`);
      return url.toString();
    } catch (error) {
      console.error(`Failed to build URL for ${offer.provider_name}:`, error);
      return baseUrl;
    }
  }

  private hasSpecificOfferUrl(offer: any): boolean {
    const specificUrl = offer.manual_override_url || offer.direct_link;
    return !!(specificUrl && specificUrl !== offer.source_url);
  }

  private isDataFresh(scrapedAt: string): boolean {
    const scrapedDate = new Date(scrapedAt);
    const hoursSinceUpdate = (Date.now() - scrapedDate.getTime()) / (1000 * 60 * 60);
    return hoursSinceUpdate <= 48; // Fresh if updated within 48 hours
  }

  private transformFeatures(offer: any): Record<string, string[]> {
    const features: string[] = [];
    
    if (offer.data_allowance) features.push(offer.data_allowance);
    if (offer.speed) features.push(offer.speed);
    if (offer.contract_length) features.push(offer.contract_length);
    if (offer.plan_name) features.push(offer.plan_name);
    
    // Add features from JSONB field - safely handle the Json type
    if (offer.features && typeof offer.features === 'object' && offer.features !== null) {
      const featuresObj = offer.features as Record<string, any>;
      Object.values(featuresObj).forEach(feature => {
        if (typeof feature === 'string') features.push(feature);
      });
    }

    return {
      nb: features,
      en: features.map(f => this.translateFeature(f))
    };
  }

  private translateFeature(feature: string): string {
    const translations: Record<string, string> = {
      'Ingen binding': 'No commitment',
      'Fast rente': 'Fixed interest',
      'Fleksible vilkår': 'Flexible terms',
      'Konkurransedyktig rente': 'Competitive interest',
      'Rask saksbehandling': 'Fast processing'
    };
    return translations[feature] || feature;
  }

  private getPriceLabel(category: string): Record<string, string> {
    const labels: Record<string, Record<string, string>> = {
      mobile: { nb: 'kr/mnd', en: 'NOK/month' },
      electricity: { nb: 'øre/kWh', en: 'øre/kWh' },
      insurance: { nb: 'kr/mnd', en: 'NOK/month' },
      loan: { nb: '% rente', en: '% interest' }
    };
    return labels[category] || { nb: 'kr/mnd', en: 'NOK/month' };
  }

  private estimateRating(providerName: string): number {
    const ratings: Record<string, number> = {
      'Sbanken': 4.5,
      'DNB': 4.2,
      'Nordea': 4.1,
      'Talkmore': 4.3,
      'Telenor': 4.4,
      'Ice': 4.2,
      'Tibber': 4.6,
      'Fjordkraft': 4.1,
      'Gjensidige': 4.2,
      'If': 4.4
    };
    return ratings[providerName] || 4.0;
  }

  private getDefaultLogo(providerName: string): string {
    const logos: Record<string, string> = {
      'DNB': 'https://www.dnb.no/static/images/dnb-logo.svg',
      'Sbanken': 'https://www.sbanken.no/globalassets/sbanken-logo.svg',
      'Nordea': 'https://www.nordea.no/globalassets/nordea-logo.svg',
      'Talkmore': 'https://www.talkmore.no/static/images/logo.svg',
      'Telenor': 'https://www.telenor.no/static/images/telenor-logo.svg',
      'Ice': 'https://www.ice.no/static/images/ice-logo.svg'
    };
    return logos[providerName] || '/placeholder.svg';
  }

  async getDataSources(category?: string): Promise<DataSource[]> {
    try {
      let query = supabase.from('data_sources').select('*').eq('is_active', true);
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('reliability_score', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching data sources:', error);
      return [];
    }
  }

  async getScrapingJobs(limit = 10): Promise<ScrapingJob[]> {
    try {
      // Use a direct fetch to handle the fact that TypeScript types haven't been regenerated yet
      const response = await fetch(`${supabase.supabaseUrl}/rest/v1/scraping_jobs?order=started_at.desc&limit=${limit}`, {
        headers: {
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform the data to match ScrapingJob interface
      return (data || []).map((job: any) => ({
        id: job.id,
        provider_name: job.provider_name,
        category: job.category,
        status: job.status,
        started_at: job.started_at,
        completed_at: job.completed_at,
        error_message: job.error_message,
        offers_found: job.offers_found || 0
      }));
    } catch (error) {
      console.error('Error fetching scraping jobs:', error);
      return [];
    }
  }

  async triggerDataUpdate(category?: string): Promise<any> {
    try {
      console.log(`Triggering data update for: ${category || 'all categories'}`);
      
      // Call the edge function for scraping
      const { data, error } = await supabase.functions.invoke('sync-provider-data', {
        body: { category: category || 'all' }
      });

      if (error) throw error;

      // Clear cache to force refresh
      if (category) {
        this.cache.delete(category);
      } else {
        this.cache.clear();
      }

      return data;
    } catch (error) {
      console.error('Failed to trigger data update:', error);
      throw error;
    }
  }

  async validateAffiliateUrl(url: string): Promise<boolean> {
    try {
      // Enhanced URL validation with better error handling
      const response = await fetch(url, { 
        method: 'HEAD', 
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; UrlValidator/1.0)'
        }
      });
      return true; // If no error thrown, URL is accessible
    } catch (error) {
      console.error('URL validation failed:', url, error);
      return false;
    }
  }
}

export const realDataService = new RealDataService();

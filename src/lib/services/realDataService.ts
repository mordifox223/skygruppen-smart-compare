
import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@/lib/types';

export interface ProviderOffer {
  id: string;
  provider_name: string;
  category: string;
  plan_name: string;
  monthly_price: number;
  offer_url: string;
  features: Record<string, any>;
  data_allowance?: string;
  speed?: string;
  contract_length?: string;
  logo_url?: string;
  direct_link?: string;
  source_url: string;
  is_active: boolean;
  scraped_at: string;
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
      // Check cache first
      const cached = this.cache.get(category);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log(`Using cached data for ${category}`);
        return cached.data;
      }

      console.log(`Fetching real data from Supabase for ${category}`);
      
      // Fetch from Supabase provider_offers table
      const { data: offers, error } = await supabase
        .from('provider_offers')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('monthly_price', { ascending: true });

      if (error) {
        console.error('Error fetching offers from Supabase:', error);
        // Fallback to static data if Supabase fails
        return this.getFallbackProviders(category);
      }

      if (!offers || offers.length === 0) {
        console.log(`No offers found in database for ${category}, using fallback`);
        return this.getFallbackProviders(category);
      }

      // Convert offers to Provider format
      const providers = this.transformOffersToProviders(offers);
      
      // Cache the results
      this.cache.set(category, { data: providers, timestamp: Date.now() });
      
      console.log(`Loaded ${providers.length} real providers for ${category}`);
      return providers;

    } catch (error) {
      console.error(`Error in getProviders for ${category}:`, error);
      return this.getFallbackProviders(category);
    }
  }

  private transformOffersToProviders(offers: ProviderOffer[]): Provider[] {
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
      offerUrl: offer.direct_link || offer.offer_url,
      lastUpdated: new Date(offer.scraped_at),
      isValidData: true,
      hasSpecificOffer: !!offer.direct_link
    }));
  }

  private transformFeatures(offer: ProviderOffer): Record<string, string[]> {
    const features: string[] = [];
    
    if (offer.data_allowance) features.push(offer.data_allowance);
    if (offer.speed) features.push(offer.speed);
    if (offer.contract_length) features.push(offer.contract_length);
    if (offer.plan_name) features.push(offer.plan_name);
    
    // Add features from JSONB field
    if (offer.features && typeof offer.features === 'object') {
      Object.values(offer.features).forEach(feature => {
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
    // Basic rating estimation based on provider reputation
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

  private getFallbackProviders(category: string): Provider[] {
    // Return minimal fallback data to show the site is working
    const fallbackData: Record<string, Provider[]> = {
      loan: [{
        id: 'fallback-loan-1',
        name: 'Datahenting pågår',
        category: 'loan',
        logo: '/placeholder.svg',
        price: 0,
        priceLabel: { nb: '% rente', en: '% interest' },
        rating: 0,
        features: {
          nb: ['Data hentes fra leverandører', 'Oppdateres automatisk daglig'],
          en: ['Data being fetched from providers', 'Updated automatically daily']
        },
        url: '#',
        offerUrl: '#',
        lastUpdated: new Date(),
        isValidData: false
      }]
    };
    
    return fallbackData[category] || [];
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
      const { data, error } = await supabase
        .from('scraping_jobs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
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
}

export const realDataService = new RealDataService();

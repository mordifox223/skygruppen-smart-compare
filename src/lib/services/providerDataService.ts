import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@/lib/types';

class ProviderDataService {
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private cache: Map<string, { data: Provider[]; timestamp: number }> = new Map();

  async getProviders(category: string): Promise<Provider[]> {
    try {
      console.log(`Getting providers for ${category} from Buifyl Shop - no fallbacks`);
      
      // Check cache first
      const cached = this.cache.get(category);
      if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
        console.log(`Using cached data for ${category}: ${cached.data.length} providers`);
        return cached.data;
      }
      
      // Fetch exclusively from Buifyl Shop provider_offers table
      const { data: offers, error } = await supabase
        .from('provider_offers')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('monthly_price', { ascending: true });

      if (error) {
        console.error('Error fetching from Buifyl Shop:', error);
        return [];
      }

      if (!offers || offers.length === 0) {
        console.log(`No products found in Buifyl Shop for ${category}`);
        return [];
      }

      // Transform Buifyl Shop data to Provider format
      const providers = this.transformBuifylDataToProviders(offers);
      
      // Cache the results
      this.cache.set(category, { data: providers, timestamp: Date.now() });
      
      console.log(`✅ Loaded ${providers.length} products from Buifyl Shop for ${category}`);
      return providers;

    } catch (error) {
      console.error(`Error fetching from Buifyl Shop for ${category}:`, error);
      return [];
    }
  }

  async validateAffiliateUrls(category: string): Promise<{ url: string; valid: boolean }[]> {
    try {
      // Get all affiliate URLs for the category
      const { data: offers, error } = await supabase
        .from('provider_offers')
        .select('offer_url, direct_link, source_url')
        .eq('category', category)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching URLs for validation:', error);
        return [];
      }

      const urlsToValidate = offers?.map(offer => offer.direct_link || offer.offer_url || offer.source_url).filter(Boolean) || [];
      
      // Validate each URL
      const results = await Promise.all(
        urlsToValidate.map(async (url: string) => {
          try {
            const response = await fetch(url, { 
              method: 'HEAD', 
              mode: 'no-cors',
              cache: 'no-cache'
            });
            return { url, valid: response.ok };
          } catch (error) {
            return { url, valid: false };
          }
        })
      );

      return results;
    } catch (error) {
      console.error('Error validating affiliate URLs:', error);
      return [];
    }
  }

  private transformBuifylDataToProviders(offers: any[]): Provider[] {
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
      offerUrl: this.buildBuifylAffiliateUrl(offer),
      lastUpdated: new Date(offer.scraped_at),
      isValidData: this.isDataFresh(offer.scraped_at),
      hasSpecificOffer: !!(offer.direct_link || offer.manual_override_url)
    }));
  }

  private buildBuifylAffiliateUrl(offer: any): string {
    // Use Buifyl Shop's affiliate URL with our tracking
    let baseUrl = offer.direct_link || offer.offer_url || offer.source_url;
    
    try {
      const url = new URL(baseUrl);
      
      // Add Buifyl Shop tracking parameters
      url.searchParams.set('utm_source', 'skygruppen');
      url.searchParams.set('utm_medium', 'buifyl_shop');
      url.searchParams.set('utm_campaign', offer.category);
      url.searchParams.set('utm_content', offer.provider_name);
      url.searchParams.set('buifyl_product_id', offer.id);
      
      // Add unique click tracking
      url.searchParams.set('click_id', `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
      
      return url.toString();
    } catch (error) {
      console.error(`Failed to build Buifyl URL for ${offer.provider_name}:`, error);
      return baseUrl;
    }
  }

  private isDataFresh(scrapedAt: string): boolean {
    const scrapedDate = new Date(scrapedAt);
    const hoursSinceUpdate = (Date.now() - scrapedDate.getTime()) / (1000 * 60 * 60);
    return hoursSinceUpdate <= 48; // Fresh if updated within 48 hours
  }

  private transformFeatures(offer: any): Record<string, string[]> {
    const features: string[] = [];
    
    // Extract features from Buifyl Shop product data
    if (offer.data_allowance) features.push(offer.data_allowance);
    if (offer.speed) features.push(offer.speed);
    if (offer.contract_length) features.push(offer.contract_length);
    if (offer.plan_name) features.push(offer.plan_name);
    
    // Add features from JSONB field
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
      power: { nb: 'øre/kWh', en: 'øre/kWh' },
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

  async getSystemStatus(): Promise<any> {
    try {
      // Get data from Buifyl Shop system
      const [dataSources, recentJobs] = await Promise.all([
        this.getDataSources(),
        this.getScrapingJobs(5)
      ]);

      return {
        dataSources,
        recentJobs,
        lastUpdate: recentJobs[0]?.completed_at || null,
        systemHealth: this.calculateSystemHealth(dataSources, recentJobs)
      };
    } catch (error) {
      console.error('Error getting Buifyl Shop system status:', error);
      return {
        dataSources: [],
        recentJobs: [],
        lastUpdate: null,
        systemHealth: 'unknown'
      };
    }
  }

  private calculateSystemHealth(dataSources: any[], recentJobs: any[]): string {
    const recentFailures = recentJobs.filter(job => job.status === 'failed').length;
    const totalSources = dataSources.length;
    const activeSources = dataSources.filter(source => source.is_active).length;
    
    if (recentFailures > 2) return 'poor';
    if (activeSources < totalSources * 0.8) return 'degraded';
    return 'good';
  }

  private async getDataSources(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('data_sources')
        .select('*')
        .eq('is_active', true)
        .order('reliability_score', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching data sources:', error);
      return [];
    }
  }

  private async getScrapingJobs(limit = 10): Promise<any[]> {
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

  // Enhanced affiliate click logging for Buifyl Shop
  async logAffiliateClick(providerId: string, providerName: string, category: string, targetUrl: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('affiliate_clicks')
        .insert({
          provider_id: providerId,
          provider_name: providerName,
          category: category,
          url: targetUrl,
          user_agent: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to log Buifyl Shop affiliate click:', error);
      } else {
        console.log('✅ Buifyl Shop affiliate click logged:', {
          provider: providerName,
          category,
          url: targetUrl
        });
      }
    } catch (error) {
      console.error('Error logging Buifyl Shop affiliate click:', error);
    }
  }
}

export const providerDataService = new ProviderDataService();

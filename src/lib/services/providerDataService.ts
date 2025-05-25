
import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@/lib/types';
import { getMobileProviders } from '@/lib/data/mobileProviders';

export interface ProviderOffer {
  id: string;
  provider_name: string;
  category: string;
  plan_name: string;
  monthly_price: number;
  offer_url: string;
  features: any;
  data_allowance?: string;
  speed?: string;
  contract_length?: string;
  logo_url?: string;
  direct_link?: string;
  is_active: boolean;
  last_updated: string;
  data_updated_at: string;
  validation_status: string;
}

class ProviderDataService {
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

      // Try to fetch from Supabase first
      const scrapedProviders = await this.fetchScrapedProviders(category);
      
      if (scrapedProviders.length > 0) {
        console.log(`Using scraped data for ${category}: ${scrapedProviders.length} providers`);
        this.cache.set(category, { data: scrapedProviders, timestamp: Date.now() });
        return scrapedProviders;
      }

      // Fallback to static data
      console.log(`Using fallback static data for ${category}`);
      const staticProviders = this.getStaticProviders(category);
      this.cache.set(category, { data: staticProviders, timestamp: Date.now() });
      return staticProviders;

    } catch (error) {
      console.error(`Error fetching providers for ${category}:`, error);
      
      // Return static data as final fallback
      const staticProviders = this.getStaticProviders(category);
      return staticProviders;
    }
  }

  async fetchScrapedProviders(category: string): Promise<Provider[]> {
    const { data: offers, error } = await supabase
      .from('provider_offers')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('data_updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching scraped providers:', error);
      return [];
    }

    if (!offers || offers.length === 0) {
      console.log(`No scraped data found for category: ${category}`);
      return [];
    }

    // Convert ProviderOffer to Provider format
    return this.convertOffersToProviders(offers);
  }

  private convertOffersToProviders(offers: ProviderOffer[]): Provider[] {
    // Group offers by provider name
    const providerMap = new Map<string, ProviderOffer[]>();
    
    offers.forEach(offer => {
      const existing = providerMap.get(offer.provider_name) || [];
      existing.push(offer);
      providerMap.set(offer.provider_name, existing);
    });

    const providers: Provider[] = [];

    providerMap.forEach((providerOffers, providerName) => {
      // Use the best/most recent offer as the primary one
      const primaryOffer = providerOffers[0];
      
      providers.push({
        id: providerName.toLowerCase().replace(/\s+/g, ''),
        name: providerName,
        category: primaryOffer.category as any,
        logo: primaryOffer.logo_url || this.getDefaultLogo(providerName),
        price: primaryOffer.monthly_price,
        priceLabel: {
          nb: primaryOffer.category === 'loan' ? '% rente' : 'per måned',
          en: primaryOffer.category === 'loan' ? '% interest' : 'per month'
        },
        rating: this.getDefaultRating(providerName),
        features: primaryOffer.features || { nb: [], en: [] },
        url: this.getProviderBaseUrl(providerName),
        offerUrl: primaryOffer.offer_url,
        lastUpdated: new Date(primaryOffer.data_updated_at),
        isValidData: true,
        validationStatus: primaryOffer.validation_status,
        hasSpecificOffer: !!primaryOffer.direct_link
      });
    });

    return providers;
  }

  private getStaticProviders(category: string): Provider[] {
    switch (category) {
      case 'mobile':
        return getMobileProviders();
      case 'electricity':
      case 'insurance':
      case 'loan':
        // Return empty array for now - these will be populated by scraper
        return [];
      default:
        return [];
    }
  }

  private getDefaultLogo(providerName: string): string {
    const logoMap: { [key: string]: string } = {
      'Talkmore': 'https://www.talkmore.no/assets/brands/talkmore/logos/logo.svg',
      'Telenor': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Telenor_logo.svg/320px-Telenor_logo.svg.png',
      'Telia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Telia_Company_Logo.svg/320px-Telia_Company_Logo.svg.png',
      'Ice': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Ice_logo_2018.svg/320px-Ice_logo_2018.svg.png',
      'OneCall': 'https://www.onecall.no/catalystimages/onecall-digital-v2/img/logo.svg',
      'Happybytes': 'https://happybytes.no/wp-content/themes/happybytes/img/happybytes-logo.svg',
      'Chili Mobil': 'https://chilimobil.no/images/logo.svg',
      'Fjordkraft': 'https://www.fjordkraft.no/assets/images/fjordkraft-logo.svg',
      'Gjensidige': 'https://www.gjensidige.no/static/images/gjensidige-logo.svg',
      'DNB': 'https://www.dnb.no/static/images/dnb-logo.svg'
    };
    
    return logoMap[providerName] || '/placeholder.svg';
  }

  private getDefaultRating(providerName: string): number {
    const ratingMap: { [key: string]: number } = {
      'Talkmore': 4.3,
      'Telenor': 4.0,
      'Telia': 4.2,
      'Ice': 4.3,
      'OneCall': 4.5,
      'Happybytes': 4.4,
      'Chili Mobil': 4.0,
      'Fjordkraft': 4.1,
      'Gjensidige': 4.2,
      'DNB': 4.0
    };
    
    return ratingMap[providerName] || 4.0;
  }

  private getProviderBaseUrl(providerName: string): string {
    const urlMap: { [key: string]: string } = {
      'Talkmore': 'https://www.talkmore.no',
      'Telenor': 'https://www.telenor.no',
      'Telia': 'https://www.telia.no',
      'Ice': 'https://www.ice.no',
      'OneCall': 'https://www.onecall.no',
      'Happybytes': 'https://happybytes.no',
      'Chili Mobil': 'https://chilimobil.no',
      'Fjordkraft': 'https://www.fjordkraft.no',
      'Gjensidige': 'https://www.gjensidige.no',
      'DNB': 'https://www.dnb.no'
    };
    
    return urlMap[providerName] || '#';
  }

  async triggerScraping(category?: string): Promise<any> {
    try {
      const response = await supabase.functions.invoke('scrape-providers', {
        body: { category }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Clear cache to force refresh
      if (category) {
        this.cache.delete(category);
      } else {
        this.cache.clear();
      }

      return response.data;
    } catch (error) {
      console.error('Failed to trigger scraping:', error);
      throw error;
    }
  }
}

export const providerDataService = new ProviderDataService();

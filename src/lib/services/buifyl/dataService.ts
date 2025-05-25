
import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@/lib/types';
import { BuifylOffer } from './types';
import { BuifylTransformer } from './transformer';
import { BuifylSystemMonitor } from './systemMonitor';
import { BuifylAffiliateTracker } from './affiliateTracker';

export class BuifylDataService {
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private cache: Map<string, { data: Provider[]; timestamp: number }> = new Map();
  private systemMonitor = new BuifylSystemMonitor();
  private affiliateTracker = new BuifylAffiliateTracker();

  async getProviders(category: string): Promise<Provider[]> {
    try {
      console.log(`🔍 Getting providers for ${category} from Buifyl Shop - no fallbacks`);
      
      const cached = this.cache.get(category);
      if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
        console.log(`📦 Using cached data for ${category}: ${cached.data.length} providers`);
        return cached.data;
      }
      
      console.log(`🌐 Fetching fresh data from Supabase for category: ${category}`);
      
      const { data: offers, error } = await supabase
        .from('provider_offers')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('monthly_price', { ascending: true });

      console.log(`📊 Supabase response:`, { 
        error: error ? error.message : 'No error',
        dataCount: offers?.length || 0,
        category,
        firstOffer: offers?.[0] || 'No offers'
      });

      if (error) {
        console.error('❌ Error fetching from Buifyl Shop:', error);
        return [];
      }

      if (!offers || offers.length === 0) {
        console.log(`📭 No products found in Buifyl Shop for ${category}`);
        
        // Let's also check if there are ANY offers in the database
        const { data: allOffers, error: countError } = await supabase
          .from('provider_offers')
          .select('category, is_active, provider_name', { count: 'exact' });
        
        console.log(`🔍 Database contains:`, {
          totalOffers: allOffers?.length || 0,
          categories: [...new Set(allOffers?.map(o => o.category) || [])],
          activeOffers: allOffers?.filter(o => o.is_active).length || 0,
          sampleOffers: allOffers?.slice(0, 3) || []
        });
        
        return [];
      }

      const providers = BuifylTransformer.transformOffersToProviders(offers as BuifylOffer[]);
      
      this.cache.set(category, { data: providers, timestamp: Date.now() });
      
      console.log(`✅ Successfully loaded ${providers.length} products from Buifyl Shop for ${category}`);
      return providers;

    } catch (error) {
      console.error(`💥 Unexpected error fetching from Buifyl Shop for ${category}:`, error);
      return [];
    }
  }

  async validateAffiliateUrls(category: string) {
    return this.systemMonitor.validateAffiliateUrls(category);
  }

  async getSystemStatus() {
    return this.systemMonitor.getSystemStatus();
  }

  async logAffiliateClick(providerId: string, providerName: string, category: string, targetUrl: string) {
    return this.affiliateTracker.logAffiliateClick(providerId, providerName, category, targetUrl);
  }
}

export const buifylDataService = new BuifylDataService();

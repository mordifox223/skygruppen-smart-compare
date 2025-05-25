
import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@/lib/types';
import { getMobileProviders } from '@/lib/data/mobileProviders';

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

      // For now, return static data since the scraping infrastructure is still being set up
      console.log(`Using static data for ${category}`);
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

  private getStaticProviders(category: string): Provider[] {
    switch (category) {
      case 'mobile':
        return getMobileProviders();
      case 'electricity':
      case 'insurance':
      case 'loan':
        // Return empty array for now - these will be populated by scraper later
        return [];
      default:
        return [];
    }
  }

  async triggerScraping(category?: string): Promise<any> {
    try {
      console.log(`Triggering scraping for category: ${category || 'all'}`);
      
      // For now, simulate a successful scraping operation
      // In the future, this will call the actual edge function
      const result = {
        success: true,
        message: 'Scraping initiated successfully',
        scrapedCount: 0,
        category: category || 'all'
      };

      // Clear cache to force refresh
      if (category) {
        this.cache.delete(category);
      } else {
        this.cache.clear();
      }

      // Simulate some delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Scraping result:', result);
      return result;
    } catch (error) {
      console.error('Failed to trigger scraping:', error);
      throw error;
    }
  }
}

export const providerDataService = new ProviderDataService();


import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@/lib/types';
import { realDataService } from './realDataService';
import { getMobileProviders } from '@/lib/data/mobileProviders';
import { getElectricityProviders } from '@/lib/data/electricityProviders';
import { getInsuranceProviders } from '@/lib/data/insuranceProviders';
import { getLoanProviders } from '@/lib/data/loanProviders';

class ProviderDataService {
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private cache: Map<string, { data: Provider[]; timestamp: number }> = new Map();

  async getProviders(category: string): Promise<Provider[]> {
    try {
      console.log(`Getting providers for ${category} using real data service`);
      
      // Try to get real data from Supabase first
      const realProviders = await realDataService.getProviders(category);
      
      if (realProviders.length > 0) {
        console.log(`Using real data for ${category}: ${realProviders.length} providers`);
        return realProviders;
      }
      
      // Only use static data if no real data AND database is empty
      console.log(`No data found for ${category}, checking if database is empty`);
      const { data: totalOffers } = await supabase
        .from('provider_offers')
        .select('id', { count: 'exact' })
        .limit(1);
      
      if (!totalOffers || totalOffers.length === 0) {
        console.log(`Database is empty, using static data for ${category}`);
        const staticProviders = this.getStaticProviders(category);
        return staticProviders.map(provider => ({
          ...provider,
          isValidData: false,
          validationStatus: 'Midlertidig data - systemet settes opp'
        }));
      }
      
      // Database has data but this category doesn't - return empty
      console.log(`Category ${category} has no data available`);
      return [];

    } catch (error) {
      console.error(`Error in getProviders for ${category}:`, error);
      
      // Only fallback on actual errors, not empty data
      const staticProviders = this.getStaticProviders(category);
      return staticProviders.map(provider => ({
        ...provider,
        isValidData: false,
        validationStatus: 'Feil ved henting av data - midlertidig backup'
      }));
    }
  }

  private getStaticProviders(category: string): Provider[] {
    switch (category) {
      case 'mobile':
        return getMobileProviders();
      case 'electricity':
        return getElectricityProviders();
      case 'insurance':
        return getInsuranceProviders();
      case 'loan':
        return getLoanProviders();
      default:
        return [];
    }
  }

  async triggerScraping(category?: string): Promise<any> {
    try {
      console.log(`Triggering data update for category: ${category || 'all'}`);
      
      const result = await realDataService.triggerDataUpdate(category);

      // Clear cache to force refresh
      if (category) {
        this.cache.delete(category);
      } else {
        this.cache.clear();
      }

      console.log('Data update result:', result);
      return result;
    } catch (error) {
      console.error('Failed to trigger data update:', error);
      throw error;
    }
  }

  async getSystemStatus(): Promise<any> {
    try {
      const [dataSources, recentJobs] = await Promise.all([
        realDataService.getDataSources(),
        realDataService.getScrapingJobs(5)
      ]);

      return {
        dataSources,
        recentJobs,
        lastUpdate: recentJobs[0]?.completed_at || null,
        systemHealth: this.calculateSystemHealth(dataSources, recentJobs)
      };
    } catch (error) {
      console.error('Error getting system status:', error);
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

  // New method to log affiliate clicks to Supabase
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
          ip_address: null, // Will be set by Supabase/server
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to log affiliate click:', error);
      } else {
        console.log('Affiliate click logged successfully');
      }
    } catch (error) {
      console.error('Error logging affiliate click:', error);
    }
  }
}

export const providerDataService = new ProviderDataService();


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
      console.log(`Getting providers for ${category} using enhanced data service`);
      
      // Try to get real data from Supabase first
      const realProviders = await realDataService.getProviders(category);
      
      if (realProviders.length > 0) {
        console.log(`Using real data for ${category}: ${realProviders.length} providers`);
        return this.enhanceProvidersWithValidation(realProviders);
      }
      
      // Check if database has any data at all before using fallback
      console.log(`No data found for ${category}, checking database status`);
      const { data: totalOffers, error } = await supabase
        .from('provider_offers')
        .select('id', { count: 'exact' })
        .limit(1);
      
      if (error) {
        console.error('Database connection error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      // Only use fallback if database is completely empty
      if (!totalOffers || totalOffers.length === 0) {
        console.log(`Database is empty, using temporary fallback for ${category}`);
        const staticProviders = this.getStaticProviders(category);
        return staticProviders.map(provider => ({
          ...provider,
          isValidData: false,
          validationStatus: 'Temporary data - system being set up'
        }));
      }
      
      // Database has data but this category doesn't - return empty state
      console.log(`Category ${category} has no offers available in database`);
      return [];

    } catch (error) {
      console.error(`Critical error in getProviders for ${category}:`, error);
      
      // Only fallback on connection errors, not empty data
      const staticProviders = this.getStaticProviders(category);
      return staticProviders.map(provider => ({
        ...provider,
        isValidData: false,
        validationStatus: 'Connection error - using backup data'
      }));
    }
  }

  private async enhanceProvidersWithValidation(providers: Provider[]): Promise<Provider[]> {
    return providers.map(provider => {
      // Check if data is fresh (within 48 hours)
      const hoursSinceUpdate = provider.lastUpdated 
        ? (Date.now() - new Date(provider.lastUpdated).getTime()) / (1000 * 60 * 60)
        : 999;
      
      const isDataFresh = hoursSinceUpdate <= 48;
      
      return {
        ...provider,
        isValidData: isDataFresh,
        validationStatus: isDataFresh ? 'current' : `Last updated ${Math.floor(hoursSinceUpdate)} hours ago`,
        hasSpecificOffer: !!(provider.offerUrl && provider.offerUrl !== provider.url)
      };
    });
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

  // Enhanced affiliate click logging with proper error handling
  async logAffiliateClick(providerId: string, providerName: string, category: string, targetUrl: string): Promise<void> {
    try {
      // Use type assertion to handle the TypeScript issue temporarily
      const { error } = await (supabase as any)
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
        console.error('Failed to log affiliate click:', error);
      } else {
        console.log('✅ Affiliate click logged successfully:', {
          provider: providerName,
          category,
          url: targetUrl
        });
        
        // Also trigger Google Analytics event if available
        if (typeof gtag !== 'undefined') {
          gtag('event', 'affiliate_click', {
            event_category: 'engagement',
            event_label: providerName,
            custom_parameter_1: category,
            custom_parameter_2: targetUrl
          });
        }
      }
    } catch (error) {
      console.error('Error logging affiliate click:', error);
    }
  }

  // Validate all affiliate URLs for a category
  async validateAffiliateUrls(category: string): Promise<{ provider: string; url: string; valid: boolean }[]> {
    try {
      const providers = await this.getProviders(category);
      const results = [];
      
      for (const provider of providers) {
        const isValid = await this.testUrl(provider.offerUrl || provider.url);
        results.push({
          provider: provider.name,
          url: provider.offerUrl || provider.url,
          valid: isValid
        });
      }
      
      return results;
    } catch (error) {
      console.error('Error validating affiliate URLs:', error);
      return [];
    }
  }

  private async testUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { 
        method: 'HEAD', 
        mode: 'no-cors',
        cache: 'no-cache'
      });
      return true; // If no error is thrown, URL is accessible
    } catch (error) {
      console.error(`URL validation failed for ${url}:`, error);
      return false;
    }
  }
}

export const providerDataService = new ProviderDataService();

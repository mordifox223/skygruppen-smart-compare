
import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@/lib/types';
import { realDataService } from './realDataService';

class ProviderDataService {
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private cache: Map<string, { data: Provider[]; timestamp: number }> = new Map();

  async getProviders(category: string): Promise<Provider[]> {
    try {
      console.log(`Getting providers for ${category} - database only, no fallbacks`);
      
      // Check cache first
      const cached = this.cache.get(category);
      if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
        console.log(`Using cached data for ${category}: ${cached.data.length} providers`);
        return cached.data;
      }
      
      // Only get real data from Supabase - no fallbacks at all
      const realProviders = await realDataService.getProviders(category);
      
      if (realProviders.length > 0) {
        console.log(`Using database data for ${category}: ${realProviders.length} providers`);
        const enhancedProviders = this.enhanceProvidersWithValidation(realProviders);
        
        // Cache the results
        this.cache.set(category, { data: enhancedProviders, timestamp: Date.now() });
        
        return enhancedProviders;
      }
      
      // If no data in database, return empty array - no fallbacks
      console.log(`No scraped data found for ${category} in database`);
      return [];

    } catch (error) {
      console.error(`Error in getProviders for ${category}:`, error);
      return [];
    }
  }

  private enhanceProvidersWithValidation(providers: Provider[]): Provider[] {
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
        console.error('Failed to log affiliate click:', error);
      } else {
        console.log('✅ Affiliate click logged successfully:', {
          provider: providerName,
          category,
          url: targetUrl
        });
        
        // Also trigger Google Analytics event if available
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'affiliate_click', {
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

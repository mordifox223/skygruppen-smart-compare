
import { supabase } from '@/integrations/supabase/client';
import { SystemStatus } from './types';

export class BuifylSystemMonitor {
  async getSystemStatus(): Promise<SystemStatus> {
    try {
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

  async validateAffiliateUrls(category: string): Promise<{ url: string; valid: boolean }[]> {
    try {
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

  private calculateSystemHealth(dataSources: any[], recentJobs: any[]): 'good' | 'degraded' | 'poor' | 'unknown' {
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
      // Use direct fetch with hardcoded URLs to avoid protected property issues
      const response = await fetch(`https://odemfyuwaasfhtpnkhei.supabase.co/rest/v1/scraping_jobs?order=started_at.desc&limit=${limit}`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kZW1meXV3YWFzZmh0cG5raGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MjEzMjEsImV4cCI6MjA2MzM5NzMyMX0.4ENgLVH543zNpaea295oDXNioIU4v0YPU17csJSel74',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kZW1meXV3YWFzZmh0cG5raGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MjEzMjEsImV4cCI6MjA2MzM5NzMyMX0.4ENgLVH543zNpaea295oDXNioIU4v0YPU17csJSel74`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data || [];
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching scraping jobs:', error);
      return [];
    }
  }
}

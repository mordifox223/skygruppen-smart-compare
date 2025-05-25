
import { supabase } from '@/integrations/supabase/client';

export interface AffiliateClickData {
  provider_id: string;
  provider_name: string;
  category: string;
  url: string;
  user_agent?: string;
  referrer?: string;
  ip_address?: string;
}

class AffiliateClickService {
  async logAffiliateClick(
    providerId: string, 
    providerName: string, 
    category: string, 
    targetUrl: string
  ): Promise<void> {
    try {
      console.log(`🔗 Logging affiliate click for ${providerName}`);
      
      const clickData: AffiliateClickData = {
        provider_id: providerId,
        provider_name: providerName,
        category: category,
        url: targetUrl,
        user_agent: navigator.userAgent,
        referrer: document.referrer || undefined,
        // ip_address will be null as we can't get real IP from frontend
        ip_address: undefined
      };

      const { error } = await supabase
        .from('affiliate_clicks')
        .insert(clickData);

      if (error) {
        console.error('Failed to log affiliate click:', error);
        // Don't throw error to avoid blocking the redirect
      } else {
        console.log('✅ Affiliate click logged successfully:', {
          provider: providerName,
          category,
          url: targetUrl
        });
      }
    } catch (error) {
      console.error('Error logging affiliate click:', error);
      // Don't throw error to avoid blocking the redirect
    }
  }

  // Get click analytics (optional bonus feature)
  async getClickAnalytics(category?: string): Promise<any[]> {
    try {
      let query = supabase
        .from('affiliate_clicks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.limit(100);
      
      if (error) {
        console.error('Error fetching click analytics:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getClickAnalytics:', error);
      return [];
    }
  }
}

export const affiliateClickService = new AffiliateClickService();

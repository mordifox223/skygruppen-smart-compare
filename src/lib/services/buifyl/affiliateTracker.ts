
import { supabase } from '@/integrations/supabase/client';

export class BuifylAffiliateTracker {
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

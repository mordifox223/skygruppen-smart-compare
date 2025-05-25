
import { supabase } from '@/integrations/supabase/client';

export interface BuifylProduct {
  id: string;
  provider_name: string;
  category: 'mobile' | 'electricity' | 'insurance' | 'loan';
  monthly_price: number;
  plan_name: string;
  features: {
    nb: string[];
    en: string[];
  };
  offer_url: string;
  source_url: string;
  data_allowance?: string;
  speed?: string;
  contract_length?: string;
  logo_url?: string;
  is_active: boolean;
  scraped_at: string;
  updated_at: string;
}

export const fetchBuifylProducts = async (category: string): Promise<BuifylProduct[]> => {
  try {
    console.log(`🔍 Fetching Buifyl products for category: ${category}`);
    
    const { data, error } = await supabase
      .from('provider_offers')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('monthly_price', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log(`✅ Found ${data?.length || 0} products for ${category}`);
    
    // Transform to match BuifylProduct interface
    const transformedData = (data || []).map(item => ({
      ...item,
      features: item.features?.features || { nb: [], en: [] }
    }));

    return transformedData;
  } catch (error) {
    console.error(`❌ Error fetching ${category} products:`, error);
    return [];
  }
};

export const logAffiliateClick = async (productId: string, providerName: string, category: string, targetUrl: string) => {
  try {
    const { error } = await supabase
      .from('affiliate_clicks')
      .insert([{ 
        provider_id: productId,
        provider_name: providerName,
        category: category,
        url: targetUrl,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      }]);

    if (error) {
      console.error('Failed to log affiliate click:', error);
    } else {
      console.log('✅ Affiliate click logged:', { provider: providerName, category });
    }
  } catch (error) {
    console.error('Error logging affiliate click:', error);
  }
};

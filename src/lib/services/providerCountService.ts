
import { supabase } from '@/integrations/supabase/client';

export interface ProviderCounts {
  mobile: number;
  electricity: number;
  insurance: number;
  loan: number;
  total: number;
}

export const getProviderCounts = async (): Promise<ProviderCounts> => {
  try {
    const categories = ['mobile', 'electricity', 'insurance', 'loan'];
    const counts: ProviderCounts = {
      mobile: 0,
      electricity: 0,
      insurance: 0,
      loan: 0,
      total: 0
    };

    // Get unique provider counts for each category
    for (const category of categories) {
      const { data, error } = await supabase
        .from('provider_offers')
        .select('provider_name')
        .eq('category', category)
        .eq('is_active', true);

      if (!error && data) {
        // Count unique providers
        const uniqueProviders = new Set(data.map(offer => offer.provider_name));
        counts[category as keyof Omit<ProviderCounts, 'total'>] = uniqueProviders.size;
      }
    }

    // Calculate total unique providers across all categories
    const { data: allData, error: allError } = await supabase
      .from('provider_offers')
      .select('provider_name')
      .eq('is_active', true);

    if (!allError && allData) {
      const allUniqueProviders = new Set(allData.map(offer => offer.provider_name));
      counts.total = allUniqueProviders.size;
    }

    console.log('📊 Provider counts:', counts);
    return counts;
  } catch (error) {
    console.error('Failed to get provider counts:', error);
    return {
      mobile: 0,
      electricity: 0,
      insurance: 0,
      loan: 0,
      total: 0
    };
  }
};

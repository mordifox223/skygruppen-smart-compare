
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Provider } from '@/lib/types';

export interface ProviderOffer {
  id: string;
  provider_name: string;
  category: string;
  plan_name: string;
  monthly_price: number;
  data_allowance: string | null;
  speed: string | null;
  contract_length: string | null;
  offer_url: string;
  direct_link: string | null;
  logo_url: string | null;
  features: Record<string, any>;
  is_active: boolean;
  data_source: 'scraped' | 'api' | 'manual' | 'cached';
  last_scraped: string | null;
  last_updated: string;
}

export const useProviderOffers = (category?: string) => {
  return useQuery({
    queryKey: ['provider-offers', category],
    queryFn: async (): Promise<ProviderOffer[]> => {
      let query = supabase
        .from('provider_offers')
        .select('*')
        .eq('is_active', true)
        .order('monthly_price', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching provider offers:', error);
        throw error;
      }
      
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProviderOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (offer: Omit<ProviderOffer, 'id' | 'created_at' | 'last_updated'>) => {
      const { data, error } = await supabase
        .from('provider_offers')
        .insert([offer])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-offers'] });
    }
  });
};

export const useUpdateProviderOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProviderOffer> & { id: string }) => {
      const { data, error } = await supabase
        .from('provider_offers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-offers'] });
    }
  });
};

// Convert ProviderOffer to legacy Provider format for compatibility
export const convertToLegacyProvider = (offer: ProviderOffer): Provider => ({
  id: offer.id,
  name: offer.provider_name,
  category: offer.category as any,
  logo: offer.logo_url || '/placeholder.svg',
  price: offer.monthly_price,
  priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
  rating: 4.2, // Default rating
  features: {
    nb: Object.entries(offer.features).map(([key, value]) => `${key}: ${value}`),
    en: Object.entries(offer.features).map(([key, value]) => `${key}: ${value}`)
  },
  url: offer.offer_url,
  offerUrl: offer.direct_link || offer.offer_url,
  lastUpdated: new Date(offer.last_updated),
  isValidData: true
});

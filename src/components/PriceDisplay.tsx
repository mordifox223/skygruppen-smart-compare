
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Provider } from '@/lib/types';
import { useLanguage } from '@/lib/languageContext';
import { ClockIcon, AlertTriangleIcon } from 'lucide-react';
import { retry } from '@/lib/validation';

interface PriceDisplayProps {
  provider: Provider;
}

const fetchProviderPrice = async (providerId: string): Promise<{ price: number; lastUpdated: string }> => {
  // In production, this would fetch from Supabase
  const response = await fetch(`/api/prices/${providerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch price');
  }
  return response.json();
};

const PriceDisplay: React.FC<PriceDisplayProps> = ({ provider }) => {
  const { language } = useLanguage();
  
  const { data, error, isLoading, isStale } = useQuery({
    queryKey: ['price', provider.id],
    queryFn: () => retry(() => fetchProviderPrice(provider.id), 3),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: (failureCount) => failureCount < 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading) {
    return (
      <div className="bg-slate-50 p-4 rounded-lg animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-24"></div>
      </div>
    );
  }

  if (error) {
    console.log(`Price fetch error for ${provider.name}:`, error);
    return (
      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
        <div className="flex items-center text-orange-600 mb-1">
          <AlertTriangleIcon className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {language === 'nb' ? 'Bruker cache' : 'Using cache'}
          </span>
        </div>
        <span className="text-sky-600 font-bold text-lg">
          {provider.price} <span className="text-sm font-normal">{provider.priceLabel[language]}</span>
        </span>
      </div>
    );
  }

  const currentPrice = data?.price ?? provider.price;
  const isUsingFallback = !data;

  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      {isStale && (
        <div className="flex items-center text-orange-500 mb-1">
          <ClockIcon className="w-4 h-4 mr-1" />
          <span className="text-xs">
            {language === 'nb' ? 'Oppdaterer...' : 'Updating...'}
          </span>
        </div>
      )}
      
      <span className="text-sky-600 font-bold text-lg">
        {currentPrice} <span className="text-sm font-normal">{provider.priceLabel[language]}</span>
      </span>
      
      {isUsingFallback && (
        <div className="text-xs text-gray-500 mt-1">
          {language === 'nb' ? 'Sist oppdatert' : 'Last updated'}: {new Date(provider.lastUpdated || Date.now()).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;


import { Provider } from '../types';

export interface ComparisonCriteria {
  priceWeight: number;
  featureWeight: number;
  ratingWeight: number;
}

export interface RankedProvider extends Provider {
  score: number;
  ranking: number;
  valuePerUnit?: number;
  keyFeatures: string[];
}

// Mobile-specific comparison logic
export const calculateMobileScore = (provider: Provider, criteria: ComparisonCriteria = {
  priceWeight: 0.4,
  featureWeight: 0.4,
  ratingWeight: 0.2
}): number => {
  // Extract data allowance for value calculation
  const features = provider.features.nb || provider.features.en;
  const dataFeature = features.find(f => f.toLowerCase().includes('gb') || f.toLowerCase().includes('data'));
  let dataAmount = 0;
  
  if (dataFeature?.toLowerCase().includes('ubegrenset') || dataFeature?.toLowerCase().includes('unlimited')) {
    dataAmount = 1000; // Treat unlimited as 1000GB for comparison
  } else if (dataFeature) {
    const match = dataFeature.match(/(\d+)\s*gb/i);
    if (match) dataAmount = parseInt(match[1]);
  }

  // Calculate scores (0-100 scale)
  const priceScore = Math.max(0, 100 - (provider.price / 5)); // Lower price = higher score
  const valueScore = dataAmount > 0 ? Math.min(100, (dataAmount / provider.price) * 1000) : 0;
  const ratingScore = (provider.rating / 5) * 100;
  
  // Has 5G network?
  const has5G = features.some(f => f.toLowerCase().includes('5g'));
  const hasUnlimitedCalls = features.some(f => 
    f.toLowerCase().includes('fri ring') || f.toLowerCase().includes('unlimited calls')
  );
  const hasEuropeRoaming = features.some(f => 
    f.toLowerCase().includes('eu') || f.toLowerCase().includes('roaming')
  );
  
  const featureScore = (has5G ? 30 : 0) + (hasUnlimitedCalls ? 25 : 0) + (hasEuropeRoaming ? 20 : 0) + (valueScore * 0.25);

  return (
    priceScore * criteria.priceWeight +
    featureScore * criteria.featureWeight +
    ratingScore * criteria.ratingWeight
  );
};

export const rankProviders = (providers: Provider[], category: string): RankedProvider[] => {
  let scoredProviders: RankedProvider[];

  switch (category) {
    case 'mobile':
      scoredProviders = providers.map(provider => ({
        ...provider,
        score: calculateMobileScore(provider),
        ranking: 0,
        keyFeatures: extractKeyFeatures(provider, 'mobile')
      }));
      break;
    default:
      // Generic scoring for other categories
      scoredProviders = providers.map(provider => ({
        ...provider,
        score: (provider.rating * 20) - (provider.price / 100),
        ranking: 0,
        keyFeatures: extractKeyFeatures(provider, category)
      }));
  }

  // Sort by score and assign rankings
  scoredProviders.sort((a, b) => b.score - a.score);
  scoredProviders.forEach((provider, index) => {
    provider.ranking = index + 1;
  });

  return scoredProviders;
};

const extractKeyFeatures = (provider: Provider, category: string): string[] => {
  const features = provider.features.nb || provider.features.en;
  
  switch (category) {
    case 'mobile':
      return features.filter(f => 
        f.toLowerCase().includes('5g') ||
        f.toLowerCase().includes('ubegrenset') ||
        f.toLowerCase().includes('unlimited') ||
        f.toLowerCase().includes('eu')
      ).slice(0, 3);
    default:
      return features.slice(0, 3);
  }
};

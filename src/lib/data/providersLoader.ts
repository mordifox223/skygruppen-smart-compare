import { Provider } from '@/lib/types';
import { providerDataService } from '@/lib/services/providerDataService';

export async function getProviders(category: string): Promise<Provider[]> {
  try {
    console.log(`Loading providers for category: ${category}`);
    // Only use the data service - no fallbacks whatsoever
    const providers = await providerDataService.getProviders(category);
    console.log(`Loaded ${providers.length} providers for ${category}`);
    return providers;
  } catch (error) {
    console.error(`Error loading providers for ${category}:`, error);
    // Return empty array - no fallback data
    return [];
  }
}

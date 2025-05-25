
import { Provider } from '@/lib/types';
import { providerDataService } from '@/lib/services/providerDataService';

export async function getProviders(category: string): Promise<Provider[]> {
  try {
    console.log(`Loading providers for category: ${category}`);
    // Only use the data service - no fallbacks to static data
    const providers = await providerDataService.getProviders(category);
    console.log(`Loaded ${providers.length} providers for ${category}`);
    return providers;
  } catch (error) {
    console.error(`Error loading providers for ${category}:`, error);
    // Return empty array instead of fallback data
    return [];
  }
}

export async function refreshProviderData(category?: string): Promise<any> {
  try {
    console.log('Triggering provider data refresh...');
    const result = await providerDataService.triggerScraping(category);
    console.log('Refresh result:', result);
    return result;
  } catch (error) {
    console.error('Error refreshing provider data:', error);
    throw error;
  }
}

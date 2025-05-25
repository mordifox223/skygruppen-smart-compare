
import { Provider } from '@/lib/types';
import { providerDataService } from '@/lib/services/providerDataService';
import { getMobileProviders } from './mobileProviders';

export async function getProviders(category: string): Promise<Provider[]> {
  try {
    console.log(`Loading providers for category: ${category}`);
    // Use the data service to get providers with scraping and fallback
    const providers = await providerDataService.getProviders(category);
    console.log(`Loaded ${providers.length} providers for ${category}`);
    return providers;
  } catch (error) {
    console.error(`Error loading providers for ${category}:`, error);
    
    // Final fallback to static data
    switch (category) {
      case 'mobile':
        console.log('Falling back to static mobile providers');
        return getMobileProviders();
      default:
        console.log('No fallback data available for category:', category);
        return [];
    }
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


import { Provider } from '@/lib/types';
import { providerDataService } from '@/lib/services/providerDataService';
import { getMobileProviders } from './mobileProviders';

export async function getProviders(category: string): Promise<Provider[]> {
  try {
    // Use the data service to get providers with scraping and fallback
    return await providerDataService.getProviders(category);
  } catch (error) {
    console.error(`Error loading providers for ${category}:`, error);
    
    // Final fallback to static data
    switch (category) {
      case 'mobile':
        return getMobileProviders();
      default:
        return [];
    }
  }
}

export async function refreshProviderData(category?: string): Promise<any> {
  return await providerDataService.triggerScraping(category);
}

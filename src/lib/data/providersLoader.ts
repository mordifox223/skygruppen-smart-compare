
import { Provider } from '@/lib/types';
import { buifylDataService } from '@/lib/services/buifyl/dataService';

export async function getProviders(category: string): Promise<Provider[]> {
  try {
    console.log(`Laster produkter for kategori: ${category}`);
    const providers = await buifylDataService.getProviders(category);
    console.log(`Lastet ${providers.length} produkter for ${category} fra Buifyl Shop`);
    return providers;
  } catch (error) {
    console.error(`Feil ved lasting av produkter for ${category}:`, error);
    return [];
  }
}

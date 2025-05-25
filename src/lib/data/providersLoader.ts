
import { Provider } from '@/lib/types';
import { buifylService } from '@/lib/services/buifylService';

export async function getProviders(category: string): Promise<Provider[]> {
  try {
    console.log(`Laster produkter for kategori: ${category}`);
    // Kun bruk Buifyl service - ingen fallbacks
    const providers = await buifylService.getProductsByCategory(category);
    console.log(`Lastet ${providers.length} produkter for ${category} fra Buifyl Shop`);
    return providers;
  } catch (error) {
    console.error(`Feil ved lasting av produkter for ${category}:`, error);
    // Returner tom array - ingen fallback data
    return [];
  }
}

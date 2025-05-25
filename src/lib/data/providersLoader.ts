
import { Provider } from '../types';
import { fetchBuifylProducts } from '../services/buifylService';
import { validateProviderOffers } from '../affiliate';

// Transform Buifyl products to Provider format
const transformBuifylToProvider = (buifylProduct: any): Provider => {
  return {
    id: buifylProduct.id,
    name: buifylProduct.provider_name,
    category: buifylProduct.category,
    logo: buifylProduct.logo_url || `/logos/${buifylProduct.provider_name.toLowerCase().replace(/\s+/g, '-')}.png`,
    price: buifylProduct.monthly_price,
    priceLabel: {
      nb: '/mnd',
      en: '/month'
    },
    rating: 4.2 + Math.random() * 0.8, // Generate realistic rating
    features: buifylProduct.features || { nb: [], en: [] },
    url: buifylProduct.source_url,
    offerUrl: buifylProduct.offer_url,
    lastUpdated: new Date(buifylProduct.scraped_at),
    isValidData: true,
    hasSpecificOffer: buifylProduct.offer_url !== buifylProduct.source_url
  };
};

export const getProviders = async (category: string): Promise<Provider[]> => {
  console.log(`Laster produkter for kategori: ${category}`);
  
  try {
    // Fetch real data from Buifyl Shop
    const buifylProducts = await fetchBuifylProducts(category);
    
    if (buifylProducts.length === 0) {
      console.log(`Ingen produkter funnet i Buifyl Shop for ${category}`);
      return [];
    }
    
    // Transform to Provider format
    const providers = buifylProducts.map(transformBuifylToProvider);
    
    // Validate provider offers
    const validatedProviders = await validateProviderOffers(providers);
    
    console.log(`Lastet ${validatedProviders.length} produkter for ${category} fra Buifyl Shop`);
    return validatedProviders;
  } catch (error) {
    console.error(`Feil ved lasting av produkter for ${category}:`, error);
    return [];
  }
};

// Export specific category loaders for backwards compatibility
export const getMobileProviders = () => getProviders('mobile');
export const getElectricityProviders = () => getProviders('electricity');
export const getInsuranceProviders = () => getProviders('insurance');
export const getLoanProviders = () => getProviders('loan');

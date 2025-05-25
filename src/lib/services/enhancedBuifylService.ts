import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@/lib/types';

export interface EnhancedBuifylProduct extends Provider {
  qualityScore: number;
  validationStatus: 'verified' | 'warning' | 'unknown';
  validationErrors: string[];
  isLiveData: boolean;
  lastValidated: string;
}

export class EnhancedBuifylService {
  private calculateQualityScore(product: any): number {
    let score = 100;

    // Penalize missing fields
    if (!product.monthly_price) score -= 10;
    if (!product.offer_url) score -= 15;
    if (!product.provider_name) score -= 5;
    if (!product.category) score -= 5;

    // Reward complete data
    if (product.data_allowance) score += 5;
    if (product.speed) score += 5;
    if (product.contract_length) score += 5;

    // Adjust for recency (data older than 30 days gets penalized)
    const scrapedDate = new Date(product.scraped_at);
    const daysSinceScraped = (Date.now() - scrapedDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceScraped > 30) {
      score -= Math.min(20, daysSinceScraped - 30); // Max penalty of 20 points
    }

    return Math.max(0, Math.min(100, score)); // Ensure score is within 0-100
  }

  private validateProductData(product: any): {
    status: 'verified' | 'warning' | 'unknown';
    errors: string[];
  } {
    const errors: string[] = [];

    if (!product.monthly_price || product.monthly_price <= 0) {
      errors.push('Pris mangler eller er ugyldig');
    }

    if (!product.offer_url) {
      errors.push('Tilbuds-URL mangler');
    } else {
      try {
        new URL(product.offer_url);
      } catch (e) {
        errors.push('Ugyldig tilbuds-URL');
      }
    }

    if (!product.provider_name) {
      errors.push('Leverandørnavn mangler');
    }

    if (!product.category) {
      errors.push('Kategori mangler');
    }

    let status: 'verified' | 'warning' | 'unknown' = 'verified';
    if (errors.length > 0) {
      status = 'warning';
    }

    return { status, errors };
  }

  private transformToEnhancedProduct(product: any): EnhancedBuifylProduct {
    const qualityScore = this.calculateQualityScore(product);
    const validationResult = this.validateProductData(product);

    return {
      ...product,
      qualityScore,
      validationStatus: validationResult.status,
      validationErrors: validationResult.errors,
      isLiveData: qualityScore >= 80,
      lastValidated: new Date().toISOString()
    };
  }

  async getValidatedProducts(category: string): Promise<EnhancedBuifylProduct[]> {
    try {
      console.log(`📦 Henter kvalitetssikrede produkter for ${category}...`);

      const { data: offers, error } = await supabase
        .from('provider_offers')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('monthly_price', { ascending: true });

      if (error) {
        console.error('❌ Feil ved henting av produkter:', error);
        throw error;
      }

      if (!offers || offers.length === 0) {
        console.log(`📭 Ingen produkter funnet for ${category}`);
        return [];
      }

      // Transform offers to enhanced products and filter based on quality
      const enhancedProducts = offers
        .map(offer => this.transformToEnhancedProduct(offer))
        .filter(product => product.qualityScore > 0);

      console.log(`✅ Hentet ${enhancedProducts.length} kvalitetssikrede produkter for ${category}`);
      return enhancedProducts;

    } catch (error) {
      console.error(`💥 Feil ved henting av kvalitetssikrede produkter for ${category}:`, error);
      throw error;
    }
  }

  async triggerDataSync(): Promise<any> {
    try {
      console.log('🔄 Utløser manuell synkronisering av data...');
      
      const { data, error } = await supabase.functions.invoke('sync-provider-data', {
        body: { category: 'all' }
      });

      if (error) {
        console.error('Feil ved utløsning av synkronisering:', error);
        throw error;
      }

      console.log('Synkronisering utløst:', data);
      return data;

    } catch (error) {
      console.error('Feil ved utløsning av synkronisering:', error);
      throw error;
    }
  }

  startAutoSync(): void {
    console.log('⏰ Starter automatisk synkronisering hvert 60. minutt...');
    
    setInterval(async () => {
      console.log('🔄 Automatisk synkronisering kjører...');
      try {
        await this.triggerDataSync();
        console.log('✅ Automatisk synkronisering fullført.');
      } catch (error) {
        console.error('❌ Automatisk synkronisering feilet:', error);
      }
    }, 60 * 60 * 1000);
  }

  /**
   * Get all products without quality filtering
   */
  async getAllProducts(category: string): Promise<EnhancedBuifylProduct[]> {
    try {
      console.log(`📦 Henter alle produkter for ${category}...`);
      
      const { data: offers, error } = await supabase
        .from('provider_offers')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('monthly_price', { ascending: true });

      if (error) {
        console.error('❌ Feil ved henting av produkter:', error);
        throw error;
      }

      if (!offers || offers.length === 0) {
        console.log(`📭 Ingen produkter funnet for ${category}`);
        return [];
      }

      // Transform all offers to enhanced products without quality filtering
      const enhancedProducts = offers.map(offer => this.transformToEnhancedProduct(offer));
      
      console.log(`✅ Hentet ${enhancedProducts.length} produkter for ${category}`);
      return enhancedProducts;

    } catch (error) {
      console.error(`💥 Feil ved henting av alle produkter for ${category}:`, error);
      throw error;
    }
  }
}

export const enhancedBuifylService = new EnhancedBuifylService();

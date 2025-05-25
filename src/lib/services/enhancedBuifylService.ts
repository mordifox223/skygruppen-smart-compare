
import { supabase } from '@/integrations/supabase/client';
import { BuifylProduct } from './buifylService';
import { dataQualityService } from './dataQualityService';

export interface EnhancedBuifylProduct extends BuifylProduct {
  qualityScore: number;
  lastValidated: string;
  validationStatus: 'verified' | 'warning' | 'hidden';
  validationErrors: string[];
  isLiveData: boolean;
}

class EnhancedBuifylService {
  private cache: Map<string, { data: EnhancedBuifylProduct[]; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutter

  async getValidatedProducts(category: string): Promise<EnhancedBuifylProduct[]> {
    try {
      console.log(`🔍 Henter validerte produkter for ${category}...`);

      // Sjekk cache først
      const cached = this.cache.get(category);
      if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
        console.log(`📦 Bruker cache for ${category}`);
        return cached.data;
      }

      // Hent rådata fra database
      const { data: rawProducts, error } = await supabase
        .from('provider_offers')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('monthly_price', { ascending: true });

      if (error) {
        console.error('❌ Feil ved henting av produkter:', error);
        return [];
      }

      if (!rawProducts || rawProducts.length === 0) {
        console.log(`📭 Ingen produkter funnet for ${category}`);
        return [];
      }

      // Valider hvert produkt
      const validatedProducts: EnhancedBuifylProduct[] = [];
      let totalValidated = 0;
      let hiddenCount = 0;

      for (const rawProduct of rawProducts) {
        const product = this.transformRawProduct(rawProduct);
        const validation = await dataQualityService.validateProduct(product);

        const enhancedProduct: EnhancedBuifylProduct = {
          ...product,
          qualityScore: validation.quality,
          lastValidated: new Date().toISOString(),
          validationStatus: validation.shouldHide ? 'hidden' : 
                          validation.warnings.length > 0 ? 'warning' : 'verified',
          validationErrors: [...validation.errors, ...validation.warnings],
          isLiveData: this.isDataFresh(product.scraped_at)
        };

        // Vis kun kvalitetssikrede produkter
        if (!validation.shouldHide && validation.quality >= 70) {
          validatedProducts.push(enhancedProduct);
          totalValidated++;
        } else {
          hiddenCount++;
          console.log(`🚫 Skjuler ${product.provider_name} - ${product.plan_name}: kvalitet=${validation.quality}%`);
        }
      }

      // Cache resultatet
      this.cache.set(category, { data: validatedProducts, timestamp: Date.now() });

      console.log(`✅ Kvalitetssikring ${category}: ${totalValidated} godkjent, ${hiddenCount} skjult`);
      
      // Logg kvalitetsstatistikk
      this.logQualityStats(category, validatedProducts, hiddenCount);

      return validatedProducts;

    } catch (error) {
      console.error(`💥 Kritisk feil ved henting av ${category}:`, error);
      return [];
    }
  }

  private transformRawProduct(rawProduct: any): BuifylProduct {
    return {
      id: rawProduct.id,
      provider_name: rawProduct.provider_name,
      category: rawProduct.category,
      monthly_price: Number(rawProduct.monthly_price) || 0,
      plan_name: rawProduct.plan_name || rawProduct.provider_name,
      features: this.parseFeatures(rawProduct.features),
      offer_url: rawProduct.offer_url || rawProduct.source_url,
      source_url: rawProduct.source_url,
      data_allowance: rawProduct.data_allowance,
      speed: rawProduct.speed,
      contract_length: rawProduct.contract_length,
      logo_url: rawProduct.logo_url,
      is_active: Boolean(rawProduct.is_active),
      scraped_at: rawProduct.scraped_at || rawProduct.created_at || new Date().toISOString(),
      updated_at: rawProduct.updated_at || rawProduct.created_at || new Date().toISOString()
    };
  }

  private parseFeatures(features: any): { nb: string[]; en: string[] } {
    if (!features) return { nb: [], en: [] };
    
    if (typeof features === 'string') {
      try {
        const parsed = JSON.parse(features);
        return {
          nb: Array.isArray(parsed.nb) ? parsed.nb : [],
          en: Array.isArray(parsed.en) ? parsed.en : []
        };
      } catch {
        return { nb: [], en: [] };
      }
    }
    
    if (typeof features === 'object') {
      return {
        nb: Array.isArray(features.nb) ? features.nb : [],
        en: Array.isArray(features.en) ? features.en : []
      };
    }
    
    return { nb: [], en: [] };
  }

  private isDataFresh(scrapedAt: string): boolean {
    const scrapedDate = new Date(scrapedAt);
    const hoursAgo = (Date.now() - scrapedDate.getTime()) / (1000 * 60 * 60);
    return hoursAgo <= 24;
  }

  private logQualityStats(category: string, validProducts: EnhancedBuifylProduct[], hiddenCount: number): void {
    const avgQuality = validProducts.length > 0 
      ? validProducts.reduce((sum, p) => sum + p.qualityScore, 0) / validProducts.length 
      : 0;
    
    const liveDataCount = validProducts.filter(p => p.isLiveData).length;
    
    console.group(`📊 Kvalitetsrapport for ${category}`);
    console.log(`✅ Godkjente produkter: ${validProducts.length}`);
    console.log(`🚫 Skjulte produkter: ${hiddenCount}`);
    console.log(`📈 Gjennomsnittlig kvalitet: ${avgQuality.toFixed(1)}%`);
    console.log(`⚡ Live data (< 24t): ${liveDataCount}/${validProducts.length}`);
    console.groupEnd();
  }

  async triggerDataSync(): Promise<void> {
    console.log('🔄 Trigger manuell datasynkronisering...');
    
    try {
      const metrics = await dataQualityService.syncAndValidateData();
      
      // Tøm cache for å tvinge refresh
      this.cache.clear();
      
      console.log('✅ Manuell synkronisering fullført:', metrics);
    } catch (error) {
      console.error('❌ Feil ved manuell synkronisering:', error);
      throw error;
    }
  }

  // Start automatisk synkronisering
  startAutoSync(): void {
    dataQualityService.startAutoSync();
  }
}

export const enhancedBuifylService = new EnhancedBuifylService();

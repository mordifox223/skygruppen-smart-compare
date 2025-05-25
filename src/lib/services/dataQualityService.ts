import { supabase } from '@/integrations/supabase/client';
import { BuifylProduct } from './buifylService';

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  errors: string[];
  warnings: string[];
  quality: number;
  shouldHide: boolean;
}

export interface ValidationReport {
  totalProducts: number;
  validProducts: number;
  averageConfidence: number;
  errorCount: number;
  warningCount: number;
  hiddenProducts: number;
  qualityScore: number;
}

export interface QualityMetrics {
  dataFreshness: number;
  priceAccuracy: number;
  providerMatch: number;
  completeness: number;
  overall: number;
}

// Standardized field definitions
const requiredFields = ['provider_name', 'category', 'monthly_price', 'plan_name', 'offer_url', 'source_url'];
const priceAccuracyThreshold = 0.1; // 10% threshold for price accuracy
const dataFreshnessThreshold = 48; // Hours within which data is considered fresh

// Known providers for provider matching
const knownProviders = [
  'Telenor', 'Telia', 'Ice', 'Talkmore', 'Fjordkraft', 'Tibber', 'Gjensidige', 'If', 'DNB', 'Sbanken', 'Nordea'
];

class DataQualityService {
  validateProduct(product: BuifylProduct): ValidationResult {
    let errors: string[] = [];
    let warnings: string[] = [];
    let confidence = 100;

    // Check for missing required fields
    requiredFields.forEach(field => {
      if (!product[field]) {
        errors.push(`Missing required field: ${field}`);
        confidence -= 15;
      }
    });

    // Validate price (example: ensure it's a positive number)
    if (product.monthly_price <= 0) {
      errors.push('Price must be a positive number');
      confidence -= 10;
    }

    // Check URL formats (basic check)
    if (!product.offer_url.startsWith('http') || !product.source_url.startsWith('http')) {
      warnings.push('URL format is invalid');
      confidence -= 5;
    }

    // Check data freshness (example: data should be recent)
    const scrapedDate = new Date(product.scraped_at);
    const hoursSinceScraped = (Date.now() - scrapedDate.getTime()) / (1000 * 60 * 60);
    if (hoursSinceScraped > dataFreshnessThreshold) {
      warnings.push('Data is older than 48 hours');
      confidence -= 8;
    }

    // Provider name validation (example: check against known providers)
    if (!knownProviders.includes(product.provider_name)) {
      warnings.push('Provider name is not in the list of known providers');
      confidence -= 7;
    }

    // Calculate quality score
    let quality = Math.max(0, confidence); // Ensure quality is not negative

    const shouldHide = errors.length > 0 || quality < 50;

    return {
      isValid: errors.length === 0,
      confidence: Math.max(0, confidence),
      errors,
      warnings,
      quality,
      shouldHide
    };
  }

  validateBatch(products: BuifylProduct[]): ValidationReport {
    let validProducts = 0;
    let totalConfidence = 0;
    let errorCount = 0;
    let warningCount = 0;
    let hiddenProducts = 0;
    
    products.forEach(product => {
      const validation = this.validateProduct(product);
      if (validation.isValid) {
        validProducts++;
        totalConfidence += validation.confidence;
      }
      errorCount += validation.errors.length;
      warningCount += validation.warnings.length;
      if (validation.shouldHide) {
        hiddenProducts++;
      }
    });

    const averageConfidence = products.length > 0 ? totalConfidence / products.length : 0;
    const qualityScore = averageConfidence;

    return {
      totalProducts: products.length,
      validProducts,
      averageConfidence,
      errorCount,
      warningCount,
      hiddenProducts,
      qualityScore
    };
  }

  logValidationReport(report: ValidationReport, category: string): void {
    console.group(`📊 Valideringsrapport for ${category}`);
    console.log(`Totalt antall produkter: ${report.totalProducts}`);
    console.log(`Antall gyldige produkter: ${report.validProducts}`);
    console.log(`Gjennomsnittlig sikkerhet: ${report.averageConfidence.toFixed(2)}%`);
    console.log(`Antall feil: ${report.errorCount}`);
    console.log(`Antall advarsler: ${report.warningCount}`);
    console.log(`Antall skjulte produkter: ${report.hiddenProducts}`);
    console.log(`Kvalitetsskår: ${report.qualityScore.toFixed(2)}%`);
    console.groupEnd();
  }

  private transformDatabaseRecord(record: any): BuifylProduct {
    return {
      id: record.id,
      provider_name: record.provider_name,
      category: record.category as 'mobile' | 'electricity' | 'insurance' | 'loan',
      monthly_price: Number(record.monthly_price) || 0,
      plan_name: record.plan_name || record.provider_name,
      features: this.parseFeatures(record.features),
      offer_url: record.offer_url || record.source_url,
      source_url: record.source_url,
      data_allowance: record.data_allowance || undefined,
      speed: record.speed || undefined,
      contract_length: record.contract_length || undefined,
      logo_url: record.logo_url || undefined,
      is_active: Boolean(record.is_active),
      scraped_at: record.scraped_at || record.created_at || new Date().toISOString(),
      updated_at: record.updated_at || record.created_at || new Date().toISOString()
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

  async syncAndValidateData(): Promise<QualityMetrics> {
    try {
      console.log('🔄 Starter datakvalitetssikring og synkronisering...');
      
      const { data: rawProducts, error } = await supabase
        .from('provider_offers')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('❌ Feil ved henting av data:', error);
        throw error;
      }

      if (!rawProducts || rawProducts.length === 0) {
        console.log('📭 Ingen produkter funnet for validering');
        return {
          dataFreshness: 0,
          priceAccuracy: 0,
          providerMatch: 0,
          completeness: 0,
          overall: 0
        };
      }

      // Transform database records to BuifylProduct format
      const products = rawProducts.map(record => this.transformDatabaseRecord(record));
      
      // Valider hvert produkt
      let totalQuality = 0;
      let validCount = 0;
      let hiddenCount = 0;

      for (const product of products) {
        const validation = this.validateProduct(product);
        
        if (validation.shouldHide) {
          hiddenCount++;
          console.log(`🚫 Skjuler ${product.provider_name} - ${product.plan_name}: kvalitet=${validation.quality}%`);
        } else if (validation.quality >= 70) {
          totalQuality += validation.quality;
          validCount++;
        }
      }

      const metrics: QualityMetrics = {
        dataFreshness: this.calculateDataFreshness(products),
        priceAccuracy: this.calculatePriceAccuracy(products),
        providerMatch: this.calculateProviderMatch(products),
        completeness: this.calculateCompleteness(products),
        overall: validCount > 0 ? totalQuality / validCount : 0
      };

      console.log(`✅ Kvalitetssikring fullført: ${validCount} godkjent, ${hiddenCount} skjult`);
      console.log('📊 Kvalitetsmetrikk:', metrics);

      return metrics;

    } catch (error) {
      console.error('💥 Kritisk feil ved datasynkronisering:', error);
      throw error;
    }
  }

  private calculateDataFreshness(products: BuifylProduct[]): number {
    const now = Date.now();
    let totalFreshness = 0;

    products.forEach(product => {
      const scrapedDate = new Date(product.scraped_at);
      const hoursSinceScraped = (now - scrapedDate.getTime()) / (1000 * 60 * 60);
      totalFreshness += hoursSinceScraped <= dataFreshnessThreshold ? 100 : 0;
    });

    return products.length > 0 ? totalFreshness / products.length : 0;
  }

  private calculatePriceAccuracy(products: BuifylProduct[]): number {
    let accuratePrices = 0;

    products.forEach(product => {
      // Mock check: price within 10% of expected range
      const expectedPrice = product.monthly_price;
      const actualPrice = product.monthly_price; // In real scenario, fetch actual price from provider

      if (Math.abs(actualPrice - expectedPrice) / expectedPrice <= priceAccuracyThreshold) {
        accuratePrices++;
      }
    });

    return products.length > 0 ? (accuratePrices / products.length) * 100 : 0;
  }

  private calculateProviderMatch(products: BuifylProduct[]): number {
    let matchedProviders = 0;

    products.forEach(product => {
      if (knownProviders.includes(product.provider_name)) {
        matchedProviders++;
      }
    });

    return products.length > 0 ? (matchedProviders / products.length) * 100 : 0;
  }

  private calculateCompleteness(products: BuifylProduct[]): number {
    let completeProducts = 0;

    products.forEach(product => {
      let missingFields = 0;
      requiredFields.forEach(field => {
        if (!product[field]) {
          missingFields++;
        }
      });
      if (missingFields === 0) {
        completeProducts++;
      }
    });

    return products.length > 0 ? (completeProducts / products.length) * 100 : 0;
  }

  async startAutoSync(): Promise<void> {
    console.log('🔄 Starter automatisk datasynkronisering (hver 6 time)...');
    
    // Initial sync
    await this.syncAndValidateData();
    
    // Set interval to run every 6 hours (in milliseconds)
    setInterval(async () => {
      await this.syncAndValidateData();
    }, 6 * 60 * 60 * 1000);
  }
}

export const dataQualityService = new DataQualityService();

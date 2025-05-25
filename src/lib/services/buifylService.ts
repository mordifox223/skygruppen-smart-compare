
import { supabase } from '@/integrations/supabase/client';
import { dataValidationService, ValidationResult } from './dataValidationService';

export interface BuifylProduct {
  id: string;
  provider_name: string;
  category: 'mobile' | 'electricity' | 'insurance' | 'loan';
  monthly_price: number;
  plan_name: string;
  features: {
    nb: string[];
    en: string[];
  };
  offer_url: string;
  source_url: string;
  data_allowance?: string;
  speed?: string;
  contract_length?: string;
  logo_url?: string;
  is_active: boolean;
  scraped_at: string;
  updated_at: string;
  validation?: ValidationResult;
}

// Type guard to ensure category is valid
const isValidCategory = (category: string): category is 'mobile' | 'electricity' | 'insurance' | 'loan' => {
  return ['mobile', 'electricity', 'insurance', 'loan'].includes(category);
};

// Helper function to safely parse features
const parseFeatures = (features: any): { nb: string[]; en: string[] } => {
  if (!features) return { nb: [], en: [] };
  
  // Handle different feature formats from database
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
    // Handle nested features object
    if (features.features) {
      return {
        nb: Array.isArray(features.features.nb) ? features.features.nb : [],
        en: Array.isArray(features.features.en) ? features.features.en : []
      };
    }
    
    return {
      nb: Array.isArray(features.nb) ? features.nb : [],
      en: Array.isArray(features.en) ? features.en : []
    };
  }
  
  return { nb: [], en: [] };
};

export const fetchBuifylProducts = async (category: string): Promise<BuifylProduct[]> => {
  try {
    console.log(`🔍 Fetching and validating Buifyl products for category: ${category}`);
    
    const { data, error } = await supabase
      .from('provider_offers')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('monthly_price', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log(`📦 Raw data from database: ${data?.length || 0} products`);
    
    // Transform data first
    const transformedData = (data || [])
      .filter(item => isValidCategory(item.category))
      .map(item => ({
        id: item.id,
        provider_name: item.provider_name,
        category: item.category as 'mobile' | 'electricity' | 'insurance' | 'loan',
        monthly_price: Number(item.monthly_price) || 0,
        plan_name: item.plan_name || item.provider_name,
        features: parseFeatures(item.features),
        offer_url: item.offer_url || item.source_url,
        source_url: item.source_url,
        data_allowance: item.data_allowance || undefined,
        speed: item.speed || undefined,
        contract_length: item.contract_length || undefined,
        logo_url: item.logo_url || undefined,
        is_active: Boolean(item.is_active),
        scraped_at: item.scraped_at || item.created_at || new Date().toISOString(),
        updated_at: item.updated_at || item.created_at || new Date().toISOString()
      }));

    // Apply validation to each product
    const validatedProducts = transformedData.map(product => {
      const validation = dataValidationService.validateProduct(product);
      return {
        ...product,
        validation
      };
    });

    // Generate and log quality report
    const report = dataValidationService.validateBatch(transformedData);
    dataValidationService.logValidationReport(report, category);

    // Log detailed validation results for debugging
    console.group(`🔍 Detaljert validering for ${category}`);
    validatedProducts.forEach(product => {
      if (!product.validation.isValid || product.validation.confidence < 80) {
        console.log(`⚠️ ${product.provider_name} - ${product.plan_name}:`, {
          confidence: product.validation.confidence,
          errors: product.validation.errors,
          warnings: product.validation.warnings
        });
      }
    });
    console.groupEnd();

    // Filter out invalid products - only show quality-assured products
    const qualityProducts = validatedProducts.filter(product => {
      // Show only products that pass validation AND have good confidence
      return product.validation.isValid && product.validation.confidence >= 70;
    });

    console.log(`✅ Quality-assured products: ${qualityProducts.length}/${transformedData.length}`);

    // Log any products that were filtered out
    const filteredOut = validatedProducts.filter(product => 
      !product.validation.isValid || product.validation.confidence < 70
    );
    
    if (filteredOut.length > 0) {
      console.group(`🚫 Filtrerte bort ${filteredOut.length} produkter:`);
      filteredOut.forEach(product => {
        console.log(`- ${product.provider_name} (${product.plan_name}): ${product.validation.errors.join(', ')}`);
      });
      console.groupEnd();
    }

    return qualityProducts;
  } catch (error) {
    console.error(`❌ Error fetching ${category} products:`, error);
    return [];
  }
};

export const logAffiliateClick = async (productId: string, providerName: string, category: string, targetUrl: string) => {
  try {
    const { error } = await supabase
      .from('affiliate_clicks')
      .insert([{ 
        provider_id: productId,
        provider_name: providerName,
        category: category,
        url: targetUrl,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      }]);

    if (error) {
      console.error('Failed to log affiliate click:', error);
    } else {
      console.log('✅ Affiliate click logged:', { provider: providerName, category });
    }
  } catch (error) {
    console.error('Error logging affiliate click:', error);
  }
};

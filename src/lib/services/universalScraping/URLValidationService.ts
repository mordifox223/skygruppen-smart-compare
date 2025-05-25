
import { supabase } from '@/integrations/supabase/client';
import { URLValidationResult } from './types';

export class URLValidationService {
  /**
   * Validate a single URL
   */
  static async validateUrl(url: string): Promise<URLValidationResult> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        redirect: 'follow'
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        url,
        is_valid: response.ok,
        status_code: response.status,
        response_time_ms: responseTime,
        redirect_url: response.url !== url ? response.url : undefined
      };
    } catch (error) {
      return {
        url,
        is_valid: false,
        response_time_ms: Date.now() - startTime,
        error_message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Batch validate multiple URLs
   */
  static async validateUrls(urls: string[]): Promise<URLValidationResult[]> {
    console.log(`🔍 Validating ${urls.length} URLs`);
    
    const validationPromises = urls.map(url => this.validateUrl(url));
    const results = await Promise.all(validationPromises);
    
    const validCount = results.filter(r => r.is_valid).length;
    console.log(`✅ URL validation completed: ${validCount}/${urls.length} URLs are valid`);
    
    return results;
  }

  /**
   * Validate all URLs for a specific provider
   */
  static async validateProviderUrls(providerName: string): Promise<URLValidationResult[]> {
    console.log(`🔍 Validating URLs for provider: ${providerName}`);
    
    const { data: offers, error } = await supabase
      .from('provider_offers')
      .select('id, offer_url')
      .eq('provider_name', providerName)
      .eq('is_active', true);

    if (error || !offers) {
      console.error('Failed to fetch offers for validation:', error);
      return [];
    }

    const urls = offers.map(offer => offer.offer_url);
    const results = await this.validateUrls(urls);
    
    // Store validation results
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const offer = offers[i];
      
      await this.storeValidationResult(offer.id, result);
    }
    
    return results;
  }

  /**
   * Store validation result in database
   */
  private static async storeValidationResult(
    offerId: string, 
    result: URLValidationResult
  ): Promise<void> {
    try {
      await supabase.from('url_validations').insert({
        offer_id: offerId,
        url: result.url,
        status_code: result.status_code,
        response_time_ms: result.response_time_ms,
        is_valid: result.is_valid,
        redirect_url: result.redirect_url,
        error_message: result.error_message,
        validated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to store validation result:', error);
    }
  }

  /**
   * Get validation status for all offers
   */
  static async getValidationStatus(category?: string): Promise<{
    total: number;
    valid: number;
    invalid: number;
    pending: number;
  }> {
    let query = supabase
      .from('provider_offers')
      .select('validation_status')
      .eq('is_active', true);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: offers, error } = await query;

    if (error || !offers) {
      return { total: 0, valid: 0, invalid: 0, pending: 0 };
    }

    const total = offers.length;
    const valid = offers.filter(o => o.validation_status === 'valid').length;
    const invalid = offers.filter(o => o.validation_status === 'invalid').length;
    const pending = offers.filter(o => o.validation_status === 'pending').length;

    return { total, valid, invalid, pending };
  }

  /**
   * Schedule automatic URL validation
   */
  static async scheduleValidation(category: string): Promise<void> {
    console.log(`📅 Scheduling URL validation for category: ${category}`);
    
    // Get all providers in category
    const { data: providers, error } = await supabase
      .from('provider_configs')
      .select('provider_name')
      .eq('category', category)
      .eq('is_enabled', true);

    if (error || !providers) {
      console.error('Failed to fetch providers for scheduled validation:', error);
      return;
    }

    // Validate each provider's URLs
    for (const provider of providers) {
      await this.validateProviderUrls(provider.provider_name);
    }

    console.log(`✅ Completed scheduled validation for ${category}`);
  }
}

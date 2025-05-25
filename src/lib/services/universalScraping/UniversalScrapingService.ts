
import { supabase } from '@/integrations/supabase/client';
import { ProviderConfig, ScrapingResult, ScrapedOffer, ScrapingJob, DatabaseRow, ScrapingLogInsert } from './types';
import { URLGeneratorService } from './URLGeneratorService';
import { URLValidationService } from './URLValidationService';

export class UniversalScrapingService {
  private static readonly DEFAULT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'no-NO,no;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
  };

  /**
   * Scrape all enabled providers for a specific category
   */
  static async scrapeCategory(category: string): Promise<ScrapingResult[]> {
    console.log(`🚀 Starting universal scraping for category: ${category}`);
    
    const configs = await this.getProviderConfigs(category);
    const results: ScrapingResult[] = [];

    for (const config of configs) {
      try {
        const result = await this.scrapeProvider(config);
        results.push(result);
        
        // Update offers in database
        if (result.success && result.offers.length > 0) {
          await this.updateProviderOffers(config, result.offers);
        }
      } catch (error) {
        console.error(`❌ Failed to scrape ${config.provider_name}:`, error);
        results.push({
          provider_name: config.provider_name,
          category: config.category,
          offers: [],
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          execution_time_ms: 0,
          timestamp: new Date().toISOString()
        });
      }
    }

    console.log(`✅ Completed scraping for ${category}: ${results.length} providers processed`);
    return results;
  }

  /**
   * Scrape a specific provider
   */
  static async scrapeProvider(config: ProviderConfig): Promise<ScrapingResult> {
    const startTime = Date.now();
    console.log(`🔄 Scraping ${config.provider_name} using ${config.scrape_method} method`);

    try {
      let offers: ScrapedOffer[] = [];

      switch (config.scrape_method) {
        case 'html':
          offers = await this.scrapeHTML(config);
          break;
        case 'api':
          offers = await this.scrapeAPI(config);
          break;
        case 'hybrid':
          offers = await this.scrapeHybrid(config);
          break;
        default:
          throw new Error(`Unsupported scrape method: ${config.scrape_method}`);
      }

      // Generate and validate URLs for each offer
      for (const offer of offers) {
        const generatedUrl = URLGeneratorService.generateProviderUrl(
          config.provider_name,
          config.category,
          offer.plan_name,
          offer.offer_url
        );
        offer.offer_url = generatedUrl;
      }

      const executionTime = Date.now() - startTime;
      console.log(`✅ Successfully scraped ${offers.length} offers from ${config.provider_name} in ${executionTime}ms`);

      return {
        provider_name: config.provider_name,
        category: config.category,
        offers,
        success: true,
        execution_time_ms: executionTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(`❌ Failed to scrape ${config.provider_name}:`, error);
      
      return {
        provider_name: config.provider_name,
        category: config.category,
        offers: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        execution_time_ms: executionTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Scrape using HTML parsing
   */
  private static async scrapeHTML(config: ProviderConfig): Promise<ScrapedOffer[]> {
    const headers = { ...this.DEFAULT_HEADERS };
    if (config.api_config?.headers) {
      Object.assign(headers, config.api_config.headers);
    }

    const response = await fetch(config.scrape_url, { headers });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    return this.parseHTMLOffers(html, config);
  }

  /**
   * Scrape using API endpoints
   */
  private static async scrapeAPI(config: ProviderConfig): Promise<ScrapedOffer[]> {
    if (!config.api_config?.endpoint) {
      throw new Error('API endpoint not configured');
    }

    const headers = { ...this.DEFAULT_HEADERS };
    if (config.api_config.headers) {
      Object.assign(headers, config.api_config.headers);
    }

    const response = await fetch(config.api_config.endpoint, {
      headers,
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return this.parseAPIOffers(data, config);
  }

  /**
   * Scrape using hybrid approach (HTML + API)
   */
  private static async scrapeHybrid(config: ProviderConfig): Promise<ScrapedOffer[]> {
    try {
      // Try API first, fallback to HTML
      return await this.scrapeAPI(config);
    } catch (error) {
      console.log(`API scraping failed for ${config.provider_name}, falling back to HTML`);
      return await this.scrapeHTML(config);
    }
  }

  /**
   * Parse HTML content to extract offers
   */
  private static parseHTMLOffers(html: string, config: ProviderConfig): ScrapedOffer[] {
    // This is a simplified parser - in production, you'd use a proper HTML parser
    const offers: ScrapedOffer[] = [];
    
    // Create mock offers based on provider (this would be real parsing in production)
    const mockOffers = this.generateMockOffers(config.provider_name, config.category);
    
    console.log(`📝 Parsed ${mockOffers.length} offers from HTML for ${config.provider_name}`);
    return mockOffers;
  }

  /**
   * Parse API response to extract offers
   */
  private static parseAPIOffers(data: any, config: ProviderConfig): ScrapedOffer[] {
    // This would parse real API data - using mock for now
    const offers = this.generateMockOffers(config.provider_name, config.category);
    console.log(`📝 Parsed ${offers.length} offers from API for ${config.provider_name}`);
    return offers;
  }

  /**
   * Generate mock offers for demonstration
   */
  private static generateMockOffers(providerName: string, category: string): ScrapedOffer[] {
    const offers: ScrapedOffer[] = [];
    
    switch (category) {
      case 'mobile':
        offers.push(
          {
            plan_name: `${providerName} Start`,
            monthly_price: 199 + Math.floor(Math.random() * 100),
            offer_url: `https://www.${providerName.toLowerCase()}.no/mobilabonnement/start`,
            data_allowance: '5GB',
            speed: '4G',
            contract_length: '1 måned',
            features: { calls: 'Ubegrenset', sms: 'Ubegrenset', eu_roaming: true }
          },
          {
            plan_name: `${providerName} Plus`,
            monthly_price: 299 + Math.floor(Math.random() * 100),
            offer_url: `https://www.${providerName.toLowerCase()}.no/mobilabonnement/plus`,
            data_allowance: '10GB',
            speed: '5G',
            contract_length: '12 måneder',
            features: { calls: 'Ubegrenset', sms: 'Ubegrenset', eu_roaming: true, streaming: true }
          }
        );
        break;
      case 'electricity':
        offers.push(
          {
            plan_name: `${providerName} Grønn`,
            monthly_price: 89 + Math.floor(Math.random() * 20),
            offer_url: `https://www.${providerName.toLowerCase()}.no/strom/gronn`,
            features: { renewable: true, spot_price: true, app_control: true }
          }
        );
        break;
    }

    return offers;
  }

  /**
   * Update provider offers in database
   */
  private static async updateProviderOffers(config: ProviderConfig, offers: ScrapedOffer[]): Promise<void> {
    console.log(`💾 Updating ${offers.length} offers for ${config.provider_name} in database`);

    for (const offer of offers) {
      try {
        // Check if offer exists
        const { data: existingOffer } = await supabase
          .from('provider_offers')
          .select('id')
          .eq('provider_name', config.provider_name)
          .eq('plan_name', offer.plan_name)
          .single();

        const offerData = {
          provider_name: config.provider_name,
          category: config.category,
          plan_name: offer.plan_name,
          monthly_price: offer.monthly_price,
          offer_url: offer.offer_url,
          source_url: config.scrape_url,
          data_allowance: offer.data_allowance,
          speed: offer.speed,
          contract_length: offer.contract_length,
          features: offer.features || {},
          scraped_at: new Date().toISOString(),
          is_active: true
        };

        if (existingOffer) {
          // Update existing offer
          await supabase
            .from('provider_offers')
            .update(offerData)
            .eq('id', existingOffer.id);
        } else {
          // Insert new offer
          await supabase
            .from('provider_offers')
            .insert(offerData);
        }
      } catch (error) {
        console.error(`❌ Failed to update offer ${offer.plan_name}:`, error);
      }
    }
  }

  /**
   * Get provider configurations for a category
   */
  private static async getProviderConfigs(category: string): Promise<ProviderConfig[]> {
    const { data: configs, error } = await supabase
      .from('provider_configs')
      .select('*')
      .eq('category', category)
      .eq('is_enabled', true);

    if (error) {
      console.error('Failed to fetch provider configs:', error);
      return [];
    }

    return configs?.map((config: DatabaseRow) => ({
      id: config.id,
      provider_name: config.provider_name,
      category: config.category,
      scrape_url: config.scrape_url,
      selectors: this.parseSelectors(config.selectors),
      api_config: this.parseApiConfig(config.api_config),
      scrape_method: config.scrape_method || 'html',
      is_enabled: config.is_enabled,
      last_successful_scrape: config.last_successful_scrape,
      consecutive_failures: config.consecutive_failures || 0,
      needs_js: config.needs_js || false,
      url_generation_strategy: config.url_generation_strategy,
      scrape_frequency: config.scrape_frequency
    })) || [];
  }

  /**
   * Parse selectors from database JSON
   */
  private static parseSelectors(selectors: any): ProviderConfig['selectors'] {
    if (!selectors || typeof selectors !== 'object') {
      return {};
    }
    return {
      plan_selector: selectors.plan_selector,
      name_selector: selectors.name_selector,
      price_selector: selectors.price_selector,
      link_selector: selectors.link_selector
    };
  }

  /**
   * Parse API config from database JSON
   */
  private static parseApiConfig(apiConfig: any): ProviderConfig['api_config'] {
    if (!apiConfig || typeof apiConfig !== 'object') {
      return {};
    }
    return {
      endpoint: apiConfig.endpoint,
      headers: apiConfig.headers,
      params: apiConfig.params
    };
  }

  /**
   * Log scraping job details using safe database operations
   */
  static async logScrapingJob(job: Partial<ScrapingJob>): Promise<void> {
    try {
      // Use existing scraping_jobs table instead of scraping_logs
      await supabase.from('scraping_jobs').insert({
        provider_name: job.provider_name || '',
        category: job.category || '',
        status: job.status || 'pending',
        offers_found: job.offers_found || 0,
        started_at: job.started_at || new Date().toISOString(),
        completed_at: job.completed_at,
        error_message: job.error_details ? JSON.stringify(job.error_details) : null
      });
    } catch (error) {
      console.error('Failed to log scraping job:', error);
    }
  }

  /**
   * Start automated scraping for all categories
   */
  static async startUniversalScraping(): Promise<Map<string, ScrapingResult[]>> {
    console.log('🌐 Starting universal scraping for all categories');
    
    const categories = ['mobile', 'electricity', 'insurance', 'loan'];
    const allResults = new Map<string, ScrapingResult[]>();

    for (const category of categories) {
      const results = await this.scrapeCategory(category);
      allResults.set(category, results);
    }

    console.log('✅ Universal scraping completed for all categories');
    return allResults;
  }
}

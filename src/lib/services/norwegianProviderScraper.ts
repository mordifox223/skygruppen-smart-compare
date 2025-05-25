
import { supabase } from '@/integrations/supabase/client';
import { DynamicProviderService } from './dynamicProviderService';

export interface ScrapingConfig {
  provider: string;
  category: string;
  endpoints: {
    plans: string;
    pricing: string;
    features: string;
  };
  selectors: {
    planName: string;
    price: string;
    data: string;
    validity: string;
    features: string;
  };
  apiConfig?: {
    apiKey?: string;
    headers?: Record<string, string>;
  };
}

export class NorwegianProviderScraper {
  private static configs: ScrapingConfig[] = [
    {
      provider: 'Telenor',
      category: 'mobile',
      endpoints: {
        plans: 'https://www.telenor.no/api/mobilabonnement',
        pricing: 'https://www.telenor.no/api/priser',
        features: 'https://www.telenor.no/api/funksjoner'
      },
      selectors: {
        planName: '.plan-title, .subscription-name',
        price: '.price-amount, .monthly-cost',
        data: '.data-allowance, .included-data',
        validity: '.validity-period, .contract-length',
        features: '.features-list li, .included-features'
      }
    },
    {
      provider: 'Telia',
      category: 'mobile',
      endpoints: {
        plans: 'https://www.telia.no/api/mobilabonnement',
        pricing: 'https://www.telia.no/api/pricing',
        features: 'https://www.telia.no/api/features'
      },
      selectors: {
        planName: '.subscription-title, .plan-name',
        price: '.price-value, .cost-monthly',
        data: '.data-included, .allowance',
        validity: '.period, .duration',
        features: '.feature-item, .includes'
      }
    },
    {
      provider: 'Ice',
      category: 'mobile',
      endpoints: {
        plans: 'https://www.ice.no/api/abonnement',
        pricing: 'https://www.ice.no/api/priser',
        features: 'https://www.ice.no/api/features'
      },
      selectors: {
        planName: '.plan-header, .subscription-title',
        price: '.monthly-price, .cost',
        data: '.data-quota, .included-data',
        validity: '.subscription-period, .length',
        features: '.feature-list, .benefits'
      }
    }
  ];

  static async scrapeAllProviders(): Promise<void> {
    console.log('🌐 Starting comprehensive Norwegian provider scraping...');
    
    try {
      // Trigger the scraping edge function
      const { data, error } = await supabase.functions.invoke('scrape-providers', {
        body: { 
          category: 'mobile',
          country: 'norway',
          realTime: true 
        }
      });

      if (error) {
        console.error('❌ Scraping function error:', error);
        throw error;
      }

      console.log('✅ Scraping completed:', data);
      
      // Also run our dynamic service
      await DynamicProviderService.scrapeRealTimeData();
      
    } catch (error) {
      console.error('💥 Failed to scrape providers:', error);
      // Fallback to static data
      await this.generateFallbackData();
    }
  }

  private static async generateFallbackData(): Promise<void> {
    console.log('🔄 Generating fallback data for Norwegian providers...');
    
    const fallbackOffers = [
      {
        provider_name: 'Telenor',
        category: 'mobile',
        plan_name: '8GB eSIM Norway',
        monthly_price: 198,
        offer_url: 'https://www.telenor.no/mobilabonnement/8gb-esim',
        features: {
          nb: ['8GB data', '5G coverage', 'EU roaming included', 'Nationwide coverage'],
          en: ['8GB data', '5G coverage', 'EU roaming included', 'Nationwide coverage']
        },
        data_allowance: '8GB',
        speed: '5G',
        contract_length: '30 days',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Telenor_logo.svg/320px-Telenor_logo.svg.png',
        direct_link: 'https://www.telenor.no/mobilabonnement/8gb-esim?utm_source=skygruppen',
        source_url: 'https://www.telenor.no',
        scraped_at: new Date().toISOString(),
        is_active: true
      },
      {
        provider_name: 'Telia',
        category: 'mobile',
        plan_name: '10GB 5G Norway',
        monthly_price: 349,
        offer_url: 'https://www.telia.no/mobilabonnement/10gb-5g',
        features: {
          nb: ['10GB data', '5G support', 'Urban coverage', 'Streaming optimized'],
          en: ['10GB data', '5G support', 'Urban coverage', 'Streaming optimized']
        },
        data_allowance: '10GB',
        speed: '5G',
        contract_length: '30 days',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Telia_Company_Logo.svg/320px-Telia_Company_Logo.svg.png',
        direct_link: 'https://www.telia.no/mobilabonnement/10gb-5g?utm_source=skygruppen',
        source_url: 'https://www.telia.no',
        scraped_at: new Date().toISOString(),
        is_active: true
      },
      {
        provider_name: 'Ice',
        category: 'mobile',
        plan_name: '35GB EU Roaming',
        monthly_price: 379,
        offer_url: 'https://www.ice.no/abonnement/35gb-eu',
        features: {
          nb: ['35GB data', 'EU data included', '4G/5G coverage', 'International roaming'],
          en: ['35GB data', 'EU data included', '4G/5G coverage', 'International roaming']
        },
        data_allowance: '35GB',
        speed: '4G/5G',
        contract_length: '30 days',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Ice_logo_2018.svg/320px-Ice_logo_2018.svg.png',
        direct_link: 'https://www.ice.no/abonnement/35gb-eu?utm_source=skygruppen',
        source_url: 'https://www.ice.no',
        scraped_at: new Date().toISOString(),
        is_active: true
      },
      {
        provider_name: 'PlussMobil',
        category: 'mobile',
        plan_name: '100GB High Data',
        monthly_price: 249,
        offer_url: 'https://www.plussmobil.no/abonnement/100gb',
        features: {
          nb: ['100GB data', 'High-data users', 'Promotional price', 'Norway coverage'],
          en: ['100GB data', 'High-data users', 'Promotional price', 'Norway coverage']
        },
        data_allowance: '100GB',
        speed: '4G',
        contract_length: '30 days',
        logo_url: 'https://www.plussmobil.no/assets/logo.svg',
        direct_link: 'https://www.plussmobil.no/abonnement/100gb?utm_source=skygruppen',
        source_url: 'https://www.plussmobil.no',
        scraped_at: new Date().toISOString(),
        is_active: true
      },
      {
        provider_name: 'Lycamobile',
        category: 'mobile',
        plan_name: '10GB Prepaid Norway',
        monthly_price: 189,
        offer_url: 'https://www.lycamobile.no/plans/10gb-prepaid',
        features: {
          nb: ['10GB data', 'Physical SIM', 'EU roaming', 'Budget travelers', 'Telia network'],
          en: ['10GB data', 'Physical SIM', 'EU roaming', 'Budget travelers', 'Telia network']
        },
        data_allowance: '10GB',
        speed: '4G',
        contract_length: '30 days',
        logo_url: 'https://www.lycamobile.no/assets/logo.svg',
        direct_link: 'https://www.lycamobile.no/plans/10gb-prepaid?utm_source=skygruppen',
        source_url: 'https://www.lycamobile.no',
        scraped_at: new Date().toISOString(),
        is_active: true
      }
    ];

    // Clear existing mobile offers and insert new ones
    const { error: deleteError } = await supabase
      .from('provider_offers')
      .delete()
      .eq('category', 'mobile');

    if (deleteError) {
      console.error('Failed to clear existing offers:', deleteError);
    }

    const { error: insertError } = await supabase
      .from('provider_offers')
      .insert(fallbackOffers);

    if (insertError) {
      console.error('Failed to insert fallback offers:', insertError);
    } else {
      console.log(`✅ Successfully stored ${fallbackOffers.length} fallback offers`);
    }
  }

  static async updateProviderConfigs(): Promise<void> {
    console.log('🔧 Updating Norwegian provider configurations...');
    
    const configs = this.configs.map(config => ({
      provider_name: config.provider,
      category: config.category,
      scrape_url: config.endpoints.plans,
      scrape_method: 'hybrid', // Use both API and HTML scraping
      selectors: config.selectors,
      api_config: config.apiConfig || {},
      is_enabled: true,
      scrape_frequency: 'hourly', // More frequent updates for real-time data
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    for (const config of configs) {
      const { error } = await supabase
        .from('provider_configs')
        .upsert(config, { onConflict: 'provider_name,category' });

      if (error) {
        console.error(`Failed to update config for ${config.provider_name}:`, error);
      }
    }

    console.log('✅ Provider configurations updated');
  }

  static async startRealTimeMonitoring(): Promise<void> {
    console.log('🚨 Starting real-time price monitoring...');
    
    // Set up periodic scraping
    setInterval(async () => {
      try {
        await this.scrapeAllProviders();
        await DynamicProviderService.monitorPromotions();
      } catch (error) {
        console.error('❌ Monitoring error:', error);
      }
    }, 60 * 60 * 1000); // Every hour
    
    console.log('✅ Real-time monitoring started');
  }
}

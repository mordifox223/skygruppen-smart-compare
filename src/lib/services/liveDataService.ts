
import { supabase } from '@/integrations/supabase/client';

interface ProductData {
  name: string;
  url: string;
  price: string;
  description: string;
  category: string;
  provider: string;
}

export class LiveDataService {
  private static baseUrls = {
    talkmore: 'https://www.talkmore.no/mobilabonnement',
    fjordkraft: 'https://www.fjordkraft.no/strom',
    if_forsikring: 'https://www.if.no/privat/bilforsikring',
    sparebank1: 'https://www.sparebank1.no/bank/privat/lan/boliglan'
  };

  static async scrapeProvider(providerName: string, category: string): Promise<ProductData[]> {
    try {
      console.log(`Triggering live scraping for ${providerName} in category ${category}`);
      
      const { data, error } = await supabase.functions.invoke('scrape-live-products', {
        body: {
          provider: providerName,
          category: category,
          baseUrl: this.getBaseUrl(providerName)
        }
      });

      if (error) {
        console.error('Scraping error:', error);
        return [];
      }

      return data?.products || [];
    } catch (error) {
      console.error(`Failed to scrape ${providerName}:`, error);
      return [];
    }
  }

  static async validateUrls(urls: string[]): Promise<{ url: string; valid: boolean; status?: number }[]> {
    try {
      const { data, error } = await supabase.functions.invoke('validate-urls', {
        body: { urls }
      });

      if (error) {
        console.error('URL validation error:', error);
        return urls.map(url => ({ url, valid: false }));
      }

      return data?.results || [];
    } catch (error) {
      console.error('Failed to validate URLs:', error);
      return urls.map(url => ({ url, valid: false }));
    }
  }

  static async getAllProductsForCategory(category: string): Promise<ProductData[]> {
    const providers = this.getProvidersForCategory(category);
    const allProducts: ProductData[] = [];

    for (const provider of providers) {
      const products = await this.scrapeProvider(provider, category);
      allProducts.push(...products);
    }

    return allProducts;
  }

  private static getBaseUrl(providerName: string): string {
    return this.baseUrls[providerName.toLowerCase().replace(' ', '_')] || '';
  }

  private static getProvidersForCategory(category: string): string[] {
    switch (category) {
      case 'mobile':
        return ['talkmore', 'telenor', 'telia', 'ice', 'onecall'];
      case 'electricity':
        return ['fjordkraft', 'tibber', 'hafslund', 'lyse'];
      case 'insurance':
        return ['if_forsikring', 'gjensidige', 'tryg', 'fremtind'];
      case 'loan':
        return ['sparebank1', 'dnb', 'nordea', 'handelsbanken'];
      default:
        return [];
    }
  }

  static async updateProviderConfigs(): Promise<void> {
    const configs = [
      // Mobile providers
      {
        provider_name: 'Talkmore',
        category: 'mobile',
        scrape_url: 'https://www.talkmore.no/mobilabonnement',
        scrape_method: 'html',
        selectors: {
          products: '.product-card, .subscription-card',
          name: '.product-title, .subscription-title, h3',
          price: '.price, .monthly-price, .kr',
          link: 'a[href*="abonnement"]',
          description: '.product-description, .features'
        }
      },
      // Electricity providers
      {
        provider_name: 'Fjordkraft',
        category: 'electricity',
        scrape_url: 'https://www.fjordkraft.no/strom',
        scrape_method: 'html',
        selectors: {
          products: '.product-card, .electricity-plan',
          name: '.plan-title, .product-name, h3',
          price: '.price, .monthly-fee, .kr',
          link: 'a[href*="strom"]',
          description: '.plan-description, .features'
        }
      },
      // Insurance providers
      {
        provider_name: 'If Forsikring',
        category: 'insurance',
        scrape_url: 'https://www.if.no/privat/bilforsikring',
        scrape_method: 'html',
        selectors: {
          products: '.insurance-product, .product-card',
          name: '.product-title, .insurance-title, h3',
          price: '.price, .premium, .kr',
          link: 'a[href*="bilforsikring"]',
          description: '.product-description, .coverage'
        }
      },
      // Loan providers
      {
        provider_name: 'Sparebank 1',
        category: 'loan',
        scrape_url: 'https://www.sparebank1.no/bank/privat/lan/boliglan',
        scrape_method: 'html',
        selectors: {
          products: '.loan-product, .product-card',
          name: '.loan-title, .product-name, h3',
          price: '.interest-rate, .rate, .percent',
          link: 'a[href*="boliglan"]',
          description: '.loan-description, .terms'
        }
      }
    ];

    for (const config of configs) {
      const { error } = await supabase
        .from('provider_configs')
        .upsert(config, { onConflict: 'provider_name,category' });

      if (error) {
        console.error(`Failed to update config for ${config.provider_name}:`, error);
      }
    }

    console.log('Provider configs updated successfully');
  }
}

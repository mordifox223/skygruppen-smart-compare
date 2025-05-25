
export interface ScrapedOffer {
  provider_name: string;
  plan_name: string;
  monthly_price: number;
  data_allowance?: string;
  speed?: string;
  contract_length?: string;
  offer_url: string;
  direct_link?: string;
  logo_url?: string;
  features: Record<string, any>;
}

export interface ScrapingConfig {
  provider_name: string;
  category: string;
  scrape_url: string;
  scrape_method: 'html' | 'api' | 'headless';
  selectors: Record<string, string>;
  api_config?: Record<string, any>;
}

export abstract class BaseScraper {
  protected config: ScrapingConfig;

  constructor(config: ScrapingConfig) {
    this.config = config;
  }

  abstract scrape(): Promise<ScrapedOffer[]>;

  protected parsePrice(priceText: string): number {
    // Remove currency symbols and extract number
    const cleaned = priceText.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  }

  protected extractFeatures(element: Element): Record<string, any> {
    // Default feature extraction logic
    const features: Record<string, any> = {};
    
    // Look for common feature patterns
    const featureElements = element.querySelectorAll('[data-feature], .feature, .spec');
    featureElements.forEach((el) => {
      const key = el.getAttribute('data-feature') || el.textContent?.split(':')[0]?.trim();
      const value = el.textContent?.split(':')[1]?.trim() || el.textContent?.trim();
      if (key && value) {
        features[key] = value;
      }
    });

    return features;
  }

  protected validateOffer(offer: Partial<ScrapedOffer>): offer is ScrapedOffer {
    return !!(
      offer.provider_name &&
      offer.plan_name &&
      offer.monthly_price &&
      offer.monthly_price > 0 &&
      offer.offer_url
    );
  }
}

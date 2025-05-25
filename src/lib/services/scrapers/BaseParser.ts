
export interface ScrapedProduct {
  name: string;
  price: string;
  description: string;
  url: string;
}

export interface ScrapingResult {
  category: string;
  source: string;
  scrapedAt: string;
  products: ScrapedProduct[];
  validation: Array<{
    url: string;
    valid: boolean;
    status: number;
  }>;
}

export abstract class BaseParser {
  protected baseUrl: string;
  protected category: string;
  protected providerName: string;

  constructor(baseUrl: string, category: string, providerName: string) {
    this.baseUrl = baseUrl;
    this.category = category;
    this.providerName = providerName;
  }

  abstract scrape(): Promise<ScrapingResult>;

  protected async validateUrl(url: string): Promise<{ url: string; valid: boolean; status: number }> {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      return {
        url,
        valid: response.ok,
        status: response.status
      };
    } catch (error) {
      console.error(`URL validation failed for ${url}:`, error);
      return {
        url,
        valid: false,
        status: 0
      };
    }
  }

  protected createResult(products: ScrapedProduct[], validationResults: Array<{ url: string; valid: boolean; status: number }>): ScrapingResult {
    return {
      category: this.category,
      source: this.baseUrl,
      scrapedAt: new Date().toISOString(),
      products,
      validation: validationResults
    };
  }

  protected extractPriceFromText(text: string): string {
    // Extract price patterns like "199 kr", "kr 299", "299,-", etc.
    const pricePatterns = [
      /(\d+[\s,.-]*kr)/gi,
      /(kr[\s]*\d+)/gi,
      /(\d+[\s]*,-)/gi,
      /(\d+[\s]*øre)/gi,
      /(\d+[.,]\d+[\s]*%)/gi
    ];

    for (const pattern of pricePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }

    // If no specific price pattern found, look for any number with common currency indicators
    const generalMatch = text.match(/\d+[.,]?\d*[\s]*(kr|øre|%)/gi);
    return generalMatch ? generalMatch[0].trim() : 'Se pris';
  }
}

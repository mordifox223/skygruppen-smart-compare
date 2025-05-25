
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

  protected async findValidProductUrl(domain: string, category: string): Promise<string> {
    const potentialPaths = this.getCategoryPaths(category);
    
    for (const path of potentialPaths) {
      const testUrl = `https://${domain}${path}`;
      try {
        const response = await fetch(testUrl, { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        if (response.ok) {
          console.log(`✅ Found valid URL for ${this.providerName}: ${testUrl}`);
          return testUrl;
        }
      } catch (error) {
        console.log(`❌ Failed to reach: ${testUrl}`);
      }
    }
    
    // Fallback to domain root if no specific path works
    return `https://${domain}`;
  }

  private getCategoryPaths(category: string): string[] {
    switch (category) {
      case 'mobile':
        return [
          '/mobilabonnement',
          '/mobil',
          '/abonnement',
          '/privat/mobil',
          '/privat/mobilabonnement'
        ];
      case 'electricity':
        return [
          '/strom',
          '/stroem',
          '/electricity',
          '/privat/strom',
          '/energi'
        ];
      case 'insurance':
        return [
          '/forsikring',
          '/bilforsikring',
          '/privat/forsikring',
          '/privat/bilforsikring',
          '/insurance'
        ];
      case 'loan':
        return [
          '/lan',
          '/laan',
          '/boliglan',
          '/boliglaan',
          '/privat/lan',
          '/bank/privat/lan'
        ];
      default:
        return ['/'];
    }
  }

  protected async validateUrl(url: string): Promise<{ url: string; valid: boolean; status: number }> {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      // Check if redirected to 404 page
      if (response.url.includes('404') || response.url.includes('not-found')) {
        return { url, valid: false, status: 404 };
      }
      
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

  protected async extractLinksFromPage(html: string, domain: string): Promise<string[]> {
    const links: string[] = [];
    
    // Extract all links that might lead to products
    const linkMatches = html.match(/href="([^"]*(?:abonnement|strom|forsikring|lan|produkt|tilbud)[^"]*)"/gi) || [];
    
    for (const match of linkMatches) {
      const urlMatch = match.match(/href="([^"]*)"/);
      if (urlMatch && urlMatch[1]) {
        let url = urlMatch[1];
        if (!url.startsWith('http')) {
          url = `https://${domain}${url.startsWith('/') ? url : '/' + url}`;
        }
        links.push(url);
      }
    }
    
    return [...new Set(links)]; // Remove duplicates
  }
}

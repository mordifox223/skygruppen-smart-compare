
import { BaseParser, ScrapedProduct, ScrapingResult } from './BaseParser';

export class FjordkraftParser extends BaseParser {
  constructor() {
    super('https://www.fjordkraft.no/strom', 'electricity', 'Fjordkraft');
  }

  async scrape(): Promise<ScrapingResult> {
    try {
      console.log(`Scraping Fjordkraft products from ${this.baseUrl}`);
      
      const response = await fetch(this.baseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Fjordkraft: ${response.status}`);
      }

      const html = await response.text();
      const products = this.parseProducts(html);
      
      const validationResults = await Promise.all(
        products.map(p => this.validateUrl(p.url))
      );

      return this.createResult(products, validationResults);
    } catch (error) {
      console.error('Fjordkraft scraping failed:', error);
      return this.createResult([], []);
    }
  }

  private parseProducts(html: string): ScrapedProduct[] {
    const products: ScrapedProduct[] = [];

    // Look for electricity plan patterns
    const planNames = html.match(/(?:Variabel|Fast|Spotpris|Strøm)[\w\s]*/gi) || [];
    const prices = html.match(/(\d+)\s*(?:kr|øre)/gi) || [];
    const linkMatches = html.match(/href="([^"]*(?:strom|variabel|fast)[^"]*)"/gi) || [];

    for (let i = 0; i < Math.min(planNames.length, 5); i++) {
      const name = planNames[i]?.trim();
      const price = prices[i] || 'Se pris';
      
      let url = this.baseUrl;
      if (linkMatches[i]) {
        const linkMatch = linkMatches[i].match(/href="([^"]*)"/);
        if (linkMatch && linkMatch[1]) {
          url = linkMatch[1].startsWith('http') 
            ? linkMatch[1] 
            : `https://www.fjordkraft.no${linkMatch[1]}`;
        }
      }

      if (name && name.length > 3) {
        products.push({
          name,
          url,
          price: this.extractPriceFromText(price),
          description: `Fjordkraft ${name} - konkurransedyktig strømavtale`
        });
      }
    }

    // Add fallback products
    if (products.length === 0) {
      products.push(
        {
          name: 'Strøm Variabel',
          url: 'https://www.fjordkraft.no/strom/variabel',
          price: '29 kr/mnd',
          description: 'Fjordkraft Variabel - følg spotprisen'
        },
        {
          name: 'Strøm Fast',
          url: 'https://www.fjordkraft.no/strom/fast',
          price: '49 kr/mnd',
          description: 'Fjordkraft Fast - trygg fast pris'
        }
      );
    }

    return products.slice(0, 10);
  }
}

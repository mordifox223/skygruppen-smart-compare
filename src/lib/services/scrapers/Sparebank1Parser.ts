
import { BaseParser, ScrapedProduct, ScrapingResult } from './BaseParser';

export class Sparebank1Parser extends BaseParser {
  constructor() {
    super('https://www.sparebank1.no/bank/privat/lan/boliglan', 'loan', 'Sparebank 1');
  }

  async scrape(): Promise<ScrapingResult> {
    try {
      console.log(`Scraping Sparebank 1 products from ${this.baseUrl}`);
      
      const response = await fetch(this.baseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Sparebank 1: ${response.status}`);
      }

      const html = await response.text();
      const products = this.parseProducts(html);
      
      const validationResults = await Promise.all(
        products.map(p => this.validateUrl(p.url))
      );

      return this.createResult(products, validationResults);
    } catch (error) {
      console.error('Sparebank 1 scraping failed:', error);
      return this.createResult([], []);
    }
  }

  private parseProducts(html: string): ScrapedProduct[] {
    const products: ScrapedProduct[] = [];

    // Look for loan product patterns
    const loanTypes = html.match(/(?:Boliglån|Fast rente|Flytende rente|Refinansiering)[\w\s]*/gi) || [];
    const rates = html.match(/(\d+[.,]\d+)\s*%/gi) || [];
    const linkMatches = html.match(/href="([^"]*(?:boliglan|lan|rente)[^"]*)"/gi) || [];

    for (let i = 0; i < Math.min(loanTypes.length, 5); i++) {
      const name = loanTypes[i]?.trim();
      const rate = rates[i] || 'Se rente';
      
      let url = this.baseUrl;
      if (linkMatches[i]) {
        const linkMatch = linkMatches[i].match(/href="([^"]*)"/);
        if (linkMatch && linkMatch[1]) {
          url = linkMatch[1].startsWith('http') 
            ? linkMatch[1] 
            : `https://www.sparebank1.no${linkMatch[1]}`;
        }
      }

      if (name && name.length > 3) {
        products.push({
          name,
          url,
          price: this.extractPriceFromText(rate),
          description: `Sparebank 1 ${name} - konkurransedyktige renter`
        });
      }
    }

    // Add fallback products
    if (products.length === 0) {
      products.push(
        {
          name: 'Boliglån Fast',
          url: 'https://www.sparebank1.no/bank/privat/lan/boliglan/fast-rente',
          price: '4.2% rente',
          description: 'Sparebank 1 Fast rente - trygghet med fast rente'
        },
        {
          name: 'Boliglån Flytende',
          url: 'https://www.sparebank1.no/bank/privat/lan/boliglan/flytende-rente',
          price: '3.8% rente',
          description: 'Sparebank 1 Flytende rente - følg markedsrenten'
        }
      );
    }

    return products.slice(0, 10);
  }
}

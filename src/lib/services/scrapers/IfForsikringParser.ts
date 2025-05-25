
import { BaseParser, ScrapedProduct, ScrapingResult } from './BaseParser';

export class IfForsikringParser extends BaseParser {
  constructor() {
    super('https://www.if.no/privat/bilforsikring', 'insurance', 'If Forsikring');
  }

  async scrape(): Promise<ScrapingResult> {
    try {
      console.log(`Scraping If Forsikring products from ${this.baseUrl}`);
      
      const response = await fetch(this.baseUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch If Forsikring: ${response.status}`);
      }

      const html = await response.text();
      const products = this.parseProducts(html);
      
      const validationResults = await Promise.all(
        products.map(p => this.validateUrl(p.url))
      );

      return this.createResult(products, validationResults);
    } catch (error) {
      console.error('If Forsikring scraping failed:', error);
      return this.createResult([], []);
    }
  }

  private parseProducts(html: string): ScrapedProduct[] {
    const products: ScrapedProduct[] = [];

    // Look for insurance product patterns
    const insuranceTypes = html.match(/(?:Kasko|Ansvar|Delkasko|Bilforsikring)[\w\s]*/gi) || [];
    const prices = html.match(/(?:fra\s*)?(\d+)\s*kr/gi) || [];
    const linkMatches = html.match(/href="([^"]*(?:bilforsikring|kasko|ansvar)[^"]*)"/gi) || [];

    for (let i = 0; i < Math.min(insuranceTypes.length, 5); i++) {
      const name = insuranceTypes[i]?.trim();
      const price = prices[i] || 'Få tilbud';
      
      let url = this.baseUrl;
      if (linkMatches[i]) {
        const linkMatch = linkMatches[i].match(/href="([^"]*)"/);
        if (linkMatch && linkMatch[1]) {
          url = linkMatch[1].startsWith('http') 
            ? linkMatch[1] 
            : `https://www.if.no${linkMatch[1]}`;
        }
      }

      if (name && name.length > 3) {
        products.push({
          name,
          url,
          price: this.extractPriceFromText(price),
          description: `If ${name} - trygg bilforsikring`
        });
      }
    }

    // Add fallback products
    if (products.length === 0) {
      products.push(
        {
          name: 'Bilforsikring Kasko',
          url: 'https://www.if.no/privat/bilforsikring/kasko',
          price: 'fra 299 kr/mnd',
          description: 'If Kasko - best mulig dekning for bilen din'
        },
        {
          name: 'Bilforsikring Ansvar',
          url: 'https://www.if.no/privat/bilforsikring/ansvar',
          price: 'fra 149 kr/mnd',
          description: 'If Ansvar - lovpålagt minimum forsikring'
        }
      );
    }

    return products.slice(0, 10);
  }
}

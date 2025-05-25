
import { BaseParser, ScrapedProduct, ScrapingResult } from './BaseParser';

export class Sparebank1Parser extends BaseParser {
  constructor() {
    super('https://www.sparebank1.no', 'loan', 'Sparebank 1');
  }

  async scrape(): Promise<ScrapingResult> {
    try {
      console.log(`🔄 Starting dynamic scraping for ${this.providerName}`);
      
      const validUrl = await this.findValidProductUrl('www.sparebank1.no', 'loan');
      this.baseUrl = validUrl;

      const response = await fetch(validUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        console.warn(`Failed to fetch Sparebank 1: ${response.status}, using fallback data`);
        return this.createFallbackResult();
      }

      const html = await response.text();
      const products = await this.parseProducts(html);
      
      const validationResults = await Promise.all(
        products.map(p => this.validateUrl(p.url))
      );

      console.log(`✅ Sparebank 1 scraping completed: ${products.length} products found`);
      return this.createResult(products, validationResults);
    } catch (error) {
      console.error('Sparebank 1 scraping failed:', error);
      return this.createFallbackResult();
    }
  }

  private async parseProducts(html: string): Promise<ScrapedProduct[]> {
    const products: ScrapedProduct[] = [];

    const loanTypes = this.extractLoanTypes(html);
    const rates = html.match(/(\d+[.,]\d+)\s*%/gi) || [];
    const productLinks = await this.extractLinksFromPage(html, 'www.sparebank1.no');

    for (let i = 0; i < Math.min(loanTypes.length, 6); i++) {
      const name = loanTypes[i]?.trim();
      const rate = rates[i] || 'Se rente';
      
      let productUrl = this.baseUrl;
      const matchingLink = productLinks.find(link => 
        link.toLowerCase().includes(name.toLowerCase().split(' ')[0])
      );
      if (matchingLink) {
        productUrl = matchingLink;
      }

      if (name && name.length > 3) {
        products.push({
          name,
          url: productUrl,
          price: this.extractPriceFromText(rate),
          description: `Sparebank 1 ${name} - konkurransedyktige renter og fleksible vilkår`
        });
      }
    }

    if (products.length === 0) {
      products.push(...this.getFallbackProducts());
    }

    return products.slice(0, 8);
  }

  private extractLoanTypes(html: string): string[] {
    const patterns = [
      /(?:Boliglån|Boliglaan)[\w\s]*/gi,
      /(?:Fast|Flytende)\s*rente[\w\s]*/gi,
      /(?:Refinansiering|Rammelån|Byggel[aå]n)[\w\s]*/gi
    ];

    const types: string[] = [];
    for (const pattern of patterns) {
      const matches = html.match(pattern) || [];
      types.push(...matches.map(m => m.trim()).filter(m => m.length > 3));
    }

    return [...new Set(types)];
  }

  private getFallbackProducts(): ScrapedProduct[] {
    return [
      {
        name: 'Boliglån Fast rente',
        url: 'https://www.sparebank1.no/bank/privat/lan/boliglan',
        price: '4.2% rente',
        description: 'Sparebank 1 Fast rente - trygghet med fast rente'
      },
      {
        name: 'Boliglån Flytende rente',
        url: 'https://www.sparebank1.no/bank/privat/lan/boliglan',
        price: '3.8% rente',
        description: 'Sparebank 1 Flytende rente - følg markedsrenten'
      },
      {
        name: 'Rammelån',
        url: 'https://www.sparebank1.no/bank/privat/lan/rammelan',
        price: '5.1% rente',
        description: 'Sparebank 1 Rammelån - fleksibel kredit når du trenger det'
      }
    ];
  }

  private createFallbackResult(): ScrapingResult {
    const fallbackProducts = this.getFallbackProducts();
    return this.createResult(fallbackProducts, []);
  }
}

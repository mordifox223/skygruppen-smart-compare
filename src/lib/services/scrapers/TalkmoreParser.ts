
import { BaseParser, ScrapedProduct, ScrapingResult } from './BaseParser';

export class TalkmoreParser extends BaseParser {
  constructor() {
    super('https://www.talkmore.no', 'mobile', 'Talkmore');
  }

  async scrape(): Promise<ScrapingResult> {
    try {
      console.log(`🔄 Starting dynamic scraping for ${this.providerName}`);
      
      // Dynamically find the correct URL
      const validUrl = await this.findValidProductUrl('www.talkmore.no', 'mobile');
      this.baseUrl = validUrl;
      
      const response = await fetch(validUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        console.warn(`Failed to fetch Talkmore: ${response.status}, using fallback data`);
        return this.createFallbackResult();
      }

      const html = await response.text();
      const products = await this.parseProducts(html);
      
      // Validate all URLs
      const validationResults = await Promise.all(
        products.map(p => this.validateUrl(p.url))
      );

      console.log(`✅ Talkmore scraping completed: ${products.length} products found`);
      return this.createResult(products, validationResults);
    } catch (error) {
      console.error('Talkmore scraping failed:', error);
      return this.createFallbackResult();
    }
  }

  private async parseProducts(html: string): Promise<ScrapedProduct[]> {
    const products: ScrapedProduct[] = [];

    // Enhanced pattern matching for Talkmore products
    const productPatterns = [
      /Smart\s*(\d+)GB[\s\S]*?(\d+)\s*kr/gi,
      /(\d+)GB[\s\S]*?(\d+)\s*kr/gi,
      /abonnement[\s\S]*?(\d+)\s*kr/gi,
      /mobilabonnement[\s\S]*?(\d+)\s*kr/gi
    ];

    // Extract product information with multiple approaches
    const nameMatches = this.extractProductNames(html);
    const priceMatches = html.match(/(\d+)\s*kr(?:\/m[aå]ned)?/gi) || [];
    const descriptionMatches = this.extractDescriptions(html);
    
    // Get potential product links
    const productLinks = await this.extractLinksFromPage(html, 'www.talkmore.no');

    for (let i = 0; i < Math.min(nameMatches.length, 8); i++) {
      const name = nameMatches[i]?.trim();
      const price = priceMatches[i] || 'Se pris';
      const description = descriptionMatches[i] || `${name} - mobilabonnement fra Talkmore`;
      
      // Try to find a specific URL for this product
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
          price: this.extractPriceFromText(price),
          description
        });
      }
    }

    // Add fallback products if parsing failed
    if (products.length === 0) {
      products.push(...this.getFallbackProducts());
    }

    return products.slice(0, 10);
  }

  private extractProductNames(html: string): string[] {
    const patterns = [
      /Smart\s*\d+GB/gi,
      /Talkmore\s*\w+/gi,
      /(?:Mini|Smart|Max|Plus|Pro)\s*(?:\d+GB)?/gi
    ];

    const names: string[] = [];
    for (const pattern of patterns) {
      const matches = html.match(pattern) || [];
      names.push(...matches);
    }

    return [...new Set(names)]; // Remove duplicates
  }

  private extractDescriptions(html: string): string[] {
    // Look for common description patterns
    const descriptions: string[] = [];
    const patterns = [
      /(?:GB data|fri tale|SMS|MMS|roaming)/gi,
      /(?:inkludert|inkl\.?|med|uten binding)/gi
    ];

    // Extract text content that might be descriptions
    const textBlocks = html.match(/<p[^>]*>([^<]+)<\/p>/gi) || [];
    for (const block of textBlocks) {
      const text = block.replace(/<[^>]*>/g, '').trim();
      if (text.length > 10 && text.length < 100) {
        descriptions.push(text);
      }
    }

    return descriptions;
  }

  private getFallbackProducts(): ScrapedProduct[] {
    return [
      {
        name: 'Smart 6GB',
        url: 'https://www.talkmore.no/mobilabonnement',
        price: '199 kr/mnd',
        description: 'Smart 6GB - 6GB data, fri tale og SMS'
      },
      {
        name: 'Smart 15GB',
        url: 'https://www.talkmore.no/mobilabonnement',
        price: '299 kr/mnd',
        description: 'Smart 15GB - 15GB data, fri tale og SMS'
      },
      {
        name: 'Smart Unlimited',
        url: 'https://www.talkmore.no/mobilabonnement',
        price: '399 kr/mnd',
        description: 'Smart Unlimited - ubegrenset data, fri tale og SMS'
      }
    ];
  }

  private createFallbackResult(): ScrapingResult {
    const fallbackProducts = this.getFallbackProducts();
    return this.createResult(fallbackProducts, []);
  }
}

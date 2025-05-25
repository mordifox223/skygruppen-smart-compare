
import { BaseParser, ScrapingResult } from './BaseParser';
import { TalkmoreParser } from './TalkmoreParser';
import { FjordkraftParser } from './FjordkraftParser';
import { IfForsikringParser } from './IfForsikringParser';
import { Sparebank1Parser } from './Sparebank1Parser';

export class ParserManager {
  private parsers: Map<string, () => BaseParser> = new Map();

  constructor() {
    this.initializeParsers();
  }

  private initializeParsers() {
    // Mobile providers
    this.parsers.set('mobile-talkmore', () => new TalkmoreParser());
    
    // Electricity providers  
    this.parsers.set('electricity-fjordkraft', () => new FjordkraftParser());
    
    // Insurance providers
    this.parsers.set('insurance-if_forsikring', () => new IfForsikringParser());
    
    // Loan providers
    this.parsers.set('loan-sparebank1', () => new Sparebank1Parser());
  }

  async scrapeProvider(category: string, providerName: string): Promise<ScrapingResult> {
    const key = `${category}-${providerName.toLowerCase().replace(/\s+/g, '_')}`;
    const parserFactory = this.parsers.get(key);

    if (!parserFactory) {
      console.warn(`⚠️ No parser found for ${category}-${providerName}, creating generic result`);
      return this.createGenericResult(category, providerName);
    }

    try {
      const parser = parserFactory();
      const result = await parser.scrape();
      console.log(`✅ Successfully scraped ${result.products.length} products from ${providerName}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to scrape ${providerName}:`, error);
      return this.createGenericResult(category, providerName);
    }
  }

  async scrapeCategory(category: string): Promise<ScrapingResult[]> {
    const providers = this.getProvidersForCategory(category);
    const results: ScrapingResult[] = [];

    console.log(`🔄 Scraping ${providers.length} providers for category: ${category}`);

    for (const provider of providers) {
      try {
        const result = await this.scrapeProvider(category, provider);
        if (result.products.length > 0) {
          results.push(result);
        }
      } catch (error) {
        console.error(`❌ Failed to scrape ${provider} in category ${category}:`, error);
      }
    }

    return results;
  }

  async scrapeAll(): Promise<Map<string, ScrapingResult[]>> {
    const categories = ['mobile', 'electricity', 'insurance', 'loan'];
    const allResults = new Map<string, ScrapingResult[]>();

    for (const category of categories) {
      console.log(`🌐 Scraping all providers for ${category}...`);
      const results = await this.scrapeCategory(category);
      allResults.set(category, results);
    }

    return allResults;
  }

  private createGenericResult(category: string, providerName: string): ScrapingResult {
    return {
      category,
      source: `https://www.${providerName.toLowerCase().replace(' ', '')}.no`,
      scrapedAt: new Date().toISOString(),
      products: [
        {
          name: `${providerName} Standard`,
          url: `https://www.${providerName.toLowerCase().replace(' ', '')}.no`,
          price: 'Se tilbud',
          description: `Standard tilbud fra ${providerName}`
        }
      ],
      validation: []
    };
  }

  private getProvidersForCategory(category: string): string[] {
    switch (category) {
      case 'mobile':
        return ['talkmore', 'telenor', 'telia', 'ice', 'onecall'];
      case 'electricity':
        return ['fjordkraft', 'tibber', 'hafslund', 'lyse', 'agva'];
      case 'insurance':
        return ['if_forsikring', 'gjensidige', 'tryg', 'fremtind', 'codan'];
      case 'loan':
        return ['sparebank1', 'dnb', 'nordea', 'handelsbanken', 'skandiabanken'];
      default:
        return [];
    }
  }

  getAvailableParsers(): Array<{ category: string; provider: string; key: string }> {
    return Array.from(this.parsers.keys()).map(key => {
      const [category, provider] = key.split('-');
      return {
        category,
        provider: provider.replace('_', ' '),
        key
      };
    });
  }
}

export const parserManager = new ParserManager();

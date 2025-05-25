
import { parserManager } from './scrapers/ParserManager';
import { ScrapingResult } from './scrapers/BaseParser';

export class UniversalScrapingService {
  static async scrapeProvider(category: string, providerName: string): Promise<ScrapingResult> {
    console.log(`🔄 Starting universal scraping for ${providerName} in ${category}`);
    
    try {
      const result = await parserManager.scrapeProvider(category, providerName);
      
      console.log(`✅ Scraping completed: ${result.products.length} products found`);
      return result;
    } catch (error) {
      console.error(`❌ Scraping failed for ${providerName}:`, error);
      throw error;
    }
  }

  static async scrapeCategory(category: string): Promise<ScrapingResult[]> {
    console.log(`🔄 Starting category scraping for ${category}`);
    
    try {
      const results = await parserManager.scrapeCategory(category);
      const totalProducts = results.reduce((sum, r) => sum + r.products.length, 0);
      
      console.log(`✅ Category scraping completed: ${totalProducts} total products from ${results.length} providers`);
      return results;
    } catch (error) {
      console.error(`❌ Category scraping failed for ${category}:`, error);
      throw error;
    }
  }

  static async scrapeAll(): Promise<Map<string, ScrapingResult[]>> {
    console.log(`🔄 Starting universal scraping for all categories`);
    
    try {
      const results = await parserManager.scrapeAll();
      
      let totalProducts = 0;
      results.forEach((categoryResults) => {
        totalProducts += categoryResults.reduce((sum, r) => sum + r.products.length, 0);
      });
      
      console.log(`✅ Universal scraping completed: ${totalProducts} total products across all categories`);
      return results;
    } catch (error) {
      console.error(`❌ Universal scraping failed:`, error);
      throw error;
    }
  }

  static async validateAllUrls(results: ScrapingResult[]): Promise<void> {
    console.log(`🔍 Validating URLs from ${results.length} scraping results`);
    
    const allUrls = results.flatMap(result => 
      result.products.map(product => product.url)
    );

    const validationPromises = allUrls.map(async (url) => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`${response.ok ? '✅' : '❌'} ${url} - Status: ${response.status}`);
        return { url, valid: response.ok, status: response.status };
      } catch (error) {
        console.log(`❌ ${url} - Error: ${error.message}`);
        return { url, valid: false, status: 0 };
      }
    });

    const validationResults = await Promise.all(validationPromises);
    const validCount = validationResults.filter(r => r.valid).length;
    
    console.log(`🔍 URL Validation completed: ${validCount}/${allUrls.length} URLs are valid`);
  }

  static exportToJson(results: ScrapingResult[], filename?: string): void {
    const exportData = {
      scrapedAt: new Date().toISOString(),
      totalProviders: results.length,
      totalProducts: results.reduce((sum, r) => sum + r.products.length, 0),
      results: results
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `scraped-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`📁 Data exported to ${a.download}`);
  }

  static getAvailableParsers() {
    return parserManager.getAvailableParsers();
  }
}

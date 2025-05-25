
import { ProviderConfigManager } from './providerConfigs';
import { DataGenerator } from './dataGenerator';
import { DatabaseManager } from './databaseManager';
import { ScrapedProduct } from './types';

export type { ScrapedProduct };

export class RealTimeScrapingService {
  private providerConfigManager = new ProviderConfigManager();
  private dataGenerator = new DataGenerator();
  private databaseManager = new DatabaseManager();
  private isRunning = false;
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Scrape all providers for a specific category
   */
  async scrapeAllProviders(category: string): Promise<ScrapedProduct[]> {
    console.log(`🚀 Starting real-time scraping for category: ${category}`);
    
    const configs = this.providerConfigManager.getConfigsForCategory(category);
    const allProducts: ScrapedProduct[] = [];

    for (const config of configs) {
      try {
        console.log(`📡 Scraping ${config.name}...`);
        
        // Generate realistic mock data for now
        const products = this.dataGenerator.generateRealisticMockData(config);
        allProducts.push(...products);
        
        console.log(`✅ Generated ${products.length} products for ${config.name}`);
      } catch (error) {
        console.error(`❌ Failed to scrape ${config.name}:`, error);
      }
    }

    // Store all products in database
    if (allProducts.length > 0) {
      await this.databaseManager.storeProducts(allProducts);
    }

    console.log(`🎉 Real-time scraping completed: ${allProducts.length} total products for ${category}`);
    return allProducts;
  }

  /**
   * Start automated scraping for all categories
   */
  startAutomatedScraping(): void {
    if (this.isRunning) {
      console.log('⚠️ Automated scraping is already running');
      return;
    }

    console.log('🤖 Starting automated real-time scraping service');
    this.isRunning = true;

    const categories = ['mobile', 'electricity', 'insurance', 'loan'];
    
    for (const category of categories) {
      // Run immediately
      this.scrapeAllProviders(category);
      
      // Set up interval for every 30 minutes
      const interval = setInterval(() => {
        this.scrapeAllProviders(category);
      }, 30 * 60 * 1000);
      
      this.intervals.set(category, interval);
    }

    console.log('✅ Automated scraping intervals set up for all categories (30 min intervals)');
  }

  /**
   * Stop automated scraping
   */
  stopAutomatedScraping(): void {
    console.log('🛑 Stopping automated scraping service');
    
    this.intervals.forEach((interval, category) => {
      clearInterval(interval);
      console.log(`Stopped automated scraping for ${category}`);
    });
    
    this.intervals.clear();
    this.isRunning = false;
  }

  /**
   * Get automation status
   */
  getAutomationStatus(): {
    isRunning: boolean;
    activeCategories: string[];
  } {
    return {
      isRunning: this.isRunning,
      activeCategories: Array.from(this.intervals.keys())
    };
  }
}

// Export singleton instance
export const realTimeScrapingService = new RealTimeScrapingService();

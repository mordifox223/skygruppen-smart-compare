
import { UniversalScrapingService } from './UniversalScrapingService';
import { URLValidationService } from './URLValidationService';
import { realTimeScrapingService } from '../realTimeScraper/RealTimeScrapingService';

export class ScrapingScheduler {
  private static isRunning = false;
  private static intervals: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Start automated scraping for all categories
   */
  static startAutomation(): void {
    if (this.isRunning) {
      console.log('⚠️ Scraping automation is already running');
      return;
    }

    console.log('🚀 Starting automated scraping system');
    this.isRunning = true;

    // Schedule real-time scraping every 30 minutes - this is the main scraper
    this.scheduleRealTimeScraping();
    
    // Schedule hourly validation
    this.scheduleHourlyValidation();
    
    // Run initial scraping to populate database
    this.runInitialScraping();
  }

  /**
   * Stop all automated scraping
   */
  static stopAutomation(): void {
    console.log('🛑 Stopping automated scraping system');
    
    this.intervals.forEach((interval, key) => {
      clearInterval(interval);
      console.log(`Stopped ${key} scheduler`);
    });
    
    this.intervals.clear();
    this.isRunning = false;
  }

  /**
   * Run initial scraping to populate database
   */
  private static async runInitialScraping(): Promise<void> {
    console.log('🌟 Running initial scraping to populate database');
    
    const categories = ['mobile', 'electricity', 'insurance', 'loan'];
    for (const category of categories) {
      try {
        console.log(`🔄 Initial scraping for ${category}`);
        await realTimeScrapingService.scrapeAllProviders(category);
        console.log(`✅ Initial scraping completed for ${category}`);
      } catch (error) {
        console.error(`❌ Initial scraping failed for ${category}:`, error);
      }
    }
  }

  /**
   * Schedule hourly URL validation
   */
  private static scheduleHourlyValidation(): void {
    const hourlyInterval = setInterval(async () => {
      const now = new Date();
      if (now.getMinutes() === 0) {
        console.log('🔍 Starting hourly URL validation');
        const categories = ['mobile', 'electricity', 'insurance', 'loan'];
        
        for (const category of categories) {
          await URLValidationService.scheduleValidation(category);
        }
      }
    }, 60000); // Check every minute

    this.intervals.set('validation', hourlyInterval);
    console.log('📅 Scheduled hourly URL validation');
  }

  /**
   * Schedule real-time scraping every 30 minutes - THIS STORES DATA IN DATABASE
   */
  private static scheduleRealTimeScraping(): void {
    const realTimeInterval = setInterval(async () => {
      const now = new Date();
      if (now.getMinutes() % 30 === 0) {
        console.log('⚡ Starting automated real-time scraping and database update');
        
        const categories = ['mobile', 'electricity', 'insurance', 'loan'];
        for (const category of categories) {
          try {
            console.log(`📊 Scraping and storing data for ${category} in database`);
            await realTimeScrapingService.scrapeAllProviders(category);
            console.log(`✅ Data scraped and stored for ${category}`);
          } catch (error) {
            console.error(`❌ Failed automated scraping for ${category}:`, error);
          }
        }
      }
    }, 60000); // Check every minute

    this.intervals.set('realtime', realTimeInterval);
    console.log('📅 Scheduled real-time scraping every 30 minutes (stores in database)');
  }

  /**
   * Run immediate scraping for a specific category and store in database
   */
  static async runImmediateScraping(category: string): Promise<void> {
    console.log(`⚡ Running immediate scraping for category: ${category} and storing in database`);
    
    try {
      // Use real-time scraping service which stores directly in database
      await realTimeScrapingService.scrapeAllProviders(category);
      console.log(`✅ Immediate scraping completed and data stored for ${category}`);
    } catch (error) {
      console.error(`❌ Immediate scraping failed for ${category}:`, error);
    }
  }

  /**
   * Get automation status
   */
  static getStatus(): {
    isRunning: boolean;
    activeSchedules: string[];
    nextRun: Record<string, string>;
  } {
    return {
      isRunning: this.isRunning,
      activeSchedules: Array.from(this.intervals.keys()),
      nextRun: {
        validation: 'Next validation: Top of next hour',
        realtime: 'Next database update: Every 30 minutes'
      }
    };
  }
}

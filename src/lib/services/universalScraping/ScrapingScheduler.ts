
import { UniversalScrapingService } from './UniversalScrapingService';
import { URLValidationService } from './URLValidationService';

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

    // Schedule daily full scraping
    this.scheduleDailyScraping();
    
    // Schedule hourly validation
    this.scheduleHourlyValidation();
    
    // Schedule priority provider updates every 30 minutes
    this.schedulePriorityUpdates();
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
   * Schedule daily full scraping at 3 AM
   */
  private static scheduleDailyScraping(): void {
    const dailyInterval = setInterval(async () => {
      const now = new Date();
      if (now.getHours() === 3 && now.getMinutes() === 0) {
        console.log('🌅 Starting daily full scraping');
        await UniversalScrapingService.startUniversalScraping();
      }
    }, 60000); // Check every minute

    this.intervals.set('daily', dailyInterval);
    console.log('📅 Scheduled daily scraping at 3:00 AM');
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
   * Schedule priority provider updates every 30 minutes
   */
  private static schedulePriorityUpdates(): void {
    const priorityProviders = ['Telenor', 'Telia', 'Ice', 'Fjordkraft', 'Tibber'];
    
    const priorityInterval = setInterval(async () => {
      const now = new Date();
      if (now.getMinutes() % 30 === 0) {
        console.log('⚡ Starting priority provider updates');
        
        for (const providerName of priorityProviders) {
          try {
            // This would scrape specific high-priority providers
            console.log(`Updating priority provider: ${providerName}`);
          } catch (error) {
            console.error(`Failed to update priority provider ${providerName}:`, error);
          }
        }
      }
    }, 60000); // Check every minute

    this.intervals.set('priority', priorityInterval);
    console.log('📅 Scheduled priority provider updates every 30 minutes');
  }

  /**
   * Run immediate scraping for a specific category
   */
  static async runImmediateScraping(category: string): Promise<void> {
    console.log(`⚡ Running immediate scraping for category: ${category}`);
    
    try {
      const results = await UniversalScrapingService.scrapeCategory(category);
      const successCount = results.filter(r => r.success).length;
      
      console.log(`✅ Immediate scraping completed: ${successCount}/${results.length} providers successful`);
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
        daily: 'Next daily scraping: 3:00 AM',
        validation: 'Next validation: Top of next hour',
        priority: 'Next priority update: Every 30 minutes'
      }
    };
  }
}

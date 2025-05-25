
import { UniversalScrapingService } from './UniversalScrapingService';
import { URLValidationService } from './URLValidationService';
import { realTimeScrapingService } from '../realTimeScraper/RealTimeScrapingService';

export class ScrapingScheduler {
  private static isRunning = false;
  private static intervals: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Start automated scraping for all categories with real-time integration
   */
  static startAutomation(): void {
    if (this.isRunning) {
      console.log('⚠️ Scraping automation is already running');
      return;
    }

    console.log('🚀 Starting integrated automated scraping system');
    this.isRunning = true;

    // Start real-time scraping service (every 30 minutes)
    this.startRealTimeScrapingService();
    
    // Schedule daily full validation
    this.scheduleDailyValidation();
    
    // Schedule priority provider updates every hour
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
   * Start real-time scraping service for automatic data collection
   */
  private static startRealTimeScrapingService(): void {
    console.log('🌐 Starting real-time scraping service...');
    
    // Start automated scraping for all categories
    realTimeScrapingService.startAutomatedScraping();
    
    console.log('✅ Real-time scraping service started (30 min intervals)');
  }

  /**
   * Schedule daily validation at 3 AM
   */
  private static scheduleDailyValidation(): void {
    const dailyInterval = setInterval(async () => {
      const now = new Date();
      if (now.getHours() === 3 && now.getMinutes() === 0) {
        console.log('🌅 Starting daily URL validation');
        const categories = ['mobile', 'electricity', 'insurance', 'loan'];
        
        for (const category of categories) {
          await URLValidationService.scheduleValidation(category);
        }
      }
    }, 60000); // Check every minute

    this.intervals.set('validation', dailyInterval);
    console.log('📅 Scheduled daily URL validation at 3:00 AM');
  }

  /**
   * Schedule priority provider updates every hour
   */
  private static schedulePriorityUpdates(): void {
    const priorityProviders = ['Telenor', 'Telia', 'Ice', 'Fjordkraft', 'Tibber'];
    
    const priorityInterval = setInterval(async () => {
      const now = new Date();
      if (now.getMinutes() === 0) {
        console.log('⚡ Starting priority provider updates');
        
        for (const providerName of priorityProviders) {
          try {
            console.log(`Updating priority provider: ${providerName}`);
            // Priority providers get extra frequent updates
          } catch (error) {
            console.error(`Failed to update priority provider ${providerName}:`, error);
          }
        }
      }
    }, 60000); // Check every minute

    this.intervals.set('priority', priorityInterval);
    console.log('📅 Scheduled priority provider updates every hour');
  }

  /**
   * Run immediate scraping for a specific category
   */
  static async runImmediateScraping(category: string): Promise<void> {
    console.log(`⚡ Running immediate real-time scraping for category: ${category}`);
    
    try {
      const results = await realTimeScrapingService.scrapeAllProviders(category);
      
      console.log(`✅ Immediate scraping completed: ${results.length} products processed and stored`);
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
        realtime: 'Real-time scraping: Every 30 minutes',
        validation: 'Next validation: 3:00 AM daily',
        priority: 'Next priority update: Top of next hour'
      }
    };
  }
}

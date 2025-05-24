
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Abstract base class for provider scrapers
export abstract class ProviderScraper {
  abstract provider: string;
  abstract category: string;
  protected supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );

  async execute(): Promise<void> {
    let retries = 3;
    while (retries--) {
      try {
        console.log(`Scraping ${this.provider} (${retries + 1} attempts left)`);
        const data = await this.scrape();
        await this.validate(data);
        await this.saveToDatabase(data);
        console.log(`Successfully scraped ${this.provider}`);
        return;
      } catch (error) {
        await this.logError(error);
        if (!retries) {
          console.error(`Failed to scrape ${this.provider} after all retries:`, error);
          throw error;
        }
        // Exponential backoff with jitter
        const delay = 2000 * (3 - retries) + Math.random() * 1000;
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  protected abstract scrape(): Promise<any>;

  protected async validate(data: any): Promise<void> {
    if (!data.name || !data.price || !data.offerUrl) {
      throw new Error('Invalid provider data: missing required fields');
    }
    
    if (typeof data.price !== 'number' || data.price <= 0) {
      throw new Error('Invalid price data');
    }
  }

  protected async saveToDatabase(data: any): Promise<void> {
    const { error } = await this.supabase
      .from('providers')
      .upsert({
        name: data.name,
        category: this.category,
        price: data.price,
        offer_url: data.offerUrl,
        features: data.features || {},
        logo: data.logo,
        rating: data.rating,
        last_updated: new Date().toISOString(),
        scraped_at: new Date().toISOString()
      });

    if (error) {
      throw new Error(`Database save failed: ${error.message}`);
    }
  }

  protected async logError(error: any): Promise<void> {
    try {
      await this.supabase
        .from('error_logs')
        .insert({
          provider: this.provider,
          category: this.category,
          error_message: error.message,
          stack_trace: error.stack,
          timestamp: new Date().toISOString()
        });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }
}

// Example implementation for Telenor
class TelenorScraper extends ProviderScraper {
  provider = 'Telenor';
  category = 'mobile';

  protected async scrape() {
    // In production, this would actually scrape Telenor's website
    // For now, return mock data
    await new Promise(r => setTimeout(r, 1000)); // Simulate network delay
    
    return {
      name: 'Telenor',
      price: 399,
      offerUrl: 'https://www.telenor.no/privat/mobil/mobilabonnement/?ref=skycompare',
      features: {
        data: '20GB',
        calls: 'Unlimited',
        sms: 'Unlimited',
        eu_roaming: 'Included'
      },
      logo: 'https://www.telenor.no/content/dam/telenor-no/logo/telenor-logo.svg',
      rating: 4.2
    };
  }
}

// Main function to run all scrapers
serve(async (req) => {
  try {
    console.log('Starting provider data fetch...');
    
    const scrapers = [
      new TelenorScraper(),
      // Add more scrapers here: TibbertScraper, GjensidgeScraper, etc.
    ];

    const results = await Promise.allSettled(
      scrapers.map(scraper => scraper.execute())
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Scraping completed: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        results: { successful, failed },
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Scraping function error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

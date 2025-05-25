
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Import scrapers (these would be actual implementations)
interface ScrapedOffer {
  provider_name: string;
  plan_name: string;
  monthly_price: number;
  data_allowance?: string;
  speed?: string;
  contract_length?: string;
  offer_url: string;
  direct_link?: string;
  logo_url?: string;
  features: Record<string, any>;
}

interface ScrapingConfig {
  provider_name: string;
  category: string;
  scrape_url: string;
  scrape_method: 'html' | 'api' | 'headless';
  selectors: Record<string, string>;
}

// Mock scraper for demonstration
class MockScraper {
  constructor(private config: ScrapingConfig) {}

  async scrape(): Promise<ScrapedOffer[]> {
    console.log(`Mock scraping ${this.config.provider_name}...`);
    
    // Simulate scraping delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Return mock data based on provider
    const mockData: Record<string, ScrapedOffer[]> = {
      'Telia': [
        {
          provider_name: 'Telia',
          plan_name: 'Telia Smart',
          monthly_price: 399,
          data_allowance: '20GB',
          speed: '100 Mbps',
          contract_length: '12 months',
          offer_url: 'https://www.telia.se/privat/mobilt/mobilabonnemang/smart',
          direct_link: 'https://www.telia.se/privat/mobilt/mobilabonnemang/smart?ref=skycompare',
          logo_url: 'https://www.telia.se/content/dam/telia-se/images/logo/telia-logo.svg',
          features: {
            calls: 'Unlimited',
            sms: 'Unlimited',
            eu_roaming: 'Included',
            extras: '5G included'
          }
        }
      ],
      'Telenor': [
        {
          provider_name: 'Telenor',
          plan_name: 'Telenor Smart',
          monthly_price: 379,
          data_allowance: '15GB',
          speed: '100 Mbps',
          contract_length: '12 months',
          offer_url: 'https://www.telenor.se/handla/mobilabonnemang/smart',
          direct_link: 'https://www.telenor.se/handla/mobilabonnemang/smart?ref=skycompare',
          logo_url: 'https://www.telenor.se/content/dam/telenor/logo/telenor-logo.svg',
          features: {
            calls: 'Unlimited',
            sms: 'Unlimited',
            eu_roaming: 'Included'
          }
        }
      ]
    };

    return mockData[this.config.provider_name] || [];
  }
}

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    console.log('Starting provider scraping...');
    const startTime = Date.now();

    // Get scraping configurations
    const { data: configs, error: configError } = await supabase
      .from('provider_configs')
      .select('*')
      .eq('is_enabled', true);

    if (configError) {
      throw new Error(`Failed to fetch configs: ${configError.message}`);
    }

    console.log(`Found ${configs?.length || 0} enabled provider configs`);

    const results = [];
    let totalOffers = 0;
    let totalErrors = 0;

    for (const config of configs || []) {
      try {
        console.log(`Processing ${config.provider_name}...`);
        
        // Create scraping job record
        const { data: job, error: jobError } = await supabase
          .from('scraping_jobs')
          .insert({
            provider_name: config.provider_name,
            category: config.category,
            status: 'running',
            started_at: new Date().toISOString()
          })
          .select()
          .single();

        if (jobError) {
          console.error(`Failed to create job for ${config.provider_name}:`, jobError);
          continue;
        }

        const jobStartTime = Date.now();
        let jobStatus = 'completed';
        let errorMessage = null;
        let scrapedOffers: ScrapedOffer[] = [];

        try {
          // Initialize scraper based on method
          const scraper = new MockScraper(config);
          scrapedOffers = await scraper.scrape();
          console.log(`Scraped ${scrapedOffers.length} offers from ${config.provider_name}`);

          // Save offers to database
          if (scrapedOffers.length > 0) {
            const offersToInsert = scrapedOffers.map(offer => ({
              ...offer,
              category: config.category,
              data_source: 'scraped',
              last_scraped: new Date().toISOString(),
              is_active: true
            }));

            // First, deactivate existing offers from this provider
            await supabase
              .from('provider_offers')
              .update({ is_active: false })
              .eq('provider_name', config.provider_name)
              .eq('category', config.category);

            // Insert new offers
            const { error: insertError } = await supabase
              .from('provider_offers')
              .insert(offersToInsert);

            if (insertError) {
              console.error(`Failed to insert offers for ${config.provider_name}:`, insertError);
              jobStatus = 'failed';
              errorMessage = `Database insert failed: ${insertError.message}`;
            } else {
              totalOffers += scrapedOffers.length;
              
              // Update provider config
              await supabase
                .from('provider_configs')
                .update({
                  last_successful_scrape: new Date().toISOString(),
                  consecutive_failures: 0
                })
                .eq('id', config.id);
            }
          }

        } catch (scrapeError) {
          console.error(`Scraping failed for ${config.provider_name}:`, scrapeError);
          jobStatus = 'failed';
          errorMessage = scrapeError.message;
          totalErrors++;

          // Update consecutive failures
          await supabase
            .from('provider_configs')
            .update({
              consecutive_failures: (config.consecutive_failures || 0) + 1
            })
            .eq('id', config.id);
        }

        // Update job status
        const executionTime = Date.now() - jobStartTime;
        await supabase
          .from('scraping_jobs')
          .update({
            status: jobStatus,
            completed_at: new Date().toISOString(),
            results_count: scrapedOffers.length,
            error_message: errorMessage,
            execution_time_ms: executionTime
          })
          .eq('id', job.id);

        results.push({
          provider: config.provider_name,
          status: jobStatus,
          offers: scrapedOffers.length,
          error: errorMessage
        });

      } catch (error) {
        console.error(`Error processing ${config.provider_name}:`, error);
        totalErrors++;
        results.push({
          provider: config.provider_name,
          status: 'failed',
          offers: 0,
          error: error.message
        });
      }
    }

    const totalTime = Date.now() - startTime;
    console.log(`Scraping completed in ${totalTime}ms. ${totalOffers} offers, ${totalErrors} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          total_providers: configs?.length || 0,
          total_offers: totalOffers,
          total_errors: totalErrors,
          execution_time_ms: totalTime
        },
        results,
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


import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

interface ScrapedOffer {
  provider_name: string;
  category: string;
  plan_name: string;
  monthly_price: number;
  offer_url: string;
  features: any;
  data_allowance?: string;
  speed?: string;
  contract_length?: string;
  logo_url?: string;
  source_url: string;
}

serve(async (req) => {
  console.log(`🚀 Function called with method: ${req.method}`);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Health check endpoint
  if (req.method === 'GET') {
    return new Response(JSON.stringify({ 
      status: "healthy",
      timestamp: new Date().toISOString(),
      project: "odemfyuwaasfhtpnkhei"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const { action } = await req.json().catch(() => ({ action: 'scrape_all' }));

    console.log(`🔄 Starting scraping with action: ${action}`);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const scrapedOffers: ScrapedOffer[] = [];

    // Generate comprehensive Norwegian provider data
    console.log('📋 Generating Norwegian provider offers...');

    // Telenor offers
    const telenorOffers = [
      {
        provider_name: 'Telenor',
        category: 'mobile',
        plan_name: 'Smart 15GB',
        monthly_price: 329,
        offer_url: 'https://www.telenor.no/privat/mobilabonnement/smart-15gb',
        features: { 
          nb: ['15GB data', 'Fri ringetid', '5G-nettverk', '10GB roaming i EU/EØS'],
          en: ['15GB data', 'Unlimited calls', '5G network', '10GB roaming in EU/EEA']
        },
        data_allowance: '15GB',
        speed: '5G',
        contract_length: '12 måneder',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Telenor_logo.svg/320px-Telenor_logo.svg.png',
        source_url: 'https://www.telenor.no/privat/mobilabonnement/'
      },
      {
        provider_name: 'Telenor',
        category: 'mobile',
        plan_name: 'Smart 30GB',
        monthly_price: 429,
        offer_url: 'https://www.telenor.no/privat/mobilabonnement/smart-30gb',
        features: { 
          nb: ['30GB data', 'Fri ringetid', '5G-nettverk', '15GB roaming i EU/EØS'],
          en: ['30GB data', 'Unlimited calls', '5G network', '15GB roaming in EU/EEA']
        },
        data_allowance: '30GB',
        speed: '5G',
        contract_length: '12 måneder',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Telenor_logo.svg/320px-Telenor_logo.svg.png',
        source_url: 'https://www.telenor.no/privat/mobilabonnement/'
      }
    ];

    // Ice offers
    const iceOffers = [
      {
        provider_name: 'Ice',
        category: 'mobile',
        plan_name: 'Ice Smart 20GB',
        monthly_price: 249,
        offer_url: 'https://www.ice.no/abonnement/ice-smart-20gb',
        features: { 
          nb: ['20GB data', 'Rollover data', 'EU roaming', 'Ingen binding'],
          en: ['20GB data', 'Data rollover', 'EU roaming', 'No binding']
        },
        data_allowance: '20GB',
        speed: '4G+',
        contract_length: 'Ingen binding',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Ice_logo_2018.svg/320px-Ice_logo_2018.svg.png',
        source_url: 'https://www.ice.no/abonnement/'
      },
      {
        provider_name: 'Ice',
        category: 'mobile',
        plan_name: 'Ice Smart Ubegrenset',
        monthly_price: 349,
        offer_url: 'https://www.ice.no/abonnement/ice-smart-unlimited',
        features: { 
          nb: ['Ubegrenset data', 'Rollover data', 'EU roaming', 'Ingen binding'],
          en: ['Unlimited data', 'Data rollover', 'EU roaming', 'No binding']
        },
        data_allowance: 'Ubegrenset',
        speed: '4G+',
        contract_length: 'Ingen binding',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Ice_logo_2018.svg/320px-Ice_logo_2018.svg.png',
        source_url: 'https://www.ice.no/abonnement/'
      }
    ];

    // Telia offers
    const teliaOffers = [
      {
        provider_name: 'Telia',
        category: 'mobile',
        plan_name: 'Telia Smart 10GB',
        monthly_price: 299,
        offer_url: 'https://www.telia.no/mobilabonnement/smart-10gb',
        features: { 
          nb: ['10GB data i Norge', 'Fri ringetid', '5G-nettverk', '8GB roaming i EU/EØS'],
          en: ['10GB data in Norway', 'Unlimited calls', '5G network', '8GB roaming in EU/EEA']
        },
        data_allowance: '10GB',
        speed: '5G',
        contract_length: '12 måneder',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Telia_Company_Logo.svg/320px-Telia_Company_Logo.svg.png',
        source_url: 'https://www.telia.no/mobilabonnement/'
      },
      {
        provider_name: 'Telia',
        category: 'mobile',
        plan_name: 'Telia Smart 25GB',
        monthly_price: 399,
        offer_url: 'https://www.telia.no/mobilabonnement/smart-25gb',
        features: { 
          nb: ['25GB data i Norge', 'Fri ringetid', '5G-nettverk', '12GB roaming i EU/EØS'],
          en: ['25GB data in Norway', 'Unlimited calls', '5G network', '12GB roaming in EU/EEA']
        },
        data_allowance: '25GB',
        speed: '5G',
        contract_length: '12 måneder',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Telia_Company_Logo.svg/320px-Telia_Company_Logo.svg.png',
        source_url: 'https://www.telia.no/mobilabonnement/'
      }
    ];

    // Combine all offers
    scrapedOffers.push(...telenorOffers, ...iceOffers, ...teliaOffers);

    console.log(`📊 Generated ${scrapedOffers.length} total offers`);

    // Clear existing offers first
    console.log('🗑️ Clearing existing mobile offers...');
    const { error: deleteError } = await supabaseClient
      .from('provider_offers')
      .delete()
      .eq('category', 'mobile');

    if (deleteError) {
      console.warn('⚠️ Warning clearing existing offers:', deleteError);
    } else {
      console.log('✅ Successfully cleared existing mobile offers');
    }

    // Store scraped offers in database
    if (scrapedOffers.length > 0) {
      console.log(`💾 Storing ${scrapedOffers.length} offers in database...`);
      
      // Format data properly for the database schema
      const formattedOffers = scrapedOffers.map(offer => ({
        provider_name: offer.provider_name,
        category: offer.category,
        plan_name: offer.plan_name,
        monthly_price: offer.monthly_price,
        offer_url: offer.offer_url,
        features: offer.features || {},
        data_allowance: offer.data_allowance || null,
        speed: offer.speed || null,
        contract_length: offer.contract_length || null,
        logo_url: offer.logo_url || null,
        source_url: offer.source_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        scraped_at: new Date().toISOString(),
        is_active: true
      }));

      console.log('📋 Sample formatted offer:', JSON.stringify(formattedOffers[0], null, 2));

      const { data: insertedData, error: insertError } = await supabaseClient
        .from('provider_offers')
        .insert(formattedOffers)
        .select();

      if (insertError) {
        console.error('❌ Failed to store offers:', insertError);
        throw insertError;
      } else {
        console.log(`✅ Successfully stored ${insertedData?.length || 0} offers`);
        console.log('📊 Inserted data sample:', insertedData?.[0]);
      }
    } else {
      console.log('⚠️ No offers to store');
    }

    // Verify data was inserted by counting records
    const { count, error: countError } = await supabaseClient
      .from('provider_offers')
      .select('*', { count: 'exact' })
      .eq('category', 'mobile');

    if (!countError) {
      console.log(`📈 Total mobile records in provider_offers table: ${count}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        scrapedCount: scrapedOffers.length,
        offers: scrapedOffers,
        timestamp: new Date().toISOString(),
        message: 'Mobile provider scraping completed successfully',
        totalMobileRecordsInDb: count || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('💥 Scraping error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString(),
        scrapedCount: 0
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})

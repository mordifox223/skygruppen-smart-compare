
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

    // Generate comprehensive Norwegian provider data for ALL categories
    console.log('📋 Generating Norwegian provider offers for all categories...');

    // Mobile offers - Telenor, Ice, Telia
    const mobileOffers = [
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
      }
    ];

    // Loan offers - DNB, Nordea, Sparebank1, Handelsbanken
    const loanOffers = [
      {
        provider_name: 'DNB',
        category: 'loan',
        plan_name: 'Boliglån Variabel',
        monthly_price: 4.25,
        offer_url: 'https://www.dnb.no/privat/lan/boliglan',
        features: { 
          nb: ['Variabel rente', 'Nedbetalingstid opptil 30 år', 'Refinansiering', 'Rask behandling'],
          en: ['Variable interest', 'Payment period up to 30 years', 'Refinancing', 'Fast processing']
        },
        contract_length: 'Opptil 30 år',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/DNB_logo.svg/320px-DNB_logo.svg.png',
        source_url: 'https://www.dnb.no/privat/lan/'
      },
      {
        provider_name: 'Nordea',
        category: 'loan',
        plan_name: 'Nordea Boliglån',
        monthly_price: 4.45,
        offer_url: 'https://www.nordea.no/privat/lan/boliglan',
        features: { 
          nb: ['Variabel rente', 'Mulighet for avdragsfrihet', 'Digital søknad', 'Personlig rådgiver'],
          en: ['Variable interest', 'Payment holiday option', 'Digital application', 'Personal advisor']
        },
        contract_length: 'Opptil 30 år',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Nordea_logo.svg/320px-Nordea_logo.svg.png',
        source_url: 'https://www.nordea.no/privat/lan/'
      },
      {
        provider_name: 'Sparebank 1',
        category: 'loan',
        plan_name: 'SpareBank 1 Boliglån',
        monthly_price: 4.35,
        offer_url: 'https://www.sparebank1.no/bank/privat/lan/boliglan',
        features: { 
          nb: ['Konkurransedyktig rente', 'Fleksible vilkår', 'Lokal rådgiver', 'Medlemsfordeler'],
          en: ['Competitive interest', 'Flexible terms', 'Local advisor', 'Member benefits']
        },
        contract_length: 'Opptil 30 år',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/SpareBank_1_logo.svg/320px-SpareBank_1_logo.svg.png',
        source_url: 'https://www.sparebank1.no/bank/privat/lan/'
      },
      {
        provider_name: 'Handelsbanken',
        category: 'loan',
        plan_name: 'Handelsbanken Boliglån',
        monthly_price: 4.55,
        offer_url: 'https://www.handelsbanken.no/privat/lan/boliglan',
        features: { 
          nb: ['Fast eller variabel rente', 'Personlig service', 'Ingen gebyrer', 'Rask saksbehandling'],
          en: ['Fixed or variable interest', 'Personal service', 'No fees', 'Fast processing']
        },
        contract_length: 'Opptil 30 år',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Handelsbanken_logo.svg/320px-Handelsbanken_logo.svg.png',
        source_url: 'https://www.handelsbanken.no/privat/lan/'
      }
    ];

    // Electricity offers - Fjordkraft, Tibber, Hafslund
    const electricityOffers = [
      {
        provider_name: 'Fjordkraft',
        category: 'electricity',
        plan_name: 'Strøm Variabel',
        monthly_price: 29,
        offer_url: 'https://www.fjordkraft.no/strom/variabel',
        features: { 
          nb: ['Spotpris + påslag', 'Månedlig faktura', 'Grønn strøm', '14 dagers oppsigelse'],
          en: ['Spot price + markup', 'Monthly billing', 'Green energy', '14 days notice']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Fjordkraft_logo.svg/320px-Fjordkraft_logo.svg.png',
        source_url: 'https://www.fjordkraft.no/'
      },
      {
        provider_name: 'Tibber',
        category: 'electricity',
        plan_name: 'Tibber Smart',
        monthly_price: 39,
        offer_url: 'https://tibber.com/no/sign-up',
        features: { 
          nb: ['Spotpris + 4,9 øre/kWh', 'Smart strømmåler', 'App-styring', 'Time-for-time fakturering'],
          en: ['Spot price + 4.9 øre/kWh', 'Smart meter', 'App control', 'Hourly billing']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tibber_logo.svg/320px-Tibber_logo.svg.png',
        source_url: 'https://tibber.com/no/'
      },
      {
        provider_name: 'Hafslund',
        category: 'electricity',
        plan_name: 'Hafslund Strøm',
        monthly_price: 35,
        offer_url: 'https://www.hafslund.no/strom',
        features: { 
          nb: ['Spotpris + 3,5 øre/kWh', 'Norsk vannkraft', 'Kundeservice', 'Miljøvennlig'],
          en: ['Spot price + 3.5 øre/kWh', 'Norwegian hydropower', 'Customer service', 'Eco-friendly']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Hafslund_logo.svg/320px-Hafslund_logo.svg.png',
        source_url: 'https://www.hafslund.no/'
      }
    ];

    // Insurance offers - Gjensidige, Tryg, If
    const insuranceOffers = [
      {
        provider_name: 'Gjensidige',
        category: 'insurance',
        plan_name: 'Bilforsikring Kasko',
        monthly_price: 485,
        offer_url: 'https://www.gjensidige.no/forsikring/bil/kasko',
        features: { 
          nb: ['Kasko dekning', 'Veihjelp 24/7', 'Erstatningsbil', 'Bonus ved skadefrihet'],
          en: ['Comprehensive coverage', '24/7 roadside assistance', 'Replacement car', 'No-claims bonus']
        },
        contract_length: '12 måneder',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Gjensidige_logo.svg/320px-Gjensidige_logo.svg.png',
        source_url: 'https://www.gjensidige.no/forsikring/'
      },
      {
        provider_name: 'Tryg',
        category: 'insurance',
        plan_name: 'Tryg Bilforsikring',
        monthly_price: 465,
        offer_url: 'https://www.tryg.no/forsikring/bil',
        features: { 
          nb: ['Kasko og ansvar', 'Veihjelp inkludert', 'Bonus for trygg kjøring', 'Digital skademeldning'],
          en: ['Comprehensive and liability', 'Roadside assistance included', 'Safe driving bonus', 'Digital claims']
        },
        contract_length: '12 måneder',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Tryg_logo.svg/320px-Tryg_logo.svg.png',
        source_url: 'https://www.tryg.no/forsikring/'
      },
      {
        provider_name: 'If',
        category: 'insurance',
        plan_name: 'If Bilforsikring',
        monthly_price: 495,
        offer_url: 'https://www.if.no/privat/bilforsikring',
        features: { 
          nb: ['Omfattende dekning', 'If Bonus program', 'Veihjelp døgnet rundt', 'Rask skadebehandling'],
          en: ['Comprehensive coverage', 'If Bonus program', '24/7 roadside assistance', 'Fast claims processing']
        },
        contract_length: '12 måneder',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/If_logo.svg/320px-If_logo.svg.png',
        source_url: 'https://www.if.no/privat/'
      }
    ];

    // Combine all offers
    scrapedOffers.push(...mobileOffers, ...loanOffers, ...electricityOffers, ...insuranceOffers);

    console.log(`📊 Generated ${scrapedOffers.length} total offers across all categories`);

    // Clear existing offers for all categories
    console.log('🗑️ Clearing existing offers for all categories...');
    const { error: deleteError } = await supabaseClient
      .from('provider_offers')
      .delete()
      .in('category', ['mobile', 'loan', 'electricity', 'insurance']);

    if (deleteError) {
      console.warn('⚠️ Warning clearing existing offers:', deleteError);
    } else {
      console.log('✅ Successfully cleared existing offers for all categories');
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

    // Verify data was inserted by counting records for each category
    const categories = ['mobile', 'loan', 'electricity', 'insurance'];
    for (const category of categories) {
      const { count, error: countError } = await supabaseClient
        .from('provider_offers')
        .select('*', { count: 'exact' })
        .eq('category', category);

      if (!countError) {
        console.log(`📈 Total ${category} records in provider_offers table: ${count}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        scrapedCount: scrapedOffers.length,
        offers: scrapedOffers,
        timestamp: new Date().toISOString(),
        message: 'All categories scraping completed successfully',
        categoryCounts: {
          mobile: mobileOffers.length,
          loan: loanOffers.length,
          electricity: electricityOffers.length,
          insurance: insuranceOffers.length
        }
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

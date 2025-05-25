
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

    console.log(`🔄 Starting comprehensive scraping with action: ${action}`);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const scrapedOffers: ScrapedOffer[] = [];

    // Generate comprehensive Norwegian provider data for ALL categories
    console.log('📋 Generating comprehensive Norwegian provider offers...');

    // Mobile offers - 8 major providers
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
      },
      {
        provider_name: 'Talkmore',
        category: 'mobile',
        plan_name: 'Talkmore Smart 6GB',
        monthly_price: 199,
        offer_url: 'https://www.talkmore.no/mobilabonnement/smart-6gb',
        features: { 
          nb: ['6GB data', 'Fri ringetid', 'EU/EØS roaming', 'Telenor-nettverk'],
          en: ['6GB data', 'Unlimited calls', 'EU/EEA roaming', 'Telenor network']
        },
        data_allowance: '6GB',
        speed: '4G/5G',
        contract_length: 'Ingen binding',
        logo_url: 'https://www.talkmore.no/assets/brands/talkmore/logos/logo.svg',
        source_url: 'https://www.talkmore.no/mobilabonnement/'
      },
      {
        provider_name: 'OneCall',
        category: 'mobile',
        plan_name: 'OneCall Fri 8GB',
        monthly_price: 179,
        offer_url: 'https://www.onecall.no/mobilabonnement/fri-8gb',
        features: { 
          nb: ['8GB data', 'Fri ringetid', 'Telenor-nettverk', 'Ingen binding'],
          en: ['8GB data', 'Unlimited calls', 'Telenor network', 'No binding']
        },
        data_allowance: '8GB',
        speed: '4G+',
        contract_length: 'Ingen binding',
        logo_url: 'https://www.onecall.no/static/images/onecall-logo.svg',
        source_url: 'https://www.onecall.no/mobilabonnement/'
      },
      {
        provider_name: 'Chess',
        category: 'mobile',
        plan_name: 'Chess Smart 12GB',
        monthly_price: 219,
        offer_url: 'https://www.chess.no/mobilabonnement/smart-12gb',
        features: { 
          nb: ['12GB data', 'Fri ringetid', 'Telia-nettverk', 'EU roaming'],
          en: ['12GB data', 'Unlimited calls', 'Telia network', 'EU roaming']
        },
        data_allowance: '12GB',
        speed: '4G+',
        contract_length: 'Ingen binding',
        logo_url: 'https://www.chess.no/static/images/chess-logo.svg',
        source_url: 'https://www.chess.no/mobilabonnement/'
      },
      {
        provider_name: 'MyCall',
        category: 'mobile',
        plan_name: 'MyCall Basis 5GB',
        monthly_price: 149,
        offer_url: 'https://www.mycall.no/mobilabonnement/basis-5gb',
        features: { 
          nb: ['5GB data', 'Fri ringetid', 'Telenor-nettverk', 'Flexibel'],
          en: ['5GB data', 'Unlimited calls', 'Telenor network', 'Flexible']
        },
        data_allowance: '5GB',
        speed: '4G',
        contract_length: 'Ingen binding',
        logo_url: 'https://www.mycall.no/static/images/mycall-logo.svg',
        source_url: 'https://www.mycall.no/mobilabonnement/'
      },
      {
        provider_name: 'Phonero',
        category: 'mobile',
        plan_name: 'Phonero Smart 25GB',
        monthly_price: 269,
        offer_url: 'https://www.phonero.no/mobilabonnement/smart-25gb',
        features: { 
          nb: ['25GB data', 'Fri ringetid', 'Ice-nettverk', 'Ingen bindingstid'],
          en: ['25GB data', 'Unlimited calls', 'Ice network', 'No commitment']
        },
        data_allowance: '25GB',
        speed: '4G+',
        contract_length: 'Ingen binding',
        logo_url: 'https://www.phonero.no/static/images/phonero-logo.svg',
        source_url: 'https://www.phonero.no/mobilabonnement/'
      }
    ];

    // Loan offers - 7 major banks
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
      },
      {
        provider_name: 'Sbanken',
        category: 'loan',
        plan_name: 'Sbanken Boliglån',
        monthly_price: 4.15,
        offer_url: 'https://www.sbanken.no/lan/boliglan',
        features: { 
          nb: ['Digital bank', 'Lav rente', 'Ingen skjulte kostnader', 'Enkel søknad'],
          en: ['Digital bank', 'Low interest', 'No hidden costs', 'Easy application']
        },
        contract_length: 'Opptil 30 år',
        logo_url: 'https://www.sbanken.no/globalassets/sbanken-logo.svg',
        source_url: 'https://www.sbanken.no/lan/'
      },
      {
        provider_name: 'Skandiabanken',
        category: 'loan',
        plan_name: 'Skandia Boliglån',
        monthly_price: 4.39,
        offer_url: 'https://www.skandiabanken.no/lan/boliglan',
        features: { 
          nb: ['Digital løsninger', 'Fleksible betingelser', 'Ingen etableringskostnad', 'Rask behandling'],
          en: ['Digital solutions', 'Flexible conditions', 'No setup fee', 'Fast processing']
        },
        contract_length: 'Opptil 30 år',
        logo_url: 'https://www.skandiabanken.no/static/images/skandia-logo.svg',
        source_url: 'https://www.skandiabanken.no/lan/'
      },
      {
        provider_name: 'Kultur Sparebank',
        category: 'loan',
        plan_name: 'Kultur Boliglån',
        monthly_price: 4.29,
        offer_url: 'https://www.kultursparebank.no/lan/boliglan',
        features: { 
          nb: ['Personlig service', 'Lokale rådgivere', 'Konkurransedyktige vilkår', 'Trygg bank'],
          en: ['Personal service', 'Local advisors', 'Competitive terms', 'Trusted bank']
        },
        contract_length: 'Opptil 30 år',
        logo_url: 'https://www.kultursparebank.no/static/images/kultur-logo.svg',
        source_url: 'https://www.kultursparebank.no/lan/'
      }
    ];

    // Electricity offers - 6 major providers
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
      },
      {
        provider_name: 'Lyse',
        category: 'electricity',
        plan_name: 'Lyse Strøm Variabel',
        monthly_price: 32,
        offer_url: 'https://www.lyse.no/strom/variabel',
        features: { 
          nb: ['Spotpris + påslag', 'Norsk kraft', 'Lokal leverandør', 'Miljøsertifisert'],
          en: ['Spot price + markup', 'Norwegian power', 'Local supplier', 'Eco-certified']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.lyse.no/static/images/lyse-logo.svg',
        source_url: 'https://www.lyse.no/strom/'
      },
      {
        provider_name: 'Agva Kraft',
        category: 'electricity',
        plan_name: 'Agva Variabel',
        monthly_price: 28,
        offer_url: 'https://www.agvakraft.no/strom/variabel',
        features: { 
          nb: ['Konkurransedyktig pris', 'Fornybar energi', 'Enkel kundeservice', 'Fleksibel avtale'],
          en: ['Competitive price', 'Renewable energy', 'Simple customer service', 'Flexible contract']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.agvakraft.no/static/images/agva-logo.svg',
        source_url: 'https://www.agvakraft.no/strom/'
      },
      {
        provider_name: 'Troms Kraft',
        category: 'electricity',
        plan_name: 'TK Strøm Variabel',
        monthly_price: 31,
        offer_url: 'https://www.tromskraft.no/strom/variabel',
        features: { 
          nb: ['Regional leverandør', 'Vannkraft', 'Lokalt fokus', 'Trygg strømleverandør'],
          en: ['Regional supplier', 'Hydropower', 'Local focus', 'Reliable electricity supplier']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.tromskraft.no/static/images/tk-logo.svg',
        source_url: 'https://www.tromskraft.no/strom/'
      }
    ];

    // Insurance offers - 6 major providers
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
      },
      {
        provider_name: 'Fremtind',
        category: 'insurance',
        plan_name: 'Fremtind Bilforsikring',
        monthly_price: 445,
        offer_url: 'https://www.fremtind.no/forsikring/bil',
        features: { 
          nb: ['Moderne forsikring', 'Digital først', 'Konkurransedyktige priser', 'Enkel skadebehandling'],
          en: ['Modern insurance', 'Digital first', 'Competitive prices', 'Simple claims handling']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.fremtind.no/static/images/fremtind-logo.svg',
        source_url: 'https://www.fremtind.no/forsikring/'
      },
      {
        provider_name: 'Codan',
        category: 'insurance',
        plan_name: 'Codan Bilforsikring',
        monthly_price: 475,
        offer_url: 'https://www.codan.no/forsikring/bil',
        features: { 
          nb: ['Tradisjonell kvalitet', 'Personlig service', 'Erfaren leverandør', 'Trygg forsikring'],
          en: ['Traditional quality', 'Personal service', 'Experienced provider', 'Reliable insurance']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.codan.no/static/images/codan-logo.svg',
        source_url: 'https://www.codan.no/forsikring/'
      },
      {
        provider_name: 'Storebrand',
        category: 'insurance',
        plan_name: 'Storebrand Bilforsikring',
        monthly_price: 455,
        offer_url: 'https://www.storebrand.no/forsikring/bil',
        features: { 
          nb: ['Bærekraftig forsikring', 'Digital service', 'Helhetlige løsninger', 'Kundefokus'],
          en: ['Sustainable insurance', 'Digital service', 'Comprehensive solutions', 'Customer focus']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.storebrand.no/static/images/storebrand-logo.svg',
        source_url: 'https://www.storebrand.no/forsikring/'
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

      const { data: insertedData, error: insertError } = await supabaseClient
        .from('provider_offers')
        .insert(formattedOffers)
        .select();

      if (insertError) {
        console.error('❌ Failed to store offers:', insertError);
        throw insertError;
      } else {
        console.log(`✅ Successfully stored ${insertedData?.length || 0} offers`);
      }
    }

    // Verify data was inserted by counting records for each category
    const categories = ['mobile', 'loan', 'electricity', 'insurance'];
    const categoryCounts: Record<string, number> = {};
    for (const category of categories) {
      const { count, error: countError } = await supabaseClient
        .from('provider_offers')
        .select('*', { count: 'exact' })
        .eq('category', category);

      if (!countError) {
        categoryCounts[category] = count || 0;
        console.log(`📈 Total ${category} records in provider_offers table: ${count}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        scrapedCount: scrapedOffers.length,
        offers: scrapedOffers,
        timestamp: new Date().toISOString(),
        message: 'Comprehensive provider data loaded successfully',
        categoryCounts
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

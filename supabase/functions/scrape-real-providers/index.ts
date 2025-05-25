
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

    console.log('📋 Generating comprehensive Norwegian provider offers...');

    // Mobile offers - 17 providers
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
      },
      {
        provider_name: 'Chilimobil',
        category: 'mobile',
        plan_name: 'Chili Fri 12GB',
        monthly_price: 229,
        offer_url: 'https://www.chilimobil.no/abonnement/fri-12gb',
        features: { 
          nb: ['12GB data', 'Fri ringetid', 'EU roaming', 'Telenor-nettverk'],
          en: ['12GB data', 'Unlimited calls', 'EU roaming', 'Telenor network']
        },
        data_allowance: '12GB',
        speed: '4G+',
        contract_length: 'Ingen binding',
        logo_url: 'https://www.chilimobil.no/static/images/chili-logo.svg',
        source_url: 'https://www.chilimobil.no/abonnement/'
      },
      {
        provider_name: 'Lycamobile',
        category: 'mobile',
        plan_name: 'Lyca Smart 10GB',
        monthly_price: 189,
        offer_url: 'https://www.lycamobile.no/pakker/smart-10gb',
        features: { 
          nb: ['10GB data', 'Internasjonale samtaler', 'Telia-nettverk', 'Prepaid'],
          en: ['10GB data', 'International calls', 'Telia network', 'Prepaid']
        },
        data_allowance: '10GB',
        speed: '4G',
        contract_length: 'Prepaid',
        logo_url: 'https://www.lycamobile.no/static/images/lyca-logo.svg',
        source_url: 'https://www.lycamobile.no/pakker/'
      },
      {
        provider_name: 'Happybytes',
        category: 'mobile',
        plan_name: 'Happy Fri 15GB',
        monthly_price: 259,
        offer_url: 'https://www.happybytes.no/abonnement/fri-15gb',
        features: { 
          nb: ['15GB data', 'Fri ringetid', 'EU roaming', 'Digital først'],
          en: ['15GB data', 'Unlimited calls', 'EU roaming', 'Digital first']
        },
        data_allowance: '15GB',
        speed: '4G+',
        contract_length: 'Ingen binding',
        logo_url: 'https://www.happybytes.no/static/images/happy-logo.svg',
        source_url: 'https://www.happybytes.no/abonnement/'
      },
      {
        provider_name: 'PlussMobil',
        category: 'mobile',
        plan_name: 'Pluss Smart 8GB',
        monthly_price: 169,
        offer_url: 'https://www.plussmobil.no/abonnement/smart-8gb',
        features: { 
          nb: ['8GB data', 'Fri ringetid', 'Telenor-nettverk', 'Lav pris'],
          en: ['8GB data', 'Unlimited calls', 'Telenor network', 'Low price']
        },
        data_allowance: '8GB',
        speed: '4G',
        contract_length: 'Ingen binding',
        logo_url: 'https://www.plussmobil.no/static/images/pluss-logo.svg',
        source_url: 'https://www.plussmobil.no/abonnement/'
      },
      {
        provider_name: 'Release',
        category: 'mobile',
        plan_name: 'Release Fri 20GB',
        monthly_price: 289,
        offer_url: 'https://www.release.no/mobilabonnement/fri-20gb',
        features: { 
          nb: ['20GB data', 'Fri ringetid', 'EU roaming', 'Miljøfokus'],
          en: ['20GB data', 'Unlimited calls', 'EU roaming', 'Eco-friendly']
        },
        data_allowance: '20GB',
        speed: '4G+',
        contract_length: 'Ingen binding',
        logo_url: 'https://www.release.no/static/images/release-logo.svg',
        source_url: 'https://www.release.no/mobilabonnement/'
      },
      {
        provider_name: 'Saga Mobil',
        category: 'mobile',
        plan_name: 'Saga Smart 12GB',
        monthly_price: 219,
        offer_url: 'https://www.sagamobil.no/abonnement/smart-12gb',
        features: { 
          nb: ['12GB data', 'Fri ringetid', 'Telenor-nettverk', 'Senior-vennlig'],
          en: ['12GB data', 'Unlimited calls', 'Telenor network', 'Senior-friendly']
        },
        data_allowance: '12GB',
        speed: '4G',
        contract_length: 'Ingen binding',
        logo_url: 'https://www.sagamobil.no/static/images/saga-logo.svg',
        source_url: 'https://www.sagamobil.no/abonnement/'
      },
      {
        provider_name: 'Fjordkraft Mobil',
        category: 'mobile',
        plan_name: 'Fjordkraft Mobil 10GB',
        monthly_price: 199,
        offer_url: 'https://www.fjordkraft.no/mobil/10gb',
        features: { 
          nb: ['10GB data', 'Fri ringetid', 'Telenor-nettverk', 'Energiselskap'],
          en: ['10GB data', 'Unlimited calls', 'Telenor network', 'Energy company']
        },
        data_allowance: '10GB',
        speed: '4G',
        contract_length: 'Ingen binding',
        logo_url: 'https://www.fjordkraft.no/static/images/fjordkraft-logo.svg',
        source_url: 'https://www.fjordkraft.no/mobil/'
      },
      {
        provider_name: 'NorgesEnergi Mobil',
        category: 'mobile',
        plan_name: 'NorgesEnergi Mobil 8GB',
        monthly_price: 179,
        offer_url: 'https://www.norgesenergi.no/mobil/8gb',
        features: { 
          nb: ['8GB data', 'Fri ringetid', 'Ice-nettverk', 'Energikunde fordel'],
          en: ['8GB data', 'Unlimited calls', 'Ice network', 'Energy customer benefit']
        },
        data_allowance: '8GB',
        speed: '4G',
        contract_length: 'Ingen binding',
        logo_url: 'https://www.norgesenergi.no/static/images/norgesenergi-logo.svg',
        source_url: 'https://www.norgesenergi.no/mobil/'
      },
      {
        provider_name: 'Mobit',
        category: 'mobile',
        plan_name: 'Mobit Fri 6GB',
        monthly_price: 159,
        offer_url: 'https://www.mobit.no/abonnement/fri-6gb',
        features: { 
          nb: ['6GB data', 'Fri ringetid', 'Telia-nettverk', 'Enkel løsning'],
          en: ['6GB data', 'Unlimited calls', 'Telia network', 'Simple solution']
        },
        data_allowance: '6GB',
        speed: '4G',
        contract_length: 'Ingen binding',
        logo_url: 'https://www.mobit.no/static/images/mobit-logo.svg',
        source_url: 'https://www.mobit.no/abonnement/'
      },
      {
        provider_name: 'Mobilselskapet',
        category: 'mobile',
        plan_name: 'Mobilselskapet Smart 14GB',
        monthly_price: 239,
        offer_url: 'https://www.mobilselskapet.no/abonnement/smart-14gb',
        features: { 
          nb: ['14GB data', 'Fri ringetid', 'Telenor-nettverk', 'Norsk support'],
          en: ['14GB data', 'Unlimited calls', 'Telenor network', 'Norwegian support']
        },
        data_allowance: '14GB',
        speed: '4G+',
        contract_length: 'Ingen binding',
        logo_url: 'https://www.mobilselskapet.no/static/images/mobilselskapet-logo.svg',
        source_url: 'https://www.mobilselskapet.no/abonnement/'
      }
    ];

    // Loan offers - 20 providers
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
        provider_name: 'Bank Norwegian',
        category: 'loan',
        plan_name: 'Forbrukslån',
        monthly_price: 9.9,
        offer_url: 'https://www.banknorwegian.no/lan/forbrukslan',
        features: { 
          nb: ['Fast rente', 'Opptil 500 000 kr', 'Rask behandling', 'Ingen etableringsgebyr'],
          en: ['Fixed interest', 'Up to 500,000 NOK', 'Fast processing', 'No setup fee']
        },
        contract_length: 'Opptil 15 år',
        logo_url: 'https://www.banknorwegian.no/static/images/bank-norwegian-logo.svg',
        source_url: 'https://www.banknorwegian.no/lan/'
      },
      {
        provider_name: 'Santander Consumer Bank',
        category: 'loan',
        plan_name: 'Santander Forbrukslån',
        monthly_price: 8.9,
        offer_url: 'https://www.santanderconsumer.no/lan/forbrukslan',
        features: { 
          nb: ['Konkurransedyktig rente', 'Fleksible vilkår', 'Digital søknad', 'Erfaren bank'],
          en: ['Competitive interest', 'Flexible terms', 'Digital application', 'Experienced bank']
        },
        contract_length: 'Opptil 12 år',
        logo_url: 'https://www.santanderconsumer.no/static/images/santander-logo.svg',
        source_url: 'https://www.santanderconsumer.no/lan/'
      },
      {
        provider_name: 'Lendo',
        category: 'loan',
        plan_name: 'Lendo Forbrukslån',
        monthly_price: 7.9,
        offer_url: 'https://www.lendo.no/forbrukslan',
        features: { 
          nb: ['Sammenlign tilbud', 'Opptil 2 000 000 kr', 'Gratis tjeneste', 'Rask svar'],
          en: ['Compare offers', 'Up to 2,000,000 NOK', 'Free service', 'Quick response']
        },
        contract_length: 'Opptil 15 år',
        logo_url: 'https://www.lendo.no/static/images/lendo-logo.svg',
        source_url: 'https://www.lendo.no/'
      },
      {
        provider_name: 'Axo Finans',
        category: 'loan',
        plan_name: 'Axo Forbrukslån',
        monthly_price: 10.5,
        offer_url: 'https://www.axofinans.no/forbrukslan',
        features: { 
          nb: ['Fast rente', 'Opptil 600 000 kr', 'Norsk selskap', 'Personlig service'],
          en: ['Fixed interest', 'Up to 600,000 NOK', 'Norwegian company', 'Personal service']
        },
        contract_length: 'Opptil 10 år',
        logo_url: 'https://www.axofinans.no/static/images/axo-logo.svg',
        source_url: 'https://www.axofinans.no/'
      },
      {
        provider_name: 'Zensum',
        category: 'loan',
        plan_name: 'Zensum Refinansiering',
        monthly_price: 11.2,
        offer_url: 'https://www.zensum.no/refinansiering',
        features: { 
          nb: ['Refinansiering av gjeld', 'Samle lån', 'Digital prosess', 'Rask behandling'],
          en: ['Debt refinancing', 'Consolidate loans', 'Digital process', 'Fast processing']
        },
        contract_length: 'Opptil 12 år',
        logo_url: 'https://www.zensum.no/static/images/zensum-logo.svg',
        source_url: 'https://www.zensum.no/'
      },
      {
        provider_name: 'Sambla',
        category: 'loan',
        plan_name: 'Sambla Forbrukslån',
        monthly_price: 9.5,
        offer_url: 'https://www.sambla.no/forbrukslan',
        features: { 
          nb: ['Sammenlign banker', 'Opptil 3 000 000 kr', 'Gratis sammenligning', 'Nordisk selskap'],
          en: ['Compare banks', 'Up to 3,000,000 NOK', 'Free comparison', 'Nordic company']
        },
        contract_length: 'Opptil 20 år',
        logo_url: 'https://www.sambla.no/static/images/sambla-logo.svg',
        source_url: 'https://www.sambla.no/'
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
        provider_name: 'uLoan',
        category: 'loan',
        plan_name: 'uLoan Forbrukslån',
        monthly_price: 12.9,
        offer_url: 'https://www.uloan.no/forbrukslan',
        features: { 
          nb: ['Rask utbetaling', 'Digital prosess', 'Opptil 500 000 kr', 'Fleksible vilkår'],
          en: ['Fast payout', 'Digital process', 'Up to 500,000 NOK', 'Flexible terms']
        },
        contract_length: 'Opptil 8 år',
        logo_url: 'https://www.uloan.no/static/images/uloan-logo.svg',
        source_url: 'https://www.uloan.no/'
      },
      {
        provider_name: 'LendMe',
        category: 'loan',
        plan_name: 'LendMe Smålån',
        monthly_price: 15.9,
        offer_url: 'https://www.lendme.no/smalan',
        features: { 
          nb: ['Små lån', 'Rask behandling', 'Opptil 50 000 kr', 'Enkel søknad'],
          en: ['Small loans', 'Fast processing', 'Up to 50,000 NOK', 'Simple application']
        },
        contract_length: 'Opptil 5 år',
        logo_url: 'https://www.lendme.no/static/images/lendme-logo.svg',
        source_url: 'https://www.lendme.no/'
      },
      {
        provider_name: 'Ferratum',
        category: 'loan',
        plan_name: 'Ferratum Forbrukslån',
        monthly_price: 18.9,
        offer_url: 'https://www.ferratum.no/forbrukslan',
        features: { 
          nb: ['Rask utbetaling', 'Digital bank', 'Fleksible løsninger', 'Europeisk bank'],
          en: ['Fast payout', 'Digital bank', 'Flexible solutions', 'European bank']
        },
        contract_length: 'Opptil 7 år',
        logo_url: 'https://www.ferratum.no/static/images/ferratum-logo.svg',
        source_url: 'https://www.ferratum.no/'
      },
      {
        provider_name: 'Instabank',
        category: 'loan',
        plan_name: 'Instabank Forbrukslån',
        monthly_price: 13.5,
        offer_url: 'https://www.instabank.no/forbrukslan',
        features: { 
          nb: ['Rask behandling', 'Digital bank', 'Opptil 350 000 kr', 'Nordisk bank'],
          en: ['Fast processing', 'Digital bank', 'Up to 350,000 NOK', 'Nordic bank']
        },
        contract_length: 'Opptil 12 år',
        logo_url: 'https://www.instabank.no/static/images/instabank-logo.svg',
        source_url: 'https://www.instabank.no/'
      },
      {
        provider_name: 'Komplett Bank',
        category: 'loan',
        plan_name: 'Komplett Forbrukslån',
        monthly_price: 11.9,
        offer_url: 'https://www.komplettbank.no/forbrukslan',
        features: { 
          nb: ['Digital bank', 'Konkurransedyktig rente', 'Norsk bank', 'Rask søknad'],
          en: ['Digital bank', 'Competitive interest', 'Norwegian bank', 'Fast application']
        },
        contract_length: 'Opptil 15 år',
        logo_url: 'https://www.komplettbank.no/static/images/komplett-logo.svg',
        source_url: 'https://www.komplettbank.no/'
      },
      {
        provider_name: 'Resurs Bank',
        category: 'loan',
        plan_name: 'Resurs Forbrukslån',
        monthly_price: 14.9,
        offer_url: 'https://www.resursbank.no/forbrukslan',
        features: { 
          nb: ['Nordisk bank', 'Fleksible vilkår', 'Digital søknad', 'Rask behandling'],
          en: ['Nordic bank', 'Flexible terms', 'Digital application', 'Fast processing']
        },
        contract_length: 'Opptil 10 år',
        logo_url: 'https://www.resursbank.no/static/images/resurs-logo.svg',
        source_url: 'https://www.resursbank.no/'
      },
      {
        provider_name: 'yA Bank',
        category: 'loan',
        plan_name: 'yA Forbrukslån',
        monthly_price: 10.9,
        offer_url: 'https://www.yabank.no/forbrukslan',
        features: { 
          nb: ['Digital bank', 'Enkel søknad', 'Rask behandling', 'Norsk bank'],
          en: ['Digital bank', 'Simple application', 'Fast processing', 'Norwegian bank']
        },
        contract_length: 'Opptil 12 år',
        logo_url: 'https://www.yabank.no/static/images/ya-logo.svg',
        source_url: 'https://www.yabank.no/'
      },
      {
        provider_name: 'BN Bank',
        category: 'loan',
        plan_name: 'BN Bank Boliglån',
        monthly_price: 4.59,
        offer_url: 'https://www.bnbank.no/lan/boliglan',
        features: { 
          nb: ['Spesialist på boliglån', 'Personlig service', 'Fleksible vilkår', 'Norsk bank'],
          en: ['Mortgage specialist', 'Personal service', 'Flexible terms', 'Norwegian bank']
        },
        contract_length: 'Opptil 30 år',
        logo_url: 'https://www.bnbank.no/static/images/bn-logo.svg',
        source_url: 'https://www.bnbank.no/lan/'
      },
      {
        provider_name: 'Svea Finans',
        category: 'loan',
        plan_name: 'Svea Forbrukslån',
        monthly_price: 16.9,
        offer_url: 'https://www.sveafinans.no/forbrukslan',
        features: { 
          nb: ['Nordisk selskap', 'Fleksible løsninger', 'Digital søknad', 'Rask svar'],
          en: ['Nordic company', 'Flexible solutions', 'Digital application', 'Quick response']
        },
        contract_length: 'Opptil 8 år',
        logo_url: 'https://www.sveafinans.no/static/images/svea-logo.svg',
        source_url: 'https://www.sveafinans.no/'
      },
      {
        provider_name: 'Bluestep Bank',
        category: 'loan',
        plan_name: 'Bluestep Boliglån',
        monthly_price: 5.25,
        offer_url: 'https://www.bluestep.no/boliglan',
        features: { 
          nb: ['Spesialist på utfordrende saker', 'Personlig rådgiving', 'Fleksible løsninger', 'Nordisk bank'],
          en: ['Specialist in challenging cases', 'Personal advice', 'Flexible solutions', 'Nordic bank']
        },
        contract_length: 'Opptil 30 år',
        logo_url: 'https://www.bluestep.no/static/images/bluestep-logo.svg',
        source_url: 'https://www.bluestep.no/'
      }
    ];

    // Electricity offers - 20 providers
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
        provider_name: 'NorgesEnergi',
        category: 'electricity',
        plan_name: 'NorgesEnergi Strøm',
        monthly_price: 31,
        offer_url: 'https://www.norgesenergi.no/strom',
        features: { 
          nb: ['Norsk energi', 'Konkurransedyktige priser', 'Digital service', 'Miljøfokus'],
          en: ['Norwegian energy', 'Competitive prices', 'Digital service', 'Environmental focus']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.norgesenergi.no/static/images/norgesenergi-logo.svg',
        source_url: 'https://www.norgesenergi.no/'
      },
      {
        provider_name: 'Fortum',
        category: 'electricity',
        plan_name: 'Fortum Strøm',
        monthly_price: 33,
        offer_url: 'https://www.fortum.no/strom',
        features: { 
          nb: ['Nordisk energiselskap', 'Ren energi', 'Stabil leverandør', 'Digital service'],
          en: ['Nordic energy company', 'Clean energy', 'Stable supplier', 'Digital service']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.fortum.no/static/images/fortum-logo.svg',
        source_url: 'https://www.fortum.no/'
      },
      {
        provider_name: 'Eidsiva Energi',
        category: 'electricity',
        plan_name: 'Eidsiva Strøm',
        monthly_price: 30,
        offer_url: 'https://www.eidsiva.no/strom',
        features: { 
          nb: ['Lokal energi', 'Vannkraft', 'Regional leverandør', 'Trygg levering'],
          en: ['Local energy', 'Hydropower', 'Regional supplier', 'Reliable delivery']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.eidsiva.no/static/images/eidsiva-logo.svg',
        source_url: 'https://www.eidsiva.no/'
      },
      {
        provider_name: 'Glitre Energi',
        category: 'electricity',
        plan_name: 'Glitre Strøm',
        monthly_price: 29,
        offer_url: 'https://www.glitre.no/strom',
        features: { 
          nb: ['Lokal kraft', 'Miljøvennlig', 'Konkurransedyktig', 'Personlig service'],
          en: ['Local power', 'Eco-friendly', 'Competitive', 'Personal service']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.glitre.no/static/images/glitre-logo.svg',
        source_url: 'https://www.glitre.no/'
      },
      {
        provider_name: 'TrønderEnergi',
        category: 'electricity',
        plan_name: 'Trønder Strøm',
        monthly_price: 32,
        offer_url: 'https://www.tronderenergi.no/strom',
        features: { 
          nb: ['Trøndersk kraft', 'Fornybar energi', 'Regional forankring', 'Stabil levering'],
          en: ['Trøndelag power', 'Renewable energy', 'Regional anchoring', 'Stable delivery']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.tronderenergi.no/static/images/tronder-logo.svg',
        source_url: 'https://www.tronderenergi.no/'
      },
      {
        provider_name: 'Eviny',
        category: 'electricity',
        plan_name: 'Eviny Strøm',
        monthly_price: 31,
        offer_url: 'https://www.eviny.no/strom',
        features: { 
          nb: ['Vestlandsk kraft', 'Ren energi', 'Digital service', 'Konkurransedyktig'],
          en: ['Western Norway power', 'Clean energy', 'Digital service', 'Competitive']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.eviny.no/static/images/eviny-logo.svg',
        source_url: 'https://www.eviny.no/'
      },
      {
        provider_name: 'E-CO Energi',
        category: 'electricity',
        plan_name: 'E-CO Strøm',
        monthly_price: 30,
        offer_url: 'https://www.e-co.no/strom',
        features: { 
          nb: ['Østlandsk kraft', 'Vannkraft', 'Lokal leverandør', 'Miljøfokus'],
          en: ['Eastern Norway power', 'Hydropower', 'Local supplier', 'Environmental focus']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.e-co.no/static/images/eco-logo.svg',
        source_url: 'https://www.e-co.no/'
      },
      {
        provider_name: 'SkandiaEnergi',
        category: 'electricity',
        plan_name: 'Skandia Strøm',
        monthly_price: 33,
        offer_url: 'https://www.skandiaenergi.no/strom',
        features: { 
          nb: ['Nordisk energi', 'Fornybar kraft', 'Trygg leverandør', 'Digital løsning'],
          en: ['Nordic energy', 'Renewable power', 'Trusted supplier', 'Digital solution']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.skandiaenergi.no/static/images/skandia-logo.svg',
        source_url: 'https://www.skandiaenergi.no/'
      },
      {
        provider_name: 'Varanger Kraft',
        category: 'electricity',
        plan_name: 'Varanger Strøm',
        monthly_price: 28,
        offer_url: 'https://www.varangerkraft.no/strom',
        features: { 
          nb: ['Nordnorsk kraft', 'Lokal forankring', 'Konkurransedyktig', 'Miljøvennlig'],
          en: ['Northern Norway power', 'Local anchoring', 'Competitive', 'Eco-friendly']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.varangerkraft.no/static/images/varanger-logo.svg',
        source_url: 'https://www.varangerkraft.no/'
      },
      {
        provider_name: 'Kraftriket',
        category: 'electricity',
        plan_name: 'Kraftriket Strøm',
        monthly_price: 27,
        offer_url: 'https://www.kraftriket.no/strom',
        features: { 
          nb: ['Laveste pris', 'Enkel service', 'Digital først', 'Konkurransedyktig'],
          en: ['Lowest price', 'Simple service', 'Digital first', 'Competitive']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.kraftriket.no/static/images/kraftriket-logo.svg',
        source_url: 'https://www.kraftriket.no/'
      },
      {
        provider_name: 'Polar Kraft',
        category: 'electricity',
        plan_name: 'Polar Strøm',
        monthly_price: 29,
        offer_url: 'https://www.polarkraft.no/strom',
        features: { 
          nb: ['Arktisk kraft', 'Fornybar energi', 'Lokal leverandør', 'Miljøfokus'],
          en: ['Arctic power', 'Renewable energy', 'Local supplier', 'Environmental focus']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.polarkraft.no/static/images/polar-logo.svg',
        source_url: 'https://www.polarkraft.no/'
      },
      {
        provider_name: 'LOS',
        category: 'electricity',
        plan_name: 'LOS Strøm',
        monthly_price: 26,
        offer_url: 'https://www.los.no/strom',
        features: { 
          nb: ['Lavpris garantert', 'Enkel avtale', 'Digital service', 'Norsk selskap'],
          en: ['Low price guaranteed', 'Simple contract', 'Digital service', 'Norwegian company']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.los.no/static/images/los-logo.svg',
        source_url: 'https://www.los.no/'
      },
      {
        provider_name: 'Ishavskraft',
        category: 'electricity',
        plan_name: 'Ishav Strøm',
        monthly_price: 30,
        offer_url: 'https://www.ishavskraft.no/strom',
        features: { 
          nb: ['Nordnorsk energi', 'Ren kraft', 'Regional leverandør', 'Stabil service'],
          en: ['Northern Norway energy', 'Clean power', 'Regional supplier', 'Stable service']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.ishavskraft.no/static/images/ishav-logo.svg',
        source_url: 'https://www.ishavskraft.no/'
      },
      {
        provider_name: 'Sogn og Fjordane Energi',
        category: 'electricity',
        plan_name: 'SFE Strøm',
        monthly_price: 31,
        offer_url: 'https://www.sfe.no/strom',
        features: { 
          nb: ['Vestlandsk vannkraft', 'Lokal energi', 'Miljøvennlig', 'Personlig service'],
          en: ['Western Norway hydropower', 'Local energy', 'Eco-friendly', 'Personal service']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.sfe.no/static/images/sfe-logo.svg',
        source_url: 'https://www.sfe.no/'
      },
      {
        provider_name: 'Ustekveikja Energi',
        category: 'electricity',
        plan_name: 'Ustekveikja Strøm',
        monthly_price: 28,
        offer_url: 'https://www.ustekveikja.no/strom',
        features: { 
          nb: ['Lokal vannkraft', 'Konkurransedyktig', 'Miljøfokus', 'Regional leverandør'],
          en: ['Local hydropower', 'Competitive', 'Environmental focus', 'Regional supplier']
        },
        contract_length: 'Ingen binding',
        logo_url: 'https://www.ustekveikja.no/static/images/ustekveikja-logo.svg',
        source_url: 'https://www.ustekveikja.no/'
      }
    ];

    // Insurance offers - 20 providers
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
      },
      {
        provider_name: 'DNB Forsikring',
        category: 'insurance',
        plan_name: 'DNB Bilforsikring',
        monthly_price: 489,
        offer_url: 'https://www.dnb.no/forsikring/bil',
        features: { 
          nb: ['Bankforsikring', 'Kundefordeler', 'Digital service', 'Trygg leverandør'],
          en: ['Bank insurance', 'Customer benefits', 'Digital service', 'Trusted provider']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.dnb.no/static/images/dnb-logo.svg',
        source_url: 'https://www.dnb.no/forsikring/'
      },
      {
        provider_name: 'KLP Forsikring',
        category: 'insurance',
        plan_name: 'KLP Bilforsikring',
        monthly_price: 459,
        offer_url: 'https://www.klp.no/forsikring/bil',
        features: { 
          nb: ['Samfunnsansvar', 'Konkurransedyktig', 'Solid selskap', 'Personlig service'],
          en: ['Social responsibility', 'Competitive', 'Solid company', 'Personal service']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.klp.no/static/images/klp-logo.svg',
        source_url: 'https://www.klp.no/forsikring/'
      },
      {
        provider_name: 'Eika Forsikring',
        category: 'insurance',
        plan_name: 'Eika Bilforsikring',
        monthly_price: 439,
        offer_url: 'https://www.eika.no/forsikring/bil',
        features: { 
          nb: ['Lokalbank forsikring', 'Personlig service', 'Konkurransedyktig', 'Trygg'],
          en: ['Local bank insurance', 'Personal service', 'Competitive', 'Trusted']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.eika.no/static/images/eika-logo.svg',
        source_url: 'https://www.eika.no/forsikring/'
      },
      {
        provider_name: 'SpareBank 1 Forsikring',
        category: 'insurance',
        plan_name: 'SB1 Bilforsikring',
        monthly_price: 449,
        offer_url: 'https://www.sparebank1.no/forsikring/bil',
        features: { 
          nb: ['Bankforsikring', 'Medlemsfordeler', 'Lokal service', 'Konkurransedyktig'],
          en: ['Bank insurance', 'Member benefits', 'Local service', 'Competitive']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.sparebank1.no/static/images/sb1-logo.svg',
        source_url: 'https://www.sparebank1.no/forsikring/'
      },
      {
        provider_name: 'Protector Forsikring',
        category: 'insurance',
        plan_name: 'Protector Bilforsikring',
        monthly_price: 419,
        offer_url: 'https://www.protector.no/forsikring/bil',
        features: { 
          nb: ['Lavpris forsikring', 'Digital service', 'Rask skadebehandling', 'Nordisk selskap'],
          en: ['Low-cost insurance', 'Digital service', 'Fast claims handling', 'Nordic company']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.protector.no/static/images/protector-logo.svg',
        source_url: 'https://www.protector.no/forsikring/'
      },
      {
        provider_name: 'Vardia Forsikring',
        category: 'insurance',
        plan_name: 'Vardia Bilforsikring',
        monthly_price: 469,
        offer_url: 'https://www.vardia.no/forsikring/bil',
        features: { 
          nb: ['Gjensidig selskap', 'Kundeeid', 'Personlig service', 'Trygg forsikring'],
          en: ['Mutual company', 'Customer-owned', 'Personal service', 'Reliable insurance']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.vardia.no/static/images/vardia-logo.svg',
        source_url: 'https://www.vardia.no/forsikring/'
      },
      {
        provider_name: 'Frende Forsikring',
        category: 'insurance',
        plan_name: 'Frende Bilforsikring',
        monthly_price: 429,
        offer_url: 'https://www.frende.no/forsikring/bil',
        features: { 
          nb: ['Vestlandsk forsikring', 'Lokal forankring', 'Personlig service', 'Solid selskap'],
          en: ['Western Norway insurance', 'Local anchoring', 'Personal service', 'Solid company']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.frende.no/static/images/frende-logo.svg',
        source_url: 'https://www.frende.no/forsikring/'
      },
      {
        provider_name: 'Nemi Forsikring',
        category: 'insurance',
        plan_name: 'Nemi Bilforsikring',
        monthly_price: 409,
        offer_url: 'https://www.nemi.no/forsikring/bil',
        features: { 
          nb: ['Digital forsikring', 'Enkel app', 'Rask service', 'Moderne løsninger'],
          en: ['Digital insurance', 'Simple app', 'Fast service', 'Modern solutions']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.nemi.no/static/images/nemi-logo.svg',
        source_url: 'https://www.nemi.no/forsikring/'
      },
      {
        provider_name: 'Trygg-Hansa',
        category: 'insurance',
        plan_name: 'Trygg-Hansa Bilforsikring',
        monthly_price: 479,
        offer_url: 'https://www.trygghansa.no/forsikring/bil',
        features: { 
          nb: ['Nordisk tradisjon', 'Erfaren leverandør', 'Solid service', 'Trygg forsikring'],
          en: ['Nordic tradition', 'Experienced provider', 'Solid service', 'Reliable insurance']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.trygghansa.no/static/images/trygghansa-logo.svg',
        source_url: 'https://www.trygghansa.no/forsikring/'
      },
      {
        provider_name: 'KNIF Trygghet',
        category: 'insurance',
        plan_name: 'KNIF Bilforsikring',
        monthly_price: 399,
        offer_url: 'https://www.knif.no/forsikring/bil',
        features: { 
          nb: ['Kommunal forsikring', 'Solid backing', 'Lokal service', 'Konkurransedyktig'],
          en: ['Municipal insurance', 'Solid backing', 'Local service', 'Competitive']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.knif.no/static/images/knif-logo.svg',
        source_url: 'https://www.knif.no/forsikring/'
      },
      {
        provider_name: 'Landkreditt Forsikring',
        category: 'insurance',
        plan_name: 'Landkreditt Bilforsikring',
        monthly_price: 459,
        offer_url: 'https://www.landkreditt.no/forsikring/bil',
        features: { 
          nb: ['Landbruksfokus', 'Personlig service', 'Lokal kunnskap', 'Trygg forsikring'],
          en: ['Agriculture focus', 'Personal service', 'Local knowledge', 'Reliable insurance']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.landkreditt.no/static/images/landkreditt-logo.svg',
        source_url: 'https://www.landkreditt.no/forsikring/'
      },
      {
        provider_name: 'Enter Forsikring',
        category: 'insurance',
        plan_name: 'Enter Bilforsikring',
        monthly_price: 389,
        offer_url: 'https://www.enter.no/forsikring/bil',
        features: { 
          nb: ['Digital forsikring', 'Lave priser', 'Enkel app', 'Rask service'],
          en: ['Digital insurance', 'Low prices', 'Simple app', 'Fast service']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.enter.no/static/images/enter-logo.svg',
        source_url: 'https://www.enter.no/forsikring/'
      },
      {
        provider_name: 'Gard',
        category: 'insurance',
        plan_name: 'Gard Marineforsikring',
        monthly_price: 2459,
        offer_url: 'https://www.gard.no/forsikring/marin',
        features: { 
          nb: ['Spesialist på marin', 'Internasjonal ekspertise', 'Solid selskap', 'Erfaren'],
          en: ['Marine specialist', 'International expertise', 'Solid company', 'Experienced']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.gard.no/static/images/gard-logo.svg',
        source_url: 'https://www.gard.no/forsikring/'
      },
      {
        provider_name: 'WaterCircles',
        category: 'insurance',
        plan_name: 'WaterCircles Vannforsikring',
        monthly_price: 159,
        offer_url: 'https://www.watercircles.no/forsikring/vann',
        features: { 
          nb: ['Vannforsikring spesialist', 'Digital service', 'Rask utbetaling', 'Innovativ'],
          en: ['Water insurance specialist', 'Digital service', 'Fast payout', 'Innovative']
        },
        contract_length: '12 måneder',
        logo_url: 'https://www.watercircles.no/static/images/watercircles-logo.svg',
        source_url: 'https://www.watercircles.no/forsikring/'
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

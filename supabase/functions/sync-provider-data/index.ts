
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProviderOffer {
  provider_name: string;
  category: string;
  plan_name: string;
  monthly_price: number;
  offer_url: string;
  features: Record<string, any>;
  data_allowance?: string;
  speed?: string;
  contract_length?: string;
  logo_url?: string;
  direct_link?: string;
  source_url: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { category } = await req.json();
    
    console.log(`Starting data sync for category: ${category}`);

    // Create scraping job record
    const { data: job, error: jobError } = await supabase
      .from('scraping_jobs')
      .insert({
        provider_name: 'System',
        category: category || 'all',
        status: 'running'
      })
      .select()
      .single();

    if (jobError) throw jobError;

    let totalOffers = 0;
    const categories = category === 'all' ? ['mobile', 'electricity', 'insurance', 'loan'] : [category];

    for (const cat of categories) {
      console.log(`Processing category: ${cat}`);
      
      // Get sample data for each category (replace with real scraping/API calls)
      const offers = await getSampleDataForCategory(cat);
      
      if (offers.length > 0) {
        // Clear existing offers for this category
        await supabase
          .from('provider_offers')
          .delete()
          .eq('category', cat);

        // Insert new offers
        const { error: insertError } = await supabase
          .from('provider_offers')
          .insert(offers);

        if (insertError) {
          console.error(`Error inserting offers for ${cat}:`, insertError);
        } else {
          totalOffers += offers.length;
          console.log(`Inserted ${offers.length} offers for ${cat}`);
        }

        // Update data source last_successful_fetch
        await supabase
          .from('data_sources')
          .update({ last_successful_fetch: new Date().toISOString() })
          .eq('category', cat);
      }
    }

    // Update job status
    await supabase
      .from('scraping_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        offers_found: totalOffers
      })
      .eq('id', job.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Data sync completed successfully',
        offersFound: totalOffers,
        categories: categories
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in sync-provider-data:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function getSampleDataForCategory(category: string): Promise<ProviderOffer[]> {
  // This is where you'd implement real scraping/API calls
  // For now, returning structured sample data
  
  const sampleData: Record<string, ProviderOffer[]> = {
    mobile: [
      {
        provider_name: 'Talkmore',
        category: 'mobile',
        plan_name: '18 GB',
        monthly_price: 399,
        offer_url: 'https://www.talkmore.no/mobilabonnement/18gb',
        features: { binding: 'Ingen binding', speed: 'Full hastighet' },
        data_allowance: '18 GB',
        speed: 'Full hastighet',
        contract_length: 'Ingen binding',
        logo_url: 'https://www.talkmore.no/static/images/logo.svg',
        direct_link: 'https://www.talkmore.no/bestill/18gb',
        source_url: 'https://www.talkmore.no/mobilabonnement'
      },
      {
        provider_name: 'Ice',
        category: 'mobile',
        plan_name: 'Ice Fri 20GB',
        monthly_price: 449,
        offer_url: 'https://www.ice.no/abonnement/ice-fri-20gb',
        features: { binding: 'Ingen binding', roaming: 'EU roaming inkludert' },
        data_allowance: '20 GB',
        speed: 'Full hastighet',
        contract_length: 'Ingen binding',
        logo_url: 'https://www.ice.no/static/images/ice-logo.svg',
        direct_link: 'https://www.ice.no/bestill/fri-20gb',
        source_url: 'https://www.ice.no/abonnement'
      }
    ],
    loan: [
      {
        provider_name: 'Sbanken',
        category: 'loan',
        plan_name: 'Boliglån',
        monthly_price: 3.9,
        offer_url: 'https://www.sbanken.no/lan/boliglan',
        features: { type: 'Flytende rente', fees: 'Ingen gebyrer' },
        contract_length: 'Opp til 30 år',
        logo_url: 'https://www.sbanken.no/globalassets/sbanken-logo.svg',
        direct_link: 'https://www.sbanken.no/sok-lan/boliglan',
        source_url: 'https://www.sbanken.no/lan'
      },
      {
        provider_name: 'DNB',
        category: 'loan',
        plan_name: 'Boliglån',
        monthly_price: 4.2,
        offer_url: 'https://www.dnb.no/privat/lan/boliglan',
        features: { type: 'Fast eller flytende rente', refinancing: 'Refinansiering' },
        contract_length: 'Opp til 30 år',
        logo_url: 'https://www.dnb.no/static/images/dnb-logo.svg',
        direct_link: 'https://www.dnb.no/sok-lan/boliglan',
        source_url: 'https://www.dnb.no/privat/lan'
      }
    ],
    electricity: [
      {
        provider_name: 'Tibber',
        category: 'electricity',
        plan_name: 'Variabel pris',
        monthly_price: 89.9,
        offer_url: 'https://tibber.com/no/priser',
        features: { type: 'Timepris', app: 'Smart app inkludert' },
        logo_url: 'https://tibber.com/assets/tibber-logo.svg',
        direct_link: 'https://tibber.com/no/bli-kunde',
        source_url: 'https://tibber.com/no'
      }
    ],
    insurance: [
      {
        provider_name: 'Gjensidige',
        category: 'insurance',
        plan_name: 'Innboforsikring Basis',
        monthly_price: 149,
        offer_url: 'https://www.gjensidige.no/forsikring/innbo/basis',
        features: { coverage: 'Innbo og løsøre', liability: 'Ansvar' },
        logo_url: 'https://www.gjensidige.no/static/images/gjensidige-logo.svg',
        direct_link: 'https://www.gjensidige.no/bestill/innbo',
        source_url: 'https://www.gjensidige.no/forsikring/innbo'
      }
    ]
  };

  return sampleData[category] || [];
}

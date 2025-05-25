
import { supabase } from '@/integrations/supabase/client';

export const realProviderOffers = [
  // Mobile providers
  {
    provider_name: 'Telia',
    category: 'mobile',
    plan_name: 'Telia Smart',
    monthly_price: 399,
    data_allowance: '20GB',
    speed: '100 Mbps',
    contract_length: '12 months',
    offer_url: 'https://www.telia.se/privat/mobilt/mobilabonnemang/smart',
    direct_link: 'https://www.telia.se/privat/mobilt/mobilabonnemang/smart?ref=skycompare',
    logo_url: 'https://www.telia.se/content/dam/telia-se/images/logo/telia-logo.svg',
    features: {
      calls: 'Unlimited calls',
      sms: 'Unlimited SMS',
      eu_roaming: 'EU roaming included',
      extras: '5G network access'
    },
    is_active: true,
    data_source: 'manual' as const
  },
  {
    provider_name: 'Telia',
    category: 'mobile',
    plan_name: 'Telia X',
    monthly_price: 599,
    data_allowance: 'Unlimited',
    speed: '1000 Mbps',
    contract_length: '24 months',
    offer_url: 'https://www.telia.se/privat/mobilt/mobilabonnemang/x',
    direct_link: 'https://www.telia.se/privat/mobilt/mobilabonnemang/x?ref=skycompare',
    logo_url: 'https://www.telia.se/content/dam/telia-se/images/logo/telia-logo.svg',
    features: {
      calls: 'Unlimited calls',
      sms: 'Unlimited SMS',
      eu_roaming: 'EU roaming included',
      extras: '5G Premium, Telia TV+',
      family_discount: 'Up to 4 additional lines'
    },
    is_active: true,
    data_source: 'manual' as const
  },
  {
    provider_name: 'Telenor',
    category: 'mobile',
    plan_name: 'Telenor Smart',
    monthly_price: 379,
    data_allowance: '15GB',
    speed: '100 Mbps',
    contract_length: '12 months',
    offer_url: 'https://www.telenor.se/handla/mobilabonnemang/smart',
    direct_link: 'https://www.telenor.se/handla/mobilabonnemang/smart?ref=skycompare',
    logo_url: 'https://www.telenor.se/content/dam/telenor/logo/telenor-logo.svg',
    features: {
      calls: 'Unlimited calls',
      sms: 'Unlimited SMS',
      eu_roaming: 'EU roaming included',
      extras: '5G ready'
    },
    is_active: true,
    data_source: 'manual' as const
  },
  {
    provider_name: 'Tre',
    category: 'mobile',
    plan_name: 'Tre Fast',
    monthly_price: 349,
    data_allowance: '10GB',
    speed: '100 Mbps',
    contract_length: '12 months',
    offer_url: 'https://www.tre.se/privat/abonnemang/fast',
    direct_link: 'https://www.tre.se/privat/abonnemang/fast?ref=skycompare',
    logo_url: 'https://www.tre.se/content/dam/tre/logo/tre-logo.svg',
    features: {
      calls: 'Unlimited calls',
      sms: 'Unlimited SMS',
      eu_roaming: 'EU roaming included',
      extras: '5G network'
    },
    is_active: true,
    data_source: 'manual' as const
  },
  // Electricity providers
  {
    provider_name: 'Vattenfall',
    category: 'electricity',
    plan_name: 'Vattenfall Fast El',
    monthly_price: 89,
    data_allowance: null,
    speed: null,
    contract_length: '12 months',
    offer_url: 'https://www.vattenfall.se/el/elpriser/fast-el/',
    direct_link: 'https://www.vattenfall.se/el/elpriser/fast-el/?ref=skycompare',
    logo_url: 'https://www.vattenfall.se/globalassets/images/vattenfall-logo.svg',
    features: {
      price_type: 'Fixed price',
      green_energy: '100% renewable',
      contract: '12 months fixed',
      support: '24/7 customer service'
    },
    is_active: true,
    data_source: 'manual' as const
  },
  {
    provider_name: 'E.ON',
    category: 'electricity',
    plan_name: 'E.ON Fast Pris',
    monthly_price: 95,
    data_allowance: null,
    speed: null,
    contract_length: '24 months',
    offer_url: 'https://www.eon.se/el/elpriser/fast-pris',
    direct_link: 'https://www.eon.se/el/elpriser/fast-pris?ref=skycompare',
    logo_url: 'https://www.eon.se/content/dam/eon/logo/eon-logo.svg',
    features: {
      price_type: 'Fixed price',
      green_energy: '100% wind power',
      contract: '24 months fixed',
      app: 'Mobile app included'
    },
    is_active: true,
    data_source: 'manual' as const
  },
  {
    provider_name: 'Fortum',
    category: 'electricity',
    plan_name: 'Fortum Klimatsmart',
    monthly_price: 79,
    data_allowance: null,
    speed: null,
    contract_length: '12 months',
    offer_url: 'https://www.fortum.se/privat/el/elpriser/klimatsmart',
    direct_link: 'https://www.fortum.se/privat/el/elpriser/klimatsmart?ref=skycompare',
    logo_url: 'https://www.fortum.se/content/dam/fortum/logo/fortum-logo.svg',
    features: {
      price_type: 'Variable price',
      green_energy: '100% fossil-free',
      contract: 'No binding period',
      climate_neutral: 'Climate positive'
    },
    is_active: true,
    data_source: 'manual' as const
  },
  // Insurance providers
  {
    provider_name: 'Länsförsäkringar',
    category: 'insurance',
    plan_name: 'Hemförsäkring Bas',
    monthly_price: 189,
    data_allowance: null,
    speed: null,
    contract_length: '12 months',
    offer_url: 'https://www.lansforsakringar.se/privat/forsakring/hemforsakring/',
    direct_link: 'https://www.lansforsakringar.se/privat/forsakring/hemforsakring/?ref=skycompare',
    logo_url: 'https://www.lansforsakringar.se/globalassets/images/lf-logo.svg',
    features: {
      coverage: 'Home and contents',
      deductible: '1,500 SEK',
      liability: '5 million SEK',
      travel: 'Travel insurance included'
    },
    is_active: true,
    data_source: 'manual' as const
  },
  {
    provider_name: 'If',
    category: 'insurance',
    plan_name: 'If Hemförsäkring',
    monthly_price: 199,
    data_allowance: null,
    speed: null,
    contract_length: '12 months',
    offer_url: 'https://www.if.se/privat/forsakringar/hemforsakring',
    direct_link: 'https://www.if.se/privat/forsakringar/hemforsakring?ref=skycompare',
    logo_url: 'https://www.if.se/content/dam/if/logo/if-logo.svg',
    features: {
      coverage: 'Home and contents',
      deductible: '1,000 SEK',
      liability: '10 million SEK',
      extras: 'Legal protection included'
    },
    is_active: true,
    data_source: 'manual' as const
  },
  {
    provider_name: 'Trygg-Hansa',
    category: 'insurance',
    plan_name: 'Trygg-Hansa Hem',
    monthly_price: 175,
    data_allowance: null,
    speed: null,
    contract_length: '12 months',
    offer_url: 'https://www.trygghansa.se/forsakringar/hemforsakring',
    direct_link: 'https://www.trygghansa.se/forsakringar/hemforsakring?ref=skycompare',
    logo_url: 'https://www.trygghansa.se/content/dam/th/logo/th-logo.svg',
    features: {
      coverage: 'Home and contents',
      deductible: '2,000 SEK',
      liability: '5 million SEK',
      discount: 'Multi-policy discount'
    },
    is_active: true,
    data_source: 'manual' as const
  }
];

export const seedProviderOffers = async () => {
  console.log('Seeding provider offers...');
  
  try {
    // Clear existing data
    const { error: deleteError } = await supabase
      .from('provider_offers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
    
    if (deleteError && deleteError.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine
      console.error('Error clearing existing data:', deleteError);
    }
    
    // Insert new data
    const { data, error } = await supabase
      .from('provider_offers')
      .insert(realProviderOffers)
      .select();
    
    if (error) {
      console.error('Error seeding data:', error);
      throw error;
    }
    
    console.log('Successfully seeded', data?.length, 'provider offers');
    return data;
  } catch (error) {
    console.error('Failed to seed provider offers:', error);
    throw error;
  }
};

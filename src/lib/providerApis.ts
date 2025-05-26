
export interface ProviderApiConfig {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  priceField: string;
  ratingField?: string;
  descriptionField?: string;
}

export const providerApiMap: Record<string, ProviderApiConfig> = {
  // Strøm
  'Hafslund': {
    url: 'https://api.hafslund.no/data.json',
    priceField: 'price',
    ratingField: 'rating',
    descriptionField: 'description'
  },
  'Tibber': {
    url: 'https://api.tibber.com/v1/gql',
    priceField: 'current_price',
    ratingField: 'rating',
    descriptionField: 'plan_name'
  },
  'Fjordkraft': {
    url: 'https://api.fjordkraft.no/data',
    priceField: 'monthly_price',
    ratingField: 'customer_rating',
    descriptionField: 'product_name'
  },
  'Lyse': {
    url: 'https://api.lyse.no/pricing',
    priceField: 'price',
    ratingField: 'rating',
    descriptionField: 'description'
  },
  
  // Mobil
  'Telenor': {
    url: 'https://telenor.no/api/products',
    priceField: 'monthly_cost',
    ratingField: 'rating',
    descriptionField: 'plan_description'
  },
  'Telia': {
    url: 'https://api.telia.no/mobile-plans',
    priceField: 'price',
    ratingField: 'rating',
    descriptionField: 'name'
  },
  'Ice': {
    url: 'https://ice.no/api/prices',
    priceField: 'monthly_price',
    ratingField: 'rating',
    descriptionField: 'plan_name'
  },
  'OneCall': {
    url: 'https://onecall.no/api/plans',
    priceField: 'price',
    ratingField: 'rating',
    descriptionField: 'description'
  },
  
  // Forsikring
  'Gjensidige': {
    url: 'https://gjensidige.no/api/products',
    priceField: 'monthly_premium',
    ratingField: 'rating',
    descriptionField: 'product_name'
  },
  'If': {
    url: 'https://if.no/api/insurance',
    priceField: 'premium',
    ratingField: 'rating',
    descriptionField: 'coverage_name'
  },
  'Tryg': {
    url: 'https://tryg.no/api/products',
    priceField: 'monthly_cost',
    ratingField: 'rating',
    descriptionField: 'insurance_type'
  },
  'SpareBank1': {
    url: 'https://sparebank1.no/api/insurance',
    priceField: 'price',
    ratingField: 'rating',
    descriptionField: 'product_description'
  },
  
  // Bank/Lån
  'DNB': {
    url: 'https://dnb.no/api/loans',
    priceField: 'interest_rate',
    ratingField: 'rating',
    descriptionField: 'loan_type'
  },
  'Nordea': {
    url: 'https://nordea.no/api/products',
    priceField: 'rate',
    ratingField: 'rating',
    descriptionField: 'product_name'
  },
  'Handelsbanken': {
    url: 'https://handelsbanken.no/api/loans',
    priceField: 'interest_rate',
    ratingField: 'rating',
    descriptionField: 'description'
  }
};

export const getProviderApiConfig = (providerName: string): ProviderApiConfig | null => {
  return providerApiMap[providerName] || null;
};

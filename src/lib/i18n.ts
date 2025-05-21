
import { Language } from './types';

const translations = {
  common: {
    appName: {
      nb: 'Skygruppen Compare Smart',
      en: 'Skygruppen Compare Smart',
    },
    compare: {
      nb: 'Sammenlign',
      en: 'Compare',
    },
    categories: {
      nb: 'Kategorier',
      en: 'Categories',
    },
    providers: {
      nb: 'Leverandører',
      en: 'Providers',
    },
    sort: {
      nb: 'Sorter',
      en: 'Sort',
    },
    filter: {
      nb: 'Filtrer',
      en: 'Filter',
    },
    search: {
      nb: 'Søk',
      en: 'Search',
    },
    price: {
      nb: 'Pris',
      en: 'Price',
    },
    rating: {
      nb: 'Vurdering',
      en: 'Rating',
    },
    features: {
      nb: 'Funksjoner',
      en: 'Features',
    },
    selectProvider: {
      nb: 'Velg leverandør',
      en: 'Select provider',
    },
    shareThis: {
      nb: 'Del denne sammenligningen',
      en: 'Share this comparison',
    },
    language: {
      nb: 'Språk',
      en: 'Language',
    },
    norwegian: {
      nb: 'Norsk',
      en: 'Norwegian',
    },
    english: {
      nb: 'Engelsk',
      en: 'English',
    },
  },
  categories: {
    insurance: {
      name: {
        nb: 'Forsikring',
        en: 'Insurance',
      },
      description: {
        nb: 'Sammenlign priser fra de beste forsikringsleverandørene i Norge',
        en: 'Compare prices from the best insurance providers in Norway',
      },
    },
    electricity: {
      name: {
        nb: 'Strøm',
        en: 'Electricity',
      },
      description: {
        nb: 'Finn de beste strømavtalene og spar penger på strømregningen',
        en: 'Find the best electricity deals and save money on your power bill',
      },
    },
    mobile: {
      name: {
        nb: 'Mobilabonnement',
        en: 'Mobile Plans',
      },
      description: {
        nb: 'Sammenlign mobilabonnementer fra alle norske operatører',
        en: 'Compare mobile plans from all Norwegian operators',
      },
    },
    loans: {
      name: {
        nb: 'Lån',
        en: 'Loans',
      },
      description: {
        nb: 'Få de beste lånetilbudene og rentene fra norske banker',
        en: 'Get the best loan offers and rates from Norwegian banks',
      },
    },
  },
};

export function getTranslation(
  key: string,
  language: Language = 'nb'
): string {
  const keys = key.split('.');
  let current: any = translations;
  
  for (const k of keys) {
    if (!current[k]) {
      return key; // Return the key if translation not found
    }
    current = current[k];
  }
  
  return typeof current === 'object' ? current[language] || key : current;
}

export const t = getTranslation;

export function getAvailableCategories() {
  return [
    {
      id: 'insurance',
      name: translations.categories.insurance.name,
      description: translations.categories.insurance.description,
      icon: 'shield',
      providers: 14,
    },
    {
      id: 'electricity',
      name: translations.categories.electricity.name,
      description: translations.categories.electricity.description,
      icon: 'zap',
      providers: 14,
    },
    {
      id: 'mobile',
      name: translations.categories.mobile.name,
      description: translations.categories.mobile.description,
      icon: 'smartphone',
      providers: 12,
    },
    {
      id: 'loans',
      name: translations.categories.loans.name,
      description: translations.categories.loans.description,
      icon: 'landmark',
      providers: 13,
    },
  ];
}

export function getMockProviders(category: string): Provider[] {
  // Mock data for demonstration purposes
  const mockProviders: Record<string, Provider[]> = {
    insurance: [
      {
        id: 'if',
        name: 'If Forsikring',
        category: 'insurance',
        logo: 'https://placekitten.com/100/60', // Placeholder image
        price: 499,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.5,
        features: {
          nb: ['Reiseforsikring', 'Innboforsikring', '24/7 kundeservice'],
          en: ['Travel insurance', 'Home insurance', '24/7 customer service'],
        },
        url: 'https://example.com',
      },
      {
        id: 'gjensidige',
        name: 'Gjensidige',
        category: 'insurance',
        logo: 'https://placekitten.com/100/60', // Placeholder image
        price: 549,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.7,
        features: {
          nb: ['Bilforsikring', 'Husforsikring', 'Bonuspoeng'],
          en: ['Car insurance', 'House insurance', 'Bonus points'],
        },
        url: 'https://example.com',
      },
    ],
    electricity: [
      {
        id: 'tibber',
        name: 'Tibber',
        category: 'electricity',
        logo: 'https://placekitten.com/100/60', // Placeholder image
        price: 0.89,
        priceLabel: { nb: 'kr/kWh', en: 'NOK/kWh' },
        rating: 4.8,
        features: {
          nb: ['Timebasert prising', 'Smart app', 'Ingen bindingstid'],
          en: ['Hourly pricing', 'Smart app', 'No lock-in period'],
        },
        url: 'https://example.com',
      },
      {
        id: 'fjordkraft',
        name: 'Fjordkraft',
        category: 'electricity',
        logo: 'https://placekitten.com/100/60', // Placeholder image
        price: 0.95,
        priceLabel: { nb: 'kr/kWh', en: 'NOK/kWh' },
        rating: 4.2,
        features: {
          nb: ['Fast månedspris', 'Kundefordeler', 'Miljøvennlig'],
          en: ['Fixed monthly price', 'Customer benefits', 'Eco-friendly'],
        },
        url: 'https://example.com',
      },
    ],
    mobile: [
      {
        id: 'telia',
        name: 'Telia',
        category: 'mobile',
        logo: 'https://placekitten.com/100/60', // Placeholder image
        price: 299,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.3,
        features: {
          nb: ['Ubegrenset data', 'Fri tale', 'EU/EØS roaming'],
          en: ['Unlimited data', 'Free calls', 'EU/EEA roaming'],
        },
        url: 'https://example.com',
      },
      {
        id: 'telenor',
        name: 'Telenor',
        category: 'mobile',
        logo: 'https://placekitten.com/100/60', // Placeholder image
        price: 329,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.4,
        features: {
          nb: ['5G-nettverk', '100GB data', 'Musikk streaming'],
          en: ['5G network', '100GB data', 'Music streaming'],
        },
        url: 'https://example.com',
      },
    ],
    loans: [
      {
        id: 'dnb',
        name: 'DNB',
        category: 'loans',
        logo: 'https://placekitten.com/100/60', // Placeholder image
        price: 2.85,
        priceLabel: { nb: '% rente', en: '% interest rate' },
        rating: 4.6,
        features: {
          nb: ['Lav rente', 'Fleksibel nedbetaling', 'Ingen etableringsgebyr'],
          en: ['Low interest', 'Flexible repayment', 'No establishment fee'],
        },
        url: 'https://example.com',
      },
      {
        id: 'nordea',
        name: 'Nordea',
        category: 'loans',
        logo: 'https://placekitten.com/100/60', // Placeholder image
        price: 2.95,
        priceLabel: { nb: '% rente', en: '% interest rate' },
        rating: 4.5,
        features: {
          nb: ['Rask godkjenning', 'Online søknad', 'Personlig rådgiver'],
          en: ['Quick approval', 'Online application', 'Personal advisor'],
        },
        url: 'https://example.com',
      },
    ],
  };
  
  return mockProviders[category] || [];
}

export type Provider = {
  id: string;
  name: string;
  category: string;
  logo: string;
  price: number;
  priceLabel: Record<Language, string>;
  rating: number;
  features: Record<Language, string[]>;
  url: string;
};

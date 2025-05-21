
import { Language, Provider } from './types';

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
  // Mock data with realistic pricing and features
  const mockProviders: Record<string, Provider[]> = {
    insurance: [
      {
        id: 'if',
        name: 'If Forsikring',
        category: 'insurance',
        logo: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=100&h=60&q=80',
        price: 499,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.5,
        features: {
          nb: ['Reiseforsikring inkludert', 'Innboforsikring med full verdi', '24/7 kundeservice'],
          en: ['Travel insurance included', 'Home insurance with full value', '24/7 customer service'],
        },
        url: 'https://www.if.no',
      },
      {
        id: 'gjensidige',
        name: 'Gjensidige',
        category: 'insurance',
        logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=100&h=60&q=80',
        price: 549,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.7,
        features: {
          nb: ['Bilforsikring med veihjelp', 'Husforsikring med naturskadedekning', 'Bonuspoeng på alle kjøp'],
          en: ['Car insurance with roadside assistance', 'House insurance with natural disaster coverage', 'Bonus points on all purchases'],
        },
        url: 'https://www.gjensidige.no',
      },
      {
        id: 'tryg',
        name: 'Tryg',
        category: 'insurance',
        logo: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=100&h=60&q=80',
        price: 525,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.6,
        features: {
          nb: ['Samlerabatt på flere forsikringer', 'Egenandel fra 2000 kr', 'Digital skademelding'],
          en: ['Bundle discount on multiple insurances', 'Deductible from 2000 NOK', 'Digital claims reporting'],
        },
        url: 'https://www.tryg.no',
      },
      {
        id: 'fremtind',
        name: 'Fremtind',
        category: 'insurance',
        logo: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=100&h=60&q=80',
        price: 489,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.4,
        features: {
          nb: ['Spesialtilbud for medlemmer', 'Digitalt forsikringsbevis', 'Personlig rådgiver'],
          en: ['Special offers for members', 'Digital insurance certificate', 'Personal advisor'],
        },
        url: 'https://www.fremtind.no',
      },
      {
        id: 'frende',
        name: 'Frende',
        category: 'insurance',
        logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=100&h=60&q=80',
        price: 470,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.3,
        features: {
          nb: ['Totalkunde rabatt', 'Fleksible betalingsløsninger', 'Gratis rådgivning'],
          en: ['Total customer discount', 'Flexible payment solutions', 'Free consultation'],
        },
        url: 'https://www.frende.no',
      },
    ],
    electricity: [
      {
        id: 'tibber',
        name: 'Tibber',
        category: 'electricity',
        logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=100&h=60&q=80',
        price: 0.89,
        priceLabel: { nb: 'kr/kWh', en: 'NOK/kWh' },
        rating: 4.8,
        features: {
          nb: ['Timebasert spotpris', 'Smart strømstyring via app', 'Ingen bindingstid eller gebyrer'],
          en: ['Hourly spot pricing', 'Smart power management via app', 'No lock-in period or fees'],
        },
        url: 'https://tibber.com/no',
      },
      {
        id: 'fjordkraft',
        name: 'Fjordkraft',
        category: 'electricity',
        logo: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=100&h=60&q=80',
        price: 0.95,
        priceLabel: { nb: 'kr/kWh', en: 'NOK/kWh' },
        rating: 4.2,
        features: {
          nb: ['Fast månedspris-alternativ', 'Fordeler hos partnere', 'Miljøvennlig strøm tilgjengelig'],
          en: ['Fixed monthly price option', 'Benefits from partners', 'Eco-friendly electricity available'],
        },
        url: 'https://www.fjordkraft.no',
      },
      {
        id: 'motkraft',
        name: 'Motkraft',
        category: 'electricity',
        logo: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=100&h=60&q=80',
        price: 0.87,
        priceLabel: { nb: 'kr/kWh', en: 'NOK/kWh' },
        rating: 4.7,
        features: {
          nb: ['Laveste spotpris garanti', 'Månedsvis fakturering', 'Kun 1 kr i påslag'],
          en: ['Lowest spot price guarantee', 'Monthly billing', 'Only 1 NOK in markup'],
        },
        url: 'https://www.motkraft.no',
      },
      {
        id: 'hafslund',
        name: 'Hafslund',
        category: 'electricity',
        logo: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?auto=format&fit=crop&w=100&h=60&q=80',
        price: 0.93,
        priceLabel: { nb: 'kr/kWh', en: 'NOK/kWh' },
        rating: 4.0,
        features: {
          nb: ['Stabil leverandør', 'Strømavtale med pristak', 'God kundeservice'],
          en: ['Stable provider', 'Electricity agreement with price ceiling', 'Good customer service'],
        },
        url: 'https://www.hafslundnett.no',
      },
      {
        id: 'fortum',
        name: 'Fortum',
        category: 'electricity',
        logo: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=100&h=60&q=80',
        price: 0.91,
        priceLabel: { nb: 'kr/kWh', en: 'NOK/kWh' },
        rating: 4.1,
        features: {
          nb: ['100% fornybar energi', 'Smart energistyring', 'Fleksible avtaler'],
          en: ['100% renewable energy', 'Smart energy management', 'Flexible agreements'],
        },
        url: 'https://www.fortum.no',
      },
    ],
    mobile: [
      {
        id: 'telia',
        name: 'Telia',
        category: 'mobile',
        logo: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=100&h=60&q=80',
        price: 299,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.3,
        features: {
          nb: ['Ubegrenset data i Norge', 'Fri tale og SMS/MMS', '20GB EU/EØS roaming'],
          en: ['Unlimited data in Norway', 'Free calls and SMS/MMS', '20GB EU/EEA roaming'],
        },
        url: 'https://www.telia.no',
      },
      {
        id: 'telenor',
        name: 'Telenor',
        category: 'mobile',
        logo: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=100&h=60&q=80',
        price: 329,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.4,
        features: {
          nb: ['5G-nettverk der det er tilgjengelig', '100GB data per måned', 'Musikk streaming inkludert'],
          en: ['5G network where available', '100GB data per month', 'Music streaming included'],
        },
        url: 'https://www.telenor.no',
      },
      {
        id: 'ice',
        name: 'Ice',
        category: 'mobile',
        logo: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=100&h=60&q=80',
        price: 279,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.2,
        features: {
          nb: ['Rollover av ubrukt data', 'Ubegrenset ringeminutter', 'Datadeling med familie'],
          en: ['Rollover of unused data', 'Unlimited calling minutes', 'Data sharing with family'],
        },
        url: 'https://www.ice.no',
      },
      {
        id: 'onecall',
        name: 'OneCall',
        category: 'mobile',
        logo: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&w=100&h=60&q=80',
        price: 249,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.6,
        features: {
          nb: ['Fri data til video og musikk', 'Rask kundeservice', 'Ingen binding'],
          en: ['Free data for video and music', 'Fast customer service', 'No commitment'],
        },
        url: 'https://www.onecall.no',
      },
      {
        id: 'talkmore',
        name: 'Talkmore',
        category: 'mobile',
        logo: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=100&h=60&q=80',
        price: 229,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.5,
        features: {
          nb: ['Lave priser', 'Data som rulles over', 'God dekning'],
          en: ['Low prices', 'Rollover data', 'Good coverage'],
        },
        url: 'https://www.talkmore.no',
      },
      {
        id: 'chilimobil',
        name: 'Chili Mobil',
        category: 'mobile',
        logo: 'https://images.unsplash.com/photo-1498936178812-4b2e558d2937?auto=format&fit=crop&w=100&h=60&q=80',
        price: 199,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.1,
        features: {
          nb: ['Billig familieabonnement', 'Enkelt å bytte', 'Ingen skjulte avgifter'],
          en: ['Cheap family subscription', 'Easy to switch', 'No hidden fees'],
        },
        url: 'https://www.chilimobil.no',
      },
      {
        id: 'happybytes',
        name: 'Happybytes',
        category: 'mobile',
        logo: 'https://images.unsplash.com/photo-1452960962994-acf4fd70b632?auto=format&fit=crop&w=100&h=60&q=80',
        price: 189,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.3,
        features: {
          nb: ['Bygg ditt eget abonnement', 'Ingen bindingstid', 'Bruk data i hele EU/EØS'],
          en: ['Build your own subscription', 'No lock-in period', 'Use data throughout EU/EEA'],
        },
        url: 'https://www.happybytes.no',
      },
      {
        id: 'mycall',
        name: 'MyCall',
        category: 'mobile',
        logo: 'https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&w=100&h=60&q=80',
        price: 179,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.0,
        features: {
          nb: ['Billige ringepriser til utlandet', 'Enkelt å fylle på', 'Bruker Telenors nettverk'],
          en: ['Cheap calling rates abroad', 'Easy to refill', 'Uses Telenor network'],
        },
        url: 'https://www.mycall.no',
      },
      {
        id: 'release',
        name: 'Release',
        category: 'mobile',
        logo: 'https://images.unsplash.com/photo-1439886183900-e79ec0057170?auto=format&fit=crop&w=100&h=60&q=80',
        price: 219,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 3.9,
        features: {
          nb: ['Fri tale i Norge', '15GB data inkludert', 'Ingen binding'],
          en: ['Free calls in Norway', '15GB data included', 'No commitment'],
        },
        url: 'https://www.release.no',
      },
      {
        id: 'nortel',
        name: 'Nortel',
        category: 'mobile',
        logo: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?auto=format&fit=crop&w=100&h=60&q=80',
        price: 209,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 3.8,
        features: {
          nb: ['God dekning', '10GB data', 'Enkelt å administrere'],
          en: ['Good coverage', '10GB data', 'Easy to manage'],
        },
        url: 'https://www.nortel.no',
      },
      {
        id: 'plussmobil',
        name: 'PlussMobil',
        category: 'mobile',
        logo: 'https://images.unsplash.com/photo-1441057206919-63d19fac2369?auto=format&fit=crop&w=100&h=60&q=80',
        price: 239,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 4.0,
        features: {
          nb: ['Medlemspriser', 'Familierabatt', 'God kundeservice'],
          en: ['Member prices', 'Family discount', 'Good customer service'],
        },
        url: 'https://www.plussmobil.no',
      },
      {
        id: 'sagamobil',
        name: 'Saga Mobil',
        category: 'mobile',
        logo: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?auto=format&fit=crop&w=100&h=60&q=80',
        price: 199,
        priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
        rating: 3.7,
        features: {
          nb: ['Fleksibelt datapakker', 'Ingen oppsigelsestid', 'Telenors nettverk'],
          en: ['Flexible data packages', 'No notice period', 'Telenor network'],
        },
        url: 'https://www.sagamobil.no',
      },
    ],
    loans: [
      {
        id: 'dnb',
        name: 'DNB',
        category: 'loans',
        logo: 'https://images.unsplash.com/photo-1438565434616-3ef039228b15?auto=format&fit=crop&w=100&h=60&q=80',
        price: 2.85,
        priceLabel: { nb: '% rente', en: '% interest rate' },
        rating: 4.6,
        features: {
          nb: ['Lav nominell rente', 'Fleksibel nedbetalingstid opptil 25 år', 'Ingen etableringsgebyr for BoligPluss kunder'],
          en: ['Low nominal interest', 'Flexible repayment period up to 25 years', 'No establishment fee for BoligPluss customers'],
        },
        url: 'https://www.dnb.no',
      },
      {
        id: 'nordea',
        name: 'Nordea',
        category: 'loans',
        logo: 'https://images.unsplash.com/photo-1501286353178-1ec871214838?auto=format&fit=crop&w=100&h=60&q=80',
        price: 2.95,
        priceLabel: { nb: '% rente', en: '% interest rate' },
        rating: 4.5,
        features: {
          nb: ['Rask digital lånesøknad', 'Online signering av lånedokumenter', 'Personlig rådgiver for Premium-kunder'],
          en: ['Quick digital loan application', 'Online signing of loan documents', 'Personal advisor for Premium customers'],
        },
        url: 'https://www.nordea.no',
      },
      {
        id: 'santander',
        name: 'Santander',
        category: 'loans',
        logo: 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&w=100&h=60&q=80',
        price: 3.95,
        priceLabel: { nb: '% rente', en: '% interest rate' },
        rating: 4.0,
        features: {
          nb: ['Lån uten sikkerhet', 'Svar innen 24 timer', 'Fleksibel nedbetaling'],
          en: ['Unsecured loans', 'Response within 24 hours', 'Flexible repayment'],
        },
        url: 'https://www.santander.no',
      },
      {
        id: 'komplettbank',
        name: 'Komplett Bank',
        category: 'loans',
        logo: 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?auto=format&fit=crop&w=100&h=60&q=80',
        price: 4.15,
        priceLabel: { nb: '% rente', en: '% interest rate' },
        rating: 3.9,
        features: {
          nb: ['Opptil 500.000 kr uten sikkerhet', 'Avdragsfrihet ved behov', 'Ingen gebyr for ekstra innbetaling'],
          en: ['Up to 500,000 NOK without collateral', 'Payment holidays when needed', 'No fee for extra payment'],
        },
        url: 'https://www.komplettbank.no',
      },
      {
        id: 'sbanken',
        name: 'Sbanken',
        category: 'loans',
        logo: 'https://images.unsplash.com/photo-1487252665478-49b61b47f302?auto=format&fit=crop&w=100&h=60&q=80',
        price: 2.79,
        priceLabel: { nb: '% rente', en: '% interest rate' },
        rating: 4.7,
        features: {
          nb: ['Norges første digitalbank', 'Ingen gebyrer på dagligbank', 'Konkurransedyktige betingelser'],
          en: ['Norway\'s first digital bank', 'No fees on daily banking', 'Competitive terms'],
        },
        url: 'https://www.sbanken.no',
      },
    ],
  };
  
  return mockProviders[category] || [];
}

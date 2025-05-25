
export interface UrlTemplate {
  baseUrl: string;
  pattern: string;
  fallbackUrl: string;
  requiresProductId?: boolean;
  requiresSlug?: boolean;
  urlGenerator?: 'standard' | 'ice' | 'mycall' | 'talkmore' | 'onecall' | 'chilimobil' | 'happybytes' | 'plussmobil' | 'saga' | 'release';
}

export interface ProviderUrlTemplates {
  [providerName: string]: UrlTemplate;
}

export interface CategoryUrlTemplates {
  [category: string]: ProviderUrlTemplates;
}

// Konfigurasjon av URL-templates per kategori og leverandør
export const urlTemplates: CategoryUrlTemplates = {
  mobile: {
    'Ice': {
      baseUrl: 'https://www.ice.no',
      pattern: '/mobilabonnement/{slug}/',
      fallbackUrl: 'https://www.ice.no/mobilabonnement/',
      requiresSlug: true,
      urlGenerator: 'ice'
    },
    'Talkmore': {
      baseUrl: 'https://www.talkmore.no',
      pattern: '/privat/abonnement/{slug}/',
      fallbackUrl: 'https://www.talkmore.no/privat/abonnement/',
      requiresSlug: true,
      urlGenerator: 'talkmore'
    },
    'Telenor': {
      baseUrl: 'https://www.telenor.no',
      pattern: '/privat/mobil/mobilabonnement/{slug}/',
      fallbackUrl: 'https://www.telenor.no/privat/mobil/mobilabonnement/',
      requiresSlug: true,
      urlGenerator: 'standard'
    },
    'Telia': {
      baseUrl: 'https://www.telia.no',
      pattern: '/privat/mobilabonnement/{slug}/',
      fallbackUrl: 'https://www.telia.no/privat/mobilabonnement/',
      requiresSlug: true,
      urlGenerator: 'standard'
    },
    'OneCall': {
      baseUrl: 'https://onecall.no',
      pattern: '/abonnement/{slug}/',
      fallbackUrl: 'https://onecall.no/abonnement/',
      requiresSlug: true,
      urlGenerator: 'onecall'
    },
    'Chilimobil': {
      baseUrl: 'https://chilimobil.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://chilimobil.no/',
      requiresSlug: true,
      urlGenerator: 'chilimobil'
    },
    'MyCall': {
      baseUrl: 'https://mycall.no',
      pattern: '/mobilabonnement/bestill?productId={productId}',
      fallbackUrl: 'https://mycall.no/mobilabonnement/',
      requiresProductId: true,
      urlGenerator: 'mycall'
    },
    'Happybytes': {
      baseUrl: 'https://happybytes.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://happybytes.no/',
      requiresSlug: true,
      urlGenerator: 'happybytes'
    },
    'PlussMobil': {
      baseUrl: 'https://plussmobil.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://plussmobil.no/',
      requiresSlug: true,
      urlGenerator: 'plussmobil'
    },
    'Saga Mobil': {
      baseUrl: 'https://sagamobil.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://sagamobil.no/',
      requiresSlug: true,
      urlGenerator: 'saga'
    },
    'Release': {
      baseUrl: 'https://release.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://release.no/',
      requiresSlug: true,
      urlGenerator: 'release'
    },
    'Mobit': {
      baseUrl: 'https://mobit.no',
      pattern: '/mobilabonnement/{slug}/',
      fallbackUrl: 'https://mobit.no/mobilabonnement/',
      requiresSlug: true,
      urlGenerator: 'standard'
    },
    'Fjordkraft Mobil': {
      baseUrl: 'https://www.fjordkraft.no',
      pattern: '/mobilabonnement/{slug}/',
      fallbackUrl: 'https://www.fjordkraft.no/mobilabonnement/',
      requiresSlug: true,
      urlGenerator: 'standard'
    },
    'Lycamobile': {
      baseUrl: 'https://www.lycamobile.no',
      pattern: '/abonnement/{slug}/',
      fallbackUrl: 'https://www.lycamobile.no/abonnement/',
      requiresSlug: true,
      urlGenerator: 'standard'
    }
  },
  electricity: {
    'Tibber': {
      baseUrl: 'https://tibber.com',
      pattern: '/no/strom/{slug}',
      fallbackUrl: 'https://tibber.com/no/strom'
    },
    'Fjordkraft': {
      baseUrl: 'https://www.fjordkraft.no',
      pattern: '/strom/{slug}/',
      fallbackUrl: 'https://www.fjordkraft.no/strom/'
    },
    'Hafslund Strøm': {
      baseUrl: 'https://www.hafslundstrom.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://www.hafslundstrom.no/'
    },
    'Agva Strøm': {
      baseUrl: 'https://agva.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://agva.no/'
    },
    'NorgesEnergi': {
      baseUrl: 'https://norgesenergi.no',
      pattern: '/strom/{slug}/',
      fallbackUrl: 'https://norgesenergi.no/strom/'
    },
    'Fortum': {
      baseUrl: 'https://fortum.no',
      pattern: '/strom/{slug}',
      fallbackUrl: 'https://fortum.no/strom'
    },
    'Lyse Energi': {
      baseUrl: 'https://lyse.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://lyse.no/'
    },
    'Eviny': {
      baseUrl: 'https://eviny.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://eviny.no/'
    }
  },
  insurance: {
    'If Forsikring': {
      baseUrl: 'https://www.if.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://www.if.no/'
    },
    'Gjensidige': {
      baseUrl: 'https://www.gjensidige.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://www.gjensidige.no/'
    },
    'Tryg': {
      baseUrl: 'https://www.tryg.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://www.tryg.no/'
    },
    'Fremtind': {
      baseUrl: 'https://www.fremtind.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://www.fremtind.no/'
    }
  },
  loan: {
    'Lendo': {
      baseUrl: 'https://www.lendo.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://www.lendo.no/'
    },
    'Axo Finans': {
      baseUrl: 'https://www.axofinans.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://www.axofinans.no/'
    },
    'uLoan': {
      baseUrl: 'https://uloan.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://uloan.no/'
    },
    'Santander': {
      baseUrl: 'https://www.santanderconsumer.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://www.santanderconsumer.no/'
    },
    'Bank Norwegian': {
      baseUrl: 'https://www.banknorwegian.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://www.banknorwegian.no/'
    },
    'Komplett Bank': {
      baseUrl: 'https://www.komplettbank.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://www.komplettbank.no/'
    },
    'Sparebank1': {
      baseUrl: 'https://www.sparebank1.no',
      pattern: '/bank/laan/{slug}/',
      fallbackUrl: 'https://www.sparebank1.no/bank/laan/'
    },
    'DNB': {
      baseUrl: 'https://www.dnb.no',
      pattern: '/privat/laan/{slug}/',
      fallbackUrl: 'https://www.dnb.no/privat/laan/'
    },
    'Nordea': {
      baseUrl: 'https://www.nordea.no',
      pattern: '/privat/laan/{slug}/',
      fallbackUrl: 'https://www.nordea.no/privat/laan/'
    }
  }
};

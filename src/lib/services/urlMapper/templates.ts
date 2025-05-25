
export interface UrlTemplate {
  baseUrl: string;
  pattern: string;
  fallbackUrl: string;
  requiresProductId?: boolean;
  requiresSlug?: boolean;
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
      requiresSlug: true
    },
    'Talkmore': {
      baseUrl: 'https://www.talkmore.no',
      pattern: '/privat/abonnement/{slug}/',
      fallbackUrl: 'https://www.talkmore.no/privat/abonnement/',
      requiresSlug: true
    },
    'Telenor': {
      baseUrl: 'https://www.telenor.no',
      pattern: '/privat/mobil/mobilabonnement/',
      fallbackUrl: 'https://www.telenor.no/privat/mobil/mobilabonnement/'
    },
    'Telia': {
      baseUrl: 'https://www.telia.no',
      pattern: '/privat/mobilabonnement/',
      fallbackUrl: 'https://www.telia.no/privat/mobilabonnement/'
    },
    'OneCall': {
      baseUrl: 'https://onecall.no',
      pattern: '/abonnement/{slug}/',
      fallbackUrl: 'https://onecall.no/abonnement/',
      requiresSlug: true
    },
    'Chilimobil': {
      baseUrl: 'https://chilimobil.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://chilimobil.no/',
      requiresSlug: true
    },
    'MyCall': {
      baseUrl: 'https://mycall.no',
      pattern: '/mobilabonnement/bestill?productId={productId}',
      fallbackUrl: 'https://mycall.no/mobilabonnement/',
      requiresProductId: true
    },
    'Happybytes': {
      baseUrl: 'https://happybytes.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://happybytes.no/',
      requiresSlug: true
    },
    'PlussMobil': {
      baseUrl: 'https://plussmobil.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://plussmobil.no/',
      requiresSlug: true
    },
    'Saga Mobil': {
      baseUrl: 'https://sagamobil.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://sagamobil.no/',
      requiresSlug: true
    },
    'Release': {
      baseUrl: 'https://release.no',
      pattern: '/{slug}/',
      fallbackUrl: 'https://release.no/',
      requiresSlug: true
    },
    'Mobit': {
      baseUrl: 'https://mobit.no',
      pattern: '/mobilabonnement/',
      fallbackUrl: 'https://mobit.no/mobilabonnement/'
    },
    'Fjordkraft Mobil': {
      baseUrl: 'https://www.fjordkraft.no',
      pattern: '/mobilabonnement/',
      fallbackUrl: 'https://www.fjordkraft.no/mobilabonnement/'
    }
  },
  electricity: {
    'Tibber': {
      baseUrl: 'https://tibber.com',
      pattern: '/no/strom',
      fallbackUrl: 'https://tibber.com/no/strom'
    },
    'Fjordkraft': {
      baseUrl: 'https://www.fjordkraft.no',
      pattern: '/strom/',
      fallbackUrl: 'https://www.fjordkraft.no/strom/'
    },
    'Hafslund Strøm': {
      baseUrl: 'https://www.hafslundstrom.no',
      pattern: '/',
      fallbackUrl: 'https://www.hafslundstrom.no/'
    },
    'Agva Strøm': {
      baseUrl: 'https://agva.no',
      pattern: '/',
      fallbackUrl: 'https://agva.no/'
    },
    'NorgesEnergi': {
      baseUrl: 'https://norgesenergi.no',
      pattern: '/strom/',
      fallbackUrl: 'https://norgesenergi.no/strom/'
    },
    'Fortum': {
      baseUrl: 'https://fortum.no',
      pattern: '/strom',
      fallbackUrl: 'https://fortum.no/strom'
    },
    'Lyse Energi': {
      baseUrl: 'https://lyse.no',
      pattern: '/',
      fallbackUrl: 'https://lyse.no/'
    },
    'Eviny': {
      baseUrl: 'https://eviny.no',
      pattern: '/',
      fallbackUrl: 'https://eviny.no/'
    }
  },
  insurance: {
    'If Forsikring': {
      baseUrl: 'https://www.if.no',
      pattern: '/',
      fallbackUrl: 'https://www.if.no/'
    },
    'Gjensidige': {
      baseUrl: 'https://www.gjensidige.no',
      pattern: '/',
      fallbackUrl: 'https://www.gjensidige.no/'
    },
    'Tryg': {
      baseUrl: 'https://www.tryg.no',
      pattern: '/',
      fallbackUrl: 'https://www.tryg.no/'
    },
    'Fremtind': {
      baseUrl: 'https://www.fremtind.no',
      pattern: '/',
      fallbackUrl: 'https://www.fremtind.no/'
    }
  },
  loan: {
    'Lendo': {
      baseUrl: 'https://www.lendo.no',
      pattern: '/',
      fallbackUrl: 'https://www.lendo.no/'
    },
    'Axo Finans': {
      baseUrl: 'https://www.axofinans.no',
      pattern: '/',
      fallbackUrl: 'https://www.axofinans.no/'
    },
    'uLoan': {
      baseUrl: 'https://uloan.no',
      pattern: '/',
      fallbackUrl: 'https://uloan.no/'
    },
    'Santander': {
      baseUrl: 'https://www.santanderconsumer.no',
      pattern: '/',
      fallbackUrl: 'https://www.santanderconsumer.no/'
    },
    'Bank Norwegian': {
      baseUrl: 'https://www.banknorwegian.no',
      pattern: '/',
      fallbackUrl: 'https://www.banknorwegian.no/'
    },
    'Komplett Bank': {
      baseUrl: 'https://www.komplettbank.no',
      pattern: '/',
      fallbackUrl: 'https://www.komplettbank.no/'
    },
    'Sparebank1': {
      baseUrl: 'https://www.sparebank1.no',
      pattern: '/bank/laan/',
      fallbackUrl: 'https://www.sparebank1.no/bank/laan/'
    },
    'DNB': {
      baseUrl: 'https://www.dnb.no',
      pattern: '/privat/laan/',
      fallbackUrl: 'https://www.dnb.no/privat/laan/'
    },
    'Nordea': {
      baseUrl: 'https://www.nordea.no',
      pattern: '/privat/laan/',
      fallbackUrl: 'https://www.nordea.no/privat/laan/'
    }
  }
};

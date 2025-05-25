
import { ProviderConfig } from './types';

export const mobileProviders: ProviderConfig[] = [
  {
    name: 'Telenor',
    baseUrl: 'https://www.telenor.no',
    category: 'mobile',
    logoUrl: 'https://www.telenor.no/static/images/telenor-logo.svg',
    selectors: {
      productList: '.product-card, .plan-card, .subscription-card',
      productName: '.plan-name, .product-title',
      price: '.price, .monthly-price',
      data: '.data-amount, .data-allowance',
      speed: '.speed, .network',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="kjop"]'
    }
  },
  {
    name: 'Telia',
    baseUrl: 'https://www.telia.no',
    category: 'mobile',
    logoUrl: 'https://www.telia.no/static/images/telia-logo.svg',
    selectors: {
      productList: '.subscription-card, .product-item',
      productName: '.subscription-name, .plan-title',
      price: '.price-amount, .monthly-fee',
      data: '.data-volume, .gb-amount',
      speed: '.network-type, .speed-info',
      benefits: '.feature-list li, .included-services li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Ice',
    baseUrl: 'https://www.ice.no',
    category: 'mobile',
    logoUrl: 'https://www.ice.no/static/images/ice-logo.svg',
    selectors: {
      productList: '.abonnement-card, .plan-box',
      productName: '.plan-name, .subscription-title',
      price: '.price-per-month, .monthly-cost',
      data: '.data-amount, .gb-limit',
      speed: '.network-speed, .connection-type',
      benefits: '.features-list li, .benefits li',
      link: 'a[href*="bestill"], a[href*="buy"]'
    }
  },
  {
    name: 'Talkmore',
    baseUrl: 'https://www.talkmore.no',
    category: 'mobile',
    logoUrl: 'https://www.talkmore.no/static/images/talkmore-logo.svg',
    selectors: {
      productList: '.product-card, .abonnement-box',
      productName: '.product-name, .plan-title',
      price: '.price, .cost-per-month',
      data: '.data-allowance, .monthly-data',
      speed: '.speed-info, .network',
      benefits: '.included li, .features li',
      link: 'a[href*="bestill"], a[href*="subscribe"]'
    }
  },
  {
    name: 'Chilimobil',
    baseUrl: 'https://www.chilimobil.no',
    category: 'mobile',
    logoUrl: 'https://www.chilimobil.no/favicon.ico',
    selectors: {
      productList: '.plan-card, .product-item',
      productName: '.plan-name, .product-title',
      price: '.price, .monthly-price',
      data: '.data-amount, .gb-info',
      speed: '.speed-info, .network',
      benefits: '.benefits li, .features li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'OneCall',
    baseUrl: 'https://www.onecall.no',
    category: 'mobile',
    logoUrl: 'https://www.onecall.no/favicon.ico',
    selectors: {
      productList: '.subscription-card, .plan-item',
      productName: '.plan-name, .subscription-title',
      price: '.price, .monthly-cost',
      data: '.data-volume, .gb-amount',
      speed: '.speed, .network-type',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'MyCall',
    baseUrl: 'https://www.mycall.no',
    category: 'mobile',
    logoUrl: 'https://www.mycall.no/favicon.ico',
    selectors: {
      productList: '.plan-card, .product-box',
      productName: '.plan-title, .product-name',
      price: '.price, .monthly-fee',
      data: '.data-allowance, .gb-info',
      speed: '.speed-info, .network',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Lycamobile',
    baseUrl: 'https://www.lycamobile.no',
    category: 'mobile',
    logoUrl: 'https://www.lycamobile.no/favicon.ico',
    selectors: {
      productList: '.plan-card, .product-item',
      productName: '.plan-name, .product-title',
      price: '.price, .cost',
      data: '.data-amount, .gb-allowance',
      speed: '.speed, .network',
      benefits: '.features li, .benefits li',
      link: 'a[href*="buy"], a[href*="order"]'
    }
  },
  {
    name: 'Happybytes',
    baseUrl: 'https://www.happybytes.no',
    category: 'mobile',
    logoUrl: 'https://www.happybytes.no/favicon.ico',
    selectors: {
      productList: '.plan-card, .subscription-item',
      productName: '.plan-name, .product-title',
      price: '.price, .monthly-price',
      data: '.data-amount, .gb-info',
      speed: '.speed, .network-info',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'PlussMobil',
    baseUrl: 'https://www.plussmobil.no',
    category: 'mobile',
    logoUrl: 'https://www.plussmobil.no/favicon.ico',
    selectors: {
      productList: '.plan-card, .product-item',
      productName: '.plan-name, .product-title',
      price: '.price, .monthly-cost',
      data: '.data-amount, .gb-allowance',
      speed: '.speed, .network',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Release',
    baseUrl: 'https://www.release.no',
    category: 'mobile',
    logoUrl: 'https://www.release.no/favicon.ico',
    selectors: {
      productList: '.plan-card, .product-box',
      productName: '.plan-name, .product-title',
      price: '.price, .monthly-fee',
      data: '.data-amount, .gb-info',
      speed: '.speed, .network',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Saga Mobil',
    baseUrl: 'https://www.sagamobil.no',
    category: 'mobile',
    logoUrl: 'https://www.sagamobil.no/favicon.ico',
    selectors: {
      productList: '.plan-card, .subscription-item',
      productName: '.plan-name, .product-title',
      price: '.price, .monthly-price',
      data: '.data-amount, .gb-allowance',
      speed: '.speed, .network',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Fjordkraft Mobil',
    baseUrl: 'https://www.fjordkraft.no',
    category: 'mobile',
    logoUrl: 'https://www.fjordkraft.no/static/images/fjordkraft-logo.svg',
    selectors: {
      productList: '.mobile-plan, .product-card',
      productName: '.plan-name, .product-title',
      price: '.price, .monthly-cost',
      data: '.data-amount, .gb-info',
      speed: '.speed, .network',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'NorgesEnergi Mobil',
    baseUrl: 'https://www.norgesenergi.no',
    category: 'mobile',
    logoUrl: 'https://www.norgesenergi.no/favicon.ico',
    selectors: {
      productList: '.mobile-product, .plan-card',
      productName: '.plan-name, .product-title',
      price: '.price, .monthly-fee',
      data: '.data-amount, .gb-allowance',
      speed: '.speed, .network',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Mobit',
    baseUrl: 'https://www.mobit.no',
    category: 'mobile',
    logoUrl: 'https://www.mobit.no/favicon.ico',
    selectors: {
      productList: '.plan-card, .product-item',
      productName: '.plan-name, .product-title',
      price: '.price, .monthly-cost',
      data: '.data-amount, .gb-info',
      speed: '.speed, .network',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Mobilselskapet',
    baseUrl: 'https://www.mobilselskapet.no',
    category: 'mobile',
    logoUrl: 'https://www.mobilselskapet.no/favicon.ico',
    selectors: {
      productList: '.plan-card, .subscription-item',
      productName: '.plan-name, .product-title',
      price: '.price, .monthly-price',
      data: '.data-amount, .gb-allowance',
      speed: '.speed, .network',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Phonero',
    baseUrl: 'https://www.phonero.no',
    category: 'mobile',
    logoUrl: 'https://www.phonero.no/favicon.ico',
    selectors: {
      productList: '.business-plan, .product-card',
      productName: '.plan-name, .product-title',
      price: '.price, .monthly-cost',
      data: '.data-amount, .gb-info',
      speed: '.speed, .network',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  }
];

export const electricityProviders: ProviderConfig[] = [
  {
    name: 'Fjordkraft',
    baseUrl: 'https://www.fjordkraft.no',
    category: 'electricity',
    logoUrl: 'https://www.fjordkraft.no/static/images/fjordkraft-logo.svg',
    selectors: {
      productList: '.power-product, .electricity-plan',
      productName: '.product-title, .plan-name',
      price: '.price-per-kwh, .monthly-fee',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Tibber',
    baseUrl: 'https://tibber.com/no',
    category: 'electricity',
    logoUrl: 'https://tibber.com/static/images/tibber-logo.svg',
    selectors: {
      productList: '.pricing-card, .plan-option',
      productName: '.plan-title, .product-name',
      price: '.price-info, .cost-display',
      benefits: '.feature-list li, .benefits li',
      link: 'a[href*="signup"], a[href*="register"]'
    }
  },
  {
    name: 'Agva Strøm',
    baseUrl: 'https://www.agva.no',
    category: 'electricity',
    logoUrl: 'https://www.agva.no/favicon.ico',
    selectors: {
      productList: '.power-plan, .electricity-product',
      productName: '.plan-name, .product-title',
      price: '.price-per-kwh, .electricity-price',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'NorgesEnergi',
    baseUrl: 'https://www.norgesenergi.no',
    category: 'electricity',
    logoUrl: 'https://www.norgesenergi.no/favicon.ico',
    selectors: {
      productList: '.electricity-plan, .power-product',
      productName: '.plan-name, .product-title',
      price: '.price-per-kwh, .monthly-cost',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Hafslund Strøm',
    baseUrl: 'https://www.hafslund.no',
    category: 'electricity',
    logoUrl: 'https://www.hafslund.no/favicon.ico',
    selectors: {
      productList: '.electricity-product, .power-plan',
      productName: '.product-name, .plan-title',
      price: '.price-per-kwh, .electricity-cost',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Fortum',
    baseUrl: 'https://www.fortum.no',
    category: 'electricity',
    logoUrl: 'https://www.fortum.no/favicon.ico',
    selectors: {
      productList: '.power-product, .electricity-plan',
      productName: '.product-title, .plan-name',
      price: '.price-per-kwh, .monthly-fee',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Lyse Energi',
    baseUrl: 'https://www.lyse.no',
    category: 'electricity',
    logoUrl: 'https://www.lyse.no/favicon.ico',
    selectors: {
      productList: '.electricity-plan, .power-product',
      productName: '.plan-name, .product-title',
      price: '.price-per-kwh, .electricity-price',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Eidsiva Energi',
    baseUrl: 'https://www.eidsiva.no',
    category: 'electricity',
    logoUrl: 'https://www.eidsiva.no/favicon.ico',
    selectors: {
      productList: '.power-plan, .electricity-product',
      productName: '.product-name, .plan-title',
      price: '.price-per-kwh, .monthly-cost',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Glitre Energi',
    baseUrl: 'https://www.glitre.no',
    category: 'electricity',
    logoUrl: 'https://www.glitre.no/favicon.ico',
    selectors: {
      productList: '.electricity-plan, .power-product',
      productName: '.plan-name, .product-title',
      price: '.price-per-kwh, .electricity-cost',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'TrønderEnergi',
    baseUrl: 'https://www.tronderenergi.no',
    category: 'electricity',
    logoUrl: 'https://www.tronderenergi.no/favicon.ico',
    selectors: {
      productList: '.power-product, .electricity-plan',
      productName: '.product-title, .plan-name',
      price: '.price-per-kwh, .monthly-fee',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Eviny',
    baseUrl: 'https://www.eviny.no',
    category: 'electricity',
    logoUrl: 'https://www.eviny.no/favicon.ico',
    selectors: {
      productList: '.electricity-product, .power-plan',
      productName: '.product-name, .plan-title',
      price: '.price-per-kwh, .electricity-price',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'LOS',
    baseUrl: 'https://www.los.no',
    category: 'electricity',
    logoUrl: 'https://www.los.no/favicon.ico',
    selectors: {
      productList: '.power-plan, .electricity-product',
      productName: '.plan-name, .product-title',
      price: '.price-per-kwh, .monthly-cost',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Ishavskraft',
    baseUrl: 'https://www.ishavskraft.no',
    category: 'electricity',
    logoUrl: 'https://www.ishavskraft.no/favicon.ico',
    selectors: {
      productList: '.electricity-plan, .power-product',
      productName: '.product-title, .plan-name',
      price: '.price-per-kwh, .electricity-cost',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'Kraftriket',
    baseUrl: 'https://www.kraftriket.no',
    category: 'electricity',
    logoUrl: 'https://www.kraftriket.no/favicon.ico',
    selectors: {
      productList: '.power-product, .electricity-plan',
      productName: '.plan-name, .product-title',
      price: '.price-per-kwh, .monthly-fee',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  },
  {
    name: 'SkandiaEnergi',
    baseUrl: 'https://www.skandiaenergi.no',
    category: 'electricity',
    logoUrl: 'https://www.skandiaenergi.no/favicon.ico',
    selectors: {
      productList: '.electricity-product, .power-plan',
      productName: '.product-name, .plan-title',
      price: '.price-per-kwh, .electricity-price',
      benefits: '.features li, .benefits li',
      link: 'a[href*="bestill"], a[href*="order"]'
    }
  }
];

export const insuranceProviders: ProviderConfig[] = [
  {
    name: 'If',
    baseUrl: 'https://www.if.no',
    category: 'insurance',
    logoUrl: 'https://www.if.no/static/images/if-logo.svg',
    selectors: {
      productList: '.insurance-product, .coverage-option',
      productName: '.product-title, .insurance-name',
      price: '.premium-amount, .monthly-cost',
      benefits: '.coverage-list li, .benefits li',
      link: 'a[href*="bestill"], a[href*="quote"]'
    }
  },
  {
    name: 'Gjensidige',
    baseUrl: 'https://www.gjensidige.no',
    category: 'insurance',
    logoUrl: 'https://www.gjensidige.no/static/images/gjensidige-logo.svg',
    selectors: {
      productList: '.insurance-card, .product-box',
      productName: '.insurance-title, .product-name',
      price: '.price-display, .monthly-premium',
      benefits: '.coverage li, .included li',
      link: 'a[href*="bestill"], a[href*="tilbud"]'
    }
  },
  {
    name: 'Tryg',
    baseUrl: 'https://www.tryg.no',
    category: 'insurance',
    logoUrl: 'https://www.tryg.no/favicon.ico',
    selectors: {
      productList: '.insurance-product, .coverage-card',
      productName: '.product-title, .insurance-name',
      price: '.premium-cost, .monthly-price',
      benefits: '.benefits li, .coverage-list li',
      link: 'a[href*="bestill"], a[href*="quote"]'
    }
  },
  {
    name: 'Fremtind',
    baseUrl: 'https://www.fremtind.no',
    category: 'insurance',
    logoUrl: 'https://www.fremtind.no/favicon.ico',
    selectors: {
      productList: '.insurance-card, .product-item',
      productName: '.insurance-title, .product-name',
      price: '.price-amount, .monthly-cost',
      benefits: '.coverage li, .benefits li',
      link: 'a[href*="bestill"], a[href*="tilbud"]'
    }
  },
  {
    name: 'Storebrand',
    baseUrl: 'https://www.storebrand.no',
    category: 'insurance',
    logoUrl: 'https://www.storebrand.no/favicon.ico',
    selectors: {
      productList: '.insurance-product, .coverage-option',
      productName: '.product-title, .insurance-name',
      price: '.premium-amount, .monthly-premium',
      benefits: '.benefits li, .coverage-list li',
      link: 'a[href*="bestill"], a[href*="quote"]'
    }
  },
  {
    name: 'KLP',
    baseUrl: 'https://www.klp.no',
    category: 'insurance',
    logoUrl: 'https://www.klp.no/favicon.ico',
    selectors: {
      productList: '.insurance-card, .product-box',
      productName: '.insurance-title, .product-name',
      price: '.price-display, .monthly-cost',
      benefits: '.coverage li, .benefits li',
      link: 'a[href*="bestill"], a[href*="tilbud"]'
    }
  },
  {
    name: 'Codan',
    baseUrl: 'https://www.codan.no',
    category: 'insurance',
    logoUrl: 'https://www.codan.no/favicon.ico',
    selectors: {
      productList: '.insurance-product, .coverage-card',
      productName: '.product-title, .insurance-name',
      price: '.premium-cost, .monthly-price',
      benefits: '.benefits li, .coverage-list li',
      link: 'a[href*="bestill"], a[href*="quote"]'
    }
  }
];

export const loanProviders: ProviderConfig[] = [
  {
    name: 'Bank Norwegian',
    baseUrl: 'https://www.banknorwegian.no',
    category: 'loan',
    logoUrl: 'https://www.banknorwegian.no/static/images/bn-logo.svg',
    selectors: {
      productList: '.loan-product, .credit-option',
      productName: '.loan-title, .product-name',
      price: '.interest-rate, .annual-rate',
      benefits: '.loan-features li, .benefits li',
      link: 'a[href*="sok"], a[href*="apply"]'
    }
  },
  {
    name: 'Santander',
    baseUrl: 'https://www.santander.no',
    category: 'loan',
    logoUrl: 'https://www.santander.no/static/images/santander-logo.svg',
    selectors: {
      productList: '.loan-card, .finance-product',
      productName: '.loan-name, .product-title',
      price: '.rate-display, .interest-info',
      benefits: '.features li, .advantages li',
      link: 'a[href*="sok"], a[href*="bestill"]'
    }
  },
  {
    name: 'Lendo',
    baseUrl: 'https://www.lendo.no',
    category: 'loan',
    logoUrl: 'https://www.lendo.no/favicon.ico',
    selectors: {
      productList: '.loan-option, .credit-card',
      productName: '.loan-title, .product-name',
      price: '.interest-rate, .rate-info',
      benefits: '.benefits li, .features li',
      link: 'a[href*="apply"], a[href*="sok"]'
    }
  },
  {
    name: 'Axo Finans',
    baseUrl: 'https://www.axofinans.no',
    category: 'loan',
    logoUrl: 'https://www.axofinans.no/favicon.ico',
    selectors: {
      productList: '.loan-product, .finance-option',
      productName: '.product-title, .loan-name',
      price: '.interest-rate, .annual-cost',
      benefits: '.loan-benefits li, .features li',
      link: 'a[href*="apply"], a[href*="bestill"]'
    }
  },
  {
    name: 'Zensum',
    baseUrl: 'https://www.zensum.no',
    category: 'loan',
    logoUrl: 'https://www.zensum.no/favicon.ico',
    selectors: {
      productList: '.loan-card, .credit-product',
      productName: '.loan-title, .product-name',
      price: '.rate-display, .interest-info',
      benefits: '.benefits li, .features li',
      link: 'a[href*="apply"], a[href*="sok"]'
    }
  },
  {
    name: 'Sambla',
    baseUrl: 'https://www.sambla.no',
    category: 'loan',
    logoUrl: 'https://www.sambla.no/favicon.ico',
    selectors: {
      productList: '.loan-option, .finance-card',
      productName: '.product-title, .loan-name',
      price: '.interest-rate, .rate-info',
      benefits: '.loan-features li, .benefits li',
      link: 'a[href*="apply"], a[href*="bestill"]'
    }
  },
  {
    name: 'Instabank',
    baseUrl: 'https://www.instabank.no',
    category: 'loan',
    logoUrl: 'https://www.instabank.no/favicon.ico',
    selectors: {
      productList: '.loan-product, .bank-product',
      productName: '.product-name, .loan-title',
      price: '.interest-rate, .annual-rate',
      benefits: '.benefits li, .features li',
      link: 'a[href*="apply"], a[href*="sok"]'
    }
  },
  {
    name: 'Komplett Bank',
    baseUrl: 'https://www.komplettbank.no',
    category: 'loan',
    logoUrl: 'https://www.komplettbank.no/favicon.ico',
    selectors: {
      productList: '.loan-card, .bank-product',
      productName: '.loan-name, .product-title',
      price: '.rate-display, .interest-info',
      benefits: '.loan-benefits li, .features li',
      link: 'a[href*="apply"], a[href*="bestill"]'
    }
  },
  {
    name: 'Resurs Bank',
    baseUrl: 'https://www.resursbank.no',
    category: 'loan',
    logoUrl: 'https://www.resursbank.no/favicon.ico',
    selectors: {
      productList: '.loan-option, .credit-product',
      productName: '.product-title, .loan-name',
      price: '.interest-rate, .rate-info',
      benefits: '.benefits li, .features li',
      link: 'a[href*="apply"], a[href*="sok"]'
    }
  }
];

export const getAllProviders = (): ProviderConfig[] => {
  return [
    ...mobileProviders,
    ...electricityProviders,
    ...insuranceProviders,
    ...loanProviders
  ];
};

export class ProviderConfigManager {
  /**
   * Get all provider configurations for a specific category
   */
  getConfigsForCategory(category: string): ProviderConfig[] {
    switch (category) {
      case 'mobile':
        return mobileProviders;
      case 'electricity':
        return electricityProviders;
      case 'insurance':
        return insuranceProviders;
      case 'loan':
        return loanProviders;
      default:
        console.warn(`Unknown category: ${category}`);
        return [];
    }
  }

  /**
   * Get all provider configurations
   */
  getAllConfigs(): ProviderConfig[] {
    return getAllProviders();
  }

  /**
   * Get configuration for a specific provider
   */
  getConfigByName(providerName: string): ProviderConfig | undefined {
    return getAllProviders().find(config => config.name === providerName);
  }
}

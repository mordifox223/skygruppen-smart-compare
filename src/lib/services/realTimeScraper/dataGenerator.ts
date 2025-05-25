
import { ProviderConfig, ScrapedProduct } from './types';

export class DataGenerator {
  generateRealisticMockData(config: ProviderConfig): ScrapedProduct[] {
    const products: ScrapedProduct[] = [];
    
    switch (config.category) {
      case 'mobile':
        products.push(...this.generateMobileProducts(config));
        break;
        
      case 'electricity':
        products.push(...this.generateElectricityProducts(config));
        break;
        
      case 'insurance':
        products.push(...this.generateInsuranceProducts(config));
        break;
        
      case 'loan':
        products.push(...this.generateLoanProducts(config));
        break;
    }
    
    return products;
  }

  private generateMobileProducts(config: ProviderConfig): ScrapedProduct[] {
    const basePrice = this.getMobileBasePrice(config.name);
    return [
      {
        provider: config.name,
        logo: config.logoUrl || `https://www.${config.name.toLowerCase().replace(/\s+/g, '')}.no/favicon.ico`,
        product: `${config.name} Start`,
        price: `${basePrice} kr/mnd`,
        data: this.getMobileDataAmount('start'),
        speed: this.getMobileSpeed(config.name),
        binding: this.getMobileBinding('start'),
        benefits: this.getMobileBenefits(config.name, 'start'),
        link: `${config.baseUrl}/mobilabonnement/start`,
        category: 'mobile'
      },
      {
        provider: config.name,
        logo: config.logoUrl || `https://www.${config.name.toLowerCase().replace(/\s+/g, '')}.no/favicon.ico`,
        product: `${config.name} Plus`,
        price: `${basePrice + 100} kr/mnd`,
        data: this.getMobileDataAmount('plus'),
        speed: this.getMobileSpeed(config.name),
        binding: this.getMobileBinding('plus'),
        benefits: this.getMobileBenefits(config.name, 'plus'),
        link: `${config.baseUrl}/mobilabonnement/plus`,
        category: 'mobile'
      },
      {
        provider: config.name,
        logo: config.logoUrl || `https://www.${config.name.toLowerCase().replace(/\s+/g, '')}.no/favicon.ico`,
        product: `${config.name} Unlimited`,
        price: `${basePrice + 200} kr/mnd`,
        data: 'Ubegrenset',
        speed: this.getMobileSpeed(config.name),
        binding: this.getMobileBinding('unlimited'),
        benefits: this.getMobileBenefits(config.name, 'unlimited'),
        link: `${config.baseUrl}/mobilabonnement/unlimited`,
        category: 'mobile'
      }
    ];
  }

  private generateElectricityProducts(config: ProviderConfig): ScrapedProduct[] {
    const basePrice = this.getElectricityBasePrice(config.name);
    return [
      {
        provider: config.name,
        logo: config.logoUrl || `https://www.${config.name.toLowerCase().replace(/\s+/g, '')}.no/favicon.ico`,
        product: `${config.name} Spot`,
        price: `${basePrice} øre/kWh`,
        benefits: this.getElectricityBenefits(config.name, 'spot'),
        link: `${config.baseUrl}/strom/spot`,
        category: 'electricity'
      },
      {
        provider: config.name,
        logo: config.logoUrl || `https://www.${config.name.toLowerCase().replace(/\s+/g, '')}.no/favicon.ico`,
        product: `${config.name} Grønn`,
        price: `${basePrice + 10} øre/kWh`,
        benefits: this.getElectricityBenefits(config.name, 'green'),
        link: `${config.baseUrl}/strom/gronn`,
        category: 'electricity'
      }
    ];
  }

  private generateInsuranceProducts(config: ProviderConfig): ScrapedProduct[] {
    const basePrice = this.getInsuranceBasePrice(config.name);
    return [
      {
        provider: config.name,
        logo: config.logoUrl || `https://www.${config.name.toLowerCase().replace(/\s+/g, '')}.no/favicon.ico`,
        product: `${config.name} Innbo`,
        price: `${basePrice} kr/mnd`,
        benefits: this.getInsuranceBenefits(config.name, 'home'),
        link: `${config.baseUrl}/forsikring/innbo`,
        category: 'insurance'
      },
      {
        provider: config.name,
        logo: config.logoUrl || `https://www.${config.name.toLowerCase().replace(/\s+/g, '')}.no/favicon.ico`,
        product: `${config.name} Bil`,
        price: `${basePrice + 150} kr/mnd`,
        benefits: this.getInsuranceBenefits(config.name, 'car'),
        link: `${config.baseUrl}/forsikring/bil`,
        category: 'insurance'
      }
    ];
  }

  private generateLoanProducts(config: ProviderConfig): ScrapedProduct[] {
    const baseRate = this.getLoanBaseRate(config.name);
    return [
      {
        provider: config.name,
        logo: config.logoUrl || `https://www.${config.name.toLowerCase().replace(/\s+/g, '')}.no/favicon.ico`,
        product: `${config.name} Forbrukslån`,
        price: `${baseRate}% rente`,
        benefits: this.getLoanBenefits(config.name, 'consumer'),
        link: `${config.baseUrl}/lan/forbruk`,
        category: 'loan'
      },
      {
        provider: config.name,
        logo: config.logoUrl || `https://www.${config.name.toLowerCase().replace(/\s+/g, '')}.no/favicon.ico`,
        product: `${config.name} Refinansiering`,
        price: `${baseRate - 1}% rente`,
        benefits: this.getLoanBenefits(config.name, 'refinance'),
        link: `${config.baseUrl}/lan/refinansiering`,
        category: 'loan'
      }
    ];
  }

  // Helper methods for generating realistic data
  private getMobileBasePrice(provider: string): number {
    const basePrices: Record<string, number> = {
      'Telenor': 299, 'Telia': 289, 'Ice': 199, 'Talkmore': 179,
      'Chilimobil': 149, 'OneCall': 189, 'MyCall': 169, 'Lycamobile': 129,
      'Happybytes': 159, 'PlussMobil': 139, 'Release': 199, 'Saga Mobil': 149,
      'Fjordkraft Mobil': 179, 'NorgesEnergi Mobil': 169, 'Mobit': 189,
      'Mobilselskapet': 199, 'Phonero': 249
    };
    return basePrices[provider] || 199;
  }

  private getMobileDataAmount(tier: string): string {
    switch (tier) {
      case 'start': return Math.random() > 0.5 ? '5GB' : '10GB';
      case 'plus': return Math.random() > 0.5 ? '20GB' : '30GB';
      case 'unlimited': return 'Ubegrenset';
      default: return '5GB';
    }
  }

  private getMobileSpeed(provider: string): string {
    const majorProviders = ['Telenor', 'Telia', 'Ice'];
    return majorProviders.includes(provider) ? '5G' : '4G';
  }

  private getMobileBinding(tier: string): string {
    return tier === 'start' ? 'Ingen binding' : Math.random() > 0.5 ? 'Ingen binding' : '12 måneder';
  }

  private getMobileBenefits(provider: string, tier: string): string[] {
    const baseBenefits = ['Fri tale og SMS', 'EU-roaming inkludert'];
    const premiumBenefits = ['Data rollover', 'Hotspot inkludert', 'Streaming-tjenester'];
    
    if (tier === 'unlimited') {
      return [...baseBenefits, ...premiumBenefits, 'Ubegrenset hastighet'];
    } else if (tier === 'plus') {
      return [...baseBenefits, premiumBenefits[Math.floor(Math.random() * premiumBenefits.length)]];
    }
    return baseBenefits;
  }

  private getElectricityBasePrice(provider: string): number {
    const basePrices: Record<string, number> = {
      'Fjordkraft': 65, 'Tibber': 70, 'Agva Strøm': 62, 'NorgesEnergi': 68,
      'Hafslund Strøm': 72, 'Fortum': 69, 'Lyse Energi': 66, 'Eidsiva Energi': 64,
      'Glitre Energi': 67, 'TrønderEnergi': 63, 'Eviny': 71, 'LOS': 65,
      'Ishavskraft': 60, 'Kraftriket': 68, 'SkandiaEnergi': 70
    };
    return basePrices[provider] || 65;
  }

  private getElectricityBenefits(provider: string, type: string): string[] {
    if (type === 'green') {
      return ['100% fornybar energi', 'Opprinnelsesgaranti', 'Klimanøytral', 'App-styring'];
    }
    return ['Spotpris', 'Ingen påslag', 'App-styring', 'Månedlig faktura'];
  }

  private getInsuranceBasePrice(provider: string): number {
    const basePrices: Record<string, number> = {
      'If': 180, 'Gjensidige': 175, 'Tryg': 185, 'Fremtind': 170,
      'Storebrand': 190, 'KLP': 165, 'Codan': 175
    };
    return basePrices[provider] || 175;
  }

  private getInsuranceBenefits(provider: string, type: string): string[] {
    if (type === 'car') {
      return ['Kasko', 'Ansvar', 'Redningsaksjon', 'Erstatningsbil', 'Europeisk dekning'];
    }
    return ['Innboforsikring', 'Reiseforsikring', 'Ansvarsforsikring', 'Verdigjenstander'];
  }

  private getLoanBaseRate(provider: string): number {
    const baseRates: Record<string, number> = {
      'Bank Norwegian': 8.9, 'Santander': 9.5, 'Lendo': 10.2, 'Axo Finans': 11.5,
      'Zensum': 12.0, 'Sambla': 10.8, 'Instabank': 9.8, 'Komplett Bank': 10.5,
      'Resurs Bank': 11.2
    };
    return baseRates[provider] || 10.0;
  }

  private getLoanBenefits(provider: string, type: string): string[] {
    if (type === 'refinance') {
      return ['Samle alle lån', 'Lavere rente', 'En månedlig betaling', 'Gratis etablering'];
    }
    return ['Rask behandling', 'Ingen etableringsgebyr', 'Fleksible vilkår', 'Digital søknad'];
  }
}

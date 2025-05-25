
import { Provider, ProviderCategory } from '@/lib/types';
import { BuifylOffer } from './types';

export class BuifylTransformer {
  static transformOffersToProviders(offers: BuifylOffer[]): Provider[] {
    return offers.map(offer => ({
      id: offer.id,
      name: offer.provider_name,
      category: offer.category as ProviderCategory,
      logo: offer.logo_url || this.getDefaultLogo(offer.provider_name),
      price: offer.monthly_price,
      priceLabel: this.getPriceLabel(offer.category),
      rating: this.estimateRating(offer.provider_name),
      features: this.transformFeatures(offer),
      url: offer.source_url,
      offerUrl: this.buildBuifylAffiliateUrl(offer),
      lastUpdated: new Date(offer.scraped_at),
      isValidData: this.isDataFresh(offer.scraped_at),
      hasSpecificOffer: !!(offer.direct_link || offer.manual_override_url)
    }));
  }

  private static buildBuifylAffiliateUrl(offer: BuifylOffer): string {
    let baseUrl = offer.direct_link || offer.offer_url || offer.source_url;
    
    try {
      const url = new URL(baseUrl);
      
      url.searchParams.set('utm_source', 'skygruppen');
      url.searchParams.set('utm_medium', 'buifyl_shop');
      url.searchParams.set('utm_campaign', offer.category);
      url.searchParams.set('utm_content', offer.provider_name);
      url.searchParams.set('buifyl_product_id', offer.id);
      url.searchParams.set('click_id', `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
      
      return url.toString();
    } catch (error) {
      console.error(`Failed to build Buifyl URL for ${offer.provider_name}:`, error);
      return baseUrl;
    }
  }

  private static isDataFresh(scrapedAt: string): boolean {
    const scrapedDate = new Date(scrapedAt);
    const hoursSinceUpdate = (Date.now() - scrapedDate.getTime()) / (1000 * 60 * 60);
    return hoursSinceUpdate <= 48;
  }

  private static transformFeatures(offer: BuifylOffer): Record<string, string[]> {
    const features: string[] = [];
    
    if (offer.data_allowance) features.push(offer.data_allowance);
    if (offer.speed) features.push(offer.speed);
    if (offer.contract_length) features.push(offer.contract_length);
    if (offer.plan_name) features.push(offer.plan_name);
    
    if (offer.features && typeof offer.features === 'object' && offer.features !== null) {
      const featuresObj = offer.features as Record<string, any>;
      Object.values(featuresObj).forEach(feature => {
        if (typeof feature === 'string') features.push(feature);
      });
    }

    return {
      nb: features,
      en: features.map(f => this.translateFeature(f))
    };
  }

  private static translateFeature(feature: string): string {
    const translations: Record<string, string> = {
      'Ingen binding': 'No commitment',
      'Fast rente': 'Fixed interest',
      'Fleksible vilkår': 'Flexible terms',
      'Konkurransedyktig rente': 'Competitive interest',
      'Rask saksbehandling': 'Fast processing'
    };
    return translations[feature] || feature;
  }

  private static getPriceLabel(category: string): Record<string, string> {
    const labels: Record<string, Record<string, string>> = {
      mobile: { nb: 'kr/mnd', en: 'NOK/month' },
      electricity: { nb: 'øre/kWh', en: 'øre/kWh' },
      power: { nb: 'øre/kWh', en: 'øre/kWh' },
      insurance: { nb: 'kr/mnd', en: 'NOK/month' },
      loan: { nb: '% rente', en: '% interest' }
    };
    return labels[category] || { nb: 'kr/mnd', en: 'NOK/month' };
  }

  private static estimateRating(providerName: string): number {
    const ratings: Record<string, number> = {
      'Sbanken': 4.5,
      'DNB': 4.2,
      'Nordea': 4.1,
      'Talkmore': 4.3,
      'Telenor': 4.4,
      'Ice': 4.2,
      'Tibber': 4.6,
      'Fjordkraft': 4.1,
      'Gjensidige': 4.2,
      'If': 4.4
    };
    return ratings[providerName] || 4.0;
  }

  private static getDefaultLogo(providerName: string): string {
    const logos: Record<string, string> = {
      'DNB': 'https://www.dnb.no/static/images/dnb-logo.svg',
      'Sbanken': 'https://www.sbanken.no/globalassets/sbanken-logo.svg',
      'Nordea': 'https://www.nordea.no/globalassets/nordea-logo.svg',
      'Talkmore': 'https://www.talkmore.no/static/images/logo.svg',
      'Telenor': 'https://www.telenor.no/static/images/telenor-logo.svg',
      'Ice': 'https://www.ice.no/static/images/ice-logo.svg'
    };
    return logos[providerName] || '/placeholder.svg';
  }
}

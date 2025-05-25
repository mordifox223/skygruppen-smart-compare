
import { supabase } from '@/integrations/supabase/client';
import { Provider } from '@/lib/types';

/**
 * Ren Buifyl Shop service - henter kun data fra Supabase provider_offers tabellen
 */
class BuifylService {
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private cache: Map<string, { data: Provider[]; timestamp: number }> = new Map();

  async getProductsByCategory(category: string): Promise<Provider[]> {
    try {
      console.log(`Henter produkter fra Buifyl Shop for ${category}`);
      
      // Sjekk cache først
      const cached = this.cache.get(category);
      if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
        console.log(`Bruker cached data for ${category}: ${cached.data.length} produkter`);
        return cached.data;
      }
      
      // Hent data fra Supabase provider_offers tabellen
      const { data: offers, error } = await supabase
        .from('provider_offers')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('monthly_price', { ascending: true });

      if (error) {
        console.error('Feil ved henting fra Buifyl Shop:', error);
        return [];
      }

      if (!offers || offers.length === 0) {
        console.log(`Ingen produkter funnet i Buifyl Shop for ${category}`);
        return [];
      }

      // Transform til Provider format
      const providers = this.transformBuifylOffersToProviders(offers);
      
      // Cache resultatene
      this.cache.set(category, { data: providers, timestamp: Date.now() });
      
      console.log(`✅ Lastet ${providers.length} produkter fra Buifyl Shop for ${category}`);
      return providers;

    } catch (error) {
      console.error(`Feil ved henting fra Buifyl Shop for ${category}:`, error);
      return [];
    }
  }

  private transformBuifylOffersToProviders(offers: any[]): Provider[] {
    return offers.map(offer => ({
      id: offer.id,
      name: offer.provider_name,
      category: offer.category as any,
      logo: offer.logo_url || this.getDefaultLogo(offer.provider_name),
      price: offer.monthly_price,
      priceLabel: this.getPriceLabel(offer.category),
      rating: this.estimateRating(offer.provider_name),
      features: this.transformFeatures(offer),
      url: offer.source_url,
      offerUrl: this.buildBuifylAffiliateUrl(offer),
      lastUpdated: new Date(offer.scraped_at),
      isValidData: this.isDataFresh(offer.scraped_at),
      hasSpecificOffer: !!(offer.direct_link)
    }));
  }

  private buildBuifylAffiliateUrl(offer: any): string {
    // Bruk direkte lenke hvis tilgjengelig, ellers offer_url eller source_url
    let baseUrl = offer.direct_link || offer.offer_url || offer.source_url;
    
    try {
      const url = new URL(baseUrl);
      
      // Legg til Buifyl Shop tracking parametere
      url.searchParams.set('utm_source', 'skygruppen');
      url.searchParams.set('utm_medium', 'buifyl_shop');
      url.searchParams.set('utm_campaign', offer.category);
      url.searchParams.set('utm_content', offer.provider_name);
      url.searchParams.set('buifyl_product_id', offer.id);
      
      // Legg til unik click tracking
      url.searchParams.set('click_id', `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
      
      return url.toString();
    } catch (error) {
      console.error(`Kunne ikke bygge Buifyl URL for ${offer.provider_name}:`, error);
      return baseUrl;
    }
  }

  private isDataFresh(scrapedAt: string): boolean {
    const scrapedDate = new Date(scrapedAt);
    const hoursSinceUpdate = (Date.now() - scrapedDate.getTime()) / (1000 * 60 * 60);
    return hoursSinceUpdate <= 48; // Fresh hvis oppdatert innen 48 timer
  }

  private transformFeatures(offer: any): Record<string, string[]> {
    const features: string[] = [];
    
    // Hent features fra Buifyl Shop produktdata
    if (offer.data_allowance) features.push(offer.data_allowance);
    if (offer.speed) features.push(offer.speed);
    if (offer.contract_length) features.push(offer.contract_length);
    if (offer.plan_name) features.push(offer.plan_name);
    
    // Legg til features fra JSONB felt
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

  private translateFeature(feature: string): string {
    const translations: Record<string, string> = {
      'Ingen binding': 'No commitment',
      'Fast rente': 'Fixed interest',
      'Fleksible vilkår': 'Flexible terms',
      'Konkurransedyktig rente': 'Competitive interest',
      'Rask saksbehandling': 'Fast processing'
    };
    return translations[feature] || feature;
  }

  private getPriceLabel(category: string): Record<string, string> {
    const labels: Record<string, Record<string, string>> = {
      mobile: { nb: 'kr/mnd', en: 'NOK/month' },
      electricity: { nb: 'øre/kWh', en: 'øre/kWh' },
      power: { nb: 'øre/kWh', en: 'øre/kWh' },
      insurance: { nb: 'kr/mnd', en: 'NOK/month' },
      loan: { nb: '% rente', en: '% interest' }
    };
    return labels[category] || { nb: 'kr/mnd', en: 'NOK/month' };
  }

  private estimateRating(providerName: string): number {
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

  private getDefaultLogo(providerName: string): string {
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

  // Affiliate click logging for Buifyl Shop
  async logAffiliateClick(providerId: string, providerName: string, category: string, targetUrl: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('affiliate_clicks')
        .insert({
          provider_id: providerId,
          provider_name: providerName,
          category: category,
          url: targetUrl,
          user_agent: navigator.userAgent,
          referrer: document.referrer,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Kunne ikke logge Buifyl Shop affiliate click:', error);
      } else {
        console.log('✅ Buifyl Shop affiliate click logget:', {
          provider: providerName,
          category,
          url: targetUrl
        });
      }
    } catch (error) {
      console.error('Feil ved logging av Buifyl Shop affiliate click:', error);
    }
  }
}

export const buifylService = new BuifylService();

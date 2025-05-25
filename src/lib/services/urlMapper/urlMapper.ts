
import { urlTemplates } from './templates';
import { UrlTemplate, ProductInfo } from './types';
import { SlugGenerators } from './slugGenerators';
import { UrlUpdater } from './urlUpdater';

export class UniversalUrlMapper {
  /**
   * Generer korrekt redirect URL for et produkt basert på leverandør og kategori
   */
  static generateRedirectUrl(product: ProductInfo): string {
    try {
      console.log(`🔗 Genererer smart URL for ${product.provider_name} - ${product.name}`);
      
      // Først: Bruk eksisterende direct_link hvis tilgjengelig og gyldig
      if (product.direct_link && this.isValidUrl(product.direct_link)) {
        console.log(`✅ Bruker direct_link: ${product.direct_link}`);
        return this.addTrackingParams(product.direct_link, product);
      }
      
      // Deretter: Generer URL basert på smart template-logikk
      const generatedUrl = this.generateSmartUrl(product);
      if (generatedUrl) {
        console.log(`✅ Generert smart URL: ${generatedUrl}`);
        const trackedUrl = this.addTrackingParams(generatedUrl, product);
        
        // Update the generated URL in Supabase asynchronously
        UrlUpdater.updateGeneratedUrl(product, trackedUrl).catch(error => {
          console.error('Failed to update URL in Supabase:', error);
        });
        
        return trackedUrl;
      }
      
      // Hvis offer_url er forskjellig fra source_url, bruk den
      if (product.offer_url && this.isValidUrl(product.offer_url) && product.offer_url !== product.source_url) {
        console.log(`✅ Bruker offer_url: ${product.offer_url}`);
        return this.addTrackingParams(product.offer_url, product);
      }
      
      // Fallback til source_url med tracking
      console.log(`⚠️ Fallback til source_url for ${product.provider_name}`);
      return this.addTrackingParams(product.source_url || `https://www.${product.provider_name.toLowerCase().replace(/\s+/g, '')}.no`, product);
      
    } catch (error) {
      console.error(`❌ Feil ved generering av URL for ${product.provider_name}:`, error);
      return product.source_url || `https://www.${product.provider_name.toLowerCase().replace(/\s+/g, '')}.no`;
    }
  }
  
  /**
   * Generer smart URL basert på leverandørspesifikk logikk
   */
  private static generateSmartUrl(product: ProductInfo): string | null {
    const categoryTemplates = urlTemplates[product.category];
    if (!categoryTemplates) {
      console.log(`⚠️ Ingen templates funnet for kategori: ${product.category}`);
      return null;
    }
    
    const template = categoryTemplates[product.provider_name];
    if (!template) {
      console.log(`⚠️ Ingen template funnet for ${product.provider_name} i ${product.category}`);
      return null;
    }
    
    // Sjekk om template krever spesifikke data
    if (template.requiresProductId && !product.productId) {
      console.log(`⚠️ Template krever productId, fallback for ${product.provider_name}`);
      return template.fallbackUrl;
    }
    
    const smartSlug = this.getSmartSlug(product, template);
    if (template.requiresSlug && !smartSlug) {
      console.log(`⚠️ Template krever slug, fallback for ${product.provider_name}`);
      return template.fallbackUrl;
    }
    
    // Bygg URL fra template med smart slug-generering
    let url = template.baseUrl + template.pattern;
    
    // Erstatt placeholders
    url = url.replace('{productId}', product.productId || '');
    url = url.replace('{slug}', smartSlug || '');
    url = url.replace('{id}', product.id || '');
    
    return url;
  }
  
  /**
   * Generer smart slug basert på leverandør og template-type
   */
  private static getSmartSlug(product: ProductInfo, template: UrlTemplate): string {
    const planName = product.plan_name || product.name;
    const generator = template.urlGenerator || 'standard';
    
    console.log(`🧠 Generating smart slug for ${product.provider_name} using ${generator} generator`);
    console.log(`📝 Plan name: "${planName}"`);
    
    switch (generator) {
      case 'ice':
        return SlugGenerators.generateIceSlug(planName);
      case 'talkmore':
        return SlugGenerators.generateTalkmoreSlug(planName);
      case 'onecall':
        return SlugGenerators.generateOneCallSlug(planName);
      case 'mycall':
        return SlugGenerators.generateMyCallSlug(planName);
      case 'chilimobil':
        return SlugGenerators.generateChilimobilSlug(planName);
      case 'happybytes':
        return SlugGenerators.generateHappybytesSlug(planName);
      case 'plussmobil':
        return SlugGenerators.generatePlussmobilSlug(planName);
      case 'saga':
        return SlugGenerators.generateSagaSlug(planName);
      case 'release':
        return SlugGenerators.generateReleaseSlug(planName);
      default:
        return SlugGenerators.generateStandardSlug(planName);
    }
  }
  
  /**
   * Valider om URL er gyldig
   */
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  }
  
  /**
   * Legg til tracking-parametere til URL
   */
  private static addTrackingParams(url: string, product: ProductInfo): string {
    try {
      const urlObj = new URL(url);
      
      // Legg til affiliate tracking
      urlObj.searchParams.set('utm_source', 'skygruppen');
      urlObj.searchParams.set('utm_medium', 'comparison');
      urlObj.searchParams.set('utm_campaign', product.category);
      urlObj.searchParams.set('utm_content', product.provider_name);
      urlObj.searchParams.set('utm_term', product.id);
      urlObj.searchParams.set('ref', 'skycompare');
      urlObj.searchParams.set('partner_id', 'skygruppen');
      urlObj.searchParams.set('click_id', `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
      
      return urlObj.toString();
    } catch (error) {
      console.error('Feil ved adding tracking params:', error);
      return url;
    }
  }
  
  /**
   * Få template for en spesifikk leverandør og kategori
   */
  static getTemplate(category: string, provider: string): UrlTemplate | null {
    return urlTemplates[category]?.[provider] || null;
  }
  
  /**
   * Legg til ny template-konfigurasjon
   */
  static addTemplate(category: string, provider: string, template: UrlTemplate): void {
    if (!urlTemplates[category]) {
      urlTemplates[category] = {};
    }
    urlTemplates[category][provider] = template;
    console.log(`✅ Lagt til ny template for ${provider} i ${category}`);
  }
  
  /**
   * Få alle tilgjengelige leverandører for en kategori
   */
  static getProvidersForCategory(category: string): string[] {
    return Object.keys(urlTemplates[category] || {});
  }
  
  /**
   * Få alle kategorier med templates
   */
  static getAvailableCategories(): string[] {
    return Object.keys(urlTemplates);
  }

  /**
   * Update URLs for all providers in a category
   */
  static async updateCategoryUrls(category: string): Promise<number> {
    const providers = this.getProvidersForCategory(category);
    let totalUpdated = 0;
    
    for (const provider of providers) {
      const updated = await UrlUpdater.updateProviderUrls(provider, category);
      totalUpdated += updated;
    }
    
    console.log(`🎯 Updated ${totalUpdated} URLs for category ${category}`);
    return totalUpdated;
  }
}

// Re-export for convenience
export { UrlUpdater, SlugGenerators };
export * from './types';

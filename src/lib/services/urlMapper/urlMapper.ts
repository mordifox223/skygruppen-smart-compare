import { urlTemplates, UrlTemplate } from './templates';

export interface ProductInfo {
  id: string;
  name: string;
  provider_name: string;
  category: string;
  plan_name?: string;
  productId?: string;
  slug?: string;
  offer_url?: string;
  direct_link?: string;
  source_url?: string;
}

export class UniversalUrlMapper {
  /**
   * Generer korrekt redirect URL for et produkt basert på leverandør og kategori
   */
  static generateRedirectUrl(product: ProductInfo): string {
    try {
      console.log(`🔗 Genererer URL for ${product.provider_name} - ${product.name}`);
      
      // Først: Bruk eksisterende direct_link eller offer_url hvis tilgjengelig
      if (product.direct_link && this.isValidUrl(product.direct_link)) {
        console.log(`✅ Bruker direct_link: ${product.direct_link}`);
        return this.addTrackingParams(product.direct_link, product);
      }
      
      if (product.offer_url && this.isValidUrl(product.offer_url) && product.offer_url !== product.source_url) {
        console.log(`✅ Bruker offer_url: ${product.offer_url}`);
        return this.addTrackingParams(product.offer_url, product);
      }
      
      // Deretter: Generer URL basert på template
      const generatedUrl = this.generateFromTemplate(product);
      if (generatedUrl) {
        console.log(`✅ Generert URL fra template: ${generatedUrl}`);
        return this.addTrackingParams(generatedUrl, product);
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
   * Generer URL fra template-konfigurasjon
   */
  private static generateFromTemplate(product: ProductInfo): string | null {
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
      console.log(`⚠️ Template krever productId, men mangler for ${product.provider_name}`);
      return template.fallbackUrl;
    }
    
    if (template.requiresSlug && !this.getProductSlug(product)) {
      console.log(`⚠️ Template krever slug, men kan ikke genereres for ${product.provider_name}`);
      return template.fallbackUrl;
    }
    
    // Bygg URL fra template
    let url = template.baseUrl + template.pattern;
    
    // Erstatt placeholders
    url = url.replace('{productId}', product.productId || '');
    url = url.replace('{slug}', this.getProductSlug(product) || '');
    url = url.replace('{id}', product.id || '');
    
    return url;
  }
  
  /**
   * Generer slug fra produktnavn eller plan_name med leverandørspesifikk logikk
   */
  private static getProductSlug(product: ProductInfo): string {
    const name = product.plan_name || product.name;
    
    // Spesifikk logikk for Ice mobilabonnement
    if (product.provider_name === 'Ice' && product.category === 'mobile') {
      return this.generateIceSlug(name);
    }
    
    // Standard slugify for andre leverandører
    return this.slugify(name);
  }
  
  /**
   * Generer Ice-spesifikk slug (f.eks. "Ice Smart 20GB" -> "20-gb")
   */
  private static generateIceSlug(planName: string): string {
    // Fjern "Ice" prefix og lignende
    let cleanName = planName.replace(/^Ice\s*/i, '').trim();
    
    // Ekstraksjonslogikk for datamengde
    const dataMatch = cleanName.match(/(\d+)\s*(gb|mb)/i);
    if (dataMatch) {
      const amount = dataMatch[1];
      const unit = dataMatch[2].toLowerCase();
      return `${amount}-${unit}`;
    }
    
    // Fallback til standard slugify
    return this.slugify(cleanName);
  }
  
  /**
   * Konverter tekst til URL-slug
   */
  private static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[æåø]/g, (match) => {
        const replacements: { [key: string]: string } = { 'æ': 'ae', 'å': 'aa', 'ø': 'oe' };
        return replacements[match] || match;
      })
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
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
}

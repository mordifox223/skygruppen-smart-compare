
import { UniversalUrlMapper } from '../urlMapper/urlMapper';
import { ProductInfo } from '../urlMapper/types';

export class URLGeneratorService {
  /**
   * Generate optimized URL for a provider offer
   */
  static generateProviderUrl(
    providerName: string,
    category: string,
    planName: string,
    originalUrl: string
  ): string {
    try {
      const productInfo: ProductInfo = {
        id: `${providerName}-${planName}`.toLowerCase().replace(/\s+/g, '-'),
        name: planName,
        provider_name: providerName,
        category,
        plan_name: planName,
        offer_url: originalUrl,
        source_url: originalUrl,
        productId: this.generateProductId(providerName, planName),
        slug: this.generateSlug(providerName, planName)
      };

      const generatedUrl = UniversalUrlMapper.generateRedirectUrl(productInfo);
      console.log(`🔗 Generated URL for ${providerName} ${planName}: ${generatedUrl}`);
      
      return generatedUrl;
    } catch (error) {
      console.error(`❌ Failed to generate URL for ${providerName} ${planName}:`, error);
      return originalUrl; // Fallback to original URL
    }
  }

  /**
   * Generate product ID for URL tracking
   */
  private static generateProductId(providerName: string, planName: string): string {
    const normalized = `${providerName}-${planName}`
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    return normalized;
  }

  /**
   * Generate SEO-friendly slug
   */
  private static generateSlug(providerName: string, planName: string): string {
    const slug = `${providerName}-${planName}`
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    return slug;
  }

  /**
   * Batch generate URLs for multiple offers
   */
  static batchGenerateUrls(offers: Array<{
    providerName: string;
    category: string;
    planName: string;
    originalUrl: string;
  }>): Map<string, string> {
    const generatedUrls = new Map<string, string>();
    
    offers.forEach(offer => {
      const key = `${offer.providerName}-${offer.planName}`;
      const url = this.generateProviderUrl(
        offer.providerName,
        offer.category,
        offer.planName,
        offer.originalUrl
      );
      generatedUrls.set(key, url);
    });

    console.log(`🔗 Batch generated ${generatedUrls.size} URLs`);
    return generatedUrls;
  }

  /**
   * Validate and optimize existing URLs
   */
  static async optimizeExistingUrls(category: string): Promise<number> {
    console.log(`🔧 Optimizing existing URLs for category: ${category}`);
    
    // This would fetch existing offers and regenerate their URLs
    // Implementation would go here
    
    return 0; // Return count of optimized URLs
  }
}

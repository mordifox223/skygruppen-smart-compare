
import { supabase } from '@/integrations/supabase/client';
import { ProductInfo } from './types';

export class UrlUpdater {
  /**
   * Update generated URL in Supabase for a product offer
   */
  static async updateGeneratedUrl(productInfo: ProductInfo, generatedUrl: string): Promise<boolean> {
    try {
      console.log(`🔄 Updating generated URL in Supabase for ${productInfo.provider_name} - ${productInfo.name}`);
      console.log(`📝 Generated URL: ${generatedUrl}`);
      
      const { error } = await supabase
        .from('provider_offers')
        .update({ 
          direct_link: generatedUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', productInfo.id);

      if (error) {
        console.error('❌ Failed to update generated URL in Supabase:', error);
        return false;
      }

      console.log(`✅ Successfully updated generated URL for ${productInfo.provider_name}`);
      return true;
    } catch (error) {
      console.error('💥 Unexpected error updating generated URL:', error);
      return false;
    }
  }

  /**
   * Batch update URLs for multiple products
   */
  static async batchUpdateUrls(updates: Array<{ productInfo: ProductInfo; generatedUrl: string }>): Promise<number> {
    let successCount = 0;
    
    for (const { productInfo, generatedUrl } of updates) {
      const success = await this.updateGeneratedUrl(productInfo, generatedUrl);
      if (success) successCount++;
    }
    
    console.log(`🎯 Batch update completed: ${successCount}/${updates.length} URLs updated`);
    return successCount;
  }

  /**
   * Update all offers for a specific provider and category
   */
  static async updateProviderUrls(providerName: string, category: string): Promise<number> {
    try {
      console.log(`🚀 Updating all URLs for ${providerName} in ${category}`);
      
      const { data: offers, error } = await supabase
        .from('provider_offers')
        .select('*')
        .eq('provider_name', providerName)
        .eq('category', category)
        .eq('is_active', true);

      if (error) {
        console.error('❌ Failed to fetch offers for URL update:', error);
        return 0;
      }

      if (!offers || offers.length === 0) {
        console.log(`📭 No offers found for ${providerName} in ${category}`);
        return 0;
      }

      // Import UniversalUrlMapper here to avoid circular dependency
      const { UniversalUrlMapper } = await import('./urlMapper');
      
      const updates = offers.map(offer => {
        const productInfo: ProductInfo = {
          id: offer.id,
          name: offer.plan_name || offer.provider_name,
          provider_name: offer.provider_name,
          category: offer.category,
          plan_name: offer.plan_name,
          productId: offer.product_id,
          slug: offer.slug,
          offer_url: offer.offer_url,
          direct_link: offer.direct_link,
          source_url: offer.source_url
        };

        const generatedUrl = UniversalUrlMapper.generateRedirectUrl(productInfo);
        return { productInfo, generatedUrl };
      });

      return await this.batchUpdateUrls(updates);
    } catch (error) {
      console.error(`💥 Error updating URLs for ${providerName}:`, error);
      return 0;
    }
  }
}

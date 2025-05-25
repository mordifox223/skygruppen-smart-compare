
import { supabase } from '@/integrations/supabase/client';
import { ScrapedProduct } from './types';

export class DatabaseManager {
  async storeProducts(products: ScrapedProduct[]): Promise<void> {
    console.log(`💾 Storing ${products.length} products in database...`);

    for (const product of products) {
      try {
        const offerData = {
          provider_name: product.provider,
          category: product.category,
          plan_name: product.product,
          monthly_price: this.extractNumericPrice(product.price),
          offer_url: product.link,
          source_url: product.link,
          data_allowance: product.data,
          speed: product.speed,
          contract_length: product.binding,
          features: { benefits: product.benefits },
          logo_url: product.logo,
          scraped_at: new Date().toISOString(),
          is_active: true
        };

        // Check if offer exists
        const { data: existingOffer } = await supabase
          .from('provider_offers')
          .select('id')
          .eq('provider_name', product.provider)
          .eq('plan_name', product.product)
          .single();

        if (existingOffer) {
          // Update existing offer
          const { error } = await supabase
            .from('provider_offers')
            .update(offerData)
            .eq('id', existingOffer.id);
            
          if (error) {
            console.error(`Failed to update offer ${product.product}:`, error);
          }
        } else {
          // Insert new offer
          const { error } = await supabase
            .from('provider_offers')
            .insert(offerData);
            
          if (error) {
            console.error(`Failed to insert offer ${product.product}:`, error);
          }
        }
      } catch (error) {
        console.error(`Failed to store product ${product.product}:`, error);
      }
    }
    
    console.log(`✅ Successfully stored products in database`);
  }

  private extractNumericPrice(priceString: string): number {
    const match = priceString.match(/(\d+(?:[.,]\d+)?)/);
    return match ? parseFloat(match[1].replace(',', '.')) : 0;
  }
}

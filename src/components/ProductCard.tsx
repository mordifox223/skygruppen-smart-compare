
import React from 'react';
import { EnhancedBuifylProduct } from '@/lib/services/enhancedBuifylService';
import { logAffiliateClick } from '@/lib/services/buifylService';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: EnhancedBuifylProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleProductClick = async () => {
    try {
      await logAffiliateClick(product.id, product.provider_name, product.category, product.offer_url);
      console.log(`🔗 Åpner tilbud fra ${product.provider_name}:`, product.offer_url);
      window.open(product.offer_url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Feil ved håndtering av produktklikk:', error);
      window.open(product.offer_url, '_blank', 'noopener,noreferrer');
    }
  };

  // Format features for better display
  const getFormattedFeatures = () => {
    const features = [];
    
    if (product.data_allowance) {
      features.push(`${product.data_allowance}`);
    }
    
    if (product.speed) {
      features.push(`${product.speed}`);
    }
    
    // Add features from the features object
    if (product.features?.nb && product.features.nb.length > 0) {
      features.push(...product.features.nb.slice(0, 3));
    }
    
    return features;
  };

  const formattedFeatures = getFormattedFeatures();

  return (
    <article 
      className="product-card border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col h-full bg-white hover:shadow-md transition-shadow"
      aria-labelledby={`product-${product.id}-title`}
    >
      {/* Provider Logo */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
          <span className="text-lg font-bold text-gray-600">
            {product.provider_name.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <h3 
            id={`product-${product.id}-title`}
            className="font-bold text-lg text-gray-900"
          >
            📱 {product.provider_name} {product.plan_name || ''}
          </h3>
        </div>
      </div>

      {/* Features display */}
      <div className="mb-4 flex-grow">
        {formattedFeatures.length > 0 && (
          <div className="mb-3">
            <div className="text-sm text-green-600 font-medium">
              ✅ {formattedFeatures.join(' • ')}
            </div>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-gray-900">
          💰 {product.monthly_price} kr/mnd
        </div>
      </div>

      {/* Action button */}
      <footer className="mt-auto">
        <Button 
          className={cn("w-full flex items-center justify-center gap-2", 
            product.category === 'electricity' ? 'bg-emerald-600 hover:bg-emerald-700' : 
            product.category === 'insurance' ? 'bg-blue-600 hover:bg-blue-700' :
            product.category === 'loan' ? 'bg-purple-600 hover:bg-purple-700' : 
            'bg-sky-600 hover:bg-sky-700'
          )}
          onClick={handleProductClick}
          aria-label={`Bestill ${product.provider_name} abonnement`}
        >
          🔗 Bestill hos {product.provider_name}
          <ExternalLink size={16} />
        </Button>
      </footer>
    </article>
  );
};

export default ProductCard;

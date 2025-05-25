
import React from 'react';
import { EnhancedBuifylProduct } from '@/lib/services/enhancedBuifylService';
import { logAffiliateClick } from '@/lib/services/buifylService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Wifi, Database, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: EnhancedBuifylProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleProductClick = async () => {
    try {
      await logAffiliateClick(product.id, product.provider_name, product.category, product.offer_url);
      console.log(`Åpner tilbud fra ${product.provider_name}:`, product.offer_url);
      window.open(product.offer_url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Feil ved håndtering av produktklikk:', error);
      window.open(product.offer_url, '_blank', 'noopener,noreferrer');
    }
  };

  // Format features for better display
  const getFormattedFeatures = () => {
    const features = [];
    
    // Add features from the features object
    if (product.features?.nb && product.features.nb.length > 0) {
      features.push(...product.features.nb.slice(0, 4));
    }
    
    return features;
  };

  const formattedFeatures = getFormattedFeatures();
  const providerInitial = product.provider_name.charAt(0).toUpperCase();

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header with provider info */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              {providerInitial}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                {product.provider_name}
              </h3>
              {product.plan_name && (
                <p className="text-sm text-gray-600 mt-1">
                  {product.plan_name}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {product.monthly_price} kr
            </div>
            <div className="text-sm text-gray-500">per måned</div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="p-6 space-y-4">
        {/* Data and Speed */}
        <div className="flex flex-wrap gap-3">
          {product.data_allowance && (
            <div className="flex items-center space-x-2 text-sm">
              <Database size={16} className="text-blue-500" />
              <span className="font-medium text-gray-700">{product.data_allowance}</span>
            </div>
          )}
          {product.speed && (
            <div className="flex items-center space-x-2 text-sm">
              <Wifi size={16} className="text-green-500" />
              <span className="font-medium text-gray-700">{product.speed}</span>
            </div>
          )}
          {product.contract_length && (
            <div className="flex items-center space-x-2 text-sm">
              <Clock size={16} className="text-orange-500" />
              <span className="font-medium text-gray-700">{product.contract_length}</span>
            </div>
          )}
        </div>

        {/* Features */}
        {formattedFeatures.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Inkludert:</h4>
            <div className="flex flex-wrap gap-2">
              {formattedFeatures.map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="p-6 pt-0">
        <Button 
          className={cn("w-full flex items-center justify-center gap-2", 
            product.category === 'electricity' ? 'bg-emerald-600 hover:bg-emerald-700' : 
            product.category === 'insurance' ? 'bg-blue-600 hover:bg-blue-700' :
            product.category === 'loan' ? 'bg-purple-600 hover:bg-purple-700' : 
            'bg-blue-600 hover:bg-blue-700'
          )}
          onClick={handleProductClick}
          aria-label={`Bestill ${product.provider_name} abonnement`}
        >
          Se tilbud hos {product.provider_name}
          <ExternalLink size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;

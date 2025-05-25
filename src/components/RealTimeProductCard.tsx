
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Wifi, Database, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logAffiliateClick } from '@/lib/services/buifylService';

interface RealTimeProduct {
  provider: string;
  logo: string;
  product: string;
  price: string;
  data?: string;
  speed?: string;
  binding?: string;
  benefits: string[];
  link: string;
  category: 'mobile' | 'electricity' | 'insurance' | 'loan';
}

interface RealTimeProductCardProps {
  product: RealTimeProduct;
}

const RealTimeProductCard: React.FC<RealTimeProductCardProps> = ({ product }) => {
  const handleProductClick = async () => {
    try {
      await logAffiliateClick(
        `${product.provider}-${product.product}`, 
        product.provider, 
        product.category,
        product.link
      );
      
      console.log(`🔗 Åpner ${product.provider} ${product.product}:`, product.link);
      window.open(product.link, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Feil ved håndtering av produktklikk:', error);
      window.open(product.link, '_blank', 'noopener,noreferrer');
    }
  };

  const getCategoryColor = () => {
    switch (product.category) {
      case 'mobile': return 'bg-blue-600 hover:bg-blue-700';
      case 'electricity': return 'bg-emerald-600 hover:bg-emerald-700';
      case 'insurance': return 'bg-purple-600 hover:bg-purple-700';
      case 'loan': return 'bg-orange-600 hover:bg-orange-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header with provider info */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={product.logo} 
              alt={`${product.provider} logo`}
              className="w-12 h-12 rounded-lg object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${product.provider}&background=random`;
              }}
            />
            <div>
              <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                {product.provider}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {product.product}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {product.price}
            </div>
            {product.category === 'mobile' && (
              <div className="text-sm text-gray-500">per måned</div>
            )}
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="p-6 space-y-4">
        {/* Mobile-specific details */}
        {product.category === 'mobile' && (
          <div className="flex flex-wrap gap-3">
            {product.data && (
              <div className="flex items-center space-x-2 text-sm">
                <Database size={16} className="text-blue-500" />
                <span className="font-medium text-gray-700">{product.data}</span>
              </div>
            )}
            {product.speed && (
              <div className="flex items-center space-x-2 text-sm">
                <Wifi size={16} className="text-green-500" />
                <span className="font-medium text-gray-700">{product.speed}</span>
              </div>
            )}
            {product.binding && (
              <div className="flex items-center space-x-2 text-sm">
                <Clock size={16} className="text-orange-500" />
                <span className="font-medium text-gray-700">{product.binding}</span>
              </div>
            )}
          </div>
        )}

        {/* Benefits */}
        {product.benefits.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Fordeler:</h4>
            <div className="space-y-1">
              {product.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                  <Check size={14} className="text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="p-6 pt-0">
        <Button 
          className={cn("w-full flex items-center justify-center gap-2", getCategoryColor())}
          onClick={handleProductClick}
          aria-label={`Bestill ${product.provider} ${product.product}`}
        >
          Se tilbud hos {product.provider}
          <ExternalLink size={16} />
        </Button>
      </div>
    </div>
  );
};

export default RealTimeProductCard;

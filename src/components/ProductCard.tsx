
import React from 'react';
import { BuifylProduct, logAffiliateClick } from '@/lib/services/buifylService';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: BuifylProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleProductClick = async () => {
    try {
      await logAffiliateClick(product.id, product.provider_name, product.category, product.offer_url);
      console.log(`🔗 Opening ${product.provider_name} offer:`, product.offer_url);
      window.open(product.offer_url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error handling product click:', error);
      window.open(product.offer_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article 
      className="product-card border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col h-full bg-white hover:shadow-md transition-shadow"
      aria-labelledby={`product-${product.id}-title`}
    >
      <header className="card-header mb-4">
        <h3 
          id={`product-${product.id}-title`}
          className="font-semibold text-lg text-gray-900"
        >
          {product.provider_name}
        </h3>
        {product.plan_name && product.plan_name !== product.provider_name && (
          <p className="text-sm text-gray-600 mt-1">{product.plan_name}</p>
        )}
        <div className="price-badge mt-2">
          <span className="text-2xl font-semibold text-sky-600">
            {product.monthly_price} kr
          </span>
          <span className="text-sm font-normal text-gray-600">/mnd</span>
        </div>
      </header>
      
      <div className="card-body mb-4 flex-grow">
        {product.data_allowance && (
          <div className="mb-2 text-sm text-gray-600">
            <strong>Data:</strong> {product.data_allowance}
          </div>
        )}
        {product.speed && (
          <div className="mb-2 text-sm text-gray-600">
            <strong>Hastighet:</strong> {product.speed}
          </div>
        )}
        
        {product.features?.nb && product.features.nb.length > 0 && (
          <ul aria-label="Produktfunksjoner" className="space-y-2">
            {product.features.nb.slice(0, 4).map((feature, index) => (
              <li key={index} className="text-sm flex items-start">
                <span className="text-green-500 mr-2 font-bold">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="card-footer">
        <Button 
          className={cn("w-full flex items-center justify-center gap-2", 
            product.category === 'electricity' ? 'bg-emerald-600 hover:bg-emerald-700' : 
            product.category === 'insurance' ? 'bg-blue-600 hover:bg-blue-700' :
            product.category === 'loan' ? 'bg-purple-600 hover:bg-purple-700' : 
            'bg-sky-600 hover:bg-sky-700'
          )}
          onClick={handleProductClick}
          aria-label={`Velg ${product.provider_name} abonnement`}
        >
          Velg abonnement
          <ExternalLink size={16} />
        </Button>
      </footer>
    </article>
  );
};

export default ProductCard;


import React from 'react';
import { BuifylProduct, logAffiliateClick } from '@/lib/services/buifylService';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
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

  // Show data quality indicator if validation exists
  const showQualityIndicator = product.validation && (
    product.validation.confidence < 90 || product.validation.warnings.length > 0
  );

  const getQualityColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 80) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getDataAge = (scrapedAt: string) => {
    const scrapedDate = new Date(scrapedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - scrapedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const dataAge = getDataAge(product.scraped_at);

  return (
    <article 
      className="product-card border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col h-full bg-white hover:shadow-md transition-shadow"
      aria-labelledby={`product-${product.id}-title`}
    >
      {/* Data quality indicator */}
      {showQualityIndicator && product.validation && (
        <div className={cn(
          "mb-3 p-2 rounded text-xs border",
          getQualityColor(product.validation.confidence)
        )}>
          <div className="flex items-center">
            {product.validation.confidence >= 80 ? (
              <CheckCircle size={12} className="mr-1" />
            ) : (
              <AlertTriangle size={12} className="mr-1" />
            )}
            <span>Datakvalitet: {product.validation.confidence}%</span>
          </div>
          {product.validation.warnings.length > 0 && (
            <div className="mt-1 text-xs opacity-75">
              {product.validation.warnings[0]}
            </div>
          )}
        </div>
      )}

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

        {/* Show data age if older than 3 days */}
        {dataAge > 3 && (
          <div className="mt-2 text-xs text-gray-500 text-center flex items-center justify-center">
            <Clock size={12} className="mr-1" />
            Oppdatert for {dataAge} dager siden
          </div>
        )}
      </footer>
    </article>
  );
};

export default ProductCard;

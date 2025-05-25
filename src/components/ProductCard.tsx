
import React from 'react';
import { EnhancedBuifylProduct } from '@/lib/services/enhancedBuifylService';
import { logAffiliateClick } from '@/lib/services/buifylService';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: EnhancedBuifylProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleProductClick = async () => {
    try {
      await logAffiliateClick(product.id, product.provider_name, product.category, product.offer_url);
      console.log(`🔗 Åpner kvalitetssikret tilbud fra ${product.provider_name}:`, product.offer_url);
      window.open(product.offer_url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Feil ved håndtering av produktklikk:', error);
      window.open(product.offer_url, '_blank', 'noopener,noreferrer');
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  const getValidationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle size={12} className="text-green-600" />;
      case 'warning':
        return <AlertTriangle size={12} className="text-yellow-600" />;
      default:
        return <Shield size={12} className="text-gray-600" />;
    }
  };

  return (
    <article 
      className="product-card border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col h-full bg-white hover:shadow-md transition-shadow"
      aria-labelledby={`product-${product.id}-title`}
    >
      {/* Kvalitetsindikator */}
      <div className={cn(
        "mb-3 p-2 rounded text-xs border flex items-center justify-between",
        getQualityColor(product.qualityScore)
      )}>
        <div className="flex items-center">
          {getValidationIcon(product.validationStatus)}
          <span className="ml-1 font-medium">Kvalitet: {product.qualityScore}%</span>
        </div>
        {product.isLiveData && (
          <div className="flex items-center text-green-600">
            <Clock size={10} className="mr-1" />
            <span>Live</span>
          </div>
        )}
      </div>

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

        {/* Valideringsinfo */}
        {product.validationErrors.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            <div className="flex items-center">
              <AlertTriangle size={10} className="mr-1" />
              {product.validationErrors[0]}
            </div>
          </div>
        )}

        {/* Sist validert */}
        <div className="mt-2 text-xs text-gray-500 text-center flex items-center justify-center">
          <Shield size={12} className="mr-1" />
          Validert: {new Date(product.lastValidated).toLocaleDateString('nb-NO')}
        </div>
      </footer>
    </article>
  );
};

export default ProductCard;


import React from 'react';
import { Provider } from '@/lib/types';
import { useLanguage } from '@/lib/languageContext';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProviderLogo from '@/components/ProviderLogo';
import { providerDataService } from '@/lib/services/providerDataService';

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const { language } = useLanguage();
  
  const handleProviderClick = async () => {
    try {
      // Log the click for analytics in Supabase
      await providerDataService.logAffiliateClick(
        provider.id, 
        provider.name, 
        provider.category,
        provider.offerUrl
      );
      
      console.log(`Opening ${provider.name} offer:`, provider.offerUrl);
      
      // Open in new tab with proper security
      window.open(provider.offerUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error handling provider click:', error);
      // Fallback - still open the link
      window.open(provider.offerUrl || provider.url, '_blank', 'noopener,noreferrer');
    }
  };
  
  // Generate stars for rating
  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(provider.rating);
    const hasHalfStar = provider.rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="fill-yellow-400 text-yellow-400" size={16} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="text-gray-300" size={16} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="text-gray-300" size={16} />);
      }
    }
    return stars;
  };

  // Check if provider has specific offer URL
  const hasSpecificOffer = provider.hasSpecificOffer;
  
  // Only show outdated warning if data is actually old (not just fallback)
  const showOutdatedWarning = provider.isValidData === false && provider.validationStatus?.includes('utdatert');
  
  return (
    <div className="provider-card border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col h-full bg-white hover:shadow-md transition-shadow">
      {/* Only show warnings for actual data issues, not fallback data */}
      {showOutdatedWarning && (
        <div className="mb-2">
          <div className="p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
            {provider.validationStatus}
          </div>
        </div>
      )}
      
      {/* Show offer type indicator */}
      {hasSpecificOffer && (
        <div className="mb-2">
          <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700 flex items-center">
            <CheckCircle size={12} className="mr-1" />
            {language === 'nb' ? 'Direkte til tilbud' : 'Direct to offer'}
          </div>
        </div>
      )}
      
      <div className="flex items-center mb-4">
        <div className="mr-3">
          <ProviderLogo provider={provider} size="lg" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{provider.name}</h3>
          <div className="flex mt-1">{renderRating()}</div>
          <span className="text-sm text-gray-500">
            {provider.rating.toFixed(1)} / 5
          </span>
        </div>
      </div>
      
      <div className="mb-4 flex-grow">
        <div className="text-2xl font-semibold text-sky-600">
          {provider.price} <span className="text-sm font-normal">{provider.priceLabel[language]}</span>
        </div>
        
        <ul className="mt-3 space-y-2">
          {provider.features[language].map((feature, idx) => (
            <li key={idx} className="text-sm flex items-start">
              <span className="text-green-500 mr-2 font-bold">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <Button 
        className={cn("w-full mt-auto flex items-center justify-center gap-2", 
          provider.category === 'electricity' ? 'bg-emerald-600 hover:bg-emerald-700' : 
          provider.category === 'insurance' ? 'bg-blue-600 hover:bg-blue-700' :
          provider.category === 'loan' ? 'bg-purple-600 hover:bg-purple-700' : 
          'bg-sky-600 hover:bg-sky-700'
        )}
        onClick={handleProviderClick}
      >
        {hasSpecificOffer 
          ? (language === 'nb' ? 'Gå til tilbud' : 'Go to offer')
          : (language === 'nb' ? 'Velg leverandør' : 'Select provider')
        }
        <ExternalLink size={16} />
      </Button>
      
      {/* Last updated info - only show for real data */}
      {provider.lastUpdated && provider.isValidData !== false && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          {language === 'nb' ? 'Oppdatert' : 'Updated'}: {new Date(provider.lastUpdated).toLocaleDateString('nb-NO')}
        </div>
      )}
    </div>
  );
};

export default ProviderCard;

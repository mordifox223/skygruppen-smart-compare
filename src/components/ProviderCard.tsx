
import React from 'react';
import { Provider } from '@/lib/types';
import { useLanguage } from '@/lib/languageContext';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const { language } = useLanguage();
  
  // Generate stars for rating
  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(provider.rating);
    const hasHalfStar = provider.rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Full star
        stars.push(<Star key={i} className="fill-yellow-400 text-yellow-400" size={16} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Half star (we'll simulate with CSS)
        stars.push(
          <div key={i} className="relative">
            <Star className="text-gray-300" size={16} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
            </div>
          </div>
        );
      } else {
        // Empty star
        stars.push(<Star key={i} className="text-gray-300" size={16} />);
      }
    }
    return stars;
  };
  
  return (
    <div className="provider-card border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col h-full bg-white">
      <div className="flex items-center mb-4">
        <div className="w-20 h-12 bg-gray-50 rounded flex items-center justify-center overflow-hidden mr-3">
          <img 
            src={provider.logo} 
            alt={`${provider.name} logo`} 
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{provider.name}</h3>
          <div className="flex">{renderRating()}</div>
        </div>
      </div>
      
      <div className="mb-4 flex-grow">
        <div className="text-2xl font-semibold text-sky-600">
          {provider.price} <span className="text-sm font-normal">{provider.priceLabel[language]}</span>
        </div>
        
        <ul className="mt-3 space-y-1">
          {provider.features[language].map((feature, idx) => (
            <li key={idx} className="text-sm flex items-start">
              <span className="text-green-500 mr-2 font-bold">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <Button 
        className="w-full bg-sky-600 hover:bg-sky-700 mt-auto"
        asChild
      >
        <a 
          href={`${provider.url}?ref=skycompare`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {language === 'nb' ? 'Velg leverandør' : 'Select provider'}
        </a>
      </Button>
    </div>
  );
};

export default ProviderCard;

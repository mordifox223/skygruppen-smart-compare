
import React from 'react';
import { Provider } from '@/lib/types';
import { useLanguage } from '@/lib/languageContext';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProviderCardProps {
  provider: Provider;
}

// Map of real provider logos
const logoMap: Record<string, string> = {
  // Insurance companies
  "Gjensidige": "https://www.gjensidige.no/favicon.ico",
  "If": "https://www.if.no/themes/contrib/if_theme/images/favicon.ico",
  "Tryg": "https://www.tryg.no/favicon.ico",
  "Fremtind": "https://www.fremtind.no/assets/icons/favicon-32x32.png",
  "Storebrand": "https://www.storebrand.no/favicon.ico",
  
  // Mobile providers
  "Telenor": "https://www.telenor.no/favicon.ico",
  "Telia": "https://www.telia.no/favicon.ico",
  "ice": "https://www.ice.no/assets/favicon/ico/favicon.ico",
  "Talkmore": "https://www.talkmore.no/static/talkmore/icons/favicon-32x32.png",
  "Chili Mobil": "https://www.chilimobil.no/wp-content/uploads/2020/04/cropped-chili-mobil-square-logo-32x32.png",
  
  // Electricity providers
  "Tibber": "https://tibber.com/favicon.ico",
  "Fjordkraft": "https://www.fjordkraft.no/favicon.ico",
  "Fortum": "https://www.fortum.com/favicon.ico",
  "NorgesEnergi": "https://www.norgesenergi.no/favicon.ico",
  "Lyse": "https://www.lyse.no/assets/images/favicon.ico",
  
  // Bank/loan providers
  "DNB": "https://www.dnb.no/favicon.ico",
  "Nordea": "https://www.nordea.no/Images/144-267091/favicon.ico",
  "Sparebank1": "https://www.sparebank1.no/content/dam/SB1/favicon/favicon-32x32.png",
  "Danske Bank": "https://danskebank.no/favicon.ico",
  "Sbanken": "https://www.sbanken.no/Static/favicon.ico"
};

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
  
  // Get logo URL
  const getLogo = () => {
    // If provider has specific logo in our map, use it
    if (logoMap[provider.name]) {
      return logoMap[provider.name];
    }
    
    // If provider has a logo URL already, use it
    if (provider.logo && provider.logo.startsWith('http')) {
      return provider.logo;
    }
    
    // Fallback to a generated placeholder with initials
    return '';
  };

  // Generate initials for avatar fallback
  const getInitials = () => {
    return provider.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="provider-card border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col h-full bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <div className="w-24 h-16 bg-white rounded flex items-center justify-center overflow-hidden mr-3 border border-gray-100">
          <Avatar className="w-14 h-14">
            <AvatarImage 
              src={getLogo()} 
              alt={`${provider.name} logo`}
              className="object-contain"
            />
            <AvatarFallback className="text-lg bg-sky-100 text-sky-700">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h3 className="font-semibold text-lg">{provider.name}</h3>
          <div className="flex mt-1">{renderRating()}</div>
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
        className={cn("w-full bg-sky-600 hover:bg-sky-700 mt-auto", 
          provider.category === 'electricity' ? 'bg-emerald-600 hover:bg-emerald-700' : 
          provider.category === 'insurance' ? 'bg-blue-600 hover:bg-blue-700' :
          provider.category === 'loan' ? 'bg-purple-600 hover:bg-purple-700' : 
          'bg-sky-600 hover:bg-sky-700'
        )}
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

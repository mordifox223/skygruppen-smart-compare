
import React from 'react';
import { Provider } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProviderLogoProps {
  provider: Provider;
  size?: 'sm' | 'md' | 'lg';
}

const categoryColors = {
  insurance: 'bg-blue-600',
  mobile: 'bg-sky-600', 
  electricity: 'bg-emerald-600',
  loan: 'bg-purple-600'
};

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-14 w-14',
  lg: 'h-16 w-16'
};

// Validate provider logos with category-specific patterns
const isValidProviderLogo = (url: string, category: string) => {
  if (!url) return false;
  
  const validExtensions = /\.(png|svg|webp|ico)(\?.*)?$/i;
  const isValidUrl = /^https?:\/\//.test(url);
  
  // Category-specific validation patterns
  const categoryPatterns = {
    electricity: /tibber|fortum|fjordkraft|lyse|norgesenergi/i,
    mobile: /telenor|telia|ice|talkmore|chili/i,
    insurance: /gjensidige|tryg|fremtind|storebrand/i,
    loan: /dnb|nordea|sparebank|danske|sbanken/i
  };
  
  return isValidUrl && validExtensions.test(url) && 
         (!categoryPatterns[category as keyof typeof categoryPatterns] || 
          categoryPatterns[category as keyof typeof categoryPatterns].test(url));
};

const ProviderLogo: React.FC<ProviderLogoProps> = ({ 
  provider, 
  size = 'md' 
}) => {
  const isValidLogo = isValidProviderLogo(provider.logo, provider.category);
  
  // Generate initials for fallback
  const getInitials = () => {
    return provider.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <Avatar className={sizeClasses[size]}>
        {isValidLogo && (
          <AvatarImage 
            src={provider.logo} 
            alt={`${provider.name} logo`}
            className="object-contain"
            onError={(e) => {
              console.log(`Logo failed to load for ${provider.name}: ${provider.logo}`);
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <AvatarFallback 
          className={`${categoryColors[provider.category as keyof typeof categoryColors] || 'bg-gray-600'} text-white font-semibold`}
        >
          {getInitials()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default ProviderLogo;

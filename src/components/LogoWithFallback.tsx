
import React, { useState } from 'react';
import { ProviderCategory } from '@/lib/types';
import { isValidLogo } from '@/lib/validation';
import { cn } from '@/lib/utils';

interface LogoWithFallbackProps {
  src: string;
  name: string;
  category: ProviderCategory;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const categoryColors = {
  insurance: 'bg-blue-600',
  mobile: 'bg-sky-600', 
  electricity: 'bg-emerald-600',
  loan: 'bg-purple-600'
};

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-14 w-14 text-lg',
  lg: 'h-16 w-16 text-xl'
};

const LogoWithFallback: React.FC<LogoWithFallbackProps> = ({ 
  src, 
  name, 
  category, 
  size = 'md',
  className 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(() => isValidLogo(src, category, name));

  const handleImageError = () => {
    console.log(`Logo failed to load for ${name}: ${src}`);
    setImageError(true);
  };

  const getInitials = () => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!isValidUrl || imageError) {
    return (
      <div className={cn(
        sizeClasses[size],
        categoryColors[category],
        'rounded-full flex items-center justify-center text-white font-bold',
        className
      )}>
        {getInitials()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      className={cn(sizeClasses[size], 'object-contain rounded-lg', className)}
      onError={handleImageError}
      onLoad={() => setIsValidUrl(true)}
    />
  );
};

export default LogoWithFallback;

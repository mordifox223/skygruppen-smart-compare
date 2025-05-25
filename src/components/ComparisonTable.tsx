
import React, { useState, useEffect } from 'react';
import { Provider, ComparisonFilters } from '@/lib/types';
import { useLanguage } from '@/lib/languageContext';
import ProviderCard from '@/components/ProviderCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Slider
} from '@/components/ui/slider';
import { ArrowDown, ArrowUp, Filter, Star, Zap } from 'lucide-react';

interface ComparisonTableProps {
  providers: Provider[];
  categoryId: string;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ providers: initialProviders, categoryId }) => {
  const { language } = useLanguage();
  const [providers, setProviders] = useState<Provider[]>(initialProviders);
  const [filters, setFilters] = useState<ComparisonFilters>({
    sortBy: 'price',
    sortDirection: 'asc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [visibleProviders, setVisibleProviders] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  // Update providers when initialProviders change
  useEffect(() => {
    setProviders(initialProviders);
  }, [initialProviders]);
  
  // Filter and sort providers
  const filteredProviders = providers
    .filter(provider => {
      if (minRating > 0 && provider.rating < minRating) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const direction = filters.sortDirection === 'asc' ? 1 : -1;
      
      switch (filters.sortBy) {
        case 'price':
          return (a.price - b.price) * direction;
        case 'rating':
          return (a.rating - b.rating) * direction;
        case 'name':
          return a.name.localeCompare(b.name) * direction;
        default:
          return 0;
      }
    });
  
  const handleSortChange = (value: string) => {
    setFilters({
      ...filters,
      sortBy: value as 'price' | 'rating' | 'name',
    });
  };
  
  const toggleSortDirection = () => {
    setFilters({
      ...filters,
      sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc',
    });
  };
  
  const handleRatingChange = (value: number[]) => {
    setMinRating(value[0]);
  };
  
  const loadMoreProviders = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setVisibleProviders(prev => prev + 6);
    setIsLoading(false);
  };
  
  const displayedProviders = filteredProviders.slice(0, visibleProviders);
  
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <h2 className="text-2xl font-bold">
            {language === 'nb' ? 'Sammenlign tilbud' : 'Compare offers'}
          </h2>
          
          {providers.length > 0 && (
            <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                <span>{language === 'nb' ? 'Filtrer' : 'Filter'}</span>
              </Button>
              
              <div className="flex items-center gap-2">
                <Select
                  value={filters.sortBy}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-32 bg-white">
                    <SelectValue placeholder={language === 'nb' ? 'Sorter etter' : 'Sort by'} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    <SelectGroup>
                      <SelectItem value="price">{language === 'nb' ? 'Pris' : 'Price'}</SelectItem>
                      <SelectItem value="rating">{language === 'nb' ? 'Vurdering' : 'Rating'}</SelectItem>
                      <SelectItem value="name">{language === 'nb' ? 'Navn' : 'Name'}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleSortDirection}
                >
                  {filters.sortDirection === 'asc' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Filter panel */}
        {showFilters && providers.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg animate-fade-in">
            <div className="mb-2">
              <label className="text-sm font-medium mb-1 block">
                {language === 'nb' ? 'Minimum vurdering' : 'Minimum rating'}
              </label>
              <div className="flex items-center gap-4">
                <Slider
                  defaultValue={[minRating]}
                  max={5}
                  step={0.5}
                  onValueChange={handleRatingChange}
                  className="w-full max-w-xs"
                />
                <div className="flex items-center">
                  <span>{minRating}</span>
                  <Star className="ml-1 h-4 w-4 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Provider count and data update info */}
        {providers.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                {language === 'nb' 
                  ? `Viser ${displayedProviders.length} av ${filteredProviders.length} tilbud` 
                  : `Showing ${displayedProviders.length} of ${filteredProviders.length} offers`}
              </p>
              <div className="flex items-center text-green-600 text-xs">
                <Zap size={12} className="mr-1" />
                {language === 'nb' ? 'Live data' : 'Live data'}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {language === 'nb' 
                ? 'Data oppdateres automatisk i bakgrunnen' 
                : 'Data is updated automatically in the background'}
            </p>
          </div>
        )}
        
        {/* Provider grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProviders.length > 0 ? (
            displayedProviders.map(provider => (
              <ErrorBoundary key={provider.id}>
                <ProviderCard provider={provider} />
              </ErrorBoundary>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <div className="space-y-3">
                <div className="text-gray-500">
                  {language === 'nb' 
                    ? 'Ingen tilbud tilgjengelig for øyeblikket.' 
                    : 'No offers available at the moment.'}
                </div>
                <div className="text-sm text-gray-400">
                  {language === 'nb' 
                    ? 'Data vil vises automatisk når den hentes fra leverandørene.' 
                    : 'Data will be displayed automatically when fetched from providers.'}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Load more button */}
        {visibleProviders < filteredProviders.length && (
          <div className="text-center mt-6">
            <Button 
              onClick={loadMoreProviders} 
              variant="outline"
              className="mx-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                language === 'nb' ? 'Vis flere tilbud' : 'Show more offers'
              )}
            </Button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ComparisonTable;

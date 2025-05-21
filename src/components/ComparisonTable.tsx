
import React, { useState } from 'react';
import { Provider, ComparisonFilters } from '@/lib/types';
import { useLanguage } from '@/lib/languageContext';
import ProviderCard from '@/components/ProviderCard';
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
import { ArrowDown, ArrowUp, Filter, Star } from 'lucide-react';

interface ComparisonTableProps {
  providers: Provider[];
  categoryId: string;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ providers, categoryId }) => {
  const { language } = useLanguage();
  const [filters, setFilters] = useState<ComparisonFilters>({
    sortBy: 'price',
    sortDirection: 'asc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold">
          {language === 'nb' ? 'Sammenlign leverandører' : 'Compare providers'}
        </h2>
        
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
              <SelectTrigger className="w-32">
                <SelectValue placeholder={language === 'nb' ? 'Sorter etter' : 'Sort by'} />
              </SelectTrigger>
              <SelectContent>
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
      </div>
      
      {/* Filter panel */}
      {showFilters && (
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
      
      {/* Provider grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.length > 0 ? (
          filteredProviders.map(provider => (
            <ProviderCard key={provider.id} provider={provider} />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            {language === 'nb' 
              ? 'Ingen leverandører matcher dine filtere. Prøv å justere filtrene.' 
              : 'No providers match your filters. Try adjusting your filters.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonTable;

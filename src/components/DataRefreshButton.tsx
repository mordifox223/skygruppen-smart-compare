
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';
import { validateProviderOffers } from '@/lib/affiliate';
import { Provider } from '@/lib/types';

interface DataRefreshButtonProps {
  providers: Provider[];
  onDataRefresh?: (providers: Provider[]) => void;
}

const DataRefreshButton: React.FC<DataRefreshButtonProps> = ({ providers, onDataRefresh }) => {
  const { language } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log('Validating provider data...');
      const validatedProviders = await validateProviderOffers(providers);
      
      // Check for any invalid data
      const invalidProviders = validatedProviders.filter(p => p.isValidData === false);
      if (invalidProviders.length > 0) {
        console.warn('Found providers with invalid data:', invalidProviders.map(p => p.name));
      }
      
      onDataRefresh?.(validatedProviders);
      
      // Show success message
      console.log('Data validation completed');
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={isRefreshing}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
      {isRefreshing 
        ? (language === 'nb' ? 'Validerer...' : 'Validating...') 
        : (language === 'nb' ? 'Last inn data' : 'Refresh data')
      }
    </Button>
  );
};

export default DataRefreshButton;

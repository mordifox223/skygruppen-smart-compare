
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';
import { refreshProviderData } from '@/lib/data/providersLoader';
import { Provider } from '@/lib/types';

interface DataRefreshButtonProps {
  providers: Provider[];
  onDataRefresh?: (providers: Provider[]) => void;
  categoryId?: string;
}

const DataRefreshButton: React.FC<DataRefreshButtonProps> = ({ 
  providers, 
  onDataRefresh, 
  categoryId 
}) => {
  const { language } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshResult, setLastRefreshResult] = useState<{
    success: boolean;
    message: string;
    timestamp: Date;
  } | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLastRefreshResult(null);
    
    try {
      console.log(`Triggering scraping for category: ${categoryId}`);
      const result = await refreshProviderData(categoryId);
      
      if (result.success) {
        setLastRefreshResult({
          success: true,
          message: language === 'nb' 
            ? `Oppdatert ${result.scrapedCount} tilbud`
            : `Updated ${result.scrapedCount} offers`,
          timestamp: new Date()
        });
        
        // Trigger a reload of the page data
        if (onDataRefresh) {
          // In a real implementation, this would refetch the data
          // For now, we'll just update the timestamp
          const updatedProviders = providers.map(p => ({
            ...p,
            lastUpdated: new Date()
          }));
          onDataRefresh(updatedProviders);
        }
      } else {
        throw new Error(result.error || 'Unknown error');
      }
      
    } catch (error) {
      console.error('Failed to refresh data:', error);
      setLastRefreshResult({
        success: false,
        message: language === 'nb' 
          ? 'Oppdatering feilet - bruker cache'
          : 'Update failed - using cache',
        timestamp: new Date()
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      <Button
        onClick={handleRefresh}
        disabled={isRefreshing}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
        {isRefreshing 
          ? (language === 'nb' ? 'Henter ny data...' : 'Fetching new data...') 
          : (language === 'nb' ? 'Oppdater priser' : 'Update prices')
        }
      </Button>
      
      {lastRefreshResult && (
        <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${
          lastRefreshResult.success 
            ? 'text-green-700 bg-green-50' 
            : 'text-orange-700 bg-orange-50'
        }`}>
          {lastRefreshResult.success ? (
            <CheckCircle size={12} />
          ) : (
            <AlertTriangle size={12} />
          )}
          <span>{lastRefreshResult.message}</span>
          <span className="text-gray-500">
            {lastRefreshResult.timestamp.toLocaleTimeString('nb-NO', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      )}
    </div>
  );
};

export default DataRefreshButton;

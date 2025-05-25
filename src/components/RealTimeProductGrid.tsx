
import React, { useEffect, useState } from 'react';
import { realTimeScrapingService } from '@/lib/services/realTimeScraper/RealTimeScrapingService';
import type { ScrapedProduct } from '@/lib/services/realTimeScraper/RealTimeScrapingService';
import RealTimeProductCard from './RealTimeProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, Zap } from 'lucide-react';

interface RealTimeProductGridProps {
  category: string;
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="space-y-4 p-6 border rounded-xl bg-white">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
  </div>
);

const RealTimeProductGrid: React.FC<RealTimeProductGridProps> = ({ category }) => {
  const [products, setProducts] = useState<ScrapedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scraping, setScraping] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Laster sanntidsprodukter for ${category}...`);
      
      // Start real-time scraping for this category
      const scrapedProducts = await realTimeScrapingService.scrapeAllProviders(category);
      setProducts(scrapedProducts);
      
      console.log(`✅ Lastet ${scrapedProducts.length} sanntidsprodukter for ${category}`);
      
    } catch (err) {
      console.error('Feil ved lasting av sanntidsprodukter:', err);
      setError('Kunne ikke laste produkter');
    } finally {
      setLoading(false);
    }
  };

  const handleManualScrape = async () => {
    try {
      setScraping(true);
      console.log('🚀 Starter manuell sanntidsskraping...');
      
      const scrapedProducts = await realTimeScrapingService.scrapeAllProviders(category);
      setProducts(scrapedProducts);
      
      console.log(`✅ Hentet ${scrapedProducts.length} nye produkter`);
      
    } catch (error) {
      console.error('Feil ved manuell skraping:', error);
      setError('Feil ved henting av nye produkter');
    } finally {
      setScraping(false);
    }
  };

  useEffect(() => {
    loadProducts();
    
    // Start real-time scraping service
    realTimeScrapingService.startRealTimeScraping(category);
  }, [category]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-900">Sanntidsdata hentes...</h2>
          </div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-2 text-red-600">Kunne ikke laste produkter</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadProducts} variant="outline">
            <RefreshCw size={16} className="mr-2" />
            Prøv igjen
          </Button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-2">Ingen produkter funnet</h3>
          <p className="text-gray-600 mb-4">
            Ingen produkter ble funnet for denne kategorien. Prøv å oppdatere.
          </p>
          <Button onClick={handleManualScrape} disabled={scraping}>
            <RefreshCw size={16} className={`mr-2 ${scraping ? 'animate-spin' : ''}`} />
            {scraping ? 'Henter produkter...' : 'Hent nye produkter'}
          </Button>
        </div>
      </div>
    );
  }

  // Group products by provider for better organization
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.provider]) {
      acc[product.provider] = [];
    }
    acc[product.provider].push(product);
    return acc;
  }, {} as Record<string, ScrapedProduct[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Sanntidsdata fra leverandører</h2>
            <p className="text-sm text-gray-600 mt-1">
              {products.length} tilbud fra {Object.keys(groupedProducts).length} leverandører
            </p>
          </div>
        </div>
        <Button 
          onClick={handleManualScrape} 
          disabled={scraping}
          size="sm"
          variant="outline"
        >
          <RefreshCw size={14} className={`mr-1 ${scraping ? 'animate-spin' : ''}`} />
          {scraping ? 'Oppdaterer...' : 'Oppdater'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <RealTimeProductCard key={`${product.provider}-${product.product}-${index}`} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RealTimeProductGrid;

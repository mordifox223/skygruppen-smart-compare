
import React, { useEffect, useState } from 'react';
import { realTimeScrapingService, ScrapedProduct } from '@/lib/services/realTimeScraper/RealTimeScrapingService';
import RealTimeProductCard from './RealTimeProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap } from 'lucide-react';

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

  const loadAndStoreProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Starter automatisk sanntidsskraping for ${category}...`);
      
      // Start real-time scraping and automatically store in database
      const scrapedProducts = await realTimeScrapingService.scrapeAllProviders(category);
      setProducts(scrapedProducts);
      
      console.log(`✅ Automatisk lagret ${scrapedProducts.length} sanntidsprodukter for ${category} i databasen`);
      
    } catch (err) {
      console.error('Feil ved automatisk sanntidsskraping:', err);
      setError('Kunne ikke laste produkter automatisk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load when component mounts
    loadAndStoreProducts();
    
    // Set up automatic refresh every 30 minutes
    const interval = setInterval(loadAndStoreProducts, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [category]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500 animate-pulse" />
          <h2 className="text-xl font-semibold text-gray-900">Henter sanntidsdata automatisk...</h2>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-2 text-red-600">Automatisk oppdatering mislyktes</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Systemet vil prøve igjen automatisk om 30 minutter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Zap className="h-5 w-5 text-green-500" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Database oppdatert automatisk</h2>
          <p className="text-sm text-gray-600 mt-1">
            {products.length} tilbud lagret fra {new Set(products.map(p => p.provider)).size} leverandører
          </p>
        </div>
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

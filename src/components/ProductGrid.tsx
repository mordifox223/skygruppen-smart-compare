
import React, { useEffect, useState } from 'react';
import { enhancedBuifylService, EnhancedBuifylProduct } from '@/lib/services/enhancedBuifylService';
import { realTimeScrapingService } from '@/lib/services/realTimeScraper/RealTimeScrapingService';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Database, RefreshCw } from 'lucide-react';

interface ProductGridProps {
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

const ProductGrid: React.FC<ProductGridProps> = ({ category }) => {
  const [products, setProducts] = useState<EnhancedBuifylProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Laster produkter fra database for ${category}...`);
      
      const allProducts = await enhancedBuifylService.getAllProducts(category);
      setProducts(allProducts);
      setLastRefresh(new Date());
      
    } catch (err) {
      console.error('Feil ved lasting av produkter:', err);
      setError('Feil ved lasting av produkter fra database');
    } finally {
      setLoading(false);
    }
  };

  const refreshDataWithScraping = async () => {
    try {
      console.log('🔄 Starter automatisk oppdatering av sanntidsdata...');
      
      // Scrape new data and store in database
      await realTimeScrapingService.scrapeAllProviders(category);
      
      // Wait a bit for data to be stored, then reload
      setTimeout(() => {
        loadProducts();
      }, 2000);
      
    } catch (error) {
      console.error('Feil ved automatisk oppdatering:', error);
    }
  };

  useEffect(() => {
    // Initial scraping and loading when component mounts
    refreshDataWithScraping();
    
    // Set up automatic refresh every 30 minutes
    const interval = setInterval(refreshDataWithScraping, 30 * 60 * 1000);
    
    // Set up real-time listener for database changes
    const channel = supabase
      .channel('realtime-products')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'provider_offers',
        filter: `category=eq.${category}`
      }, (payload) => {
        console.log('Real-time database oppdatering mottatt:', payload);
        loadProducts();
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [category]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Oppdaterer produktdata automatisk...</h2>
            <p className="text-sm text-gray-600 mt-1">Henter nyeste tilbud fra leverandører</p>
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
          <p className="text-sm text-gray-500">Systemet vil automatisk prøve igjen om 30 minutter.</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-2">Ingen produkter tilgjengelig</h3>
          <p className="text-gray-600 mb-4">
            Systemet oppdaterer produkter automatisk. Nye tilbud vil vises snart.
          </p>
          <p className="text-sm text-gray-500">
            Automatisk oppdatering hver 30. minutt
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-green-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Sammenlign tilbud</h2>
            <p className="text-sm text-gray-600 mt-1">
              {products.length} aktuelle tilbud
              {lastRefresh && (
                <span className="ml-2 text-gray-400">
                  • Sist oppdatert: {lastRefresh.toLocaleTimeString('no-NO')}
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <RefreshCw className="h-3 w-3" />
          Automatisk oppdatering hver 30 min
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;

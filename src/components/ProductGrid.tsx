
import React, { useEffect, useState } from 'react';
import { enhancedBuifylService, EnhancedBuifylProduct } from '@/lib/services/enhancedBuifylService';
import { realTimeScrapingService } from '@/lib/services/realTimeScraper/RealTimeScrapingService';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database } from 'lucide-react';

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
  const [syncing, setSyncing] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Laster alle produkter for ${category}...`);
      
      const allProducts = await enhancedBuifylService.getAllProducts(category);
      setProducts(allProducts);
      
    } catch (err) {
      console.error('Feil ved lasting av produkter:', err);
      setError('Feil ved lasting av produkter');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = async () => {
    try {
      setSyncing(true);
      console.log('Starter manuell synkronisering og automatisk scraping...');
      
      // Trigger both manual sync and automated scraping
      await enhancedBuifylService.triggerDataSync();
      await realTimeScrapingService.scrapeAllProviders(category);
      
      setTimeout(() => {
        loadProducts();
      }, 2000);
      
    } catch (error) {
      console.error('Feil ved manuell synkronisering:', error);
      setError('Feil ved synkronisering av data');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadProducts();

    // Start automated scraping in the background
    realTimeScrapingService.startAutomatedScraping(category);

    enhancedBuifylService.startAutoSync();

    const channel = supabase
      .channel('realtime-products')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'provider_offers',
        filter: `category=eq.${category}`
      }, (payload) => {
        console.log('Real-time oppdatering mottatt:', payload);
        loadProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [category]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">Laster tilbud...</h2>
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
          <h3 className="text-xl font-semibold mb-2">Ingen produkter tilgjengelig</h3>
          <p className="text-gray-600 mb-4">
            Vi jobber med å få flere produkter tilgjengelig. Automatisk oppdatering kjører i bakgrunnen.
          </p>
          <Button onClick={handleManualSync} disabled={syncing}>
            <RefreshCw size={16} className={`mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Oppdaterer...' : 'Oppdater produkter'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Sammenlign tilbud</h2>
            <p className="text-sm text-gray-600 mt-1">
              {products.length} tilbud tilgjengelig (automatisk oppdatert)
            </p>
          </div>
        </div>
        <Button 
          onClick={handleManualSync} 
          disabled={syncing}
          size="sm"
          variant="outline"
        >
          <RefreshCw size={14} className={`mr-1 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Oppdaterer...' : 'Oppdater'}
        </Button>
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

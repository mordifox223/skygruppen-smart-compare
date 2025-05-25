
import React, { useEffect, useState } from 'react';
import { fetchBuifylProducts, BuifylProduct } from '@/lib/services/buifylService';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Database, RefreshCw } from 'lucide-react';

interface ProductGridProps {
  category: string;
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="space-y-4 p-4 border rounded-lg">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
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
  const [products, setProducts] = useState<BuifylProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scraping, setScraping] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBuifylProducts(category);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products from Buifyl Shop');
    } finally {
      setLoading(false);
    }
  };

  const triggerScraping = async () => {
    try {
      setScraping(true);
      console.log('🔄 Triggering manual scraping...');
      
      const { data, error } = await supabase.functions.invoke('scrape-real-providers', {
        body: { action: 'scrape_all' }
      });

      if (error) {
        console.error('❌ Scraping error:', error);
        throw error;
      }

      console.log('✅ Scraping completed:', data);
      
      // Reload products after scraping
      setTimeout(() => {
        loadProducts();
      }, 2000);
      
    } catch (err) {
      console.error('Failed to trigger scraping:', err);
      setError('Failed to trigger data scraping');
    } finally {
      setScraping(false);
    }
  };

  useEffect(() => {
    loadProducts();

    // Set up real-time updates
    const channel = supabase
      .channel('realtime-products')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'provider_offers',
        filter: `category=eq.${category}`
      }, (payload) => {
        console.log('Real-time update received:', payload);
        loadProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [category]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ShoppingCart size={16} />
          <span>Loading products from Buifyl Shop...</span>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Database size={48} className="mx-auto text-red-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-red-600">Connection Error</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="space-x-2">
          <Button 
            onClick={loadProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </Button>
          <Button 
            onClick={triggerScraping}
            disabled={scraping}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {scraping ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Scraping...
              </>
            ) : (
              'Trigger Scraping'
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state text-center py-12">
        <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          Ingen tilbud tilgjengelig akkurat nå
        </h3>
        <p className="text-gray-600 mb-4">
          Produkter vil vises automatisk når de er tilgjengelige via Buifyl Shop.
        </p>
        <div className="space-x-2">
          <Button 
            onClick={loadProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </Button>
          <Button 
            onClick={triggerScraping}
            disabled={scraping}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {scraping ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Scraping Data...
              </>
            ) : (
              'Load Provider Data'
            )}
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Click "Load Provider Data" to fetch the latest offers from Norwegian providers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-green-600">
          <ShoppingCart size={16} />
          <span>{products.length} produkter fra Buifyl Shop</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={triggerScraping}
            disabled={scraping}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            {scraping ? (
              <>
                <RefreshCw size={12} className="mr-1 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Data'
            )}
          </Button>
          <div className="text-xs text-gray-500">
            Sist oppdatert: {new Date().toLocaleTimeString('nb-NO')}
          </div>
        </div>
      </div>
      
      <div className="product-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;

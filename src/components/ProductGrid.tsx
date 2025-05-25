
import React, { useEffect, useState } from 'react';
import { enhancedBuifylService, EnhancedBuifylProduct } from '@/lib/services/enhancedBuifylService';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ShoppingCart, RefreshCw } from 'lucide-react';

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
  const [products, setProducts] = useState<EnhancedBuifylProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Laster alle produkter for ${category}...`);
      
      // Get all products without quality filtering
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
      console.log('🔄 Starter manuell synkronisering...');
      
      await enhancedBuifylService.triggerDataSync();
      
      // Last produkter på nytt etter synkronisering
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

    // Start automatisk synkronisering
    enhancedBuifylService.startAutoSync();

    // Sett opp real-time updates
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
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ShoppingCart size={16} />
          <span>Laster produkter...</span>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ShoppingCart size={48} className="mx-auto text-red-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-red-600">Datafeil</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadProducts} variant="outline">
          <RefreshCw size={16} className="mr-2" />
          Prøv igjen
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state text-center py-12">
        <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          Ingen produkter tilgjengelig
        </h3>
        <p className="text-gray-600 mb-4">
          Vi jobber med å få flere produkter tilgjengelig.
        </p>
        <Button onClick={handleManualSync} disabled={syncing}>
          <RefreshCw size={16} className={`mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Synkroniserer...' : 'Synkroniser data'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Simple product count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {products.length} produkter tilgjengelig
        </p>
        <Button 
          onClick={handleManualSync} 
          disabled={syncing}
          size="sm"
          variant="outline"
        >
          <RefreshCw size={14} className={`mr-1 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Synker...' : 'Oppdater'}
        </Button>
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


import React, { useEffect, useState } from 'react';
import { fetchBuifylProducts, BuifylProduct } from '@/lib/services/buifylService';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, Database } from 'lucide-react';

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
        <button 
          onClick={loadProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
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
        <p className="text-sm text-gray-500">
          Buifyl Shop oppdaterer produkter automatisk i bakgrunnen.
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
        <div className="text-xs text-gray-500">
          Sist oppdatert: {new Date().toLocaleTimeString('nb-NO')}
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

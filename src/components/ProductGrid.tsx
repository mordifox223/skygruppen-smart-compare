
import React, { useEffect, useState } from 'react';
import { fetchBuifylProducts, BuifylProduct } from '@/lib/services/buifylService';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, Database, AlertTriangle, CheckCircle } from 'lucide-react';

interface ProductGridProps {
  category: string;
}

interface QualityStats {
  total: number;
  quality: number;
  filtered: number;
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
  const [qualityStats, setQualityStats] = useState<QualityStats>({ total: 0, quality: 0, filtered: 0 });

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Loading products for ${category} with quality validation...`);
      
      const data = await fetchBuifylProducts(category);
      setProducts(data);
      
      // Calculate quality stats from console logs or validation results
      const total = data.length;
      const quality = data.filter(p => p.validation?.confidence && p.validation.confidence >= 90).length;
      const filtered = 0; // This would come from the validation service
      
      setQualityStats({ total, quality, filtered });
      
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const initializeData = async () => {
    try {
      console.log('🔄 Initializing provider data automatically...');
      
      const { data, error } = await supabase.functions.invoke('scrape-real-providers', {
        body: { action: 'scrape_all' }
      });

      if (error) {
        console.error('❌ Data initialization error:', error);
      } else {
        console.log('✅ Data initialization completed:', data);
      }
      
      // Load products after initialization
      setTimeout(() => {
        loadProducts();
      }, 1000);
      
    } catch (err) {
      console.error('Failed to initialize data:', err);
      // Still try to load products even if initialization fails
      loadProducts();
    }
  };

  useEffect(() => {
    // Initialize data automatically on first load
    initializeData();

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
          <span>Laster og validerer produkter...</span>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Database size={48} className="mx-auto text-red-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-red-600">Tilkoblingsfeil</h3>
        <p className="text-gray-600 mb-4">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state text-center py-12">
        <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          Ingen kvalitetssikrede tilbud tilgjengelig
        </h3>
        <p className="text-gray-600 mb-4">
          Vi viser kun produkter som har bestått våre kvalitetskontroller.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Data quality indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle size={16} className="text-green-600" />
          <span className="font-medium">Kun kvalitetssikrede produkter vises</span>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          Viser {products.length} validerte produkter • Alle data er kvalitetskontrollert
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

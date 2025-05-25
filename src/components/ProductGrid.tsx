
import React, { useEffect, useState } from 'react';
import { enhancedBuifylService, EnhancedBuifylProduct } from '@/lib/services/enhancedBuifylService';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Database, AlertTriangle, CheckCircle, RefreshCw, Clock } from 'lucide-react';

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
  const [lastSync, setLastSync] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Laster kvalitetssikrede produkter for ${category}...`);
      
      const validatedProducts = await enhancedBuifylService.getValidatedProducts(category);
      setProducts(validatedProducts);
      setLastSync(new Date().toISOString());
      
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
          <span>Validerer og laster produkter...</span>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Database size={48} className="mx-auto text-red-400 mb-4" />
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
          Ingen kvalitetssikrede tilbud tilgjengelig
        </h3>
        <p className="text-gray-600 mb-4">
          Alle produkter gjennomgår kvalitetskontroll før visning.
        </p>
        <Button onClick={handleManualSync} disabled={syncing}>
          <RefreshCw size={16} className={`mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Synkroniserer...' : 'Synkroniser data'}
        </Button>
      </div>
    );
  }

  // Beregn kvalitetsstatistikk
  const avgQuality = products.reduce((sum, p) => sum + p.qualityScore, 0) / products.length;
  const liveDataCount = products.filter(p => p.isLiveData).length;
  const verifiedCount = products.filter(p => p.validationStatus === 'verified').length;

  return (
    <div className="space-y-4">
      {/* Kvalitetsindikatorer */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle size={16} className="text-green-600" />
            <span className="font-medium">Kvalitetssikrede produkter</span>
          </div>
          <Button 
            onClick={handleManualSync} 
            disabled={syncing}
            size="sm"
            variant="outline"
          >
            <RefreshCw size={14} className={`mr-1 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Synker...' : 'Sync'}
          </Button>
        </div>
        <div className="text-xs text-gray-600 mt-1 space-y-1">
          <div>📊 {products.length} produkter vises • Kvalitet: {avgQuality.toFixed(1)}%</div>
          <div>⚡ {liveDataCount} med live data • ✅ {verifiedCount} fullt verifisert</div>
          {lastSync && (
            <div className="flex items-center">
              <Clock size={12} className="mr-1" />
              Sist kontrollert: {new Date(lastSync).toLocaleTimeString('nb-NO')}
            </div>
          )}
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

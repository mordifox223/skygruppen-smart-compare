
import React, { useEffect, useState } from 'react';
import { enhancedBuifylService, EnhancedBuifylProduct } from '@/lib/services/enhancedBuifylService';
import { DynamicProviderService } from '@/lib/services/dynamicProviderService';
import { NorwegianProviderScraper } from '@/lib/services/norwegianProviderScraper';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import SmartRecommendations from './SmartRecommendations';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Database, AlertTriangle, CheckCircle, RefreshCw, Clock, Zap } from 'lucide-react';

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
  const [showSmartRecommendations, setShowSmartRecommendations] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Loading enhanced products for ${category}...`);
      
      // For mobile category, use Norwegian provider data
      if (category === 'mobile') {
        await NorwegianProviderScraper.scrapeAllProviders();
      }
      
      const validatedProducts = await enhancedBuifylService.getValidatedProducts(category);
      setProducts(validatedProducts);
      setLastSync(new Date().toISOString());
      
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = async () => {
    try {
      setSyncing(true);
      console.log('🔄 Starting manual sync with real-time data...');
      
      if (category === 'mobile') {
        // Use Norwegian provider scraper for mobile
        await NorwegianProviderScraper.scrapeAllProviders();
      } else {
        // Use existing service for other categories
        await enhancedBuifylService.triggerDataSync();
      }
      
      // Reload products after sync
      setTimeout(() => {
        loadProducts();
      }, 2000);
      
    } catch (error) {
      console.error('Error during manual sync:', error);
      setError('Error syncing data');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadProducts();

    // Start real-time monitoring for mobile category
    if (category === 'mobile') {
      NorwegianProviderScraper.startRealTimeMonitoring();
    } else {
      enhancedBuifylService.startAutoSync();
    }

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
          <span>Loading Norwegian providers with real-time data...</span>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Database size={48} className="mx-auto text-red-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-red-600">Data Error</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={loadProducts} variant="outline">
          <RefreshCw size={16} className="mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state text-center py-12">
        <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          No verified offers available
        </h3>
        <p className="text-gray-600 mb-4">
          All products undergo quality control before display.
        </p>
        <Button onClick={handleManualSync} disabled={syncing}>
          <RefreshCw size={16} className={`mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Data'}
        </Button>
      </div>
    );
  }

  // Calculate quality statistics
  const avgQuality = products.reduce((sum, p) => sum + p.qualityScore, 0) / products.length;
  const liveDataCount = products.filter(p => p.isLiveData).length;
  const verifiedCount = products.filter(p => p.validationStatus === 'verified').length;

  return (
    <div className="space-y-6">
      {/* Smart Recommendations for Mobile */}
      {category === 'mobile' && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Smart Recommendations</h3>
            </div>
            <Button 
              onClick={() => setShowSmartRecommendations(!showSmartRecommendations)}
              variant="outline"
              size="sm"
            >
              {showSmartRecommendations ? 'Hide' : 'Show'} AI Recommendations
            </Button>
          </div>
          
          {showSmartRecommendations && <SmartRecommendations />}
        </div>
      )}

      {/* Quality indicators */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle size={16} className="text-green-600" />
            <span className="font-medium">
              {category === 'mobile' ? 'Norwegian Mobile Providers - Live Data' : 'Quality Assured Products'}
            </span>
          </div>
          <Button 
            onClick={handleManualSync} 
            disabled={syncing}
            size="sm"
            variant="outline"
          >
            <RefreshCw size={14} className={`mr-1 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync'}
          </Button>
        </div>
        <div className="text-xs text-gray-600 mt-1 space-y-1">
          <div>📊 {products.length} products shown • Quality: {avgQuality.toFixed(1)}%</div>
          <div>⚡ {liveDataCount} with live data • ✅ {verifiedCount} fully verified</div>
          {lastSync && (
            <div className="flex items-center">
              <Clock size={12} className="mr-1" />
              Last checked: {new Date(lastSync).toLocaleTimeString('nb-NO')}
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

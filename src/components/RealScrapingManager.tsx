
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Database, CheckCircle, AlertCircle } from 'lucide-react';

const RealScrapingManager = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runRealScraping = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🚀 Starting real provider scraping...');
      
      const { data, error } = await supabase.functions.invoke('scrape-real-providers', {
        body: { action: 'scrape_all' }
      });

      if (error) {
        throw error;
      }

      setResult(data);
      console.log('✅ Real scraping completed:', data);
      
    } catch (err: any) {
      console.error('❌ Real scraping failed:', err);
      setError(err.message || 'Failed to scrape providers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Database className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Real Provider Scraping</h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        Scrape real data from Norwegian provider websites (Telenor, Telia, Ice, Tibber, Fjordkraft)
      </p>

      <Button 
        onClick={runRealScraping}
        disabled={loading}
        className="mb-4"
      >
        {loading ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Scraping Real Data...
          </>
        ) : (
          <>
            <Database className="h-4 w-4 mr-2" />
            Scrape Real Providers
          </>
        )}
      </Button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Scraping Error</span>
          </div>
          <p className="text-red-600 mt-1 text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded p-3">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Scraping Successful</span>
          </div>
          <div className="text-sm text-green-600">
            <p>• Scraped {result.scrapedCount} real offers</p>
            <p>• Updated at: {new Date(result.timestamp).toLocaleString('nb-NO')}</p>
            <p>• Real data from live provider websites</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealScrapingManager;

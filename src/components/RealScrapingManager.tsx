
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Database, CheckCircle, AlertCircle, Activity } from 'lucide-react';

const RealScrapingManager = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const testFunctionHealth = async () => {
    setTesting(true);
    setError(null);
    
    try {
      console.log('🔍 Testing function health...');
      
      const { data, error } = await supabase.functions.invoke('scrape-real-providers', {
        body: { action: 'health_check' }
      });

      if (error) {
        throw error;
      }

      console.log('✅ Function health check successful:', data);
      setResult({ ...data, type: 'health_check' });
      
    } catch (err: any) {
      console.error('❌ Function health check failed:', err);
      setError(`Health check failed: ${err.message || 'Unknown error'}`);
    } finally {
      setTesting(false);
    }
  };

  const runEnhancedScraping = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🚀 Starting enhanced provider scraping...');
      
      const { data, error } = await supabase.functions.invoke('scrape-real-providers', {
        body: { action: 'scrape_all', enhanced: true }
      });

      if (error) {
        throw error;
      }

      setResult(data);
      console.log('✅ Enhanced scraping completed:', data);
      
    } catch (err: any) {
      console.error('❌ Enhanced scraping failed:', err);
      setError(err.message || 'Failed to scrape providers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Database className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Enhanced Real Provider Scraping</h3>
      </div>
      
      <p className="text-gray-600 mb-4">
        Enhanced scraping with BeautifulSoup-like parsing from Norwegian providers (Telenor, Telia, Ice, Tibber, Fjordkraft)
      </p>

      <div className="flex gap-3 mb-4">
        <Button 
          onClick={testFunctionHealth}
          disabled={testing || loading}
          variant="outline"
          size="sm"
        >
          {testing ? (
            <>
              <Activity className="h-4 w-4 mr-2 animate-pulse" />
              Testing...
            </>
          ) : (
            <>
              <Activity className="h-4 w-4 mr-2" />
              Test Health
            </>
          )}
        </Button>

        <Button 
          onClick={runEnhancedScraping}
          disabled={loading || testing}
          className="flex-1"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Enhanced Scraping...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Start Enhanced Scraping
            </>
          )}
        </Button>
      </div>

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
            <span className="font-medium">
              {result.type === 'health_check' ? 'Health Check Successful' : 'Enhanced Scraping Successful'}
            </span>
          </div>
          <div className="text-sm text-green-600">
            {result.type === 'health_check' ? (
              <>
                <p>• Function is healthy and responsive</p>
                <p>• Status: {result.status}</p>
                <p>• Project: {result.project}</p>
              </>
            ) : (
              <>
                <p>• Scraped {result.scrapedCount} enhanced offers</p>
                <p>• Updated at: {new Date(result.timestamp).toLocaleString('nb-NO')}</p>
                <p>• Enhanced data from live provider websites</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RealScrapingManager;

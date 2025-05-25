
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { refreshProviderData } from '@/lib/data/providersLoader';
import { RefreshCw, Play, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';

interface ProviderConfig {
  id: string;
  provider_name: string;
  category: string;
  scrape_url: string;
  is_enabled: boolean;
  last_successful_scrape: string | null;
  consecutive_failures: number;
}

const AdminPanel: React.FC = () => {
  const { language } = useLanguage();
  const [configs, setConfigs] = useState<ProviderConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningJobs, setIsRunningJobs] = useState<string[]>([]);
  const [lastRefreshResults, setLastRefreshResults] = useState<{[key: string]: {success: boolean, message: string, timestamp: Date}}>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load provider configs
      const { data: configData, error: configError } = await supabase
        .from('provider_configs')
        .select('*')
        .order('category', { ascending: true });

      if (configError) throw configError;
      setConfigs(configData || []);

    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runScrapingJob = async (category?: string) => {
    const jobKey = category || 'all';
    setIsRunningJobs(prev => [...prev, jobKey]);
    
    try {
      const result = await refreshProviderData(category);
      console.log('Scraping job completed:', result);
      
      setLastRefreshResults(prev => ({
        ...prev,
        [jobKey]: {
          success: true,
          message: language === 'nb' ? 'Scraping fullført' : 'Scraping completed',
          timestamp: new Date()
        }
      }));
      
      await loadData(); // Refresh the data
    } catch (error) {
      console.error('Scraping job failed:', error);
      setLastRefreshResults(prev => ({
        ...prev,
        [jobKey]: {
          success: false,
          message: language === 'nb' ? 'Scraping feilet' : 'Scraping failed',
          timestamp: new Date()
        }
      }));
    } finally {
      setIsRunningJobs(prev => prev.filter(k => k !== jobKey));
    }
  };

  const getStatusBadge = (config: ProviderConfig) => {
    if (config.consecutive_failures > 0) {
      return <Badge variant="destructive"><AlertTriangle size={12} className="mr-1" />Feil</Badge>;
    }
    if (config.last_successful_scrape) {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1" />OK</Badge>;
    }
    return <Badge variant="outline">Aldri kjørt</Badge>;
  };

  const categories = ['mobile', 'electricity', 'insurance', 'loan'];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="animate-spin mr-2" />
        <span>Laster admin data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          {language === 'nb' ? 'Admin Panel - Dataimport' : 'Admin Panel - Data Import'}
        </h1>
        <p className="text-gray-600">
          {language === 'nb' 
            ? 'Administrer scraping av leverandørdata og overvåk jobber'
            : 'Manage provider data scraping and monitor jobs'}
        </p>
      </div>

      {/* Manual Scraping Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Manuell Scraping</CardTitle>
          <CardDescription>
            Start scraping av leverandørdata for spesifikke kategorier eller alle kategorier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => runScrapingJob()}
              disabled={isRunningJobs.includes('all')}
              className="flex items-center gap-2"
            >
              {isRunningJobs.includes('all') ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Play size={16} />
              )}
              Scrape alle kategorier
            </Button>
            
            {categories.map(category => (
              <Button
                key={category}
                onClick={() => runScrapingJob(category)}
                disabled={isRunningJobs.includes(category)}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isRunningJobs.includes(category) ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Play size={16} />
                )}
                {category}
              </Button>
            ))}
          </div>
          
          {/* Show last refresh results */}
          <div className="mt-4 space-y-2">
            {Object.entries(lastRefreshResults).map(([key, result]) => (
              <div key={key} className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${
                result.success 
                  ? 'text-green-700 bg-green-50' 
                  : 'text-red-700 bg-red-50'
              }`}>
                {result.success ? (
                  <CheckCircle size={12} />
                ) : (
                  <AlertTriangle size={12} />
                )}
                <span>{key}: {result.message}</span>
                <span className="text-gray-500">
                  {result.timestamp.toLocaleTimeString('nb-NO', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Provider Configurations */}
      <Card>
        <CardHeader>
          <CardTitle>Leverandør Konfigurasjoner</CardTitle>
          <CardDescription>
            Status og konfigurasjon for alle konfigurerte leverandører
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map(category => {
              const categoryConfigs = configs.filter(c => c.category === category);
              return (
                <div key={category} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3 capitalize">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categoryConfigs.map(config => (
                      <div key={config.id} className="border rounded p-3 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{config.provider_name}</span>
                          <div className="flex flex-col gap-1">
                            <Badge variant={config.is_enabled ? "default" : "secondary"}>
                              {config.is_enabled ? 'Aktiv' : 'Inaktiv'}
                            </Badge>
                            {getStatusBadge(config)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>
                            Feil: <span className="font-medium">{config.consecutive_failures || 0}</span>
                          </div>
                          {config.last_successful_scrape && (
                            <div>
                              Sist oppdatert: {new Date(config.last_successful_scrape).toLocaleDateString('nb-NO')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {categoryConfigs.length === 0 && (
                      <div className="text-gray-500 text-sm">
                        Ingen konfigurasjoner funnet for {category}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;

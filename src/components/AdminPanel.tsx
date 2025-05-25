
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { refreshProviderData } from '@/lib/data/providersLoader';
import { RefreshCw, Play, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
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

interface ScrapingJob {
  id: string;
  provider_name: string;
  category: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  results_count: number;
  error_message: string | null;
}

const AdminPanel: React.FC = () => {
  const { language } = useLanguage();
  const [configs, setConfigs] = useState<ProviderConfig[]>([]);
  const [jobs, setJobs] = useState<ScrapingJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningJobs, setIsRunningJobs] = useState<string[]>([]);

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

      // Load recent scraping jobs
      const { data: jobData, error: jobError } = await supabase
        .from('scraping_jobs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10);

      if (jobError) throw jobError;
      setJobs(jobData || []);

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
      await loadData(); // Refresh the data
    } catch (error) {
      console.error('Scraping job failed:', error);
    } finally {
      setIsRunningJobs(prev => prev.filter(k => k !== jobKey));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1" />Fullført</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertTriangle size={12} className="mr-1" />Feilet</Badge>;
      case 'running':
        return <Badge variant="secondary"><Clock size={12} className="mr-1" />Kjører</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
                          <Badge variant={config.is_enabled ? "default" : "secondary"}>
                            {config.is_enabled ? 'Aktiv' : 'Inaktiv'}
                          </Badge>
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
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Siste Scraping Jobs</CardTitle>
          <CardDescription>
            Status og resultater fra de siste scraping-operasjonene
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {jobs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Ingen scraping jobs funnet
              </p>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="flex items-center justify-between border rounded p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{job.provider_name}</span>
                      <Badge variant="outline" className="text-xs">{job.category}</Badge>
                      {getStatusBadge(job.status)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Startet: {new Date(job.started_at).toLocaleString('nb-NO')}
                      {job.results_count > 0 && (
                        <span className="ml-3">Resultater: {job.results_count}</span>
                      )}
                    </div>
                    {job.error_message && (
                      <div className="text-sm text-red-600 mt-1">
                        Feil: {job.error_message}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;

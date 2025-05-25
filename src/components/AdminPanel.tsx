
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, AlertTriangle, CheckCircle, Database } from 'lucide-react';
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
          {language === 'nb' ? 'Admin Panel - Leverandørkonfigurasjon' : 'Admin Panel - Provider Configuration'}
        </h1>
        <p className="text-gray-600">
          {language === 'nb' 
            ? 'Administrer leverandørkonfigurasjoner og overvåk systemstatus. Data oppdateres automatisk.'
            : 'Manage provider configurations and monitor system status. Data is updated automatically.'}
        </p>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database size={20} />
            Systemstatus
          </CardTitle>
          <CardDescription>
            Oversikt over systemets funksjonalitet og dataoppbevaring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="font-medium text-green-800">Dataoppbevaring</span>
              </div>
              <p className="text-sm text-green-700">
                Statiske data er tilgjengelige for alle kategorier
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw size={16} className="text-blue-600" />
                <span className="font-medium text-blue-800">Automatisk oppdatering</span>
              </div>
              <p className="text-sm text-blue-700">
                System kjører uten manuell intervensjon
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Database size={16} className="text-purple-600" />
                <span className="font-medium text-purple-800">Leverandører</span>
              </div>
              <p className="text-sm text-purple-700">
                {configs.length} konfigurerte leverandører
              </p>
            </div>
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

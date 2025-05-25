
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { providerDataService } from '@/lib/services/providerDataService';
import { realDataService } from '@/lib/services/realDataService';
import { RefreshCw, AlertTriangle, CheckCircle, Database, Clock, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/languageContext';
import { useToast } from '@/components/ui/use-toast';

interface SystemStatus {
  dataSources: any[];
  recentJobs: any[];
  lastUpdate: string | null;
  systemHealth: string;
}

const AdminPanel: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadSystemStatus();
  }, []);

  const loadSystemStatus = async () => {
    setIsLoading(true);
    try {
      const status = await providerDataService.getSystemStatus();
      setSystemStatus(status);
    } catch (error) {
      console.error('Failed to load system status:', error);
      toast({
        title: "Error",
        description: "Failed to load system status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerUpdate = async (category?: string) => {
    setIsUpdating(true);
    try {
      const result = await providerDataService.triggerScraping(category);
      
      toast({
        title: "Success",
        description: `Data update triggered successfully for ${category || 'all categories'}`,
      });
      
      // Reload status after a short delay
      setTimeout(() => {
        loadSystemStatus();
      }, 2000);
      
    } catch (error) {
      console.error('Failed to trigger update:', error);
      toast({
        title: "Error",
        description: "Failed to trigger data update",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getHealthBadge = (health: string) => {
    switch (health) {
      case 'good':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1" />Excellent</Badge>;
      case 'degraded':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertTriangle size={12} className="mr-1" />Degraded</Badge>;
      case 'poor':
        return <Badge variant="destructive"><AlertTriangle size={12} className="mr-1" />Poor</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getJobStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'running':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Running</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="animate-spin mr-2" />
        <span>Loading system status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {language === 'nb' ? 'Admin Panel - Data Management' : 'Admin Panel - Data Management'}
          </h1>
          <p className="text-gray-600">
            {language === 'nb' 
              ? 'Overvåk datakilder og administrer automatiske oppdateringer'
              : 'Monitor data sources and manage automatic updates'}
          </p>
        </div>
        <Button 
          onClick={() => triggerUpdate()} 
          disabled={isUpdating}
          className="flex items-center gap-2"
        >
          {isUpdating ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}
          Update All Data
        </Button>
      </div>

      {/* System Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database size={20} />
            System Status
          </CardTitle>
          <CardDescription>
            Real-time overview of data pipeline health and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Database size={16} className="text-blue-600" />
                <span className="font-medium text-blue-800">Data Sources</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {systemStatus?.dataSources?.length || 0}
              </p>
              <p className="text-sm text-blue-700">Active providers configured</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="font-medium text-green-800">System Health</span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {systemStatus && getHealthBadge(systemStatus.systemHealth)}
              </div>
              <p className="text-sm text-green-700">Overall data pipeline status</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-purple-600" />
                <span className="font-medium text-purple-800">Recent Jobs</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {systemStatus?.recentJobs?.length || 0}
              </p>
              <p className="text-sm text-purple-700">Updates in last 24h</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-orange-600" />
                <span className="font-medium text-orange-800">Last Update</span>
              </div>
              <p className="text-sm font-bold text-orange-900">
                {systemStatus?.lastUpdate 
                  ? new Date(systemStatus.lastUpdate).toLocaleString('nb-NO')
                  : 'Never'
                }
              </p>
              <p className="text-sm text-orange-700">Most recent data sync</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources Status */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
          <CardDescription>
            Status and reliability of configured data sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['mobile', 'electricity', 'insurance', 'loan'].map(category => {
              const categorySources = systemStatus?.dataSources?.filter(s => s.category === category) || [];
              return (
                <div key={category} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold capitalize">{category}</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => triggerUpdate(category)}
                      disabled={isUpdating}
                    >
                      Update {category}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categorySources.map(source => (
                      <div key={source.id} className="border rounded p-3 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{source.provider_name}</span>
                          <Badge variant={source.is_active ? "default" : "secondary"}>
                            {source.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Type: <span className="font-medium">{source.source_type}</span></div>
                          <div>Reliability: <span className="font-medium">{source.reliability_score}%</span></div>
                          {source.last_successful_fetch && (
                            <div>
                              Last fetch: {new Date(source.last_successful_fetch).toLocaleDateString('nb-NO')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {categorySources.length === 0 && (
                      <div className="text-gray-500 text-sm col-span-full">
                        No data sources configured for {category}
                      </div>
                    )}
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
          <CardTitle>Recent Data Updates</CardTitle>
          <CardDescription>
            Latest scraping and data synchronization jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemStatus?.recentJobs?.map(job => (
              <div key={job.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium">{job.provider_name} - {job.category}</div>
                    <div className="text-sm text-gray-600">
                      Started: {new Date(job.started_at).toLocaleString('nb-NO')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    {job.offers_found > 0 && `${job.offers_found} offers found`}
                  </div>
                  {getJobStatusBadge(job.status)}
                </div>
              </div>
            )) || (
              <div className="text-center py-4 text-gray-500">
                No recent jobs found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;

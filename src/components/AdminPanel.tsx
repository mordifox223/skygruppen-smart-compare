
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { providerDataService } from '@/lib/services/providerDataService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Database, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

const AdminPanel = () => {
  const { language } = useLanguage();
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadSystemStatus = async () => {
    try {
      setIsLoading(true);
      const status = await providerDataService.getSystemStatus();
      setSystemStatus(status);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load system status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSystemStatus();
  }, []);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'good': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'good': return <CheckCircle className="h-5 w-5" />;
      case 'degraded': return <AlertTriangle className="h-5 w-5" />;
      case 'poor': return <XCircle className="h-5 w-5" />;
      default: return <Database className="h-5 w-5" />;
    }
  };

  if (isLoading && !systemStatus) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-3">Loading system status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Button onClick={loadSystemStatus} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Health
          </CardTitle>
          <CardDescription>
            Overall system status and data freshness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${getHealthColor(systemStatus?.systemHealth || 'unknown')}`}>
              {getHealthIcon(systemStatus?.systemHealth || 'unknown')}
              <span className="font-medium capitalize">
                {systemStatus?.systemHealth || 'Unknown'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
          <CardDescription>
            Active data sources and their reliability scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemStatus?.dataSources?.length > 0 ? (
              systemStatus.dataSources.map((source: any) => (
                <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{source.provider_name}</div>
                    <div className="text-sm text-gray-500">{source.category}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={source.is_active ? 'default' : 'secondary'}>
                      {source.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{source.reliability_score}%</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No data sources configured</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scraping Jobs</CardTitle>
          <CardDescription>
            Latest data collection activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemStatus?.recentJobs?.length > 0 ? (
              systemStatus.recentJobs.map((job: any) => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{job.provider_name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(job.started_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={
                        job.status === 'completed' ? 'default' : 
                        job.status === 'failed' ? 'destructive' : 
                        'secondary'
                      }
                    >
                      {job.status}
                    </Badge>
                    <span className="text-sm">{job.offers_found} offers</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent jobs found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;

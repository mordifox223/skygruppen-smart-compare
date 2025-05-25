
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle, Clock, Play } from 'lucide-react';
import type { ScrapingJob } from '@/hooks/useScrapingJobs';

interface ScrapingJobsListProps {
  jobs: ScrapingJob[];
  isLoading: boolean;
}

export const ScrapingJobsList: React.FC<ScrapingJobsListProps> = ({ jobs, isLoading }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Play className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'running':
        return 'default';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <RefreshCw className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Scraping Jobs</h2>
        <Badge variant="outline">{jobs.length} total jobs</Badge>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <p>No scraping jobs found</p>
              <p className="text-sm">Start a scraping job to see results here</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(job.status)}
                      <h3 className="font-semibold">{job.provider_name}</h3>
                      <Badge variant="outline">{job.category}</Badge>
                      <Badge variant={getStatusColor(job.status) as any}>
                        {job.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Started:</span>{' '}
                        {job.started_at ? new Date(job.started_at).toLocaleString() : 'Not started'}
                      </div>
                      <div>
                        <span className="font-medium">Completed:</span>{' '}
                        {job.completed_at ? new Date(job.completed_at).toLocaleString() : 'Not completed'}
                      </div>
                      <div>
                        <span className="font-medium">Results:</span> {job.results_count}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span>{' '}
                        {job.execution_time_ms ? `${job.execution_time_ms}ms` : 'N/A'}
                      </div>
                    </div>
                    
                    {job.error_message && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                        <span className="font-medium text-red-800">Error:</span>
                        <span className="text-red-700 ml-2">{job.error_message}</span>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(job.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

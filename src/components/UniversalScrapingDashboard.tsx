
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Database,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { UniversalScrapingService, ScrapingScheduler, URLValidationService } from '@/lib/services/universalScraping';
import { ScrapingResult, URLValidationResult } from '@/lib/services/universalScraping/types';

const UniversalScrapingDashboard: React.FC = () => {
  const [isAutomationRunning, setIsAutomationRunning] = useState(false);
  const [scrapingResults, setScrapingResults] = useState<Map<string, ScrapingResult[]>>(new Map());
  const [validationStatus, setValidationStatus] = useState<{
    total: number;
    valid: number;
    invalid: number;
    pending: number;
  }>({ total: 0, valid: 0, invalid: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadValidationStatus();
  }, []);

  const loadValidationStatus = async () => {
    try {
      const status = await URLValidationService.getValidationStatus();
      setValidationStatus(status);
    } catch (error) {
      console.error('Failed to load validation status:', error);
    }
  };

  const handleStartAutomation = () => {
    ScrapingScheduler.startAutomation();
    setIsAutomationRunning(true);
  };

  const handleStopAutomation = () => {
    ScrapingScheduler.stopAutomation();
    setIsAutomationRunning(false);
  };

  const handleImmediateScraping = async (category: string) => {
    setIsLoading(true);
    try {
      await ScrapingScheduler.runImmediateScraping(category);
      
      // Update results
      const results = await UniversalScrapingService.scrapeCategory(category);
      setScrapingResults(prev => new Map(prev).set(category, results));
      
      await loadValidationStatus();
    } catch (error) {
      console.error(`Failed to run immediate scraping for ${category}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUniversalScraping = async () => {
    setIsLoading(true);
    try {
      const allResults = await UniversalScrapingService.startUniversalScraping();
      setScrapingResults(allResults);
      await loadValidationStatus();
    } catch (error) {
      console.error('Failed to run universal scraping:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuccessRate = (results: ScrapingResult[]): number => {
    if (results.length === 0) return 0;
    const successful = results.filter(r => r.success).length;
    return Math.round((successful / results.length) * 100);
  };

  const getTotalOffers = (results: ScrapingResult[]): number => {
    return results.reduce((total, result) => total + result.offers.length, 0);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Universal Scraping System</h1>
          <p className="text-gray-600">Automated data collection and URL generation for Norwegian providers</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isAutomationRunning ? "default" : "secondary"} className="flex items-center gap-1">
            {isAutomationRunning ? <Play size={12} /> : <Pause size={12} />}
            {isAutomationRunning ? "Running" : "Stopped"}
          </Badge>
        </div>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Control Panel
          </CardTitle>
          <CardDescription>
            Manage automated scraping and immediate actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={isAutomationRunning ? handleStopAutomation : handleStartAutomation}
              variant={isAutomationRunning ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isAutomationRunning ? <Pause size={16} /> : <Play size={16} />}
              {isAutomationRunning ? "Stop Automation" : "Start Automation"}
            </Button>
            
            <Button
              onClick={handleUniversalScraping}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Run Universal Scraping
            </Button>

            <Button
              onClick={() => handleImmediateScraping('mobile')}
              disabled={isLoading}
              variant="outline"
            >
              Scrape Mobile
            </Button>

            <Button
              onClick={() => handleImmediateScraping('electricity')}
              disabled={isLoading}
              variant="outline"
            >
              Scrape Electricity
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Offers</p>
                <p className="text-2xl font-bold">{validationStatus.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valid URLs</p>
                <p className="text-2xl font-bold">{validationStatus.valid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Invalid URLs</p>
                <p className="text-2xl font-bold">{validationStatus.invalid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{validationStatus.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* URL Health Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            URL Health Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Valid URLs</span>
                <span>{validationStatus.total > 0 ? Math.round((validationStatus.valid / validationStatus.total) * 100) : 0}%</span>
              </div>
              <Progress 
                value={validationStatus.total > 0 ? (validationStatus.valid / validationStatus.total) * 100 : 0} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Tabs */}
      <Tabs defaultValue="mobile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
          <TabsTrigger value="electricity">Electricity</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="loan">Loan</TabsTrigger>
        </TabsList>

        {['mobile', 'electricity', 'insurance', 'loan'].map(category => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {category.charAt(0).toUpperCase() + category.slice(1)} Providers
                </CardTitle>
                <CardDescription>
                  Scraping results and statistics for {category} providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scrapingResults.has(category) ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {scrapingResults.get(category)?.length || 0}
                        </p>
                        <p className="text-sm text-gray-600">Providers</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {getTotalOffers(scrapingResults.get(category) || [])}
                        </p>
                        <p className="text-sm text-gray-600">Total Offers</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">
                          {getSuccessRate(scrapingResults.get(category) || [])}%
                        </p>
                        <p className="text-sm text-gray-600">Success Rate</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {scrapingResults.get(category)?.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {result.success ? 
                              <CheckCircle className="h-5 w-5 text-green-600" /> : 
                              <XCircle className="h-5 w-5 text-red-600" />
                            }
                            <span className="font-medium">{result.provider_name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{result.offers.length} offers</span>
                            <span>{result.execution_time_ms}ms</span>
                            <Badge variant={result.success ? "default" : "destructive"}>
                              {result.success ? "Success" : "Failed"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No scraping results available</p>
                    <Button
                      onClick={() => handleImmediateScraping(category)}
                      disabled={isLoading}
                      className="mt-4"
                      variant="outline"
                    >
                      Run Scraping for {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default UniversalScrapingDashboard;

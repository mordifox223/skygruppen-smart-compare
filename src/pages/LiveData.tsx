
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LiveDataManager from '@/components/LiveDataManager';
import UniversalScrapingManager from '@/components/UniversalScrapingManager';
import ScrapingTestManager from '@/components/ScrapingTestManager';
import { Database, Zap, TestTube } from 'lucide-react';

const LiveData: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Live Data Management
          </h1>
          <p className="text-gray-600">
            Administrer og test live datahenting fra leverandører
          </p>
        </div>

        <Tabs defaultValue="database" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database size={16} />
              Database Scraping
            </TabsTrigger>
            <TabsTrigger value="universal" className="flex items-center gap-2">
              <Zap size={16} />
              Universal Scraping
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube size={16} />
              Test Manager
            </TabsTrigger>
          </TabsList>

          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle>Database-basert Scraping</CardTitle>
                <p className="text-sm text-gray-600">
                  Bruk konfigurerte leverandører fra databasen for å hente produktdata
                </p>
              </CardHeader>
              <CardContent>
                <ScrapingTestManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="universal">
            <Card>
              <CardHeader>
                <CardTitle>Universal Scraping System</CardTitle>
                <p className="text-sm text-gray-600">
                  Avansert scraping system med spesialiserte parsers
                </p>
              </CardHeader>
              <CardContent>
                <UniversalScrapingManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle>Legacy Live Data Manager</CardTitle>
                <p className="text-sm text-gray-600">
                  Eldre system for testing av live datahenting
                </p>
              </CardHeader>
              <CardContent>
                <LiveDataManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LiveData;

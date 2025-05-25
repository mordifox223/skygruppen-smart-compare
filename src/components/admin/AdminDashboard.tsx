
import React, { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProviderOffers, useCreateProviderOffer, useUpdateProviderOffer } from '@/hooks/useProviderOffers';
import { useScrapingJobs, useCreateScrapingJob } from '@/hooks/useScrapingJobs';
import { ProviderOfferForm } from './ProviderOfferForm';
import { ScrapingJobsList } from './ScrapingJobsList';
import { Plus, RefreshCw, Database, Bot } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { language } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  
  const { data: offers = [], isLoading: offersLoading, refetch: refetchOffers } = useProviderOffers();
  const { data: jobs = [], isLoading: jobsLoading } = useScrapingJobs();
  const createOffer = useCreateProviderOffer();
  const updateOffer = useUpdateProviderOffer();
  const createJob = useCreateScrapingJob();

  const handleRunScraping = async (category: string) => {
    try {
      await createJob.mutateAsync({
        provider_name: 'All',
        category
      });
      toast.success(`Scraping job started for ${category}`);
    } catch (error) {
      toast.error('Failed to start scraping job');
      console.error(error);
    }
  };

  const stats = {
    totalOffers: offers.length,
    activeOffers: offers.filter(o => o.is_active).length,
    scrapedOffers: offers.filter(o => o.data_source === 'scraped').length,
    manualOffers: offers.filter(o => o.data_source === 'manual').length,
    runningJobs: jobs.filter(j => j.status === 'running').length,
    recentJobs: jobs.filter(j => j.status === 'completed').length
  };

  if (offersLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <RefreshCw className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {language === 'nb' ? 'Admin Dashboard' : 'Admin Dashboard'}
        </h1>
        <p className="text-gray-600">
          {language === 'nb' ? 
            'Administrer leverandørdata og skrapejobber' : 
            'Manage provider data and scraping jobs'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOffers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeOffers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scrapedOffers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.manualOffers} manual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.runningJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.recentJobs} completed today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => handleRunScraping('mobile')}
                disabled={createJob.isPending}
              >
                Scrape Mobile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="offers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="offers">Provider Offers</TabsTrigger>
          <TabsTrigger value="jobs">Scraping Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="offers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Provider Offers</h2>
            <div className="flex gap-2">
              <Button onClick={() => refetchOffers()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Offer
              </Button>
            </div>
          </div>

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Provider Offer</CardTitle>
              </CardHeader>
              <CardContent>
                <ProviderOfferForm
                  onSubmit={async (data) => {
                    try {
                      await createOffer.mutateAsync(data);
                      setShowAddForm(false);
                      toast.success('Offer created successfully');
                    } catch (error) {
                      toast.error('Failed to create offer');
                      console.error(error);
                    }
                  }}
                  onCancel={() => setShowAddForm(false)}
                  isLoading={createOffer.isPending}
                />
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {offers.map((offer) => (
              <Card key={offer.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{offer.provider_name}</h3>
                        <Badge variant="outline">{offer.category}</Badge>
                        <Badge variant={offer.data_source === 'scraped' ? 'default' : 'secondary'}>
                          {offer.data_source}
                        </Badge>
                        {!offer.is_active && <Badge variant="destructive">Inactive</Badge>}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{offer.plan_name}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Price:</span> {offer.monthly_price} kr/month
                        </div>
                        <div>
                          <span className="font-medium">Data:</span> {offer.data_allowance || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Speed:</span> {offer.speed || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Contract:</span> {offer.contract_length || 'N/A'}
                        </div>
                      </div>
                      {offer.last_scraped && (
                        <p className="text-xs text-gray-500 mt-2">
                          Last scraped: {new Date(offer.last_scraped).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          updateOffer.mutate({
                            id: offer.id,
                            is_active: !offer.is_active
                          });
                        }}
                      >
                        {offer.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs">
          <ScrapingJobsList jobs={jobs} isLoading={jobsLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

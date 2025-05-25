
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Download, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Globe,
  Target
} from 'lucide-react';
import { UniversalScrapingService } from '@/lib/services/universalScraping/UniversalScrapingService';
import { ScrapingResult } from '@/lib/services/universalScraping/types';
import { useToast } from '@/components/ui/use-toast';

const UniversalScrapingManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Map<string, ScrapingResult[]>>(new Map());
  const [selectedCategory, setSelectedCategory] = useState<string>('mobile');
  const { toast } = useToast();

  const categories = [
    { id: 'mobile', name: 'Mobilabonnement', icon: '📱' },
    { id: 'electricity', name: 'Strøm', icon: '⚡' },
    { id: 'insurance', name: 'Forsikring', icon: '🛡️' },
    { id: 'loan', name: 'Lån', icon: '🏦' }
  ];

  const handleScrapeCategory = async (category: string) => {
    setIsLoading(true);
    try {
      toast({
        title: "🔄 Starter scraping",
        description: `Henter produkter for ${category}...`,
        duration: 3000,
      });

      const categoryResults = await UniversalScrapingService.scrapeCategory(category);
      
      setResults(prev => {
        const newResults = new Map(prev);
        newResults.set(category, categoryResults);
        return newResults;
      });

      const totalOffers = categoryResults.reduce((sum, r) => sum + r.offers.length, 0);
      
      toast({
        title: "✅ Scraping fullført",
        description: `Hentet ${totalOffers} tilbud fra ${categoryResults.length} leverandører`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Scraping failed:', error);
      toast({
        title: "❌ Scraping feilet",
        description: "Kunne ikke hente produktdata",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrapeAll = async () => {
    setIsLoading(true);
    try {
      toast({
        title: "🌐 Starter universal scraping",
        description: "Henter produkter fra alle kategorier...",
        duration: 3000,
      });

      const allResults = await UniversalScrapingService.startUniversalScraping();
      setResults(allResults);

      let totalOffers = 0;
      allResults.forEach((categoryResults) => {
        totalOffers += categoryResults.reduce((sum, r) => sum + r.offers.length, 0);
      });

      toast({
        title: "🎉 Universal scraping fullført",
        description: `Hentet ${totalOffers} tilbud totalt`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Universal scraping failed:', error);
      toast({
        title: "❌ Universal scraping feilet",
        description: "Kunne ikke hente alle produktdata",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const allResults = Array.from(results.values()).flat();
    if (allResults.length === 0) {
      toast({
        title: "⚠️ Ingen data",
        description: "Kjør scraping først",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const exportData = {
      scrapedAt: new Date().toISOString(),
      totalProviders: allResults.length,
      totalOffers: allResults.reduce((sum, r) => sum + r.offers.length, 0),
      results: allResults
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scraped-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "📁 Data eksportert",
      description: "JSON-fil lastet ned",
      duration: 3000,
    });
  };

  const getCategoryResults = (category: string) => {
    return results.get(category) || [];
  };

  const getTotalOffersForCategory = (category: string) => {
    const categoryResults = getCategoryResults(category);
    return categoryResults.reduce((sum, r) => sum + r.offers.length, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe size={20} />
            Universal Scraping Manager
          </CardTitle>
          <p className="text-sm text-gray-600">
            Automatisk produkthenting fra alle leverandører
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-4">
            <Button onClick={handleScrapeAll} disabled={isLoading} size="lg">
              <Globe className="mr-2" size={16} />
              Scrape Alt
            </Button>
            
            <Button onClick={handleExport} variant="secondary" disabled={results.size === 0}>
              <Download className="mr-2" size={16} />
              Eksporter JSON
            </Button>
          </div>

          {/* Provider Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {categories.map((category) => (
              <div key={category.id} className="p-3 border rounded text-center">
                <div className="text-lg mb-1">{category.icon}</div>
                <div className="text-sm font-medium">{category.name}</div>
                <div className="text-xs text-gray-500">
                  {getTotalOffersForCategory(category.id)} tilbud
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              <span>{category.icon}</span>
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Target size={20} />
                    {category.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {getTotalOffersForCategory(category.id)} tilbud
                    </Badge>
                    <Button 
                      onClick={() => handleScrapeCategory(category.id)} 
                      disabled={isLoading}
                      size="sm"
                    >
                      <Play className="mr-1" size={14} />
                      Scrape
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {getCategoryResults(category.id).map((result, resultIndex) => (
                    <div key={resultIndex} className="border rounded p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">
                          {result.provider_name}
                        </h4>
                        <div className="flex gap-2">
                          {result.success ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" />
                              Vellykket
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle size={12} className="mr-1" />
                              Feilet
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {result.offers.length} tilbud
                          </Badge>
                          <Badge variant="outline">
                            {result.execution_time_ms}ms
                          </Badge>
                        </div>
                      </div>
                      
                      {result.error && (
                        <div className="text-sm text-red-600 mb-2">
                          Feil: {result.error}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        {result.offers.map((offer, offerIndex) => (
                          <div key={offerIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div className="flex-1">
                              <div className="font-medium">{offer.plan_name}</div>
                              <div className="text-lg font-semibold text-blue-600">
                                {offer.monthly_price} kr/mnd
                              </div>
                              {offer.data_allowance && (
                                <div className="text-sm text-gray-600">{offer.data_allowance}</div>
                              )}
                            </div>
                            <div className="ml-4">
                              <a 
                                href={offer.offer_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <ExternalLink size={16} />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {getCategoryResults(category.id).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Ingen data hentet ennå. Klikk "Scrape" for å hente tilbud.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default UniversalScrapingManager;

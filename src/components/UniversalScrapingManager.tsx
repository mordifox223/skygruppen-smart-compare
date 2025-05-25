
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
  RefreshCw,
  ExternalLink,
  Globe,
  Target
} from 'lucide-react';
import { UniversalScrapingService } from '@/lib/services/UniversalScrapingService';
import { ScrapingResult } from '@/lib/services/scrapers/BaseParser';
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

  const availableParsers = UniversalScrapingService.getAvailableParsers();

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

      const totalProducts = categoryResults.reduce((sum, r) => sum + r.products.length, 0);
      
      toast({
        title: "✅ Scraping fullført",
        description: `Hentet ${totalProducts} produkter fra ${categoryResults.length} leverandører`,
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

      const allResults = await UniversalScrapingService.scrapeAll();
      setResults(allResults);

      let totalProducts = 0;
      allResults.forEach((categoryResults) => {
        totalProducts += categoryResults.reduce((sum, r) => sum + r.products.length, 0);
      });

      toast({
        title: "🎉 Universal scraping fullført",
        description: `Hentet ${totalProducts} produkter totalt`,
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

  const handleValidateUrls = async () => {
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

    try {
      await UniversalScrapingService.validateAllUrls(allResults);
      toast({
        title: "🔍 URL-validering fullført",
        description: "Sjekk konsollen for detaljer",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "❌ Validering feilet",
        description: "Kunne ikke validere URL-er",
        variant: "destructive",
        duration: 3000,
      });
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

    UniversalScrapingService.exportToJson(allResults);
    toast({
      title: "📁 Data eksportert",
      description: "JSON-fil lastet ned",
      duration: 3000,
    });
  };

  const getCategoryResults = (category: string) => {
    return results.get(category) || [];
  };

  const getTotalProductsForCategory = (category: string) => {
    const categoryResults = getCategoryResults(category);
    return categoryResults.reduce((sum, r) => sum + r.products.length, 0);
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
              {isLoading ? <RefreshCw className="animate-spin mr-2" size={16} /> : <Globe className="mr-2" size={16} />}
              Scrape Alt
            </Button>
            
            <Button onClick={handleValidateUrls} variant="outline" disabled={isLoading}>
              <CheckCircle className="mr-2" size={16} />
              Valider URL-er
            </Button>
            
            <Button onClick={handleExport} variant="secondary" disabled={results.size === 0}>
              <Download className="mr-2" size={16} />
              Eksporter JSON
            </Button>
          </div>

          {/* Available Parsers Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {availableParsers.map((parser, index) => (
              <div key={index} className="p-3 border rounded text-center">
                <div className="text-lg mb-1">
                  {categories.find(c => c.id === parser.category)?.icon || '🔧'}
                </div>
                <div className="text-sm font-medium">{parser.provider}</div>
                <div className="text-xs text-gray-500 capitalize">{parser.category}</div>
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
                      {getTotalProductsForCategory(category.id)} produkter
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
                          Leverandør: {result.products[0]?.name.split(' ')[0] || 'Ukjent'}
                        </h4>
                        <div className="flex gap-2">
                          <Badge variant="default">
                            {result.products.length} produkter
                          </Badge>
                          <Badge variant="outline">
                            {new Date(result.scrapedAt).toLocaleTimeString('no-NO')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {result.products.map((product, productIndex) => (
                          <div key={productIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div className="flex-1">
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-600">{product.description}</div>
                              <div className="text-lg font-semibold text-blue-600">{product.price}</div>
                            </div>
                            <div className="ml-4">
                              <a 
                                href={product.url} 
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
                      
                      {result.validation.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-sm text-gray-600 mb-2">URL Validering:</div>
                          <div className="flex gap-2 flex-wrap">
                            {result.validation.map((validation, validationIndex) => (
                              <Badge 
                                key={validationIndex}
                                variant={validation.valid ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {validation.valid ? (
                                  <><CheckCircle size={10} className="mr-1" /> Gyldig</>
                                ) : (
                                  <><XCircle size={10} className="mr-1" /> {validation.status}</>
                                )}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {getCategoryResults(category.id).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Ingen data hentet ennå. Klikk "Scrape" for å hente produkter.
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

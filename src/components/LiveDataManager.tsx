
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Download, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  Database 
} from 'lucide-react';
import { LiveDataService } from '@/lib/services/liveDataService';
import { useToast } from '@/components/ui/use-toast';

interface ProductData {
  name: string;
  url: string;
  price: string;
  description: string;
  category?: string;
  provider?: string;
}

const LiveDataManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('mobile');
  const { toast } = useToast();

  const categories = [
    { id: 'mobile', name: 'Mobilabonnement' },
    { id: 'electricity', name: 'Strøm' },
    { id: 'insurance', name: 'Forsikring' },
    { id: 'loan', name: 'Lån' }
  ];

  const handleScrapeCategory = async () => {
    setIsLoading(true);
    try {
      toast({
        title: "Starter scraping",
        description: `Henter live data for ${selectedCategory}...`,
        duration: 3000,
      });

      const scrapedProducts = await LiveDataService.getAllProductsForCategory(selectedCategory);
      setProducts(scrapedProducts);

      toast({
        title: "Scraping fullført",
        description: `Hentet ${scrapedProducts.length} produkter for ${selectedCategory}`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Scraping failed:', error);
      toast({
        title: "Scraping feilet",
        description: "Kunne ikke hente live data",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateUrls = async () => {
    if (products.length === 0) {
      toast({
        title: "Ingen produkter",
        description: "Scrape produkter først før validering",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const urls = products.map(p => p.url);
      const results = await LiveDataService.validateUrls(urls);
      setValidationResults(results);

      const validCount = results.filter(r => r.valid).length;
      toast({
        title: "URL-validering fullført",
        description: `${validCount} av ${results.length} URL-er er gyldige`,
        duration: 5000,
      });
    } catch (error) {
      console.error('URL validation failed:', error);
      toast({
        title: "Validering feilet",
        description: "Kunne ikke validere URL-er",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToJson = () => {
    const data = {
      category: selectedCategory,
      scrapedAt: new Date().toISOString(),
      products: products,
      validation: validationResults
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCategory}-products-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateConfigs = async () => {
    try {
      await LiveDataService.updateProviderConfigs();
      toast({
        title: "Konfigurasjon oppdatert",
        description: "Provider-konfigurasjoner er oppdatert",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Feil ved oppdatering",
        description: "Kunne ikke oppdatere konfigurasjoner",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database size={20} />
            Live Data Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded px-3 py-2"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              
              <Button onClick={handleScrapeCategory} disabled={isLoading}>
                {isLoading ? <RefreshCw className="animate-spin mr-2" size={16} /> : <RefreshCw className="mr-2" size={16} />}
                Scrape Live Data
              </Button>
              
              <Button onClick={handleValidateUrls} variant="outline" disabled={isLoading || products.length === 0}>
                <CheckCircle className="mr-2" size={16} />
                Valider URL-er
              </Button>
              
              <Button onClick={updateConfigs} variant="secondary">
                Oppdater Configs
              </Button>
            </div>

            {products.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {products.length} produkter hentet
                </span>
                <Button onClick={exportToJson} variant="outline" size="sm">
                  <Download className="mr-2" size={16} />
                  Eksporter JSON
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scrapede Produkter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.map((product, index) => {
                const validation = validationResults.find(v => v.url === product.url);
                return (
                  <div key={index} className="border rounded p-3 flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.description}</p>
                      <p className="text-lg font-semibold text-blue-600">{product.price}</p>
                      <a 
                        href={product.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                      >
                        {product.url}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <div className="ml-4">
                      {validation && (
                        <Badge variant={validation.valid ? "default" : "destructive"}>
                          {validation.valid ? (
                            <><CheckCircle size={12} className="mr-1" /> Gyldig</>
                          ) : (
                            <><XCircle size={12} className="mr-1" /> Ugyldig</>
                          )}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveDataManager;

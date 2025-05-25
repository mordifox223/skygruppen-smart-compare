
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  RefreshCw,
  CheckCircle, 
  XCircle,
  Database 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const ScrapingTestManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
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

      const { data, error } = await supabase.functions.invoke('scrape-providers', {
        body: { category }
      });

      if (error) {
        throw error;
      }

      setResults(data);
      
      toast({
        title: "✅ Scraping fullført",
        description: `${data.summary}`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Scraping failed:', error);
      toast({
        title: "❌ Scraping feilet",
        description: error.message || "Kunne ikke hente produktdata",
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
        title: "🌐 Starter full scraping",
        description: "Henter produkter fra alle kategorier...",
        duration: 3000,
      });

      const { data, error } = await supabase.functions.invoke('scrape-providers', {
        body: {}
      });

      if (error) {
        throw error;
      }

      setResults(data);
      
      toast({
        title: "🎉 Full scraping fullført",
        description: `${data.summary}`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Full scraping failed:', error);
      toast({
        title: "❌ Full scraping feilet",
        description: error.message || "Kunne ikke hente alle produktdata",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database size={20} />
            Scraping Test Manager
          </CardTitle>
          <p className="text-sm text-gray-600">
            Test scraping av produktdata fra konfigurerte leverandører
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3 mb-6">
              <Button onClick={handleScrapeAll} disabled={isLoading} size="lg">
                <RefreshCw className="mr-2" size={16} />
                Scrape alle kategorier
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map(category => (
                <div key={category.id} className="p-4 border rounded text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="text-sm font-medium mb-3">{category.name}</div>
                  <Button 
                    onClick={() => handleScrapeCategory(category.id)} 
                    disabled={isLoading}
                    size="sm"
                    variant="outline"
                  >
                    <Play className="mr-1" size={14} />
                    Scrape
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Scraping Resultat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-4 items-center">
                <Badge variant={results.success ? "default" : "destructive"}>
                  {results.success ? (
                    <><CheckCircle size={12} className="mr-1" /> Vellykket</>
                  ) : (
                    <><XCircle size={12} className="mr-1" /> Feilet</>
                  )}
                </Badge>
                <span className="text-sm text-gray-600">
                  {results.timestamp}
                </span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScrapingTestManager;

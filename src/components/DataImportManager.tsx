
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  CheckCircle, 
  XCircle, 
  Database,
  FileText,
  Loader2,
  Download
} from 'lucide-react';
import { DataImportService } from '@/lib/services/dataImportService';
import { useToast } from '@/components/ui/use-toast';

const DataImportManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('mobile');
  const [importResults, setImportResults] = useState<{ success: number; errors: string[] } | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const { toast } = useToast();

  const categories = [
    { id: 'mobile', name: 'Mobilabonnement', file: '/sample-data/mobile-providers.txt' },
    { id: 'electricity', name: 'Strøm', file: '/sample-data/electricity-providers.txt' },
    { id: 'insurance', name: 'Forsikring', file: '/sample-data/insurance-providers.txt' },
    { id: 'loan', name: 'Lån', file: '/sample-data/loan-providers.txt' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      
      const providerCount = content.split('\n').filter(line => line.trim().length > 0).length;
      toast({
        title: "Fil lastet",
        description: `Fant ${providerCount} leverandører i filen`,
        duration: 3000,
      });
    };
    reader.readAsText(file);
  };

  const loadSampleData = async () => {
    const category = categories.find(cat => cat.id === selectedCategory);
    if (!category) return;

    try {
      const response = await fetch(category.file);
      const content = await response.text();
      setFileContent(content);
      
      const providerCount = content.split('\n').filter(line => line.trim().length > 0).length;
      toast({
        title: "Eksempeldata lastet",
        description: `Lastet ${providerCount} leverandører for ${category.name}`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Feil ved lasting",
        description: "Kunne ikke laste eksempeldata",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleImportProviders = async () => {
    if (!fileContent.trim()) {
      toast({
        title: "Ingen data",
        description: "Last opp en fil eller bruk eksempeldata først",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    setImportResults(null);

    try {
      toast({
        title: "Starter import",
        description: `Importerer leverandører for ${selectedCategory}...`,
        duration: 3000,
      });

      const results = await DataImportService.importProvidersFromText(
        fileContent, 
        selectedCategory
      );
      
      setImportResults(results);

      if (results.success > 0) {
        toast({
          title: "Import fullført",
          description: `Importerte ${results.success} leverandører${results.errors.length > 0 ? ` med ${results.errors.length} feil` : ''}`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Import feilet",
          description: "Ingen leverandører ble importert",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: "Import feilet",
        description: "En feil oppstod under importen",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createSampleFile = () => {
    if (!fileContent) {
      toast({
        title: "Ingen data",
        description: "Last først data for å lage en eksempelfil",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCategory}-leverandorer.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database size={20} />
            Importer Leverandørdata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-center flex-wrap">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded px-3 py-2 bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              
              <Button onClick={loadSampleData} variant="outline" size="sm">
                <Database className="mr-2" size={16} />
                Last eksempeldata
              </Button>

              <Button onClick={createSampleFile} variant="outline" size="sm" disabled={!fileContent}>
                <Download className="mr-2" size={16} />
                Last ned som fil
              </Button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Klikk for å laste opp .txt-fil med leverandørnavn
                </p>
                <p className="text-xs text-gray-400">
                  Ett navn per linje, eller bruk eksempeldata fra prosjektet
                </p>
              </label>
            </div>

            {fileContent && (
              <div className="bg-gray-50 p-3 rounded border">
                <p className="text-sm font-medium mb-2">
                  Leverandører som vil importeres ({fileContent.split('\n').filter(line => line.trim()).length} stk):
                </p>
                <div className="max-h-32 overflow-y-auto text-sm text-gray-600">
                  {fileContent.split('\n').filter(line => line.trim()).map((line, index) => (
                    <div key={index} className="py-1 border-b last:border-b-0">{line.trim()}</div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={handleImportProviders} 
              disabled={isLoading || !fileContent}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} />
                  Importerer data fra API-er...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={16} />
                  Importer Leverandører til Database
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {importResults && (
        <Card>
          <CardHeader>
            <CardTitle>Import Resultater</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant={importResults.success > 0 ? "default" : "destructive"}>
                  {importResults.success > 0 ? (
                    <><CheckCircle size={12} className="mr-1" /> {importResults.success} Importert</>
                  ) : (
                    <><XCircle size={12} className="mr-1" /> Ingen importert</>
                  )}
                </Badge>
                
                {importResults.errors.length > 0 && (
                  <Badge variant="destructive">
                    <XCircle size={12} className="mr-1" /> {importResults.errors.length} Feil
                  </Badge>
                )}
              </div>

              {importResults.errors.length > 0 && (
                <div className="bg-red-50 p-3 rounded border border-red-200">
                  <p className="text-sm font-medium text-red-700 mb-2">Feil som oppstod:</p>
                  <div className="max-h-32 overflow-y-auto text-sm text-red-600">
                    {importResults.errors.map((error, index) => (
                      <div key={index} className="mb-1">{error}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataImportManager;

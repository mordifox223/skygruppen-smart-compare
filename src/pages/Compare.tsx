
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';
import { getAvailableCategories } from '@/lib/i18n';
import { useProviderOffers, convertToLegacyProvider } from '@/hooks/useProviderOffers';
import { seedProviderOffers } from '@/lib/seedData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComparisonTable from '@/components/ComparisonTable';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Compare = () => {
  const { categoryId = 'insurance' } = useParams<{ categoryId: string }>();
  const { language } = useLanguage();
  const [isSeeding, setIsSeeding] = useState(false);
  
  console.log('Compare component mounted, categoryId:', categoryId);
  
  // Get real data from database
  const { data: realProviders, isLoading: realLoading, error: realError, refetch } = useProviderOffers(categoryId);
  const categories = getAvailableCategories();
  const category = categories.find(c => c.id === categoryId);
  
  console.log('Real providers data:', realProviders);
  console.log('Real providers error:', realError);
  console.log('Real providers loading:', realLoading);
  
  // Convert to legacy format for display
  const providers = React.useMemo(() => {
    if (realProviders && realProviders.length > 0) {
      console.log('Using real providers data');
      return realProviders.map(convertToLegacyProvider);
    }
    console.log('No real data available');
    return [];
  }, [realProviders]);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      await seedProviderOffers();
      await refetch(); // Refresh the data
    } catch (error) {
      console.error('Failed to seed data:', error);
    } finally {
      setIsSeeding(false);
    }
  };
  
  if (!category) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'nb' ? 'Kategori ikke funnet' : 'Category not found'}
          </h2>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-slate-900 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">{category.name[language]}</h1>
            <p className="text-gray-300">{category.description[language]}</p>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-sm text-gray-400">
                {providers.length} {language === 'nb' ? 'leverandører tilgjengelig' : 'providers available'}
              </p>
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                {language === 'nb' ? 'Sanntidsdata' : 'Real-time data'}
              </span>
              {realLoading && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded animate-pulse">
                  {language === 'nb' ? 'Laster...' : 'Loading...'}
                </span>
              )}
              {providers.length === 0 && !realLoading && (
                <Button
                  size="sm"
                  onClick={handleSeedData}
                  disabled={isSeeding}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${isSeeding ? 'animate-spin' : ''}`} />
                  {language === 'nb' ? 'Last inn data' : 'Load data'}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {providers.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-4">
                <ComparisonTable providers={providers} categoryId={categoryId} />
              </div>
              
              <div className="lg:col-span-1">
                {/* Information box */}
                <div className="bg-sky-50 p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-2 text-sky-800">
                    {language === 'nb' ? 'Visste du?' : 'Did you know?'}
                  </h3>
                  <p className="text-sm text-sky-900">
                    {language === 'nb' 
                      ? `Å sammenligne ${category.name[language].toLowerCase()} kan spare deg tusenvis av kroner i året. Våre brukere sparer i gjennomsnitt 2,345 kr per år!` 
                      : `Comparing ${category.name[language].toLowerCase()} can save you thousands of kroner per year. Our users save 2,345 NOK per year on average!`}
                  </p>
                </div>
                
                {/* Provider count info */}
                <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
                  <h3 className="font-semibold mb-2 text-gray-800">
                    {language === 'nb' ? 'Om dataene' : 'About the data'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'nb' 
                      ? `Vi viser sanntidsdata fra ${providers.length} leverandører. Data oppdateres daglig for å sikre nøyaktighet.` 
                      : `We show real-time data from ${providers.length} providers. Data is updated daily to ensure accuracy.`}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4 text-gray-600">
                {language === 'nb' ? 'Ingen data tilgjengelig' : 'No data available'}
              </h2>
              <p className="text-gray-500 mb-6">
                {language === 'nb' 
                  ? 'Klikk på "Last inn data" for å laste inn de nyeste tilbudene.' 
                  : 'Click "Load data" to load the latest offers.'}
              </p>
              <Button
                onClick={handleSeedData}
                disabled={isSeeding}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isSeeding ? 'animate-spin' : ''}`} />
                {language === 'nb' ? 'Last inn data' : 'Load data'}
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Compare;

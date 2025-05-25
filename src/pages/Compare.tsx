
import React from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';
import { getMockProviders, getAvailableCategories } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComparisonTable from '@/components/ComparisonTable';

const Compare = () => {
  const { categoryId = 'insurance' } = useParams<{ categoryId: string }>();
  const { language } = useLanguage();
  
  // Try to get real data first, fallback to mock data
  const { data: realProviders, isLoading: realLoading, error: realError } = useProviderOffers(categoryId);
  const mockProviders = getMockProviders(categoryId);
  const categories = getAvailableCategories();
  const category = categories.find(c => c.id === categoryId);
  
  console.log('Real providers:', realProviders, 'Error:', realError);
  
  // Use real data if available, otherwise fallback to mock data
  const providers = React.useMemo(() => {
    if (realProviders && realProviders.length > 0) {
      return realProviders.map(convertToLegacyProvider);
    }
    return mockProviders;
  }, [realProviders, mockProviders]);

  const dataSource = realProviders && realProviders.length > 0 ? 'real' : 'mock';
  
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
              {dataSource === 'real' && (
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                  {language === 'nb' ? 'Sanntidsdata' : 'Real-time data'}
                </span>
              )}
              {dataSource === 'mock' && (
                <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                  {language === 'nb' ? 'Demo data' : 'Demo data'}
                </span>
              )}
              {realLoading && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded animate-pulse">
                  {language === 'nb' ? 'Laster...' : 'Loading...'}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
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
                  {dataSource === 'real' ? (
                    language === 'nb' 
                      ? `Vi viser sanntidsdata fra ${providers.length} leverandører. Data oppdateres daglig for å sikre nøyaktighet.` 
                      : `We show real-time data from ${providers.length} providers. Data is updated daily to ensure accuracy.`
                  ) : (
                    language === 'nb' 
                      ? `Vi sammenligner priser og tjenester fra ${providers.length} leverandører. Dette er demo-data.` 
                      : `We compare prices and services from ${providers.length} providers. This is demo data.`
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Compare;

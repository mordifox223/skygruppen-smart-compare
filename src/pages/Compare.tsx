
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';
import { getAvailableCategories } from '@/lib/i18n';
import { getProviders } from '@/lib/data/providersLoader';
import { Provider } from '@/lib/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComparisonTable from '@/components/ComparisonTable';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Database, Zap, ShoppingCart } from 'lucide-react';

const Compare = () => {
  const { categoryId = 'insurance' } = useParams<{ categoryId: string }>();
  const { language } = useLanguage();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const categories = getAvailableCategories();
  const category = categories.find(c => c.id === categoryId);
  
  const loadProviders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProviders(categoryId);
      setProviders(data);
      
      if (data.length > 0) {
        // Find the most recent update time
        const latestUpdate = Math.max(...data
          .filter(p => p.lastUpdated)
          .map(p => new Date(p.lastUpdated).getTime())
        );
        if (latestUpdate > 0) {
          setLastUpdated(new Date(latestUpdate));
        }
      }
    } catch (err) {
      console.error('Failed to load providers from Buifyl Shop:', err);
      setError(language === 'nb' 
        ? 'Teknisk feil ved lasting av data fra Buifyl Shop. Prøv igjen senere.' 
        : 'Technical error loading data from Buifyl Shop. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, [categoryId]);
  
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
            <div>
              <h1 className="text-3xl font-bold mb-2">{category.name[language]}</h1>
              <p className="text-gray-300">{category.description[language]}</p>
              {!isLoading && providers.length > 0 && (
                <div className="mt-4 flex items-center gap-4">
                  <p className="text-sm text-gray-400">
                    {providers.length} {language === 'nb' ? 'produkter fra Buifyl Shop' : 'products from Buifyl Shop'}
                  </p>
                  <div className="flex items-center text-green-400 text-sm">
                    <ShoppingCart size={16} className="mr-1" />
                    {language === 'nb' ? 'Buifyl Shop' : 'Buifyl Shop'}
                  </div>
                  {lastUpdated && (
                    <div className="flex items-center text-blue-400 text-xs">
                      <Zap size={12} className="mr-1" />
                      {language === 'nb' ? 'Sist oppdatert' : 'Last updated'}: {lastUpdated.toLocaleDateString('nb-NO')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-lg">
                {language === 'nb' ? 'Henter produkter fra Buifyl Shop...' : 'Loading products from Buifyl Shop...'}
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Database size={48} className="mx-auto text-red-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-red-600">
                {language === 'nb' ? 'Teknisk feil' : 'Technical error'}
              </h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : providers.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {language === 'nb' ? 'Ingen tilbud tilgjengelig akkurat nå' : 'No offers available right now'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'nb' 
                  ? 'Produkter vil vises automatisk når de er tilgjengelige via Buifyl Shop.' 
                  : 'Products will be displayed automatically when available via Buifyl Shop.'}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'nb' 
                  ? 'Buifyl Shop oppdaterer produkter automatisk i bakgrunnen.' 
                  : 'Buifyl Shop updates products automatically in the background.'}
              </p>
            </div>
          ) : (
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
                
                {/* Buifyl Shop info */}
                {providers.length > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
                    <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {language === 'nb' ? 'Om produktene' : 'About the products'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === 'nb' 
                        ? `Vi viser ${providers.length} produkter fra Buifyl Shop. Alle priser oppdateres automatisk.` 
                        : `We show ${providers.length} products from Buifyl Shop. All prices are updated automatically.`}
                    </p>
                    {lastUpdated && (
                      <p className="text-xs text-green-600 mt-2">
                        {language === 'nb' ? 'Sist oppdatert' : 'Last updated'}: {lastUpdated.toLocaleDateString('nb-NO')} {lastUpdated.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Compare;

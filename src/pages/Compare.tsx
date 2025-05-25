
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
import { Database, Zap } from 'lucide-react';

const Compare = () => {
  const { categoryId = 'insurance' } = useParams<{ categoryId: string }>();
  const { language } = useLanguage();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const categories = getAvailableCategories();
  const category = categories.find(c => c.id === categoryId);
  
  const loadProviders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProviders(categoryId);
      setProviders(data);
      
      if (data.length === 0) {
        setError(null); // Don't treat empty data as error
      }
    } catch (err) {
      console.error('Failed to load providers:', err);
      setError(language === 'nb' 
        ? 'Teknisk feil ved lasting av data. Prøv igjen senere.' 
        : 'Technical error loading data. Please try again later.'
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
                    {providers.length} {language === 'nb' ? 'leverandører tilgjengelig' : 'providers available'}
                  </p>
                  {providers.some(p => p.isValidData !== false) && (
                    <div className="flex items-center text-green-400 text-sm">
                      <Zap size={16} className="mr-1" />
                      {language === 'nb' ? 'Live data' : 'Live data'}
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
                {language === 'nb' ? 'Laster tilbud...' : 'Loading offers...'}
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
              <Database size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {language === 'nb' ? 'Ingen tilbud tilgjengelig akkurat nå' : 'No offers available right now'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'nb' 
                  ? 'Data vil vises automatisk når den hentes fra leverandørene.' 
                  : 'Data will be displayed automatically when fetched from providers.'}
              </p>
              <p className="text-sm text-gray-500">
                {language === 'nb' 
                  ? 'Vårt system henter nye tilbud regelmessig i bakgrunnen.' 
                  : 'Our system fetches new offers regularly in the background.'}
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
                
                {/* Data freshness info */}
                {providers.length > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
                    <h3 className="font-semibold mb-2 text-gray-800">
                      {language === 'nb' ? 'Om dataene' : 'About the data'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {language === 'nb' 
                        ? `Vi sammenligner priser fra ${providers.length} leverandører. Data oppdateres automatisk.` 
                        : `We compare prices from ${providers.length} providers. Data is updated automatically.`}
                    </p>
                    {providers.some(p => p.lastUpdated && p.isValidData !== false) && (
                      <p className="text-xs text-green-600 mt-2">
                        {language === 'nb' ? 'Sist oppdatert: ' : 'Last updated: '}
                        {Math.max(...providers.filter(p => p.lastUpdated && p.isValidData !== false)
                          .map(p => new Date(p.lastUpdated!).getTime())
                        ) > 0 && new Date(Math.max(...providers.filter(p => p.lastUpdated && p.isValidData !== false)
                          .map(p => new Date(p.lastUpdated!).getTime())
                        )).toLocaleDateString('nb-NO')}
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


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';
import { getAvailableCategories } from '@/lib/i18n';
import { Provider } from '@/lib/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Database, Zap, ShoppingCart } from 'lucide-react';

const Compare = () => {
  const { categoryId = 'insurance' } = useParams<{ categoryId: string }>();
  const { language } = useLanguage();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const categories = getAvailableCategories();
  const category = categories.find(c => c.id === categoryId);
  
  useEffect(() => {
    setLastUpdated(new Date());
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
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center text-green-400 text-sm">
                  <ShoppingCart size={16} className="mr-1" />
                  {language === 'nb' ? 'Buifyl Shop - Live Data' : 'Buifyl Shop - Live Data'}
                </div>
                {lastUpdated && (
                  <div className="flex items-center text-blue-400 text-xs">
                    <Zap size={12} className="mr-1" />
                    {language === 'nb' ? 'Sist oppdatert' : 'Last updated'}: {lastUpdated.toLocaleDateString('nb-NO')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-4">
              <ProductGrid category={categoryId} />
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
              <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
                <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {language === 'nb' ? 'Om produktene' : 'About the products'}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'nb' 
                    ? 'Vi viser live produkter fra Buifyl Shop. Alle priser oppdateres automatisk.' 
                    : 'We show live products from Buifyl Shop. All prices are updated automatically.'}
                </p>
                {lastUpdated && (
                  <p className="text-xs text-green-600 mt-2">
                    {language === 'nb' ? 'Sist oppdatert' : 'Last updated'}: {lastUpdated.toLocaleDateString('nb-NO')} {lastUpdated.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
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

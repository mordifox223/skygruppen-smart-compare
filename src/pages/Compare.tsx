
import React from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';
import { getMockProviders, getAvailableCategories } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComparisonTable from '@/components/ComparisonTable';
import QRCodeGenerator from '@/components/QRCodeGenerator';

const Compare = () => {
  const { categoryId = 'insurance' } = useParams<{ categoryId: string }>();
  const { language } = useLanguage();
  const providers = getMockProviders(categoryId);
  const categories = getAvailableCategories();
  const category = categories.find(c => c.id === categoryId);
  
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">{category.name[language]}</h1>
            <p className="text-gray-600">{category.description[language]}</p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <ComparisonTable providers={providers} categoryId={categoryId} />
            </div>
            
            <div className="lg:col-span-1">
              <QRCodeGenerator />
              
              {/* Information box */}
              <div className="bg-sky-50 p-4 rounded-lg mt-6">
                <h3 className="font-semibold mb-2 text-sky-800">
                  {language === 'nb' ? 'Visste du?' : 'Did you know?'}
                </h3>
                <p className="text-sm text-sky-900">
                  {language === 'nb' 
                    ? `Å sammenligne ${category.name[language].toLowerCase()} kan spare deg tusenvis av kroner i året. Våre brukere sparer i gjennomsnitt 2,345 kr per år!` 
                    : `Comparing ${category.name[language].toLowerCase()} can save you thousands of kroner per year. Our users save 2,345 NOK per year on average!`}
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


import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DataImportManager from '@/components/DataImportManager';
import { useLanguage } from '@/lib/languageContext';

const DataImport = () => {
  const { language } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {language === 'nb' ? 'Importer Leverandørdata' : 'Import Provider Data'}
              </h1>
              <p className="text-lg text-gray-600">
                {language === 'nb' 
                  ? 'Last opp .txt-filer med leverandørnavn for automatisk dataimport fra API-er'
                  : 'Upload .txt files with provider names for automatic data import from APIs'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <DataImportManager />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DataImport;

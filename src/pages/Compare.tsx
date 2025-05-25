
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';
import { getAvailableCategories } from '@/lib/i18n';
import { Provider } from '@/lib/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import LoadingSpinner from '@/components/LoadingSpinner';

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
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{category.name[language]}</h1>
              <p className="text-lg text-gray-600">{category.description[language]}</p>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <ProductGrid category={categoryId} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Compare;

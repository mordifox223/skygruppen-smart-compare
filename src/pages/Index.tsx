
import React from 'react';
import { useLanguage } from '@/lib/languageContext';
import { getAvailableCategories } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';

const Index = () => {
  const { language } = useLanguage();
  const categories = getAvailableCategories();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-slate-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {language === 'nb' 
                  ? 'Sammenlign. Spar. Smart.' 
                  : 'Compare. Save. Smart.'}
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                {language === 'nb' 
                  ? 'Finn de beste tilbudene fra ledende leverandører i Norge.' 
                  : 'Find the best offers from leading providers in Norway.'}
              </p>
            </div>
          </div>
        </section>
        
        {/* Categories section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">
              {language === 'nb' ? 'Kategorier' : 'Categories'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>
        
        {/* Value proposition */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-6">
                {language === 'nb' 
                  ? 'Hvorfor bruke Skygruppen Compare?' 
                  : 'Why use Skygruppen Compare?'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="p-4">
                  <div className="bg-sky-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-sky-600 text-2xl">✓</span>
                  </div>
                  <h3 className="font-semibold mb-2">
                    {language === 'nb' ? 'Sanntidspriser' : 'Real-time prices'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {language === 'nb' 
                      ? 'Alltid oppdaterte priser fra alle leverandører.' 
                      : 'Always updated prices from all providers.'}
                  </p>
                </div>
                
                <div className="p-4">
                  <div className="bg-sky-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-sky-600 text-2xl">⚡</span>
                  </div>
                  <h3 className="font-semibold mb-2">
                    {language === 'nb' ? 'Enkelt å bruke' : 'Easy to use'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {language === 'nb' 
                      ? 'Sammenligninger som er oversiktlige og enkle å forstå.' 
                      : 'Comparisons that are transparent and easy to understand.'}
                  </p>
                </div>
                
                <div className="p-4">
                  <div className="bg-sky-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-sky-600 text-2xl">🔒</span>
                  </div>
                  <h3 className="font-semibold mb-2">
                    {language === 'nb' ? '100% uavhengig' : '100% independent'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {language === 'nb' 
                      ? 'Vi er en nøytral tjeneste som hjelper deg å spare penger.' 
                      : 'We are a neutral service that helps you save money.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

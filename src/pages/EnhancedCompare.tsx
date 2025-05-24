
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';
import { getMockProviders, getAvailableCategories } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComparisonEngine from '@/components/enhanced/ComparisonEngine';
import HealthIndicator from '@/components/enhanced/HealthIndicator';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EnhancedCompare = () => {
  const { categoryId = 'mobile' } = useParams<{ categoryId: string }>();
  const { language } = useLanguage();
  const providers = getMockProviders(categoryId);
  const categories = getAvailableCategories();
  const category = categories.find(c => c.id === categoryId);
  
  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-montserrat font-bold text-slate-900 mb-4">
            {language === 'nb' ? 'Kategori ikke funnet' : 'Category not found'}
          </h2>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-slate-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">
                {category.name[language]}
              </h1>
              <p className="text-xl text-slate-300 mb-6 leading-relaxed">
                {category.description[language]}
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Badge className="bg-sky-600 text-white px-3 py-1">
                  {providers.length} {language === 'nb' ? 'leverandører' : 'providers'}
                </Badge>
                <Badge className="bg-green-600 text-white px-3 py-1">
                  {language === 'nb' ? 'Realtidsdata' : 'Real-time data'}
                </Badge>
                <Badge className="bg-purple-600 text-white px-3 py-1">
                  {language === 'nb' ? 'GDPR-kompatibel' : 'GDPR compliant'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Comparison */}
            <div className="lg:col-span-3">
              <ComparisonEngine providers={providers} categoryId={categoryId} />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Share Section */}
              <Card className="p-6">
                <h3 className="font-montserrat font-semibold text-slate-900 mb-4">
                  {language === 'nb' ? 'Del sammenligning' : 'Share comparison'}
                </h3>
                <QRCodeGenerator />
              </Card>
              
              {/* Data Health Status */}
              <Card className="p-6">
                <h3 className="font-montserrat font-semibold text-slate-900 mb-4">
                  {language === 'nb' ? 'Datakvalitet' : 'Data quality'}
                </h3>
                <div className="space-y-3">
                  {providers.slice(0, 3).map(provider => (
                    <div key={provider.id} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">{provider.name}</span>
                      <HealthIndicator provider={provider} showDetails />
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-slate-500">
                  {language === 'nb' 
                    ? 'Alle priser valideres automatisk hver time'
                    : 'All prices automatically validated hourly'
                  }
                </div>
              </Card>
              
              {/* Savings Info */}
              <Card className="p-6 bg-sky-50 border-sky-200">
                <h3 className="font-montserrat font-semibold text-sky-900 mb-2">
                  {language === 'nb' ? 'Forventet besparelse' : 'Expected savings'}
                </h3>
                <div className="text-2xl font-montserrat font-bold text-sky-600 mb-2">
                  2,345 kr
                </div>
                <p className="text-sm text-sky-800">
                  {language === 'nb' 
                    ? 'Gjennomsnittlig årlig besparelse for våre brukere ved å bytte leverandør.'
                    : 'Average annual savings for our users by switching providers.'
                  }
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EnhancedCompare;

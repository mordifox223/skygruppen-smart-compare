
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UniversalScrapingManager from '@/components/UniversalScrapingManager';

const LiveData = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-slate-900 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Universal Scraping System</h1>
            <p className="text-gray-300">
              Automatisk produkthenting fra alle leverandører - adaptiv og skalerbar
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <UniversalScrapingManager />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LiveData;

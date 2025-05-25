import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveDataManager from '@/components/LiveDataManager';
import ScrapingTestManager from '@/components/ScrapingTestManager';
import UniversalScrapingManager from '@/components/UniversalScrapingManager';
import RealScrapingManager from '@/components/RealScrapingManager';

const LiveData = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-slate-900 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Live Data Management</h1>
            <p className="text-gray-300">
              Real-time provider data scraping and monitoring system
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RealScrapingManager />
            <ScrapingTestManager />
            <LiveDataManager />
            <UniversalScrapingManager />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LiveData;

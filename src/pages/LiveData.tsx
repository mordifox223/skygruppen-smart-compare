
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveDataManager from '@/components/LiveDataManager';

const LiveData = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-slate-900 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Live Data Scraping</h1>
            <p className="text-gray-300">
              Hent live produktdata fra leverandørenes nettsider
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <LiveDataManager />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LiveData;

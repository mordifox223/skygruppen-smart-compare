
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UniversalScrapingDashboard from '@/components/UniversalScrapingDashboard';

const UniversalScraping = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <UniversalScrapingDashboard />
      </main>
      
      <Footer />
    </div>
  );
};

export default UniversalScraping;

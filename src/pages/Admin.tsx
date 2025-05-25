
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Admin = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-slate-900 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="text-white hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'nb' ? 'Tilbake' : 'Back'}
              </Button>
              <h1 className="text-2xl font-bold">
                {language === 'nb' ? 'Admin Panel' : 'Admin Panel'}
              </h1>
            </div>
          </div>
        </div>
        
        <AdminDashboard />
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;

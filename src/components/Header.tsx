
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';
import LanguageToggle from './LanguageToggle';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { language } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-sky-600">
            Skygruppen Compare
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-sky-600 transition-colors"
            >
              {language === 'nb' ? 'Hjem' : 'Home'}
            </Link>
            <Link 
              to="/admin" 
              className="text-gray-700 hover:text-sky-600 transition-colors flex items-center gap-1"
            >
              <Settings size={16} />
              Admin
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="md:hidden"
            >
              <Link to="/admin">
                <Settings size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

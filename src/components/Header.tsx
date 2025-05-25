
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';
import { getAvailableCategories } from '@/lib/i18n';
import LanguageToggle from '@/components/LanguageToggle';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const { language } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const categories = getAvailableCategories();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="font-montserrat font-bold text-xl text-slate-900">
            Skygruppen <span className="text-sky-600">Compare</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/compare/${category.id}`}
              className="text-gray-700 hover:text-sky-600 transition-colors font-medium"
            >
              {category.name[language]}
            </Link>
          ))}
          <LanguageToggle />
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/compare/${category.id}`}
                className="text-gray-700 hover:text-sky-600 transition-colors py-2 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name[language]}
              </Link>
            ))}
            <div className="py-2">
              <LanguageToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

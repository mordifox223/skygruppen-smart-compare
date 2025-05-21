
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/languageContext';
import { getAvailableCategories } from '@/lib/i18n';

const Footer = () => {
  const { language } = useLanguage();
  const categories = getAvailableCategories();
  
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-xl mb-4 text-white">
              Skygruppen <span className="text-sky-400">Compare</span>
            </h3>
            <p className="text-gray-300 text-sm">
              {language === 'nb' 
                ? 'Sammenlign tilbud fra ledende leverandører i Norge og finn de beste prisene.'
                : 'Compare offerings from leading Norwegian providers and find the best prices.'}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">
              {language === 'nb' ? 'Kategorier' : 'Categories'}
            </h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    to={`/compare/${category.id}`}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {category.name[language]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">
              {language === 'nb' ? 'Om oss' : 'About us'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {language === 'nb' ? 'Hjem' : 'Home'}
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {language === 'nb' ? 'Personvern' : 'Privacy Policy'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {language === 'nb' ? 'Vilkår' : 'Terms of Service'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {language === 'nb' ? 'Kontakt oss' : 'Contact us'}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Skygruppen Compare Smart. {language === 'nb' ? 'Alle rettigheter reservert.' : 'All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

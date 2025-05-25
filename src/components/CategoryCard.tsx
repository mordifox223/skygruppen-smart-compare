
import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '@/lib/types';
import { useLanguage } from '@/lib/languageContext';
import { ChevronRight } from 'lucide-react';
import { Shield, Zap, Smartphone, Landmark } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  zap: Zap,
  phone: Smartphone,
  bank: Landmark,
};

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { language } = useLanguage();
  const Icon = iconMap[category.icon] || Shield;
  
  return (
    <Link to={`/compare/${category.id}`} className="block">
      <div className="category-card bg-white rounded-lg p-6 h-full flex flex-col border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all">
        <div className="mb-4 flex items-center justify-between">
          <div className="p-3 bg-sky-50 rounded-full">
            <Icon size={24} className="text-sky-600" />
          </div>
          <span className="text-sm text-slate-500 font-montserrat">
            {category.providers} {language === 'nb' ? 'leverandører' : 'providers'}
          </span>
        </div>
        
        <h3 className="text-xl font-montserrat font-semibold mb-2 text-slate-900">
          {category.name[language]}
        </h3>
        <p className="text-slate-600 text-sm mb-4 flex-grow leading-relaxed">
          {category.description[language]}
        </p>
        
        <div className="flex items-center text-sky-600 font-montserrat font-medium">
          <span>{language === 'nb' ? 'Sammenlign' : 'Compare'}</span>
          <ChevronRight size={16} className="ml-1" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;

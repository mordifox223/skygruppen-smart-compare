
import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '@/lib/types';
import { useLanguage } from '@/lib/languageContext';
import { ChevronRight } from 'lucide-react';
import { Shield, Zap, Smartphone, Landmark } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  zap: Zap,
  smartphone: Smartphone,
  landmark: Landmark,
};

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { language } = useLanguage();
  const Icon = iconMap[category.icon] || Shield;
  
  return (
    <Link to={`/compare/${category.id}`} className="block">
      <div className="category-card bg-white rounded-lg p-6 h-full flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div className="p-3 bg-sky-50 rounded-full">
            <Icon size={24} className="text-sky-600" />
          </div>
          <span className="text-sm text-gray-500">{category.providers} {language === 'nb' ? 'leverandører' : 'providers'}</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{category.name[language]}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{category.description[language]}</p>
        
        <div className="flex items-center text-sky-600 font-medium">
          <span>{language === 'nb' ? 'Sammenlign' : 'Compare'}</span>
          <ChevronRight size={16} className="ml-1" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;

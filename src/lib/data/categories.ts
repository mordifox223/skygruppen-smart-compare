
import { Category } from '../types';

export const getAvailableCategories = (): Category[] => {
  return [
    {
      id: 'mobile',
      name: {
        nb: 'Mobilabonnement',
        en: 'Mobile plans'
      },
      description: {
        nb: 'Sammenlign priser og tjenester fra Norges ledende mobiloperatører. Finn det beste mobilabonnementet for dine behov.',
        en: 'Compare prices and services from Norway\'s leading mobile operators. Find the best mobile plan for your needs.'
      },
      icon: 'phone',
      providers: 8
    },
    {
      id: 'electricity',
      name: {
        nb: 'Strøm',
        en: 'Electricity'
      },
      description: {
        nb: 'Finn de beste og mest miljøvennlige strømleverandørene i Norge. Sammenlign fastpris og spotpris fra ulike leverandører.',
        en: 'Find the best and most environmentally friendly electricity providers in Norway. Compare fixed price and spot price from different providers.'
      },
      icon: 'zap',
      providers: 8
    },
    {
      id: 'insurance',
      name: {
        nb: 'Forsikring',
        en: 'Insurance'
      },
      description: {
        nb: 'Sammenlign forsikringsalternativer fra Norges ledende selskaper. Innbo, reise, bil og mer - finn den beste dekningen til lavest pris.',
        en: 'Compare insurance options from Norway\'s leading companies. Home, travel, car and more - find the best coverage at the lowest price.'
      },
      icon: 'shield',
      providers: 8
    },
    {
      id: 'loan',
      name: {
        nb: 'Lån',
        en: 'Loans'
      },
      description: {
        nb: 'Finn de beste lånetilbudene fra norske banker. Boliglån, forbrukslån og refinansiering med konkurransedyktige renter.',
        en: 'Find the best loan offers from Norwegian banks. Mortgages, consumer loans and refinancing with competitive interest rates.'
      },
      icon: 'bank',
      providers: 8
    }
  ];
};

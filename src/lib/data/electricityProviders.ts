
import { Provider } from '@/lib/types';

export const getElectricityProviders = (): Provider[] => {
  return [
    {
      id: 'fjordkraft-variabel',
      name: 'Fjordkraft',
      category: 'electricity',
      logo: 'https://www.fjordkraft.no/assets/images/fjordkraft-logo.svg',
      price: 29,
      priceLabel: { nb: 'kr/mnd + spotpris', en: 'NOK/month + spot price' },
      rating: 4.2,
      features: {
        nb: ['Spotpris + påslag', 'Månedlig faktura', 'Grønn strøm', '14 dagers oppsigelse'],
        en: ['Spot price + markup', 'Monthly billing', 'Green energy', '14 days notice']
      },
      url: 'https://www.fjordkraft.no',
      offerUrl: 'https://www.fjordkraft.no/strom/variabel',
      lastUpdated: new Date(),
      isValidData: true
    },
    {
      id: 'tibber-smart',
      name: 'Tibber',
      category: 'electricity',
      logo: 'https://tibber.com/no/wp-content/uploads/sites/3/2021/01/tibber-logo.svg',
      price: 39,
      priceLabel: { nb: 'kr/mnd + spotpris', en: 'NOK/month + spot price' },
      rating: 4.5,
      features: {
        nb: ['Smart strømmåler', 'App-styring', 'Spotpris', 'Grønn energi'],
        en: ['Smart meter', 'App control', 'Spot price', 'Green energy']
      },
      url: 'https://tibber.com',
      offerUrl: 'https://tibber.com/no/strom',
      lastUpdated: new Date(),
      isValidData: true,
      hasSpecificOffer: true
    },
    {
      id: 'elvia-fast',
      name: 'Elvia',
      category: 'electricity',
      logo: 'https://www.elvia.no/globalassets/bilder/logo/elvia-logo.svg',
      price: 45,
      priceLabel: { nb: 'kr/mnd fast pris', en: 'NOK/month fixed price' },
      rating: 4.0,
      features: {
        nb: ['Fast pris i 12 mnd', 'Forutsigbar regning', 'Kundeservice', 'Ingen overraskelser'],
        en: ['Fixed price 12 months', 'Predictable bill', 'Customer service', 'No surprises']
      },
      url: 'https://www.elvia.no',
      offerUrl: 'https://www.elvia.no/strom/fastpris',
      lastUpdated: new Date(),
      isValidData: true
    },
    {
      id: 'gudbrandsdal-energi',
      name: 'Gudbrandsdal Energi',
      category: 'electricity',
      logo: 'https://via.placeholder.com/100x60?text=GE',
      price: 35,
      priceLabel: { nb: 'kr/mnd + spotpris', en: 'NOK/month + spot price' },
      rating: 4.1,
      features: {
        nb: ['Lokal leverandør', 'Konkurransedyktige priser', 'Personlig service', 'Miljøvennlig'],
        en: ['Local provider', 'Competitive prices', 'Personal service', 'Eco-friendly']
      },
      url: 'https://www.ge.no',
      offerUrl: 'https://www.ge.no/strom',
      lastUpdated: new Date(),
      isValidData: true
    },
    {
      id: 'lyse-energi',
      name: 'Lyse',
      category: 'electricity',
      logo: 'https://www.lyse.no/globalassets/bilder/logo/lyse-logo.svg',
      price: 42,
      priceLabel: { nb: 'kr/mnd + spotpris', en: 'NOK/month + spot price' },
      rating: 4.3,
      features: {
        nb: ['Spotpris med påslag', 'Digital fakturaservice', 'Kundeapp', 'Fornybar energi'],
        en: ['Spot price with markup', 'Digital billing', 'Customer app', 'Renewable energy']
      },
      url: 'https://www.lyse.no',
      offerUrl: 'https://www.lyse.no/strom/spotpris',
      lastUpdated: new Date(),
      isValidData: true
    }
  ];
};

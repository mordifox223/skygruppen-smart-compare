
import { Provider } from '@/lib/types';

export const getLoanProviders = (): Provider[] => {
  return [
    {
      id: 'dnb-boliglan',
      name: 'DNB',
      category: 'loan',
      logo: 'https://www.dnb.no/static/images/dnb-logo.svg',
      price: 4.2,
      priceLabel: { nb: '% rente', en: '% interest' },
      rating: 4.3,
      features: {
        nb: ['Fast rente tilgjengelig', 'Ingen etableringsgebyr', 'Refinansiering', 'Fleksible nedbetalinger'],
        en: ['Fixed interest available', 'No setup fee', 'Refinancing', 'Flexible payments']
      },
      url: 'https://www.dnb.no',
      offerUrl: 'https://www.dnb.no/privat/lan/boliglan',
      lastUpdated: new Date(),
      isValidData: true,
      hasSpecificOffer: true
    },
    {
      id: 'nordea-boliglan',
      name: 'Nordea',
      category: 'loan',
      logo: 'https://www.nordea.no/globalassets/nordea-logo.svg',
      price: 4.1,
      priceLabel: { nb: '% rente', en: '% interest' },
      rating: 4.2,
      features: {
        nb: ['Konkurransedyktig rente', 'Rask saksbehandling', 'Digital søknad', 'Personlig rådgiver'],
        en: ['Competitive interest', 'Fast processing', 'Digital application', 'Personal advisor']
      },
      url: 'https://www.nordea.no',
      offerUrl: 'https://www.nordea.no/privat/lan/boliglan',
      lastUpdated: new Date(),
      isValidData: true
    },
    {
      id: 'sparebank1-boliglan',
      name: 'SpareBank 1',
      category: 'loan',
      logo: 'https://www.sparebank1.no/globalassets/sparebank1-logo.svg',
      price: 4.0,
      priceLabel: { nb: '% rente', en: '% interest' },
      rating: 4.4,
      features: {
        nb: ['Lokal bank', 'Særvilkår for kunder', 'Fleksible løsninger', 'Lang erfaring'],
        en: ['Local bank', 'Special terms for customers', 'Flexible solutions', 'Long experience']
      },
      url: 'https://www.sparebank1.no',
      offerUrl: 'https://www.sparebank1.no/bank/lan/boliglan',
      lastUpdated: new Date(),
      isValidData: true
    },
    {
      id: 'handelsbanken-boliglan',
      name: 'Handelsbanken',
      category: 'loan',
      logo: 'https://www.handelsbanken.no/globalassets/handelsbanken-logo.svg',
      price: 4.3,
      priceLabel: { nb: '% rente', en: '% interest' },
      rating: 4.1,
      features: {
        nb: ['Personlig service', 'Rask behandling', 'Fleksible vilkår', 'Erfarne rådgivere'],
        en: ['Personal service', 'Fast processing', 'Flexible terms', 'Experienced advisors']
      },
      url: 'https://www.handelsbanken.no',
      offerUrl: 'https://www.handelsbanken.no/privat/lan/boliglan',
      lastUpdated: new Date(),
      isValidData: true
    },
    {
      id: 'sbanken-boliglan',
      name: 'Sbanken',
      category: 'loan',
      logo: 'https://www.sbanken.no/globalassets/sbanken-logo.svg',
      price: 3.9,
      priceLabel: { nb: '% rente', en: '% interest' },
      rating: 4.5,
      features: {
        nb: ['Lavest rente', 'Fullt digitalt', 'Ingen gebyrer', 'Rask behandling'],
        en: ['Lowest interest', 'Fully digital', 'No fees', 'Fast processing']
      },
      url: 'https://www.sbanken.no',
      offerUrl: 'https://www.sbanken.no/lan/boliglan',
      lastUpdated: new Date(),
      isValidData: true,
      hasSpecificOffer: true
    }
  ];
};


import { Provider } from '../types';

export const getLoanProviders = (): Provider[] => [
  {
    id: 'dnb',
    name: 'DNB',
    category: 'loan',
    logo: 'https://www.dnb.no/portalfront/dnb/images/dnb.svg?v=20230202',
    price: 3.95,
    priceLabel: {
      nb: '% effektiv rente',
      en: '% effective interest rate'
    },
    rating: 4.2,
    features: {
      nb: ['Boliglån', 'Personlig rådgivning', 'Mobilbank', 'Lave gebyrer'],
      en: ['Mortgage', 'Personal advisory', 'Mobile banking', 'Low fees']
    },
    url: 'https://www.dnb.no',
    offerUrl: 'https://www.dnb.no/laan',
    lastUpdated: new Date()
  },
  {
    id: 'nordea',
    name: 'Nordea',
    category: 'loan',
    logo: 'https://www.nordea.no/Images/41-174129/nordea-logo.png',
    price: 3.99,
    priceLabel: {
      nb: '% effektiv rente',
      en: '% effective interest rate'
    },
    rating: 4.1,
    features: {
      nb: ['Boliglån', 'Grønn billån', 'Nordea Mobilbank', 'Rådgivning'],
      en: ['Mortgage', 'Green car loan', 'Nordea Mobile Bank', 'Advisory']
    },
    url: 'https://www.nordea.no',
    offerUrl: 'https://www.nordea.no/laan',
    lastUpdated: new Date()
  },
  {
    id: 'sbanken',
    name: 'Sbanken',
    category: 'loan',
    logo: 'https://www.sbanken.no/globalassets/bilder/logo/sbanken-logo.svg',
    price: 3.85,
    priceLabel: {
      nb: '% effektiv rente',
      en: '% effective interest rate'
    },
    rating: 4.7,
    features: {
      nb: ['Boliglån', 'Ingen etableringskostnad', 'Prisgaranti', 'Kundeservice'],
      en: ['Mortgage', 'No establishment fee', 'Price guarantee', 'Customer service']
    },
    url: 'https://www.sbanken.no',
    offerUrl: 'https://www.sbanken.no/laan',
    lastUpdated: new Date()
  },
  {
    id: 'komplett-bank',
    name: 'Komplett Bank',
    category: 'loan',
    logo: 'https://www.komplettbank.no/globalassets/media/logo/komplett-bank-logo.png',
    price: 7.90,
    priceLabel: {
      nb: '% effektiv rente',
      en: '% effective interest rate'
    },
    rating: 3.9,
    features: {
      nb: ['Forbrukslån', 'Raskt svar', 'Ingen skjulte gebyrer', 'Fleksibel nedbetaling'],
      en: ['Consumer loan', 'Fast response', 'No hidden fees', 'Flexible repayment']
    },
    url: 'https://www.komplettbank.no',
    offerUrl: 'https://www.komplettbank.no/forbrukslan',
    lastUpdated: new Date()
  },
  {
    id: 'bank-norwegian',
    name: 'Bank Norwegian',
    category: 'loan',
    logo: 'https://www.banknorwegian.no/design/img/logoGrey.svg',
    price: 8.40,
    priceLabel: {
      nb: '% effektiv rente',
      en: '% effective interest rate'
    },
    rating: 3.8,
    features: {
      nb: ['Forbrukslån', 'Enkelt på nett', 'Rask behandlingstid', 'Ingen sikkerhet kreves'],
      en: ['Consumer loan', 'Easy online', 'Fast processing time', 'No security required']
    },
    url: 'https://www.banknorwegian.no',
    offerUrl: 'https://www.banknorwegian.no/lan',
    lastUpdated: new Date()
  },
  {
    id: 'bnbank',
    name: 'BN Bank',
    category: 'loan',
    logo: 'https://www.bnbank.no/design/images/logo.svg',
    price: 3.90,
    priceLabel: {
      nb: '% effektiv rente',
      en: '% effective interest rate'
    },
    rating: 4.3,
    features: {
      nb: ['Boliglån', 'Lavere rente ved miljøtiltak', 'Enkel digital søknad', 'Konkurransedyktige vilkår'],
      en: ['Mortgage', 'Lower rate for environmental measures', 'Simple digital application', 'Competitive terms']
    },
    url: 'https://www.bnbank.no',
    offerUrl: 'https://www.bnbank.no/boliglaan',
    lastUpdated: new Date()
  },
  {
    id: 'santander',
    name: 'Santander',
    category: 'loan',
    logo: 'https://www.santander.no/assets/images/santander.svg',
    price: 8.90,
    priceLabel: {
      nb: '% effektiv rente',
      en: '% effective interest rate'
    },
    rating: 3.7,
    features: {
      nb: ['Billån', 'Forbrukslån', 'Kredittkort', 'Fleksibel nedbetaling'],
      en: ['Car loan', 'Consumer loan', 'Credit card', 'Flexible repayment']
    },
    url: 'https://www.santander.no',
    offerUrl: 'https://www.santander.no/lan',
    lastUpdated: new Date()
  },
  {
    id: 'instabank',
    name: 'Instabank',
    category: 'loan',
    logo: 'https://www.instabank.no/static/media/logo.fe2d6e0d.svg',
    price: 8.95,
    priceLabel: {
      nb: '% effektiv rente',
      en: '% effective interest rate'
    },
    rating: 3.9,
    features: {
      nb: ['Forbrukslån', 'Refinansiering', 'Rask utbetaling', 'Ingen etableringsgebyr'],
      en: ['Consumer loan', 'Refinancing', 'Quick payout', 'No establishment fee']
    },
    url: 'https://www.instabank.no',
    offerUrl: 'https://www.instabank.no/forbrukslan',
    lastUpdated: new Date()
  }
];

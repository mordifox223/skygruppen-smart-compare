
import { Provider } from '../types';

export const getElectricityProviders = (): Provider[] => [
  {
    id: 'tibber',
    name: 'Tibber',
    category: 'electricity',
    logo: 'https://assets.tibber.com/logos/logo-wordmark-color.svg',
    price: 0.89,
    priceLabel: {
      nb: 'per kWh + 39kr/mnd',
      en: 'per kWh + 39kr/month'
    },
    rating: 4.7,
    features: {
      nb: ['Spotpris + 0 øre påslag', 'Smart styring', 'Ingen bindingstid', 'Mobilapp med forbruksoversikt'],
      en: ['Spot price + 0 øre markup', 'Smart control', 'No lock-in period', 'Mobile app with consumption overview']
    },
    url: 'https://tibber.com/no',
    offerUrl: 'https://tibber.com/no/bestill',
    lastUpdated: new Date()
  },
  {
    id: 'fjordkraft',
    name: 'Fjordkraft',
    category: 'electricity',
    logo: 'https://www.fjordkraft.no/globalassets/design/logo/fjordkraft-logo.svg',
    price: 0.95,
    priceLabel: {
      nb: 'per kWh + 49kr/mnd',
      en: 'per kWh + 49kr/month'
    },
    rating: 3.9,
    features: {
      nb: ['Spotpris + 5 øre påslag', 'Strømforsikring', 'Kundefordeler', 'Billading'],
      en: ['Spot price + 5 øre markup', 'Electricity insurance', 'Customer benefits', 'EV charging']
    },
    url: 'https://www.fjordkraft.no',
    offerUrl: 'https://www.fjordkraft.no/bestill-strom',
    lastUpdated: new Date()
  },
  {
    id: 'motkraft',
    name: 'Motkraft',
    category: 'electricity',
    logo: 'https://motkraft.no/wp-content/uploads/2021/09/Motkraft_logo_med_payoff_RGB_org.png',
    price: 0.87,
    priceLabel: {
      nb: 'per kWh + 29kr/mnd',
      en: 'per kWh + 29kr/month'
    },
    rating: 4.5,
    features: {
      nb: ['Spotpris + 0 øre påslag', 'Ingen bindingstid', 'Ingen skjulte kostnader', 'Veldedighet'],
      en: ['Spot price + 0 øre markup', 'No lock-in period', 'No hidden costs', 'Charity']
    },
    url: 'https://motkraft.no',
    offerUrl: 'https://motkraft.no/bestill',
    lastUpdated: new Date()
  },
  {
    id: 'hafslund',
    name: 'Hafslund',
    category: 'electricity',
    logo: 'https://www.hafslund.no/assets/images/hafslund-logo.svg',
    price: 0.92,
    priceLabel: {
      nb: 'per kWh + 39kr/mnd',
      en: 'per kWh + 39kr/month'
    },
    rating: 4.0,
    features: {
      nb: ['Spotpris + 2.5 øre påslag', 'Strøm fra vannkraft', 'Forutsigbar fakturering', 'God kundeservice'],
      en: ['Spot price + 2.5 øre markup', 'Hydropower electricity', 'Predictable billing', 'Good customer service']
    },
    url: 'https://www.hafslund.no',
    offerUrl: 'https://www.hafslund.no/strom',
    lastUpdated: new Date()
  },
  {
    id: 'fortum',
    name: 'Fortum',
    category: 'electricity',
    logo: 'https://www.fortum.com/sites/all/themes/fortum_2016/logo.svg',
    price: 0.90,
    priceLabel: {
      nb: 'per kWh + 35kr/mnd',
      en: 'per kWh + 35kr/month'
    },
    rating: 4.1,
    features: {
      nb: ['Spotpris + 1.9 øre påslag', '100% fornybar energi', 'Smart hjem-løsninger', 'Elektronisk faktura'],
      en: ['Spot price + 1.9 øre markup', '100% renewable energy', 'Smart home solutions', 'Electronic invoicing']
    },
    url: 'https://www.fortum.no',
    offerUrl: 'https://www.fortum.no/privat/strom',
    lastUpdated: new Date()
  },
  {
    id: 'ishavskraft',
    name: 'Ishavskraft',
    category: 'electricity',
    logo: 'https://www.ishavskraft.no/wp-content/uploads/2018/06/ishavskraft_logo_rgb_roed_transparent.png',
    price: 0.91,
    priceLabel: {
      nb: 'per kWh + 39kr/mnd',
      en: 'per kWh + 39kr/month'
    },
    rating: 4.2,
    features: {
      nb: ['Spotpris + 2 øre påslag', 'Fornybar vannkraft', 'God kundeservice', 'Mobilapp'],
      en: ['Spot price + 2 øre markup', 'Renewable hydropower', 'Good customer service', 'Mobile app']
    },
    url: 'https://www.ishavskraft.no',
    offerUrl: 'https://www.ishavskraft.no/strom',
    lastUpdated: new Date()
  },
  {
    id: 'norgesenergi',
    name: 'NorgesEnergi',
    category: 'electricity',
    logo: 'https://www.norgesenergi.no/wp-content/themes/norgesenergi/img/logo.png',
    price: 0.88,
    priceLabel: {
      nb: 'per kWh + 32kr/mnd',
      en: 'per kWh + 32kr/month'
    },
    rating: 4.0,
    features: {
      nb: ['Spotpris + 1 øre påslag', 'Enkel bestilling', 'Ingen binding', 'Strøm fra norsk vannkraft'],
      en: ['Spot price + 1 øre markup', 'Easy ordering', 'No lock-in period', 'Electricity from Norwegian hydropower']
    },
    url: 'https://www.norgesenergi.no',
    offerUrl: 'https://www.norgesenergi.no/bestill',
    lastUpdated: new Date()
  },
  {
    id: 'gudbrandsdal',
    name: 'Gudbrandsdal Energi',
    category: 'electricity',
    logo: 'https://ge.no/wp-content/themes/ge-based/assets/images/gudbrandsdal-energi-logo.svg',
    price: 0.86,
    priceLabel: {
      nb: 'per kWh + 29kr/mnd',
      en: 'per kWh + 29kr/month'
    },
    rating: 4.3,
    features: {
      nb: ['Spotpris + 0 øre påslag', 'Ingen bindingstid', 'Prisgaranti', 'Alle får samme gode pris'],
      en: ['Spot price + 0 øre markup', 'No lock-in period', 'Price guarantee', 'Everyone gets the same good price']
    },
    url: 'https://ge.no',
    offerUrl: 'https://ge.no/strom',
    lastUpdated: new Date()
  }
];

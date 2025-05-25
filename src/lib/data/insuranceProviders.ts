
import { Provider } from '@/lib/types';

export const getInsuranceProviders = (): Provider[] => {
  return [
    {
      id: 'gjensidige-innbo',
      name: 'Gjensidige',
      category: 'insurance',
      logo: 'https://www.gjensidige.no/static/images/gjensidige-logo.svg',
      price: 149,
      priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
      rating: 4.2,
      features: {
        nb: ['Innbo og løsøre', 'Ansvar', 'Reisegods', 'Egenandel fra 2000 kr'],
        en: ['Contents insurance', 'Liability', 'Travel goods', 'Deductible from 2000 NOK']
      },
      url: 'https://www.gjensidige.no',
      offerUrl: 'https://www.gjensidige.no/forsikring/innbo/basis',
      lastUpdated: new Date(),
      isValidData: true,
      hasSpecificOffer: true
    },
    {
      id: 'if-innbo-pluss',
      name: 'If',
      category: 'insurance',
      logo: 'https://www.if.no/globalassets/if-logo.svg',
      price: 169,
      priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
      rating: 4.4,
      features: {
        nb: ['Utvidet dekning', 'Verdisaker inkludert', 'Skade på mobil/PC', 'Ansvar 5 mill kr'],
        en: ['Extended coverage', 'Valuables included', 'Mobile/PC damage', 'Liability 5M NOK']
      },
      url: 'https://www.if.no',
      offerUrl: 'https://www.if.no/forsikring/innbo/pluss',
      lastUpdated: new Date(),
      isValidData: true
    },
    {
      id: 'tryg-innbo-smart',
      name: 'Tryg',
      category: 'insurance',
      logo: 'https://www.tryg.no/globalassets/tryg-logo.svg',
      price: 159,
      priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
      rating: 4.1,
      features: {
        nb: ['Smart hjemteknologi', 'Rabatt ved flere forsikringer', 'Digital skademelding', 'Rask utbetaling'],
        en: ['Smart home technology', 'Multi-policy discount', 'Digital claims', 'Fast payout']
      },
      url: 'https://www.tryg.no',
      offerUrl: 'https://www.tryg.no/forsikring/innbo/smart',
      lastUpdated: new Date(),
      isValidData: true
    },
    {
      id: 'storebrand-innbo',
      name: 'Storebrand',
      category: 'insurance',
      logo: 'https://www.storebrand.no/globalassets/storebrand-logo.svg',
      price: 139,
      priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
      rating: 4.0,
      features: {
        nb: ['Basis innbodekning', 'Personlig service', 'Miljøvennlige valg', 'Fleksible betalingsløsninger'],
        en: ['Basic contents coverage', 'Personal service', 'Eco-friendly options', 'Flexible payment']
      },
      url: 'https://www.storebrand.no',
      offerUrl: 'https://www.storebrand.no/forsikring/innbo',
      lastUpdated: new Date(),
      isValidData: true
    },
    {
      id: 'sparebank1-innbo',
      name: 'SpareBank 1',
      category: 'insurance',
      logo: 'https://www.sparebank1.no/globalassets/sparebank1-logo.svg',
      price: 155,
      priceLabel: { nb: 'kr/mnd', en: 'NOK/month' },
      rating: 4.2,
      features: {
        nb: ['Bankkunderabatt', 'Fleksibel egenandel', 'Familie-pakker', 'Lokal rådgiver'],
        en: ['Bank customer discount', 'Flexible deductible', 'Family packages', 'Local advisor']
      },
      url: 'https://www.sparebank1.no',
      offerUrl: 'https://www.sparebank1.no/forsikring/innbo',
      lastUpdated: new Date(),
      isValidData: true
    }
  ];
};

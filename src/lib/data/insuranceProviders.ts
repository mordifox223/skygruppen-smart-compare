
import { Provider } from '../types';

export const getInsuranceProviders = (): Provider[] => [
  {
    id: 'if',
    name: 'If',
    category: 'insurance',
    logo: 'https://www.if.no/images/logo.svg',
    price: 1249,
    priceLabel: {
      nb: 'per år',
      en: 'per year'
    },
    rating: 4.2,
    features: {
      nb: ['Reiseforsikring', 'Innboforsikring', 'Ungdomsrabatt', '24/7 kundeservice'],
      en: ['Travel insurance', 'Home contents insurance', 'Youth discount', '24/7 customer service']
    },
    url: 'https://www.if.no',
    offerUrl: 'https://www.if.no/forsikring',
    lastUpdated: new Date()
  },
  {
    id: 'gjensidige',
    name: 'Gjensidige',
    category: 'insurance',
    logo: 'https://www.gjensidige.no/content/dam/designs/gjensidige/images/logos/gjensidige-logo.svg',
    price: 1299,
    priceLabel: {
      nb: 'per år',
      en: 'per year'
    },
    rating: 4.3,
    features: {
      nb: ['Boligforsikring', 'Bilforsikring', 'Rabatt for medlemmer', 'Skadeforebyggende råd'],
      en: ['Home insurance', 'Car insurance', 'Member discounts', 'Damage prevention advice']
    },
    url: 'https://www.gjensidige.no',
    offerUrl: 'https://www.gjensidige.no/forsikring',
    lastUpdated: new Date()
  },
  {
    id: 'tryg',
    name: 'Tryg',
    category: 'insurance',
    logo: 'https://tryg.no/images/global/logo.svg',
    price: 1329,
    priceLabel: {
      nb: 'per år',
      en: 'per year'
    },
    rating: 4.0,
    features: {
      nb: ['Familieforsikring', 'Bilforsikring', 'Reiseforsikring', 'Uføreforsikring'],
      en: ['Family insurance', 'Car insurance', 'Travel insurance', 'Disability insurance']
    },
    url: 'https://tryg.no',
    offerUrl: 'https://tryg.no/forsikring',
    lastUpdated: new Date()
  },
  {
    id: 'fremtind',
    name: 'Fremtind',
    category: 'insurance',
    logo: 'https://www.fremtind.no/content/dam/fremtind/public/grafik/fremtind-logo.svg',
    price: 1199,
    priceLabel: {
      nb: 'per år',
      en: 'per year'
    },
    rating: 4.4,
    features: {
      nb: ['Innboforsikring', 'Bilforsikring', 'Reiseforsikring', 'Digital skademelding'],
      en: ['Home contents insurance', 'Car insurance', 'Travel insurance', 'Digital claims reporting']
    },
    url: 'https://www.fremtind.no',
    offerUrl: 'https://www.fremtind.no/forsikring',
    lastUpdated: new Date()
  },
  {
    id: 'frende',
    name: 'Frende',
    category: 'insurance',
    logo: 'https://www.frende.no/media/k5fjbxcq/frende_logo_rgb.svg',
    price: 1179,
    priceLabel: {
      nb: 'per år',
      en: 'per year'
    },
    rating: 4.1,
    features: {
      nb: ['Husforsikring', 'Bilforsikring', 'Barneforsikring', 'Enkel skademelding'],
      en: ['Home insurance', 'Car insurance', 'Child insurance', 'Easy claims reporting']
    },
    url: 'https://www.frende.no',
    offerUrl: 'https://www.frende.no/forsikring',
    lastUpdated: new Date()
  },
  {
    id: 'eika',
    name: 'Eika',
    category: 'insurance',
    logo: 'https://www.eika.no/globalassets/logo-2.png',
    price: 1259,
    priceLabel: {
      nb: 'per år',
      en: 'per year'
    },
    rating: 4.0,
    features: {
      nb: ['Innboforsikring', 'Husforsikring', 'Reiseforsikring', 'Lokalbank-fordeler'],
      en: ['Home contents insurance', 'Home insurance', 'Travel insurance', 'Local bank benefits']
    },
    url: 'https://www.eika.no',
    offerUrl: 'https://www.eika.no/forsikring',
    lastUpdated: new Date()
  },
  {
    id: 'storebrand',
    name: 'Storebrand',
    category: 'insurance',
    logo: 'https://www.storebrand.no/en/_/image/281db60b-165d-4083-81c3-2a66b226f3c7:3d40e32275d867be9e8e8b320c759af45584a3cd/width-768-height-164-fit-in/Storebrand%20logo%20RGB.png',
    price: 1359,
    priceLabel: {
      nb: 'per år',
      en: 'per year'
    },
    rating: 3.9,
    features: {
      nb: ['Bilforsikring', 'Husforsikring', 'Innboforsikring', 'Bærekraftige investeringer'],
      en: ['Car insurance', 'Home insurance', 'Home contents insurance', 'Sustainable investments']
    },
    url: 'https://www.storebrand.no',
    offerUrl: 'https://www.storebrand.no/forsikring',
    lastUpdated: new Date()
  },
  {
    id: 'klp',
    name: 'KLP',
    category: 'insurance',
    logo: 'https://www.klp.no/templates/images/klp-logo.svg',
    price: 1229,
    priceLabel: {
      nb: 'per år',
      en: 'per year'
    },
    rating: 4.2,
    features: {
      nb: ['Innboforsikring', 'Bilforsikring', 'Medlemsfordeler', 'Livsforsikring'],
      en: ['Home contents insurance', 'Car insurance', 'Member benefits', 'Life insurance']
    },
    url: 'https://www.klp.no',
    offerUrl: 'https://www.klp.no/forsikring',
    lastUpdated: new Date()
  }
];

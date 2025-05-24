
import { Provider } from '../types';

export const getMobileProviders = (): Provider[] => [
  {
    id: 'telia',
    name: 'Telia',
    category: 'mobile',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Telia_Company_Logo.svg/320px-Telia_Company_Logo.svg.png',
    price: 299,
    priceLabel: {
      nb: 'per måned',
      en: 'per month'
    },
    rating: 4.2,
    features: {
      nb: ['Ubegrenset data i Norge', 'Fri ringetid', '5G-nettverk', '10GB roaming i EU/EØS'],
      en: ['Unlimited data in Norway', 'Unlimited calls', '5G network', '10GB roaming in EU/EEA']
    },
    url: 'https://www.telia.no',
    offerUrl: 'https://www.telia.no/mobilabonnement',
    lastUpdated: new Date()
  },
  {
    id: 'telenor',
    name: 'Telenor',
    category: 'mobile',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Telenor_logo.svg/320px-Telenor_logo.svg.png',
    price: 329,
    priceLabel: {
      nb: 'per måned',
      en: 'per month'
    },
    rating: 4.0,
    features: {
      nb: ['15GB data', 'Fri ringetid', '5G-nettverk', '10GB roaming i EU/EØS'],
      en: ['15GB data', 'Unlimited calls', '5G network', '10GB roaming in EU/EEA']
    },
    url: 'https://www.telenor.no',
    offerUrl: 'https://www.telenor.no/privat/mobilabonnement',
    lastUpdated: new Date()
  },
  {
    id: 'ice',
    name: 'Ice',
    category: 'mobile',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Ice_logo_2018.svg/320px-Ice_logo_2018.svg.png',
    price: 249,
    priceLabel: {
      nb: 'per måned',
      en: 'per month'
    },
    rating: 4.3,
    features: {
      nb: ['Ubegrenset data (10GB i full hastighet)', 'Fri ringetid', 'Rollover av ubrukt data', 'EU/EØS roaming'],
      en: ['Unlimited data (10GB at full speed)', 'Unlimited calls', 'Data rollover', 'EU/EEA roaming']
    },
    url: 'https://www.ice.no',
    offerUrl: 'https://www.ice.no/abonnement',
    lastUpdated: new Date()
  },
  {
    id: 'onecall',
    name: 'OneCall',
    category: 'mobile',
    logo: 'https://www.onecall.no/catalystimages/onecall-digital-v2/img/logo.svg',
    price: 279,
    priceLabel: {
      nb: 'per måned',
      en: 'per month'
    },
    rating: 4.5,
    features: {
      nb: ['15GB data', 'Fri ringetid', '5G-nettverk', 'EU/EØS roaming'],
      en: ['15GB data', 'Unlimited calls', '5G network', 'EU/EEA roaming']
    },
    url: 'https://www.onecall.no',
    offerUrl: 'https://www.onecall.no/mobilabonnement',
    lastUpdated: new Date()
  },
  {
    id: 'talkmore',
    name: 'Talkmore',
    category: 'mobile',
    logo: 'https://www.talkmore.no/assets/brands/talkmore/logos/logo.svg',
    price: 199,
    priceLabel: {
      nb: 'per måned',
      en: 'per month'
    },
    rating: 4.3,
    features: {
      nb: ['6GB data', 'Fri ringetid', 'EU/EØS roaming', 'Telenor-nettverk'],
      en: ['6GB data', 'Unlimited calls', 'EU/EEA roaming', 'Telenor network']
    },
    url: 'https://www.talkmore.no',
    offerUrl: 'https://www.talkmore.no/mobilabonnement',
    lastUpdated: new Date()
  },
  {
    id: 'chilimobil',
    name: 'Chili Mobil',
    category: 'mobile',
    logo: 'https://chilimobil.no/images/logo.svg',
    price: 219,
    priceLabel: {
      nb: 'per måned',
      en: 'per month'
    },
    rating: 4.0,
    features: {
      nb: ['8GB data', 'Fri ringetid', 'EU/EØS roaming', 'Telenor-nettverk'],
      en: ['8GB data', 'Unlimited calls', 'EU/EEA roaming', 'Telenor network']
    },
    url: 'https://chilimobil.no',
    offerUrl: 'https://chilimobil.no/abonnement',
    lastUpdated: new Date()
  },
  {
    id: 'happybytes',
    name: 'Happybytes',
    category: 'mobile',
    logo: 'https://happybytes.no/wp-content/themes/happybytes/img/happybytes-logo.svg',
    price: 179,
    priceLabel: {
      nb: 'per måned',
      en: 'per month'
    },
    rating: 4.4,
    features: {
      nb: ['5GB data', 'Fri ringetid', 'EU/EØS roaming', 'Telenor-nettverk'],
      en: ['5GB data', 'Unlimited calls', 'EU/EEA roaming', 'Telenor network']
    },
    url: 'https://happybytes.no',
    offerUrl: 'https://happybytes.no/mobilabonnement',
    lastUpdated: new Date()
  },
  {
    id: 'mycall',
    name: 'MyCall',
    category: 'mobile',
    logo: 'https://www.lycamobile.no/images/mc_logo_2021.png',
    price: 199,
    priceLabel: {
      nb: 'per måned',
      en: 'per month'
    },
    rating: 3.8,
    features: {
      nb: ['5GB data', 'Fri ringetid', 'EU/EØS roaming', 'Billig internasjonal samtale'],
      en: ['5GB data', 'Unlimited calls', 'EU/EEA roaming', 'Cheap international calling']
    },
    url: 'https://lycamobile.no',
    offerUrl: 'https://lycamobile.no/mobilabonnement',
    lastUpdated: new Date()
  }
];

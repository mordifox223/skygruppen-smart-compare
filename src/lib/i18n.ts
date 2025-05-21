
import { Category, Language, Provider } from './types';

// Real provider data with more comprehensive information
export const getMockProviders = (categoryId: string): Provider[] => {
  switch (categoryId) {
    case 'mobile':
      return [
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
          url: 'https://www.telia.no'
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
          url: 'https://www.telenor.no'
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
          url: 'https://www.ice.no'
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
          url: 'https://www.onecall.no'
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
          url: 'https://www.talkmore.no'
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
          url: 'https://chilimobil.no'
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
          url: 'https://happybytes.no'
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
          url: 'https://lycamobile.no'
        }
      ];
      
    case 'electricity':
      return [
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
          url: 'https://tibber.com/no'
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
          url: 'https://www.fjordkraft.no'
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
          url: 'https://motkraft.no'
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
          url: 'https://www.hafslund.no'
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
          url: 'https://www.fortum.no'
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
          url: 'https://www.ishavskraft.no'
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
          url: 'https://www.norgesenergi.no'
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
          url: 'https://ge.no'
        }
      ];
      
    case 'insurance':
      return [
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
          url: 'https://www.if.no'
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
          url: 'https://www.gjensidige.no'
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
          url: 'https://tryg.no'
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
          url: 'https://www.fremtind.no'
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
          url: 'https://www.frende.no'
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
          url: 'https://www.eika.no'
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
          url: 'https://www.storebrand.no'
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
          url: 'https://www.klp.no'
        }
      ];
      
    case 'loan':
      return [
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
          url: 'https://www.dnb.no'
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
          url: 'https://www.nordea.no'
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
          url: 'https://www.sbanken.no'
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
          url: 'https://www.komplettbank.no'
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
          url: 'https://www.banknorwegian.no'
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
          url: 'https://www.bnbank.no'
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
          url: 'https://www.santander.no'
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
          url: 'https://www.instabank.no'
        }
      ];
      
    default:
      return [];
  }
};

// More comprehensive categories with better descriptions
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

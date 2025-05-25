
import { ProviderUrlTemplates } from '../types';

export const electricityTemplates: ProviderUrlTemplates = {
  'Tibber': {
    baseUrl: 'https://tibber.com',
    pattern: '/no/strom/{slug}',
    fallbackUrl: 'https://tibber.com/no/strom'
  },
  'Fjordkraft': {
    baseUrl: 'https://www.fjordkraft.no',
    pattern: '/strom/{slug}/',
    fallbackUrl: 'https://www.fjordkraft.no/strom/'
  },
  'Hafslund Strøm': {
    baseUrl: 'https://www.hafslundstrom.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://www.hafslundstrom.no/'
  },
  'Agva Strøm': {
    baseUrl: 'https://agva.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://agva.no/'
  },
  'NorgesEnergi': {
    baseUrl: 'https://norgesenergi.no',
    pattern: '/strom/{slug}/',
    fallbackUrl: 'https://norgesenergi.no/strom/'
  },
  'Fortum': {
    baseUrl: 'https://fortum.no',
    pattern: '/strom/{slug}',
    fallbackUrl: 'https://fortum.no/strom'
  },
  'Lyse Energi': {
    baseUrl: 'https://lyse.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://lyse.no/'
  },
  'Eviny': {
    baseUrl: 'https://eviny.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://eviny.no/'
  }
};

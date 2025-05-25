
import { ProviderUrlTemplates } from '../types';

export const insuranceTemplates: ProviderUrlTemplates = {
  'If Forsikring': {
    baseUrl: 'https://www.if.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://www.if.no/'
  },
  'Gjensidige': {
    baseUrl: 'https://www.gjensidige.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://www.gjensidige.no/'
  },
  'Tryg': {
    baseUrl: 'https://www.tryg.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://www.tryg.no/'
  },
  'Fremtind': {
    baseUrl: 'https://www.fremtind.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://www.fremtind.no/'
  }
};

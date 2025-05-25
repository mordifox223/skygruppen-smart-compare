
import { ProviderUrlTemplates } from '../types';

export const loanTemplates: ProviderUrlTemplates = {
  'Lendo': {
    baseUrl: 'https://www.lendo.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://www.lendo.no/'
  },
  'Axo Finans': {
    baseUrl: 'https://www.axofinans.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://www.axofinans.no/'
  },
  'uLoan': {
    baseUrl: 'https://uloan.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://uloan.no/'
  },
  'Santander': {
    baseUrl: 'https://www.santanderconsumer.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://www.santanderconsumer.no/'
  },
  'Bank Norwegian': {
    baseUrl: 'https://www.banknorwegian.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://www.banknorwegian.no/'
  },
  'Komplett Bank': {
    baseUrl: 'https://www.komplettbank.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://www.komplettbank.no/'
  },
  'Sparebank1': {
    baseUrl: 'https://www.sparebank1.no',
    pattern: '/bank/laan/{slug}/',
    fallbackUrl: 'https://www.sparebank1.no/bank/laan/'
  },
  'DNB': {
    baseUrl: 'https://www.dnb.no',
    pattern: '/privat/laan/{slug}/',
    fallbackUrl: 'https://www.dnb.no/privat/laan/'
  },
  'Nordea': {
    baseUrl: 'https://www.nordea.no',
    pattern: '/privat/laan/{slug}/',
    fallbackUrl: 'https://www.nordea.no/privat/laan/'
  }
};

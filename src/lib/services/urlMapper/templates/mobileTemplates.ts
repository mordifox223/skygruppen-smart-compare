
import { ProviderUrlTemplates } from '../types';

export const mobileTemplates: ProviderUrlTemplates = {
  'Ice': {
    baseUrl: 'https://www.ice.no',
    pattern: '/mobilabonnement/{slug}/',
    fallbackUrl: 'https://www.ice.no/mobilabonnement/',
    requiresSlug: true,
    urlGenerator: 'ice'
  },
  'Talkmore': {
    baseUrl: 'https://www.talkmore.no',
    pattern: '/privat/abonnement/{slug}/',
    fallbackUrl: 'https://www.talkmore.no/privat/abonnement/',
    requiresSlug: true,
    urlGenerator: 'talkmore'
  },
  'Telenor': {
    baseUrl: 'https://www.telenor.no',
    pattern: '/privat/mobil/mobilabonnement/{slug}/',
    fallbackUrl: 'https://www.telenor.no/privat/mobil/mobilabonnement/',
    requiresSlug: true,
    urlGenerator: 'standard'
  },
  'Telia': {
    baseUrl: 'https://www.telia.no',
    pattern: '/privat/mobilabonnement/{slug}/',
    fallbackUrl: 'https://www.telia.no/privat/mobilabonnement/',
    requiresSlug: true,
    urlGenerator: 'standard'
  },
  'OneCall': {
    baseUrl: 'https://onecall.no',
    pattern: '/abonnement/{slug}/',
    fallbackUrl: 'https://onecall.no/abonnement/',
    requiresSlug: true,
    urlGenerator: 'onecall'
  },
  'Chilimobil': {
    baseUrl: 'https://chilimobil.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://chilimobil.no/',
    requiresSlug: true,
    urlGenerator: 'chilimobil'
  },
  'MyCall': {
    baseUrl: 'https://mycall.no',
    pattern: '/mobilabonnement/bestill?productId={productId}',
    fallbackUrl: 'https://mycall.no/mobilabonnement/',
    requiresProductId: true,
    urlGenerator: 'mycall'
  },
  'Happybytes': {
    baseUrl: 'https://happybytes.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://happybytes.no/',
    requiresSlug: true,
    urlGenerator: 'happybytes'
  },
  'PlussMobil': {
    baseUrl: 'https://plussmobil.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://plussmobil.no/',
    requiresSlug: true,
    urlGenerator: 'plussmobil'
  },
  'Saga Mobil': {
    baseUrl: 'https://sagamobil.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://sagamobil.no/',
    requiresSlug: true,
    urlGenerator: 'saga'
  },
  'Release': {
    baseUrl: 'https://release.no',
    pattern: '/{slug}/',
    fallbackUrl: 'https://release.no/',
    requiresSlug: true,
    urlGenerator: 'release'
  },
  'Mobit': {
    baseUrl: 'https://mobit.no',
    pattern: '/mobilabonnement/{slug}/',
    fallbackUrl: 'https://mobit.no/mobilabonnement/',
    requiresSlug: true,
    urlGenerator: 'standard'
  },
  'Fjordkraft Mobil': {
    baseUrl: 'https://www.fjordkraft.no',
    pattern: '/mobilabonnement/{slug}/',
    fallbackUrl: 'https://www.fjordkraft.no/mobilabonnement/',
    requiresSlug: true,
    urlGenerator: 'standard'
  },
  'Lycamobile': {
    baseUrl: 'https://www.lycamobile.no',
    pattern: '/abonnement/{slug}/',
    fallbackUrl: 'https://www.lycamobile.no/abonnement/',
    requiresSlug: true,
    urlGenerator: 'standard'
  }
};


import { Category, Provider } from './types';
import { getMobileProviders } from './data/mobileProviders';
import { getElectricityProviders } from './data/electricityProviders';
import { getInsuranceProviders } from './data/insuranceProviders';
import { getLoanProviders } from './data/loanProviders';
import { getAvailableCategories } from './data/categories';

// Real provider data with more comprehensive information
export const getMockProviders = (categoryId: string): Provider[] => {
  switch (categoryId) {
    case 'mobile':
      return getMobileProviders();
    case 'electricity':
      return getElectricityProviders();
    case 'insurance':
      return getInsuranceProviders();
    case 'loan':
      return getLoanProviders();
    default:
      return [];
  }
};

// Export categories function
export { getAvailableCategories };

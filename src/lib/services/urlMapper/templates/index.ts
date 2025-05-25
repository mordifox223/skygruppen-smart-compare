
import { CategoryUrlTemplates } from '../types';
import { mobileTemplates } from './mobileTemplates';
import { electricityTemplates } from './electricityTemplates';
import { insuranceTemplates } from './insuranceTemplates';
import { loanTemplates } from './loanTemplates';

export const urlTemplates: CategoryUrlTemplates = {
  mobile: mobileTemplates,
  electricity: electricityTemplates,
  insurance: insuranceTemplates,
  loan: loanTemplates
};

export * from './mobileTemplates';
export * from './electricityTemplates';
export * from './insuranceTemplates';
export * from './loanTemplates';

import { flatten } from 'flat';

import en from './en';
import zh from './zh';

export const translations = {
  en: flatten(en),
  zh: flatten(zh),
};

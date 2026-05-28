import { Dictionary } from '@/types/i18n.types';

import { enDictionary } from './dictionaries/en';
import { siDictionary } from './dictionaries/si';
import { Locale } from './settings';

const dictionaries: Record<Locale, Dictionary> = {
  en: enDictionary,
  si: siDictionary,
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale];
}
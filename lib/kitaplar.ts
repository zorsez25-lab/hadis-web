import { BookMeta } from './types';

export const KITAPLAR: BookMeta[] = [
  {
    slug: 'bukhari',
    file: 'bukhari_tr.json',
    turkishName: 'Buhârî',
    arabicName: 'صحيح البخاري',
    from: '#1B4332',
    to: '#2D6A4F',
    totalHadiths: 7589,
  },
  {
    slug: 'muslim',
    file: 'muslim_ar.json',
    turkishName: 'Müslim',
    arabicName: 'صحيح مسلم',
    from: '#880E4F',
    to: '#AD1457',
    totalHadiths: 7453,
  },
  {
    slug: 'tirmizi',
    file: 'tirmizi_ar.json',
    turkishName: 'Tirmizî',
    arabicName: 'سنن الترمذي',
    from: '#6B1A1A',
    to: '#9B3A3A',
    totalHadiths: 3956,
  },
  {
    slug: 'ebudavud',
    file: 'abudawud_ar.json',
    turkishName: 'Ebû Dâvûd',
    arabicName: 'سنن أبي داود',
    from: '#7A5C00',
    to: '#B8860B',
    totalHadiths: 5274,
  },
  {
    slug: 'ibnmace',
    file: 'ibnmace_ar.json',
    turkishName: 'İbn Mâce',
    arabicName: 'سنن ابن ماجه',
    from: '#4A1A6B',
    to: '#7B3FA0',
    totalHadiths: 4341,
  },
  {
    slug: 'nesai',
    file: 'nesai_ar.json',
    turkishName: 'Nesâî',
    arabicName: 'سنن النسائي',
    from: '#0F4D4D',
    to: '#1A7A7A',
    totalHadiths: 5758,
  },
];

export function getKitap(slug: string): BookMeta | undefined {
  return KITAPLAR.find((k) => k.slug === slug);
}

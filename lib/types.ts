export interface Chapter {
  id: number;
  arabicName: string;
  turkishName: string;
  englishName: string;
  hadithFirst: number;
  hadithLast: number;
}

export interface Hadith {
  hadithNumber: string;
  chapterId: string;
  arabic: string;
  turkish?: string;
  coversNumbers: (number | string)[];
  grade?: string;
}

export interface BookData {
  bookSlug: string;
  bookName: string;
  totalHadiths: number;
  totalChapters: number;
  chapters: Record<string, Chapter>;
  hadiths: Hadith[];
}

export interface BookMeta {
  slug: string;
  file: string;
  turkishName: string;
  arabicName: string;
  from: string;
  to: string;
  totalHadiths: number;
  translationPending?: boolean;
}

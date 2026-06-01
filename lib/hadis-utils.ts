import fs from 'fs/promises';
import path from 'path';
import { BookData, Chapter, Hadith } from './types';
import { getKitap } from './kitaplar';

const cache = new Map<string, BookData>();

export async function loadBook(slug: string): Promise<BookData> {
  if (cache.has(slug)) return cache.get(slug)!;
  const meta = getKitap(slug);
  if (!meta) throw new Error(`Unknown book: ${slug}`);
  const filePath = path.join(process.cwd(), 'public', 'assets', meta.file);
  const raw = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(raw) as BookData;
  cache.set(slug, data);
  return data;
}

export async function getChapters(slug: string): Promise<Chapter[]> {
  const book = await loadBook(slug);
  return Object.values(book.chapters).sort((a, b) => a.id - b.id);
}

export async function getHadithsByChapter(slug: string, babId: string): Promise<Hadith[]> {
  const book = await loadBook(slug);
  return book.hadiths.filter((h) => String(h.chapterId) === babId);
}

export async function searchHadiths(query: string): Promise<Array<{ hadith: Hadith; bookSlug: string; bookName: string; chapterName: string }>> {
  const { KITAPLAR } = await import('./kitaplar');
  const results: Array<{ hadith: Hadith; bookSlug: string; bookName: string; chapterName: string }> = [];
  const q = query.toLowerCase().trim();
  if (!q || q.length < 2) return [];

  for (const meta of KITAPLAR) {
    const book = await loadBook(meta.slug);
    for (const hadith of book.hadiths) {
      const inTurkish = hadith.turkish?.toLowerCase().includes(q);
      const inArabic = hadith.arabic.includes(query);
      const isNumber = hadith.hadithNumber === query || (hadith.coversNumbers ?? []).some((n) => n.toString() === query);
      if (inTurkish || inArabic || isNumber) {
        const chapter = book.chapters[hadith.chapterId];
        results.push({
          hadith,
          bookSlug: meta.slug,
          bookName: meta.turkishName,
          chapterName: chapter?.turkishName || chapter?.englishName || '',
        });
        if (results.length >= 50) return results;
      }
    }
  }
  return results;
}

import fs from 'fs/promises';
import path from 'path';

export interface Ravi {
  id: number;
  isim: string;
  arapca?: string;
  arapca_isimler: string[];
  tabaka: string;
  vefat?: string;
  dogum?: string;
  dogumYeri?: string;
  vefatYeri?: string;
  cerh?: string;
  cerhTr?: string;
  ibnHacarCerhTr?: string;
  zehebiCerhTr?: string;
  hocalar: number[];
  talebeler: number[];
}

let _cache: Ravi[] | null = null;
let _idMap: Map<number, Ravi> | null = null;

export async function tumRaviler(): Promise<Ravi[]> {
  if (_cache) return _cache;
  const filePath = path.join(process.cwd(), 'public', 'assets', 'raviler_full_tr.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  _cache = JSON.parse(raw) as Ravi[];
  _idMap = new Map(_cache.map((r) => [r.id, r]));
  return _cache;
}

export async function raviById(id: number): Promise<Ravi | undefined> {
  await tumRaviler();
  return _idMap?.get(id);
}

export type TabakaFiltre = 'tumu' | 'sahabe' | 'tabiun' | 'muhaddis' | 'guvenilir' | 'zayif';

function tabakaSinifi(r: Ravi): string {
  const t = (r.tabaka ?? '').toLowerCase();
  const c = ((r.cerhTr ?? '') + ' ' + (r.ibnHacarCerhTr ?? '')).toLowerCase();
  if (t.includes('sahab') || t.includes('bedir') || t.includes('halife') || t.includes('müjdelen') || t.includes('ağaç altı')) return 'sahabe';
  if (t.includes('tabiin') || t.includes('tabii') || t.includes('tabî') || t.includes('tabi')) return 'tabiun';
  if (t.includes('tabaka')) return 'muhaddis';
  if (c.includes('güvenilir') || c.includes('sika') || c.includes('saduk')) return 'guvenilir';
  if (c.includes('zayıf') || c.includes('metruk') || c.includes('münker')) return 'zayif';
  return 'diger';
}

export async function araRavi(sorgu: string, filtre: TabakaFiltre = 'tumu'): Promise<Ravi[]> {
  const raviler = await tumRaviler();
  const q = sorgu.toLowerCase().trim();

  return raviler.filter((r) => {
    // Filtre
    if (filtre !== 'tumu') {
      const sinif = tabakaSinifi(r);
      if (filtre === 'guvenilir') {
        const c = ((r.cerhTr ?? '') + ' ' + (r.ibnHacarCerhTr ?? '')).toLowerCase();
        if (!c.includes('güvenilir') && !c.includes('sika') && !c.includes('saduk')) return false;
      } else if (filtre === 'zayif') {
        const c = ((r.cerhTr ?? '') + ' ' + (r.ibnHacarCerhTr ?? '')).toLowerCase();
        if (!c.includes('zayıf') && !c.includes('metruk') && !c.includes('münker')) return false;
      } else if (sinif !== filtre) return false;
    }
    // Arama
    if (!q) return true;
    if (r.isim.toLowerCase().includes(q)) return true;
    if (r.arapca?.includes(sorgu)) return true;
    if (r.arapca_isimler.some((n) => n.includes(sorgu))) return true;
    return false;
  });
}

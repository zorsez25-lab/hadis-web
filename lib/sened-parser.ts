import { tumRaviler, Ravi } from './ravi-utils';

export interface SenedRavi {
  arapca: string;
  isim: string;
  raviId?: number;
  isProphet: boolean;
}

function normalizle(text: string): string {
  return text.replace(/[ً-ٟؐ-ؚ]/g, '').replace(/\s+/g, ' ').trim();
}

function senedKisminiAl(text: string): string {
  const sonPattern = /قال رسول الله|أن رسول الله|عن رسول الله|سمعت رسول الله|أن النبي|عن النبي|سمعت النبي|يقول رسول|قال النبي|رسول الله صلى|النبي صلى/;
  const m = sonPattern.exec(text);
  return m ? text.substring(0, m.index) : text;
}

function gecerliIsimMi(isim: string): boolean {
  if (isim.length < 2) return false;
  if (isim.replace(/\s/g, '').length <= 2) return false;
  const edatlar = ['به','له','فيه','منه','عليه','إليه','معه','بهم','لهم','فيهم','منهم','عليهم','هذا','هذه','ذلك','تلك','هو','هي','هم','ما','من','في','على','إلى','عن','مع','أو','إذ','إذا','قد','لا','لم','لن'];
  if (edatlar.includes(isim)) return false;
  const reddedilenler = ['ليلة القدر','الصلاة','الزكاة','الصيام','الحج','الجهاد','القرآن','الإيمان','الإسلام','القيامة','الجنة','النار','الله','النبي','الرسول','المسجد','الكعبة','رمضان'];
  if (reddedilenler.some(r => isim.includes(r))) return false;
  return true;
}

function arapIsimlerCikar(arabicText: string): string[] {
  const normalized = normalizle(arabicText);
  const text = senedKisminiAl(normalized);
  const kwPattern = /(حدثنا|حدثني|أخبرنا|أخبرني|سمعت|عن)\s+/g;
  const matches = [...text.matchAll(kwPattern)];
  const isimler: string[] = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index! + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index! : undefined;
    let parca = end !== undefined ? text.substring(start, end) : text.substring(start);
    const kesIdx = parca.search(/[،,:"»«]|\bقال\b|\bيقول\b|\bأنه\b|\bأن\b|\bأخبر\b/);
    if (kesIdx > 0) parca = parca.substring(0, kesIdx);
    const isim = parca.trim();
    if (gecerliIsimMi(isim)) isimler.push(isim);
  }
  const goruldu = new Set<string>();
  return isimler.filter(n => { if (goruldu.has(n)) return false; goruldu.add(n); return true; });
}

let _tamEslMap: Map<string, Ravi> | null = null;
let _kismiMap: Map<string, Ravi> | null = null;

async function mapOlustur() {
  if (_tamEslMap) return;
  const raviler = await tumRaviler();
  _tamEslMap = new Map();
  _kismiMap = new Map();
  for (const r of raviler) {
    for (const n of r.arapca_isimler) {
      const key = normalizle(n).toLowerCase();
      if (!_tamEslMap.has(key)) _tamEslMap.set(key, r);
    }
    if (r.arapca) {
      const key = normalizle(r.arapca).toLowerCase();
      if (!_tamEslMap.has(key)) _tamEslMap.set(key, r);
      if (!_kismiMap.has(key)) _kismiMap.set(key, r);
    }
  }
}

async function eslestir(arapIsim: string): Promise<Ravi | undefined> {
  await mapOlustur();
  const aranan = normalizle(arapIsim).toLowerCase();
  const tam = _tamEslMap!.get(aranan);
  if (tam) return tam;
  for (const [rv, ravi] of _kismiMap!.entries()) {
    if (rv.length > 4 && aranan.length > 4) {
      if (rv.includes(aranan) || aranan.includes(rv)) return ravi;
    }
  }
  return undefined;
}

const ARAP_TURKCE: Record<string, string> = {
  'عمر بن الخطاب': 'Ömer b. Hattâb', 'عمر': 'Ömer', 'ابن عمر': 'İbn Ömer',
  'عبد الله بن عمر': 'Abdullah b. Ömer', 'أبو هريرة': 'Ebû Hüreyre',
  'ابن عباس': 'İbn Abbâs', 'عائشة': 'Âişe', 'أنس بن مالك': 'Enes b. Mâlik',
  'أنس': 'Enes', 'جابر': 'Câbir', 'علي': 'Ali', 'ابن مسعود': "İbn Mes'ûd",
  'أبو بكر': 'Ebû Bekir', 'مالك': 'Mâlik', 'الزهري': 'Zührî',
  'سفيان': 'Süfyân', 'يحيى': 'Yahyâ', 'شعبة': "Şu'be",
};

export async function zincirOlustur(arabicText: string): Promise<SenedRavi[]> {
  const arapIsimler = arapIsimlerCikar(arabicText);
  if (arapIsimler.length === 0) return [];

  const zincir: SenedRavi[] = [];
  for (const isim of arapIsimler) {
    const ravi = await eslestir(isim);
    let goruntulenenIsim = ravi?.isim;
    if (!goruntulenenIsim) {
      const a = normalizle(isim);
      for (const [arap, turkce] of Object.entries(ARAP_TURKCE)) {
        if (a.includes(arap) || arap.includes(a)) { goruntulenenIsim = turkce; break; }
      }
    }
    zincir.push({ arapca: isim, isim: goruntulenenIsim || isim, raviId: ravi?.id, isProphet: false });
  }

  return [
    { arapca: 'رسول الله', isim: 'Hz. Muhammed ﷺ', isProphet: true },
    ...zincir.reverse(),
  ];
}

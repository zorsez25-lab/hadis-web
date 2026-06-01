import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getKitap, KITAPLAR } from '@/lib/kitaplar';
import { getChapters, getHadithsByChapter } from '@/lib/hadis-utils';
import { Hadith } from '@/lib/types';
import KopyalaButon from '@/components/KopyalaButon';
import ReaderSidebar from './ReaderSidebar';

export async function generateStaticParams() {
  return KITAPLAR.map((k) => ({ kitap: k.slug }));
}

type Props = {
  params: Promise<{ kitap: string }>;
  searchParams: Promise<{ bab?: string }>;
};

export default async function KitapPage({ params, searchParams }: Props) {
  const { kitap: slug } = await params;
  const { bab } = await searchParams;

  const meta = getKitap(slug);
  if (!meta) notFound();

  const chapters = await getChapters(slug);
  const firstId = chapters[0]?.id?.toString() ?? '1';
  const babId = bab || firstId;
  const hadiths = await getHadithsByChapter(slug, babId);
  const current = chapters.find((c) => c.id.toString() === babId) ?? chapters[0];

  return (
    <div className="reader-layout" style={{ display: 'flex', height: 'calc(100vh - 80px)', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ── Sidebar: chapters ── */}
      <ReaderSidebar
        meta={{ ...meta, slug }}
        chapters={chapters}
        babId={babId}
        slug={slug}
      />

      {/* ── Main: hadiths ── */}
      <main className="reader-main" style={{ flex: 1, overflowY: 'auto', padding: '32px 48px 80px' }}>
        {/* Chapter header */}
        <div style={{ maxWidth: 760, marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 1.5, marginBottom: 6 }}>
            BAB {current?.id}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-1)', letterSpacing: -0.5, lineHeight: 1.2 }}>
            {current?.turkishName || current?.englishName}
          </h1>
          {current?.arabicName && (
            <div className="arabic" style={{ fontSize: 20, color: 'var(--text-2)', marginTop: 10 }}>
              {current.arabicName}
            </div>
          )}
          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-3)' }}>
            {hadiths.length} hadis
          </div>
          <div style={{ height: 2, background: `linear-gradient(90deg, ${meta.to}40, transparent)`, marginTop: 16, borderRadius: 2 }} />
        </div>

        {/* Hadith list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 760 }}>
          {hadiths.map((h) => <HadithCard key={h.hadithNumber} hadith={h} color={meta.to} kitap={slug} />)}
          {hadiths.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-3)', fontSize: 15 }}>
              Bu babda hadis bulunamadı.
            </div>
          )}
        </div>

        {/* Prev / Next */}
        {current && (
          <div style={{ display: 'flex', gap: 12, marginTop: 56, maxWidth: 760 }}>
            {current.id > 1 && (
              <Link href={`/${slug}?bab=${current.id - 1}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '10px 20px', background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'var(--text-2)',
                  boxShadow: 'var(--shadow-sm)', cursor: 'pointer',
                }}>← Önceki Bab</div>
              </Link>
            )}
            {current.id < chapters.length && (
              <Link href={`/${slug}?bab=${current.id + 1}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '10px 20px', background: meta.to, borderRadius: 10,
                  fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer',
                }}>Sonraki Bab →</div>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function HadithCard({ hadith, color, kitap }: { hadith: Hadith; color: string; kitap: string }) {
  const no = (hadith.coversNumbers?.length ?? 0) > 1 ? hadith.coversNumbers.join(', ') : hadith.hadithNumber;

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      {/* Header */}
      <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)', flexWrap: 'wrap', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: `${color}12`, border: `1px solid ${color}22`, borderRadius: 7, padding: '3px 11px', fontSize: 12, fontWeight: 700, color }}>
            #{no}
          </div>
          {hadith.grade && (
            <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, background: 'var(--arabic-bg)', padding: '3px 10px', borderRadius: 7 }}>
              {hadith.grade}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <KopyalaButon arabic={hadith.arabic} turkish={hadith.turkish} hadisNo={no} />
          <Link href={`/${kitap}/hadis/${hadith.hadithNumber}`} style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '4px 12px', borderRadius: 7, border: `1px solid ${color}30`,
              background: `${color}10`, fontSize: 12, fontWeight: 700, color,
            }}>Detay →</div>
          </Link>
        </div>
      </div>

      {/* Arabic */}
      <Link href={`/${kitap}/hadis/${hadith.hadithNumber}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ background: 'var(--arabic-bg)', padding: '22px 26px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
          <p className="arabic" style={{ fontSize: 24, color: 'var(--text-1)', lineHeight: 2.4 }}>{hadith.arabic}</p>
        </div>
      </Link>

      {/* Turkish */}
      {hadith.turkish ? (
        <Link href={`/${kitap}/hadis/${hadith.hadithNumber}`} style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{ padding: '18px 26px', cursor: 'pointer' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: 1.5, marginBottom: 10 }}>MEAL</div>
            <p style={{ fontSize: 15, color: 'var(--text-1)', lineHeight: 1.9 }}>{hadith.turkish}</p>
          </div>
        </Link>
      ) : (
        <div style={{ padding: '14px 26px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>🕐</span>
          <span style={{ fontSize: 13, color: 'var(--text-3)', fontStyle: 'italic' }}>Türkçe çeviri yakında eklenecek</span>
        </div>
      )}
    </div>
  );
}

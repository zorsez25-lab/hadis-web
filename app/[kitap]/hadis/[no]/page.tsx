import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getKitap } from '@/lib/kitaplar';
import { loadBook } from '@/lib/hadis-utils';
import { zincirOlustur } from '@/lib/sened-parser';
import { raviById } from '@/lib/ravi-utils';
import KopyalaButon from '@/components/KopyalaButon';
import KeyboardNav from '@/components/KeyboardNav';

type Props = { params: Promise<{ kitap: string; no: string }> };

export default async function HadisDetayPage({ params }: Props) {
  const { kitap: slug, no } = await params;
  const meta = getKitap(slug);
  if (!meta) notFound();

  const book = await loadBook(slug);
  const hadith = book.hadiths.find(h => String(h.hadithNumber) === no);
  if (!hadith) notFound();

  const chapter = book.chapters[hadith.chapterId];
  const sened = await zincirOlustur(hadith.arabic);
  const displayNo = (hadith.coversNumbers?.length ?? 0) > 1 ? hadith.coversNumbers.join(', ') : hadith.hadithNumber;

  const idx = book.hadiths.findIndex(h => String(h.hadithNumber) === no);
  const prev = idx > 0 ? book.hadiths[idx - 1] : null;
  const next = idx < book.hadiths.length - 1 ? book.hadiths[idx + 1] : null;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <KeyboardNav
        prevUrl={prev ? `/${slug}/hadis/${prev.hadithNumber}` : undefined}
        nextUrl={next ? `/${slug}/hadis/${next.hadithNumber}` : undefined}
      />

      {/* ── Compact Header ── */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '0 40px',
      }} className="detail-header-wrap">
        <div className="breadcrumb-wrap" style={{ maxWidth: 860, margin: '0 auto', padding: '16px 0 14px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Link href={`/${slug}`} style={{ textDecoration: 'none' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 8,
              background: `${meta.to}12`, border: `1px solid ${meta.to}25`,
              fontSize: 13, fontWeight: 700, color: meta.to,
            }}>
              {meta.turkishName}
            </span>
          </Link>
          <span style={{ color: 'var(--text-3)', fontSize: 14 }}>›</span>
          <Link href={`/${slug}?bab=${hadith.chapterId}`} style={{ textDecoration: 'none', fontSize: 14, color: 'var(--text-2)', fontWeight: 600 }}>
            {chapter?.turkishName || chapter?.englishName}
          </Link>
          <span style={{ color: 'var(--text-3)', fontSize: 14 }}>›</span>
          <span style={{ fontSize: 14, color: 'var(--text-1)', fontWeight: 700 }}>Hadis #{displayNo}</span>

          <div className="breadcrumb-actions" style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {prev && (
              <Link href={`/${slug}/hadis/${prev.hadithNumber}`} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '5px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-2)', fontSize: 13, fontWeight: 600, color: 'var(--text-2)', cursor: 'pointer' }}>← Önceki</div>
              </Link>
            )}
            {next && (
              <Link href={`/${slug}/hadis/${next.hadithNumber}`} style={{ textDecoration: 'none' }}>
                <div style={{ padding: '5px 14px', borderRadius: 8, border: `1px solid ${meta.to}30`, background: `${meta.to}10`, fontSize: 13, fontWeight: 700, color: meta.to, cursor: 'pointer' }}>Sonraki →</div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="detail-content" style={{ maxWidth: 860, margin: '0 auto', padding: '32px 40px 80px' }}>

        {/* Title */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{
              background: `${meta.to}15`, border: `1px solid ${meta.to}30`,
              borderRadius: 8, padding: '4px 14px',
              fontSize: 14, fontWeight: 800, color: meta.to,
            }}>#{displayNo}</div>
            {hadith.grade && (
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '4px 14px',
                fontSize: 13, fontWeight: 600, color: 'var(--text-2)',
              }}>{hadith.grade}</div>
            )}
          </div>
          <div style={{ height: 3, width: 48, background: `linear-gradient(90deg, ${meta.from}, ${meta.to})`, borderRadius: 2, marginTop: 10 }} />
        </div>

        {/* Arabic */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          marginBottom: 16,
        }}>
          <div style={{
            background: 'var(--arabic-bg)',
            padding: '32px 36px',
            borderBottom: '1px solid var(--border)',
          }}>
            <p className="arabic" style={{ fontSize: 26, color: 'var(--text-1)', lineHeight: 2.5 }}>
              {hadith.arabic}
            </p>
          </div>
          <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end' }}>
            <KopyalaButon arabic={hadith.arabic} turkish={hadith.turkish} hadisNo={displayNo} />
          </div>
        </div>

        {/* Turkish */}
        {hadith.turkish ? (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '28px 32px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 3, height: 20, background: meta.to, borderRadius: 2 }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-3)', letterSpacing: 2 }}>TÜRKÇE MEAL</span>
            </div>
            <p style={{ fontSize: 17, color: 'var(--text-1)', lineHeight: 2, fontWeight: 400 }}>{hadith.turkish}</p>
          </div>
        ) : (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '22px 28px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            <span style={{ fontSize: 24 }}>🕐</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', marginBottom: 3 }}>Türkçe Çeviri Yakında</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Bu kitabın Türkçe meali henüz hazırlanmaktadır.</div>
            </div>
          </div>
        )}

        {/* Sened */}
        {sened.length > 0 && (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '28px 32px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
              <div style={{ width: 3, height: 20, background: '#C9A84C', borderRadius: 2 }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-3)', letterSpacing: 2 }}>SENED ZİNCİRİ</span>
              <span style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: 4 }}>{sened.length} ravi</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {sened.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
                  {/* Timeline */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%', flexShrink: 0, marginTop: 16,
                      background: s.isProphet ? '#C9A84C' : s.raviId ? meta.to : 'var(--border-strong)',
                      boxShadow: s.isProphet ? '0 0 0 3px #C9A84C25' : s.raviId ? `0 0 0 3px ${meta.to}20` : 'none',
                    }} />
                    {i < sened.length - 1 && (
                      <div style={{ width: 2, flex: 1, background: 'var(--border)', minHeight: 16, marginTop: 4 }} />
                    )}
                  </div>
                  {/* Card */}
                  <div style={{ flex: 1, paddingBottom: i < sened.length - 1 ? 12 : 0 }}>
                    <RaviKutu id={s.raviId} isim={s.isim} isProphet={s.isProphet} color={meta.to} slug={slug} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '24px 32px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <div style={{ width: 3, height: 20, background: 'var(--text-3)', borderRadius: 2 }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-3)', letterSpacing: 2 }}>BİLGİLER</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20 }}>
            {[
              { etiket: 'Kitap', deger: meta.turkishName },
              { etiket: 'Hadis No', deger: `#${displayNo}` },
              { etiket: 'Bab', deger: chapter?.turkishName || chapter?.englishName },
              { etiket: 'Derece', deger: hadith.grade },
            ].filter(i => i.deger).map(item => (
              <div key={item.etiket} style={{ borderLeft: '2px solid var(--border)', paddingLeft: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 700, marginBottom: 4, letterSpacing: 0.5 }}>{item.etiket}</div>
                <div style={{ fontSize: 15, color: 'var(--text-1)', fontWeight: 700 }}>{item.deger}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

async function RaviKutu({ id, isim, isProphet, color, slug }: { id?: number; isim: string; isProphet: boolean; color: string; slug: string }) {
  const ravi = id ? await raviById(id) : undefined;
  const cerh = ravi?.cerhTr || ravi?.ibnHacarCerhTr;

  const card = (
    <div style={{
      padding: '12px 16px',
      borderRadius: 12,
      background: isProphet ? '#C9A84C0A' : ravi ? `${color}08` : 'var(--surface-2)',
      border: isProphet ? '1px solid #C9A84C35' : ravi ? `1px solid ${color}20` : '1px solid var(--border)',
      transition: 'all 0.15s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: isProphet ? '#C9A84C' : 'var(--text-1)' }}>
          {isim}
        </span>
        {ravi && id && (
          <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}15`, padding: '2px 8px', borderRadius: 6 }}>
            Profil →
          </span>
        )}
      </div>
      {ravi?.arapca && (
        <div className="arabic" style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 3, lineHeight: 1.6 }}>{ravi.arapca}</div>
      )}
      {cerh && (
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 6, lineHeight: 1.6 }}>
          {cerh.length > 120 ? cerh.slice(0, 120) + '…' : cerh}
        </div>
      )}
      {ravi?.vefat && (
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5 }}>v. {ravi.vefat} · {ravi.tabaka}</div>
      )}
    </div>
  );

  if (id) return <Link href={`/raviler/${id}`} style={{ textDecoration: 'none', display: 'block' }}>{card}</Link>;
  return card;
}

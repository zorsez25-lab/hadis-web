import { notFound } from 'next/navigation';
import Link from 'next/link';
import { raviById, tumRaviler } from '@/lib/ravi-utils';

type Props = { params: Promise<{ id: string }> };

export default async function RaviDetayPage({ params }: Props) {
  const { id } = await params;
  const ravi = await raviById(Number(id));
  if (!ravi) notFound();

  const hocaListesi = (await Promise.all(ravi.hocalar.slice(0, 20).map((hId) => raviById(hId)))).filter(Boolean);
  const talebeListesi = (await Promise.all(ravi.talebeler.slice(0, 20).map((tId) => raviById(tId)))).filter(Boolean);

  const cerh = ravi.cerhTr || ravi.ibnHacarCerhTr || ravi.cerh;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #081C15 0%, #1B4332 55%, #2D6A4F 100%)' }} className="ravi-detail-header-wrap">
        <div className="ravi-detail-header" style={{ maxWidth: 900, margin: '0 auto', padding: '36px 32px 40px' }}>
          <Link href="/raviler" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
            <span style={{ color: 'rgba(183,228,199,0.7)', fontSize: 13 }}>←</span>
            <span style={{ color: 'rgba(183,228,199,0.7)', fontSize: 13, fontWeight: 600 }}>Raviler</span>
          </Link>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#F5EDD0', lineHeight: 1.2 }}>{ravi.isim}</h1>
          {ravi.arapca && (
            <div className="arabic" style={{ fontSize: 22, color: 'rgba(245,237,208,0.7)', marginTop: 6 }}>{ravi.arapca}</div>
          )}
          {ravi.tabaka && (
            <div style={{ marginTop: 10, display: 'inline-block', background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '4px 12px', fontSize: 13, color: '#B7E4C7', fontWeight: 600 }}>
              {ravi.tabaka}
            </div>
          )}
        </div>
      </div>

      <div className="ravi-detail-content" style={{ maxWidth: 900, margin: '0 auto', padding: '36px 32px 80px' }}>
        <div className="ravi-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Bilgiler */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px', gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1.5, marginBottom: 16 }}>BİLGİLER</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {[
                { etiket: 'Doğum', deger: ravi.dogum },
                { etiket: 'Vefat', deger: ravi.vefat },
                { etiket: 'Doğum Yeri', deger: ravi.dogumYeri },
                { etiket: 'Vefat Yeri', deger: ravi.vefatYeri },
              ].filter(i => i.deger).map((item) => (
                <div key={item.etiket}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 3 }}>{item.etiket}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600 }}>{item.deger}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Cerh-Ta'dil */}
          {cerh && (
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px', gridColumn: '1 / -1' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1.5, marginBottom: 16 }}>CERH-TA'DİL</div>
              {ravi.ibnHacarCerhTr && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#2D6A4F', marginBottom: 4 }}>İbn Hacer</div>
                  <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7 }}>{ravi.ibnHacarCerhTr}</p>
                </div>
              )}
              {ravi.zehebiCerhTr && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#9B59B6', marginBottom: 4 }}>Zehebî</div>
                  <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7 }}>{ravi.zehebiCerhTr}</p>
                </div>
              )}
              {!ravi.ibnHacarCerhTr && !ravi.zehebiCerhTr && ravi.cerhTr && (
                <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7 }}>{ravi.cerhTr}</p>
              )}
            </div>
          )}

          {/* Hocalar */}
          {hocaListesi.length > 0 && (
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1.5, marginBottom: 14 }}>
                HOCALARI ({ravi.hocalar.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {hocaListesi.map((h) => h && (
                  <Link key={h.id} href={`/raviler/${h.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: 13, color: '#2D6A4F', fontWeight: 600, padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                      {h.isim}
                    </div>
                  </Link>
                ))}
                {ravi.hocalar.length > 20 && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>+{ravi.hocalar.length - 20} daha</div>
                )}
              </div>
            </div>
          )}

          {/* Talebeler */}
          {talebeListesi.length > 0 && (
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 24px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1.5, marginBottom: 14 }}>
                TALEBELERİ ({ravi.talebeler.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {talebeListesi.map((t) => t && (
                  <Link key={t.id} href={`/raviler/${t.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: 13, color: '#2D6A4F', fontWeight: 600, padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                      {t.isim}
                    </div>
                  </Link>
                ))}
                {ravi.talebeler.length > 20 && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>+{ravi.talebeler.length - 20} daha</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

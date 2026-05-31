import Link from 'next/link';
import { araRavi, Ravi, TabakaFiltre } from '@/lib/ravi-utils';

function tabakaBadge(tabaka: string) {
  if (!tabaka) return null;
  const t = tabaka.toLowerCase();
  let bg = '#E8F0EB', color = '#4A6358';
  if (t.includes('sahab')) { bg = '#FFF3CD'; color = '#856404'; }
  else if (t.includes('tabi')) { bg = '#D1ECF1'; color = '#0C5460'; }
  return { bg, color };
}

function cerhRenk(cerh?: string) {
  if (!cerh) return 'var(--text-muted)';
  const c = cerh.toLowerCase();
  if (c.includes('güvenilir') || c.includes('sika') || c.includes('sahâbî')) return '#2D6A4F';
  if (c.includes('zayıf') || c.includes('metruk') || c.includes('münker')) return '#DC3545';
  if (c.includes('saduk') || c.includes('hasan')) return '#FFA500';
  return 'var(--text-secondary)';
}

export default async function RaviListesi({ sorgu, filtre }: { sorgu: string; filtre: TabakaFiltre }) {
  const raviler = await araRavi(sorgu, filtre);
  const gosterilen = raviler.slice(0, 100);

  return (
    <>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 20 }}>
        {raviler.length.toLocaleString('tr-TR')} ravi{raviler.length > 100 ? ' (ilk 100 gösteriliyor)' : ''}
      </div>
      <div className="ravi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
        {gosterilen.map((ravi) => {
          const badge = tabakaBadge(ravi.tabaka);
          const cerh = ravi.cerhTr || ravi.ibnHacarCerhTr || ravi.cerh;
          return (
            <Link key={ravi.id} href={`/raviler/${ravi.id}`} style={{ textDecoration: 'none' }}>
              <div className="ravi-card" style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '16px 18px',
                boxShadow: '0 2px 10px var(--shadow)',
                transition: 'transform 0.12s, box-shadow 0.12s',
                cursor: 'pointer',
                height: '100%',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {ravi.isim}
                    </div>
                    {ravi.arapca && (
                      <div className="arabic" style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 3 }}>
                        {ravi.arapca}
                      </div>
                    )}
                  </div>
                  {badge && (
                    <span style={{
                      background: badge.bg,
                      color: badge.color,
                      borderRadius: 8,
                      padding: '3px 9px',
                      fontSize: 11,
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}>{ravi.tabaka}</span>
                  )}
                </div>
                {cerh && (
                  <div style={{ fontSize: 12, color: cerhRenk(cerh), fontWeight: 600, marginTop: 6 }}>
                    {cerh.length > 80 ? cerh.slice(0, 80) + '…' : cerh}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>
                  {ravi.vefat && <span>v. {ravi.vefat}</span>}
                  {ravi.hocalar?.length > 0 && <span>{ravi.hocalar.length} hoca</span>}
                  {ravi.talebeler?.length > 0 && <span>{ravi.talebeler.length} talebe</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <style>{`.ravi-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px var(--shadow) !important; }`}</style>
    </>
  );
}

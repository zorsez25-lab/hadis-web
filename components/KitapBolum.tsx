'use client';
import Link from 'next/link';
import { useState } from 'react';
import { BookMeta } from '@/lib/types';

function KitapKarti({ k }: { k: BookMeta }) {
  return (
    <Link href={`/${k.slug}`} style={{ textDecoration: 'none' }}>
      <div className="book-card" style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.18s ease',
        cursor: 'pointer',
      }}>
        <div style={{ height: 4, background: `linear-gradient(90deg, ${k.from}, ${k.to})` }} />
        <div style={{ padding: '22px 24px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', letterSpacing: -0.3 }}>{k.turkishName}</h3>
              <div className="arabic" style={{ fontSize: 17, color: 'var(--text-2)', marginTop: 3, lineHeight: 1.6 }}>{k.arabicName}</div>
            </div>
            <div style={{
              background: `${k.to}15`, border: `1px solid ${k.to}25`,
              borderRadius: 8, padding: '5px 10px',
              fontSize: 12, fontWeight: 700, color: k.to, whiteSpace: 'nowrap',
            }}>
              {k.totalHadiths.toLocaleString('tr-TR')}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500 }}>
              {k.translationPending ? '🕐 Çeviri Yakında' : 'Hadisleri Oku'}
            </span>
            <div style={{ width: 28, height: 28, background: `${k.to}15`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: k.to, fontSize: 13, fontWeight: 700 }}>→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function KitapBolum({
  baslik, altBaslik, kitaplar, defaultAcik = true,
}: {
  baslik: string;
  altBaslik: string;
  kitaplar: BookMeta[];
  defaultAcik?: boolean;
}) {
  const [acik, setAcik] = useState(defaultAcik);

  return (
    <div style={{ marginBottom: 48 }}>
      {/* Tıklanabilir başlık */}
      <button
        onClick={() => setAcik(!acik)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '14px 20px', borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: acik ? 20 : 0,
          transition: 'all 0.15s',
        } as React.CSSProperties}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>📚</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-1)' }}>{baslik}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{altBaslik} · {kitaplar.length} eser</div>
          </div>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: 'var(--text-3)',
          transform: acik ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
          flexShrink: 0,
        }}>▼</div>
      </button>

      {/* Kitap grid */}
      {acik && (
        <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {kitaplar.map((k) => <KitapKarti key={k.slug} k={k} />)}
        </div>
      )}
    </div>
  );
}

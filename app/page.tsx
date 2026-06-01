import Link from 'next/link';
import { KITAPLAR, BookMeta } from '@/lib/kitaplar';
import SearchBar from '@/components/SearchBar';

export default function HomePage() {
  const total = KITAPLAR.reduce((s, k) => s + k.totalHadiths, 0).toLocaleString('tr-TR');
  const tisa = KITAPLAR.filter(k => k.kategori === 'kutubu-tisa');
  const secme = KITAPLAR.filter(k => k.kategori === 'secme-eserler');

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg, #071510 0%, #0F2D1F 40%, #1B4332 75%, #2D6A4F 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="hero-inner" style={{ maxWidth: 1160, margin: '0 auto', padding: '72px 40px 80px' }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, background: '#52B788', borderRadius: '50%' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(183,228,199,0.6)', letterSpacing: 2 }}>KÜTÜBÜ TİS'A</span>
            </div>
            <h1 className="hero-title" style={{ fontSize: 52, fontWeight: 900, color: '#F0EAD6', letterSpacing: -1.5, lineHeight: 1.05, marginBottom: 18 }}>
              Hadis<br />Külliyatı
            </h1>
            <p className="hero-subtitle" style={{ fontSize: 17, color: 'rgba(183,228,199,0.65)', lineHeight: 1.8, marginBottom: 36, maxWidth: 460 }}>
              Dokuz temel hadis kitabı ve seçme eserler — sened zinciri analizi, ravi biyografileri ve gelişmiş arama ile birlikte.
            </p>
            <SearchBar placeholder="Kelime, konu veya hadis numarası ara..." />
          </div>

          <div className="hero-stats" style={{ display: 'flex', gap: 16, marginTop: 48, flexWrap: 'wrap' }}>
            {[
              { n: total, l: 'Rivayet' },
              { n: '9', l: 'Temel Eser' },
              { n: '97+', l: 'Konu Başlığı' },
              { n: '18.000+', l: 'Ravi Kaydı' },
            ].map(s => (
              <div key={s.l} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 22px' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#B7E4C7', letterSpacing: -0.5 }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'rgba(183,228,199,0.45)', fontWeight: 600, marginTop: 2, letterSpacing: 0.5 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Books */}
      <div className="books-section" style={{ maxWidth: 1160, margin: '0 auto', padding: '56px 40px 100px' }}>

        {/* Kütübü Tis'a */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)' }}>Kütübü Tis&apos;a</h2>
            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>9 eser</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>الكتب التسعة — Dokuz temel hadis kitabı</div>
          <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {tisa.map((k) => <KitapKarti key={k.slug} k={k} />)}
          </div>
        </div>

        {/* Seçme Eserler */}
        {secme.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)' }}>Seçme Eserler</h2>
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{secme.length} eser</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>Müstakil hadis eserleri</div>
            <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {secme.map((k) => <KitapKarti key={k.slug} k={k} />)}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .book-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg) !important;
          border-color: var(--border-strong) !important;
        }
      `}</style>

      <div className="footer" style={{ borderTop: '1px solid var(--border)', padding: '20px 40px', display: 'flex', justifyContent: 'center', gap: 32 }}>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Hadis Külliyatı</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Kütübü Tis&apos;a</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Narrator Disambiguation</span>
      </div>
    </div>
  );
}

function KitapKarti({ k }: { k: BookMeta }) {
  return (
    <Link key={k.slug} href={`/${k.slug}`} style={{ textDecoration: 'none' }}>
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
              background: `${k.to}15`,
              border: `1px solid ${k.to}25`,
              borderRadius: 8,
              padding: '5px 10px',
              fontSize: 12,
              fontWeight: 700,
              color: k.to,
              whiteSpace: 'nowrap',
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

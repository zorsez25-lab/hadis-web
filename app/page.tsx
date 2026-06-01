import { KITAPLAR } from '@/lib/kitaplar';
import SearchBar from '@/components/SearchBar';
import KitapBolum from '@/components/KitapBolum';

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
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(183,228,199,0.6)', letterSpacing: 2 }}>KÜTÜBÜ TİS&apos;A</span>
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
        <KitapBolum
          baslik="Kütübü Tis'a"
          altBaslik="الكتب التسعة — Dokuz temel hadis kitabı"
          kitaplar={tisa}
          defaultAcik={true}
        />
        {secme.length > 0 && (
          <KitapBolum
            baslik="Seçme Eserler"
            altBaslik="Müstakil hadis eserleri"
            kitaplar={secme}
            defaultAcik={true}
          />
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

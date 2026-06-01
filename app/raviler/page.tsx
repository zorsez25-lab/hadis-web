import { Suspense } from 'react';
import RaviArama from './RaviArama';
import RaviListesi from './RaviListesi';
import { TabakaFiltre } from '@/lib/ravi-utils';

type Props = { searchParams: Promise<{ q?: string; filtre?: string }> };

export default async function RavilerPage({ searchParams }: Props) {
  const { q, filtre } = await searchParams;
  const sorgu = q?.trim() ?? '';
  const aktifFiltre = (filtre as TabakaFiltre) || 'tumu';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #081C15 0%, #1B4332 55%, #2D6A4F 100%)' }}>
        <div className="raviler-header" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 44px' }}>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#F5EDD0', marginBottom: 22 }}>Raviler</h1>
          <RaviArama initialValue={sorgu} initialFiltre={aktifFiltre} />
        </div>
      </div>
      <div className="raviler-content" style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 40px 80px' }}>
        <Suspense key={`${sorgu}-${aktifFiltre}`} fallback={
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: 36, height: 36, border: '3px solid var(--border)',
              borderTop: '3px solid #2D6A4F', borderRadius: '50%',
              margin: '0 auto 12px', animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        }>
          <RaviListesi sorgu={sorgu} filtre={aktifFiltre} />
        </Suspense>
      </div>
    </div>
  );
}

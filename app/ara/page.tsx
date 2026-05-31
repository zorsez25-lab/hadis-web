import { Suspense } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import SearchResults from './SearchResults';

type Props = { searchParams: Promise<{ q?: string }> };

export default async function AraPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #081C15 0%, #1B4332 55%, #2D6A4F 100%)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 32px 40px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#F5EDD0', marginBottom: 20 }}>Hadis Ara</h1>
          <SearchBar placeholder="Hadis no, kelime veya konu ara..." initialValue={query} />
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 32px 80px' }}>
        <Suspense key={query} fallback={
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: 40, height: 40,
              border: '3px solid var(--border)',
              borderTop: '3px solid #2D6A4F',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 0.8s linear infinite',
            }} />
            <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Aranıyor...</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        }>
          <SearchResults query={query} />
        </Suspense>
      </div>
    </div>
  );
}

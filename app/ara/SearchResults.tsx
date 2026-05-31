import Link from 'next/link';
import { searchHadiths } from '@/lib/hadis-utils';
import { getKitap } from '@/lib/kitaplar';

export default async function SearchResults({ query }: { query: string }) {
  if (query.length < 2) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 15 }}>
        En az 2 karakter girin.
      </div>
    );
  }

  const results = await searchHadiths(query);

  if (results.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
        <div style={{ fontSize: 16, color: 'var(--text-muted)' }}>
          &quot;<strong style={{ color: 'var(--text-primary)' }}>{query}</strong>&quot; için sonuç bulunamadı.
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 20 }}>
        {results.length} sonuç{results.length === 50 ? ' (ilk 50 gösteriliyor)' : ''}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {results.map(({ hadith, bookSlug, bookName, chapterName }) => {
          const meta = getKitap(bookSlug);
          const color = meta?.to ?? '#2D6A4F';
          const displayNo = (hadith.coversNumbers?.length ?? 0) > 1
            ? hadith.coversNumbers.join(', ')
            : hadith.hadithNumber;

          return (
            <Link
              key={`${bookSlug}-${hadith.hadithNumber}`}
              href={`/${bookSlug}?bab=${hadith.chapterId}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="result-card" style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 2px 12px var(--shadow)',
                transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                cursor: 'pointer',
              }}>
                <div style={{
                  padding: '10px 18px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}>
                  <span style={{
                    background: `${color}18`,
                    border: `1px solid ${color}30`,
                    borderRadius: 8,
                    padding: '3px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    color,
                  }}>{bookName}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{chapterName}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>No: {displayNo}</span>
                </div>
                <div style={{ padding: '14px 18px', background: 'var(--arabic-bg)', borderBottom: '1px solid var(--border)' }}>
                  <p className="arabic" style={{
                    fontSize: 18,
                    color: 'var(--text-primary)',
                    lineHeight: 2,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>{hadith.arabic}</p>
                </div>
                {hadith.turkish && (
                  <div style={{ padding: '12px 18px' }}>
                    <p style={{
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}>{hadith.turkish}</p>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
      <style>{`.result-card:hover { transform: translateY(-2px); box-shadow: 0 6px 24px var(--shadow) !important; }`}</style>
    </>
  );
}

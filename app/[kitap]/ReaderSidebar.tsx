'use client';
import Link from 'next/link';
import { useState } from 'react';

type Chapter = { id: number; turkishName?: string; englishName?: string; arabicName?: string };
type Meta = { turkishName: string; arabicName: string; from: string; to: string; totalHadiths: number; slug: string };

export default function ReaderSidebar({
  meta, chapters, babId, slug,
}: {
  meta: Meta; chapters: Chapter[]; babId: string; slug: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="reader-sidebar" style={{
        width: 280,
        flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Book header */}
        <div style={{
          background: `linear-gradient(160deg, ${meta.from}, ${meta.to})`,
          padding: '16px 18px 14px',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: -0.3 }}>{meta.turkishName}</div>
          <div className="arabic" style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', marginTop: 2, lineHeight: 1.6 }}>{meta.arabicName}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
              {chapters.length} bab · {meta.totalHadiths.toLocaleString('tr-TR')} hadis
            </div>
            {/* Mobile toggle button */}
            <button
              className="sidebar-toggle-btn"
              onClick={() => setOpen(!open)}
              style={{
                display: 'none',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 8,
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                padding: '4px 10px',
                cursor: 'pointer',
              }}
            >
              {open ? 'Kapat ▲' : 'Bablar ▼'}
            </button>
          </div>
        </div>

        {/* Chapter list */}
        <div
          className="chapter-list"
          style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}
        >
          {chapters.map((ch) => {
            const active = ch.id.toString() === babId;
            return (
              <Link key={ch.id} href={`/${slug}?bab=${ch.id}`} style={{ textDecoration: 'none', display: 'block' }} onClick={() => setOpen(false)}>
                <div style={{
                  padding: '9px 14px 9px 16px',
                  background: active ? `${meta.to}14` : 'transparent',
                  borderLeft: active ? `3px solid ${meta.to}` : '3px solid transparent',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: active ? meta.to : 'var(--text-3)', minWidth: 24, paddingTop: 1, flexShrink: 0 }}>
                    {ch.id}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? 'var(--text-1)' : 'var(--text-2)', lineHeight: 1.45 }}>
                    {ch.turkishName || ch.englishName}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </aside>

      <style>{`
        @media (max-width: 900px) {
          .sidebar-toggle-btn { display: block !important; }
          .chapter-list {
            display: ${open ? 'block' : 'none'};
            max-height: 280px;
          }
          .reader-sidebar {
            height: auto !important;
          }
        }
      `}</style>
    </>
  );
}

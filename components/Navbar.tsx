'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';


export default function Navbar() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (q) { router.push(`/ara?q=${encodeURIComponent(q)}`); setShowSearch(false); setSearch(''); setMenuOpen(false); }
  };

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100, height: 64,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 20px', height: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9, marginRight: 12, flexShrink: 0 }} onClick={() => setMenuOpen(false)}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>📖</div>
            <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-1)', letterSpacing: -0.3 }}>Hadis Külliyatı</span>
          </Link>

          {/* Divider - desktop only */}
          <div className="navbar-divider" style={{ width: 1, height: 20, background: 'var(--border)', marginRight: 6 }} />

          {/* Nav links - desktop */}
          <div className="navbar-links" style={{ display: 'flex', gap: 2, flex: 1, alignItems: 'center' }}>
            <NavLink href="/" label="Kitaplar" />
            <NavLink href="/raviler" label="Raviler" accent />
          </div>

          {/* Spacer on mobile */}
          <div style={{ flex: 1 }} className="navbar-spacer" />

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {showSearch ? (
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: 6 }}>
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onBlur={() => { if (!search) setShowSearch(false); }}
                  placeholder="Ara..."
                  style={{
                    padding: '6px 12px', borderRadius: 8,
                    border: '1.5px solid var(--border-strong)',
                    background: 'var(--surface-2)',
                    color: 'var(--text-1)', fontSize: 13, outline: 'none', width: 160,
                    fontFamily: 'inherit',
                  }}
                />
                <button type="submit" style={{
                  padding: '6px 12px', borderRadius: 8, border: 'none',
                  background: 'var(--primary)', color: '#fff', fontSize: 13,
                  fontWeight: 700, cursor: 'pointer',
                }}>Ara</button>
              </form>
            ) : (
              <IconBtn onClick={() => setShowSearch(true)} title="Ara">🔍</IconBtn>
            )}
            <IconBtn onClick={toggleTheme} title="Tema">{dark ? '☀️' : '🌙'}</IconBtn>
            {/* Hamburger - mobile only */}
            <button
              className="hamburger-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              title="Menü"
              style={{
                display: 'none',
                width: 38, height: 38, borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--surface-2)',
                cursor: 'pointer', fontSize: 18,
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="mobile-menu-overlay"
          style={{
            position: 'fixed', top: 64, left: 0, right: 0, bottom: 0,
            background: 'var(--surface)', zIndex: 99,
            overflowY: 'auto',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div style={{ padding: '16px 20px' }}>
            {/* Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Hadis ara..."
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 10,
                  border: '1.5px solid var(--border-strong)',
                  background: 'var(--surface-2)',
                  color: 'var(--text-1)', fontSize: 15, outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <button type="submit" style={{
                padding: '10px 18px', borderRadius: 10, border: 'none',
                background: 'var(--primary)', color: '#fff', fontSize: 14,
                fontWeight: 700, cursor: 'pointer',
              }}>Ara</button>
            </form>

            {/* Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <MobileLink href="/" label="Kitaplar" onClick={() => setMenuOpen(false)} />
              <MobileLink href="/raviler" label="Raviler" onClick={() => setMenuOpen(false)} accent />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .hamburger-btn { display: flex !important; }
          .navbar-links { display: none !important; }
          .navbar-divider { display: none !important; }
          .navbar-spacer { display: flex !important; }
        }
        @media (min-width: 641px) {
          .navbar-spacer { display: none !important; }
          .mobile-menu-overlay { display: none !important; }
        }
      `}</style>
    </>
  );
}

function NavLink({ href, label, accent }: { href: string; label: string; accent?: boolean }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        padding: '6px 11px', borderRadius: 8,
        fontSize: 14, fontWeight: accent ? 700 : 500,
        color: accent ? 'var(--primary)' : 'var(--text-2)',
        background: accent ? 'var(--arabic-bg)' : 'transparent',
        transition: 'background 0.12s, color 0.12s',
      }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = 'var(--arabic-bg)';
          el.style.color = 'var(--text-1)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = accent ? 'var(--arabic-bg)' : 'transparent';
          el.style.color = accent ? 'var(--primary)' : 'var(--text-2)';
        }}
      >{label}</div>
    </Link>
  );
}

function MobileLink({ href, label, onClick, accent }: { href: string; label: string; onClick: () => void; accent?: boolean }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }} onClick={onClick}>
      <div style={{
        padding: '13px 16px', borderRadius: 12,
        fontSize: 16, fontWeight: accent ? 700 : 500,
        color: accent ? 'var(--primary)' : 'var(--text-1)',
        background: accent ? 'var(--arabic-bg)' : 'transparent',
        border: accent ? '1px solid var(--border)' : '1px solid transparent',
      }}>{label}</div>
    </Link>
  );
}

function IconBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: 38, height: 38, borderRadius: 10,
      border: '1px solid var(--border)',
      background: 'var(--surface-2)',
      cursor: 'pointer', fontSize: 15,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</button>
  );
}

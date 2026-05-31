'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (q) { router.push(`/ara?q=${encodeURIComponent(q)}`); setShowSearch(false); setSearch(''); }
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100, height: 80,
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 28px', height: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9, marginRight: 16 }}>
          <div style={{
            width: 42, height: 42,
            background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>📖</div>
          <span style={{ fontSize: 19, fontWeight: 800, color: 'var(--text-1)', letterSpacing: -0.3 }}>Hadis Külliyatı</span>
        </Link>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: 'var(--border)', marginRight: 8 }} />

        {/* Nav links */}
        <div className="navbar-links" style={{ display: 'flex', gap: 2, flex: 1, alignItems: 'center' }}>
          <NavLink href="/raviler" label="Raviler" accent />
          {[
            { slug: 'bukhari', label: 'Buhârî' },
            { slug: 'muslim', label: 'Müslim' },
            { slug: 'tirmizi', label: 'Tirmizî' },
            { slug: 'ebudavud', label: 'Ebû Dâvûd' },
            { slug: 'ibnmace', label: 'İbn Mâce' },
            { slug: 'nesai', label: 'Nesâî' },
          ].map(k => <NavLink key={k.slug} href={`/${k.slug}`} label={k.label} />)}
        </div>

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
                  padding: '6px 13px', borderRadius: 8,
                  border: '1.5px solid var(--border-strong)',
                  background: 'var(--surface-2)',
                  color: 'var(--text-1)', fontSize: 13, outline: 'none', width: 200,
                  fontFamily: 'inherit',
                }}
              />
              <button type="submit" style={{
                padding: '6px 14px', borderRadius: 8, border: 'none',
                background: 'var(--primary)', color: '#fff', fontSize: 13,
                fontWeight: 700, cursor: 'pointer',
              }}>Ara</button>
            </form>
          ) : (
            <IconBtn onClick={() => setShowSearch(true)} title="Ara">🔍</IconBtn>
          )}
          <IconBtn onClick={toggleTheme} title="Tema">{dark ? '☀️' : '🌙'}</IconBtn>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label, accent }: { href: string; label: string; accent?: boolean }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        padding: '7px 13px', borderRadius: 8,
        fontSize: 15, fontWeight: accent ? 700 : 500,
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

function IconBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: 42, height: 42, borderRadius: 10,
      border: '1px solid var(--border)',
      background: 'var(--surface-2)',
      cursor: 'pointer', fontSize: 15,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</button>
  );
}

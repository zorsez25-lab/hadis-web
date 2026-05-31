'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar({ placeholder = 'Hadis ara...', initialValue = '' }: { placeholder?: string; initialValue?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/ara?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, maxWidth: 560, width: '100%' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          padding: '12px 18px',
          borderRadius: 12,
          border: '1.5px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: 15,
          outline: 'none',
          fontFamily: 'Inter, sans-serif',
        }}
        onFocus={(e) => (e.target.style.border = '1.5px solid rgba(255,255,255,0.5)')}
        onBlur={(e) => (e.target.style.border = '1.5px solid rgba(255,255,255,0.2)')}
      />
      <button
        type="submit"
        style={{
          padding: '12px 22px',
          borderRadius: 12,
          border: 'none',
          background: '#52B788',
          color: '#fff',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          whiteSpace: 'nowrap',
        }}
      >
        Ara
      </button>
    </form>
  );
}

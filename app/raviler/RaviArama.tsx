'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TabakaFiltre } from '@/lib/ravi-utils';

const FILTRELER: { key: TabakaFiltre; label: string; renk: string }[] = [
  { key: 'tumu',      label: 'Tümü',       renk: '#2D6A4F' },
  { key: 'sahabe',    label: 'Sahabe',     renk: '#C9A84C' },
  { key: 'tabiun',    label: 'Tabiun',     renk: '#2980B9' },
  { key: 'muhaddis',  label: 'Muhaddis',   renk: '#8E44AD' },
  { key: 'guvenilir', label: 'Güvenilir',  renk: '#27AE60' },
  { key: 'zayif',     label: 'Zayıf',      renk: '#E74C3C' },
];

export default function RaviArama({ initialValue, initialFiltre }: { initialValue: string; initialFiltre: TabakaFiltre }) {
  const router = useRouter();
  const [input, setInput] = useState(initialValue);
  const [filtre, setFiltre] = useState<TabakaFiltre>(initialFiltre);

  const guncelle = (yeniInput: string, yeniFiltre: TabakaFiltre) => {
    const params = new URLSearchParams();
    if (yeniInput.trim()) params.set('q', yeniInput.trim());
    if (yeniFiltre !== 'tumu') params.set('filtre', yeniFiltre);
    router.push(`/raviler?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    guncelle(input, filtre);
  };

  const handleFiltre = (f: TabakaFiltre) => {
    setFiltre(f);
    guncelle(input, f);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, maxWidth: 560, marginBottom: 20 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ravi adı veya Arapça isim ara..."
          style={{
            flex: 1, padding: '11px 18px', borderRadius: 11,
            border: '1.5px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff', fontSize: 15, outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button type="submit" style={{
          padding: '11px 24px', borderRadius: 11, border: 'none',
          background: '#52B788', color: '#fff', fontSize: 15,
          fontWeight: 700, cursor: 'pointer',
        }}>Ara</button>
      </form>

      {/* Filtre butonları */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {FILTRELER.map((f) => {
          const aktif = filtre === f.key;
          return (
            <button
              key={f.key}
              onClick={() => handleFiltre(f.key)}
              style={{
                padding: '6px 16px', borderRadius: 20,
                border: aktif ? `2px solid ${f.renk}` : '2px solid rgba(255,255,255,0.15)',
                background: aktif ? f.renk : 'rgba(255,255,255,0.08)',
                color: aktif ? '#fff' : 'rgba(255,255,255,0.7)',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

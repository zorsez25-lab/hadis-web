'use client';
import { useState } from 'react';

export default function KopyalaButon({ arabic, turkish, hadisNo }: { arabic: string; turkish?: string; hadisNo: string }) {
  const [copied, setCopied] = useState(false);

  const kopyala = async () => {
    const metin = [
      arabic,
      turkish ? `\n${turkish}` : '',
      `\n(Hadis No: ${hadisNo})`,
    ].join('');
    await navigator.clipboard.writeText(metin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={kopyala}
      title="Kopyala"
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '4px 12px', borderRadius: 7,
        border: '1px solid var(--border)',
        background: copied ? '#2D6A4F18' : 'var(--surface-2)',
        color: copied ? '#2D6A4F' : 'var(--text-3)',
        fontSize: 12, fontWeight: 600, cursor: 'pointer',
        transition: 'all 0.15s', fontFamily: 'inherit',
      }}
    >
      {copied ? '✓ Kopyalandı' : '⎘ Kopyala'}
    </button>
  );
}

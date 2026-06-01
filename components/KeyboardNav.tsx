'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KeyboardNav({ prevUrl, nextUrl }: { prevUrl?: string; nextUrl?: string }) {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft' && prevUrl) router.push(prevUrl);
      if (e.key === 'ArrowRight' && nextUrl) router.push(nextUrl);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prevUrl, nextUrl, router]);

  return null;
}

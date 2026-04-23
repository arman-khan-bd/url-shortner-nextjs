'use client';
import { UrlShortenerForm } from '@/components/url-shortener-form';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <main className="container flex-grow flex items-center justify-center">
        <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
      </main>
    );
  }

  return (
    <main className="container flex-grow flex flex-col items-center p-4 gap-8 my-8">
      <div className="w-full max-w-2xl">
        <UrlShortenerForm />
      </div>
    </main>
  );
}

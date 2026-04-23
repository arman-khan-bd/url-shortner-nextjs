'use client';
import { UrlShortenerForm } from '@/components/url-shortener-form';
import { useUser } from '@/firebase';
import { redirect } from 'next/navigation';

export default function Home() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <main className="container flex-grow flex items-center justify-center">
        <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
      </main>
    );
  }

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="container flex-grow flex flex-col items-center p-4 gap-8 my-8">
      <div className="w-full max-w-2xl">
        <UrlShortenerForm />
      </div>
    </main>
  );
}

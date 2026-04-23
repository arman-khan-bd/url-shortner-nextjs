'use client';
import { UrlShortenerForm } from '@/components/url-shortener-form';
import { useUser } from '@/firebase';
import { redirect } from 'next/navigation';

export default function Home() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        {/* You can add a loading spinner here */}
      </main>
    );
  }

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <UrlShortenerForm />
      </div>
    </main>
  );
}

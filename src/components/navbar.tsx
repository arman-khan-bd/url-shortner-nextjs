'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon } from 'lucide-react';
import { useUser } from '@/firebase';
import { UserNav } from './user-nav';
import { Skeleton } from './ui/skeleton';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from './ui/sidebar';

export function Navbar() {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {isDashboard && <SidebarTrigger className="sm:hidden mr-4" />}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg mr-6">
          <LinkIcon className="w-7 h-7 text-primary" />
          <span >UrlHum</span>
        </Link>
        <div className="flex-1">
            {/* Future nav links can go here */}
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : user ? (
            <>
              {!isDashboard && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              )}
              <UserNav />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

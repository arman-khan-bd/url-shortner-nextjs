'use client';
import { redirect } from 'next/navigation';
import { useUserProfile } from '@/hooks/use-user-profile';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import { AdminNav } from '@/components/admin-nav';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Navbar } from '@/components/navbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, userProfile, loading } = useUserProfile();

  if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="p-4 border rounded-lg flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className='space-y-2'>
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                </div>
            </div>
        </div>
    )
  }

  if (!user) {
    redirect('/login');
  }

  if (userProfile?.role !== 'admin') {
      redirect('/dashboard');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Link href="/admin" className="flex items-center gap-2 font-semibold text-lg">
                <Shield className="w-7 h-7 text-primary" />
                <span className="group-data-[collapsible=icon]:hidden">Admin</span>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <AdminNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Navbar />
        <main className="p-4 sm:p-6 space-y-4">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

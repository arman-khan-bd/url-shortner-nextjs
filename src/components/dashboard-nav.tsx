'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Home, Link as LinkIcon, Shield } from 'lucide-react';
import { useUserProfile } from '@/hooks/use-user-profile';
import { SidebarMenuSkeleton } from '@/components/ui/sidebar';


const userLinks = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/urls', label: 'My Short URLs', icon: LinkIcon },
];

const adminLink = { href: '/admin', label: 'Admin', icon: Shield };

export function DashboardNav() {
  const pathname = usePathname();
  const { userProfile, loading } = useUserProfile();

  const links = [...userLinks];
  if (userProfile?.role === 'admin') {
    links.push(adminLink);
  }

  if (loading) {
    return (
        <SidebarMenu>
            <SidebarMenuSkeleton showIcon />
            <SidebarMenuSkeleton showIcon />
        </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href}
            tooltip={link.label}
          >
            <Link href={link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

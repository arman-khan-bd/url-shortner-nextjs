'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, Users, Link as LinkIcon, ArrowLeft } from 'lucide-react';

const links = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/links', label: 'Links', icon: LinkIcon },
];

const backLink = { href: '/dashboard', label: 'Back to Dashboard', icon: ArrowLeft };

export function AdminNav() {
  const pathname = usePathname();

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
      <SidebarMenuItem className="mt-auto">
          <SidebarMenuButton
            asChild
            tooltip={backLink.label}
            variant="outline"
          >
            <Link href={backLink.href}>
              <backLink.icon />
              <span>{backLink.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
    </SidebarMenu>
  );
}

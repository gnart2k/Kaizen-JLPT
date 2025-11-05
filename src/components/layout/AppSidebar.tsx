'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, BarChart3, Home, GraduationCap, Settings, ListChecks, Compass, ListTodo } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { UserButton } from '@/components/common/UserButton';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/practice', label: 'Practice', icon: GraduationCap },
  { href: '/mock-test', label: 'Mock Test', icon: ListChecks },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/library', label: 'Library', icon: Book },
  { href: '/questions', label: 'Questions', icon: ListTodo },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0 rounded-lg">
            <Compass className="h-6 w-6 text-primary" />
          </Button>
          <h1 className="text-xl font-semibold font-headline">Kaizen JLPT</h1>
          <div className="ml-auto hidden lg:block">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label, side: 'right', align: 'center' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className='mb-2'>
            <UserButton />
            {/* <SidebarMenuButton */}
            {/*   asChild */}
            {/*   isActive={pathname.startsWith('/settings')} */}
            {/*   tooltip={{ children: 'Settings', side: 'right', align: 'center' }} */}
            {/* > */}
            {/*   <Link href="/settings"> */}
            {/*     <Settings /> */}
            {/*     <span>Settings</span> */}
            {/*   </Link> */}
            {/* </SidebarMenuButton> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

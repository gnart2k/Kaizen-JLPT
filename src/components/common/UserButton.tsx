'use client';

import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { useUserStore } from '@/store/user-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { toast } from '@/hooks/use-toast';

export function UserButton() {
  const { user, isAuthenticated, isLoading } = useUser();
  const setUser = useUserStore((s) => s.setUser);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        setUser(null);
        toast({
          title: 'Logged out',
          description: 'You have been successfully logged out.',
        });
        router.push('/auth/login');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading || !isAuthenticated) {
    // Render a skeleton or nothing if loading or not authenticated
    return null;
  }

  const userEmail = user?.email || 'User';
  const fallback = userEmail.charAt(0).toUpperCase();

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild className='p-2'>
        <SidebarMenuButton
          className="w-full justify-start"
          tooltip={{ children: 'User Profile', side: 'right', align: 'center' }}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start overflow-hidden">
            <span className="truncate font-medium">{userEmail}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {user?.role} - {user?.plan}
            </span>
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userEmail}</p>
            <p className="text-xs leading-none text-muted-foreground capitalize">
              {user?.role} - {user?.plan}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

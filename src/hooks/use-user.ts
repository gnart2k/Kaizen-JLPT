'use client';

import { useUserStore, User } from '@/store/user-store';

interface UseUserResult {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
}

export function useUser(): UseUserResult {
  const user = useUserStore((s) => s.user);
  const isLoading = useUserStore((s) => s.isLoading);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const refetch = useUserStore((s) => s.fetchUser);

  return { user, isLoading, isAuthenticated, refetch };
}


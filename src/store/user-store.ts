import { create } from 'zustand';
import { AuthTokenPayload } from '@/lib/auth';

// Define the user type based on the JWT payload
export interface User extends AuthTokenPayload {}

interface UserState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

/**
 * Fetches the current user's data from the /api/auth/me endpoint.
 */
const fetchUserApi = async (): Promise<User | null> => {
  try {
    const response = await fetch('/api/auth/me');
    if (response.ok) {
      const data = await response.json();
      // The API returns a user object that matches the AuthTokenPayload structure
      return data.user as User;
    }
    // If response is 401 or 403, it means unauthenticated/unauthorized
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setIsLoading: (isLoading) => set({ isLoading }),

  fetchUser: async () => {
    set({ isLoading: true });
    const user = await fetchUserApi();
    set({ user, isAuthenticated: !!user, isLoading: false });
  },
}));

// Initial fetch when the store is created
// This is a common pattern in Next.js/Zustand to hydrate the store
if (typeof window !== 'undefined') {
  useUserStore.getState().fetchUser();
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '@/types'
import { AuthService } from '@/services/auth.service'

interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  phone?: string
  wilaya?: string
  avatar?: string
  isPro?: boolean
  partnerStatus?: 'pending' | 'active' | 'suspended'
  businessName?: string
  plan?: 'simple' | 'pro'
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (user: AuthUser) => void
  logout: () => void
  updateUser: (updates: Partial<AuthUser>) => void
  setLoading: (loading: boolean) => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user) =>
        set({ user, isAuthenticated: true, isLoading: false }),

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          // Clear the cookie used by middleware
          document.cookie = 'access_token=; path=/; max-age=0';
        }
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      initialize: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          set({ isLoading: true });
          const userProfile = await AuthService.getProfile();
          
          set({
            user: {
              id: userProfile.id,
              email: userProfile.email,
              firstName: userProfile.firstName,
              lastName: userProfile.lastName,
              role: (userProfile.role as string).toLowerCase() as any,
              phone: userProfile.phone,
              wilaya: userProfile.wilaya as any,
              avatar: userProfile.avatar,
              isPro: userProfile.partner?.isPro,
              plan: userProfile.partner?.plan,
              partnerStatus: userProfile.partner?.status as any,
              businessName: userProfile.partner?.businessName,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to authenticate token", error);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            document.cookie = 'access_token=; path=/; max-age=0';
          }
          set({ isAuthenticated: false, user: null, isLoading: false });
        }
      },
    }),
    {
      name: 'sanne-dz-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)

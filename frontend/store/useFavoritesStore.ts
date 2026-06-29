import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/api'
import { useAuthStore } from './useAuthStore'

interface FavoritesState {
  favoriteIds: string[]
  toggleFavorite: (partnerId: string) => Promise<void>
  isFavorite: (partnerId: string) => boolean
  clearFavorites: () => void
  syncFavorites: () => Promise<void>
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      toggleFavorite: async (partnerId) => {
        const isFav = get().favoriteIds.includes(partnerId)
        
        // Optimistic UI update
        set((state) => ({
          favoriteIds: isFav
            ? state.favoriteIds.filter((id) => id !== partnerId)
            : [...state.favoriteIds, partnerId],
        }))

        // Sync with backend if authenticated as client
        const { isAuthenticated, user } = useAuthStore.getState()
        if (isAuthenticated && user?.role === 'client') {
          try {
            if (isFav) {
              await api.delete(`/favorites/${partnerId}`)
            } else {
              await api.post(`/favorites/${partnerId}`)
            }
          } catch (err) {
            // Revert on error
            set((state) => ({
              favoriteIds: isFav
                ? [...state.favoriteIds, partnerId]
                : state.favoriteIds.filter((id) => id !== partnerId),
            }))
            console.error('Failed to sync favorite with server', err)
          }
        }
      },

      isFavorite: (partnerId) => get().favoriteIds.includes(partnerId),

      clearFavorites: () => set({ favoriteIds: [] }),

      syncFavorites: async () => {
        const { isAuthenticated, user } = useAuthStore.getState()
        if (isAuthenticated && user?.role === 'client') {
          try {
            const res = await api.get('/favorites')
            const payload = res.data?.data ?? res.data
            if (Array.isArray(payload)) {
              set({ favoriteIds: payload.map((f: any) => f.partnerId) })
            }
          } catch (err) {
            console.error('Failed to fetch favorites', err)
          }
        }
      },
    }),
    {
      name: 'sanne-dz-favorites',
    }
  )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  favoriteIds: string[]
  toggleFavorite: (partnerId: string) => void
  isFavorite: (partnerId: string) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      toggleFavorite: (partnerId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(partnerId)
            ? state.favoriteIds.filter((id) => id !== partnerId)
            : [...state.favoriteIds, partnerId],
        })),

      isFavorite: (partnerId) => get().favoriteIds.includes(partnerId),

      clearFavorites: () => set({ favoriteIds: [] }),
    }),
    {
      name: 'sanne-dz-favorites',
    }
  )
)

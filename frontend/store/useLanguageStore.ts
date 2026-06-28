import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lang } from '@/lib/i18n/translations'

interface LanguageState {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  isAr: () => boolean
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      lang: 'fr',
      setLang: (lang) => set({ lang }),
      toggleLang: () => set((state) => ({ lang: state.lang === 'fr' ? 'ar' : 'fr' })),
      isAr: () => get().lang === 'ar',
    }),
    {
      name: 'sanne-dz-lang',
    }
  )
)

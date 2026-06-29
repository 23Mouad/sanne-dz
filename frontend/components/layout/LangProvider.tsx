'use client'

import { useEffect } from 'react'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { useAuthStore } from '@/store/useAuthStore'

/**
 * LangProvider — Composant client qui applique dir/lang sur <html>
 * Doit être rendu dans le body du RootLayout
 */
export default function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useLanguageStore((s) => s.lang)
  const syncFavorites = useFavoritesStore((s) => s.syncFavorites)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      syncFavorites()
    }
  }, [isAuthenticated, syncFavorites])

  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('lang', lang)
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
    if (lang === 'ar') {
      html.classList.add('font-cairo')
    } else {
      html.classList.remove('font-cairo')
    }
  }, [lang])

  return <>{children}</>
}

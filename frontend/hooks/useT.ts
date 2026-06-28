'use client'

import { useLanguageStore } from '@/store/useLanguageStore'
import type { Lang } from '@/lib/i18n/translations'

/**
 * Hook de traduction — retourne une fonction t(obj) qui lit la langue active
 * Usage : const t = useT(); t(translations.nav.login)
 */
export function useT() {
  const lang = useLanguageStore((s) => s.lang)

  function t(obj: { fr: string; ar: string }): string {
    return obj[lang] ?? obj['fr']
  }

  return t
}

/**
 * Hook pour accéder directement à la langue courante
 */
export function useLang(): Lang {
  return useLanguageStore((s) => s.lang)
}

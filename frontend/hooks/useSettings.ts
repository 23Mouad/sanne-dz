'use client'

import { useState, useEffect } from 'react'

export interface SiteSettings {
  facebook: string
  instagram: string
  tiktok: string
  contactEmail: string
  contactPhone: string
  whatsapp: string
  address: string
}

const DEFAULT_SETTINGS: SiteSettings = {
  facebook: 'https://facebook.com/sannedz',
  instagram: 'https://instagram.com/sannedz',
  tiktok: 'https://tiktok.com/@sannedz',
  contactEmail: 'contact@sannedz.com',
  contactPhone: '+213 555 000 000',
  whatsapp: '+213 555 000 000',
  address: 'Alger, Algérie',
}

let cachedSettings: SiteSettings | null = null
let pendingPromise: Promise<SiteSettings> | null = null

async function fetchSettings(): Promise<SiteSettings> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
    const res = await fetch(`${API_URL}/admin/settings`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch settings')
    const data = await res.json()
    if (data && Object.keys(data).length > 0) {
      return { ...DEFAULT_SETTINGS, ...data }
    }
    return DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function useSettings(): { settings: SiteSettings; loading: boolean } {
  const [settings, setSettings] = useState<SiteSettings>(cachedSettings || DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(!cachedSettings)

  useEffect(() => {
    if (cachedSettings) {
      setSettings(cachedSettings)
      setLoading(false)
      return
    }

    if (!pendingPromise) {
      pendingPromise = fetchSettings()
    }

    pendingPromise.then((data) => {
      cachedSettings = data
      pendingPromise = null
      setSettings(data)
      setLoading(false)
    })
  }, [])

  return { settings, loading }
}

// Call this after saving settings to reset cache
export function invalidateSettingsCache() {
  cachedSettings = null
  pendingPromise = null
}

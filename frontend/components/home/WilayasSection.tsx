'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { MapPin, ArrowRight } from 'lucide-react'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

const AlgeriaMap = dynamic(() => import('./AlgeriaMap'), { ssr: false })

export default function WilayasSection() {
  const t = useT()

  return (
    <section className="section gradient-bg-soft">
      <div className="container-main">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={18} className="text-[#C2517A]" />
              <span className="text-sm font-semibold text-[#C2517A] uppercase tracking-wide">{t(translations.wilayas.badge)}</span>
            </div>
            <h2 className="section-title">{t(translations.wilayas.title)}</h2>
            <p className="text-gray-500 mt-2">{t(translations.wilayas.subtitle)}</p>
          </div>
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-1.5 text-[#C2517A] hover:text-[#a8365f] font-medium text-sm"
          >
            {t(translations.common.allWilayas2)}
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Interactive Map */}
        <div className="mb-10">
          <AlgeriaMap />
        </div>
      </div>
    </section>
  )
}
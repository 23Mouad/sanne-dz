'use client'

import Link from 'next/link'
import { Search, Sparkles, ArrowRight } from 'lucide-react'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function CallToAction() {
  const t = useT()

  return (
    <section className="section relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7F77DD]/30 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative container-main">
        <div className="max-w-3xl mx-auto text-center">

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            {t(translations.cta.title)}
          </h2>
          <p className="text-white/80 text-lg mb-10 whitespace-pre-line">
            {t(translations.cta.subtitle)}
          </p>

          {/* Dual CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/search"
              className="flex items-center gap-2.5 bg-white text-[#C2517A] font-bold
                         px-7 py-4 rounded-2xl shadow-xl hover:shadow-2xl
                         hover:bg-pink-50 active:scale-95
                         transition-all duration-200 text-base"
            >
              <Search size={20} />
              {t(translations.cta.findPro)}
            </Link>

            <Link
              href="/role"
              className="flex items-center gap-2.5 bg-white/15 backdrop-blur-sm text-white font-bold
                         px-7 py-4 rounded-2xl border border-white/30
                         hover:bg-white/25 active:scale-95
                         transition-all duration-200 text-base"
            >
              <Sparkles size={20} />
              {t(translations.cta.registerBusiness)}
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/70 text-sm">
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-400" /> {t(translations.cta.trustFree)}
            </span>
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-400" /> {t(translations.cta.trustNoCommit)}
            </span>
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-400" /> {t(translations.cta.trustVisible)}
            </span>
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-400" /> {t(translations.cta.trustWilayas)}
            </span>
          </div>

        </div>
      </div>

    </section>
  )
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, ChevronDown, Sparkles, TrendingUp, Users, Building2 } from 'lucide-react'
import { WILAYAS } from '@/lib/constants'
import { useCategories } from '@/hooks/useCategories'
import { useT } from '@/hooks/useT'
import { useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function HeroSection() {
  const [query, setQuery] = useState('')
  const [selectedWilaya, setSelectedWilaya] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const router = useRouter()
  const t = useT()
  const lang = useLang()
  const { categories } = useCategories()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (selectedWilaya) params.set('wilaya', selectedWilaya)
    if (selectedCategory) params.set('category', selectedCategory)
    router.push(`/search?${params.toString()}`)
  }

  const stats = [
    { icon: Building2, value: '2 300+', labelKey: translations.hero.stats.partners, color: 'text-[#C2517A]' },
    { icon: MapPin, value: '69', labelKey: translations.hero.stats.wilayas, color: 'text-[#7F77DD]' },
    { icon: Users, value: '12 800+', labelKey: translations.hero.stats.clients, color: 'text-[#C2517A]' },
    { icon: TrendingUp, value: '28%', labelKey: translations.hero.stats.proPct, color: 'text-[#7F77DD]' },
  ]

  const popularSearches = translations.popularSearches[lang]

  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">

      {/* ===== Animated Background ===== */}
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#7F77DD]/30 rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      <div className="relative container-main py-16 z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* ===== Badge ===== */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30
                          px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-6">
            <Sparkles size={14} className="text-yellow-300" />
            {t(translations.hero.badge)}
          </div>

          {/* ===== Title ===== */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            {t(translations.hero.titleMain)}{' '}
            <span className="relative inline-block">
              {t(translations.hero.titlePro)}
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-yellow-300/60 rounded-full" />
            </span>
            {' '}{t(translations.hero.titleEnd)}
          </h1>
          <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            {t(translations.hero.subtitle)}
          </p>

          {/* ===== Search Box ===== */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-2 flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto"
          >
            {/* Text Input */}
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(translations.common.searchPlaceholder)}
                className="w-full pl-10 pr-4 py-3 text-gray-800 placeholder-gray-400 text-sm
                           focus:outline-none rounded-xl bg-transparent"
              />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-gray-200 self-stretch my-1" suppressHydrationWarning />

            {/* Wilaya Select */}
            <div className="relative sm:w-44" suppressHydrationWarning>
              <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={selectedWilaya}
                onChange={(e) => setSelectedWilaya(e.target.value)}
                className="w-full pl-9 pr-8 py-3 text-sm text-gray-600 appearance-none
                           focus:outline-none rounded-xl cursor-pointer bg-transparent"
              >
                <option value="">{t(translations.common.allWilayas)}</option>
                {WILAYAS.map((w) => (
                  <option key={w.id} value={w.name}>{w.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-gray-200 self-stretch my-1" suppressHydrationWarning />

            {/* Category Select */}
            <div className="relative sm:w-44" suppressHydrationWarning>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 text-sm text-gray-600 appearance-none
                           focus:outline-none rounded-xl cursor-pointer bg-transparent"
              >
                <option value="">{t(translations.common.allCategories)}</option>
                {categories.map((cat) => {
                  const catTrans = translations.categories.items[cat.slug as keyof typeof translations.categories.items]
                  const catName = catTrans ? (lang === 'ar' ? catTrans.ar : catTrans.fr) : cat.name
                  return (
                    <option key={cat.slug} value={cat.slug}>{catName}</option>
                  )
                })}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary sm:px-6 py-3 rounded-xl text-sm whitespace-nowrap">
              <Search size={16} />
              {t(translations.common.search)}
            </button>
          </form>

          {/* ===== Popular Searches ===== */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5" suppressHydrationWarning>
            <span className="text-white/60 text-sm">{t(translations.common.popular)}</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => { setQuery(term); router.push(`/search?q=${encodeURIComponent(term)}`) }}
                className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white/90 text-sm
                           border border-white/20 transition-all duration-200 hover:scale-105"
              >
                {term}
              </button>
            ))}
          </div>

        </div>

        {/* ===== Stats Bar ===== */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, value, labelKey, color }) => (
            <div
              key={value}
              suppressHydrationWarning
              className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center
                         hover:bg-white/20 transition-all duration-200"
            >
              <div className={`${color} flex justify-center mb-2`} suppressHydrationWarning>
                <Icon size={22} className="text-white/80" />
              </div>
              <div className="text-2xl font-bold text-white" suppressHydrationWarning>{value}</div>
              <div className="text-white/60 text-sm mt-0.5" suppressHydrationWarning>{t(labelKey)}</div>
            </div>
          ))}
        </div>

      </div>

      {/* ===== Wave Bottom ===== */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L60 74.7C120 69.3 240 58.7 360 53.3C480 48 600 48 720 53.3C840 58.7 960 69.3 1080 74.7C1200 80 1320 80 1380 80H1440V80H0V80Z" fill="#fdf8fc" />
        </svg>
      </div>

    </section>
  )
}
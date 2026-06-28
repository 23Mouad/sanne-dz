'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { CategoryIcon } from '@/components/CategoryIcon'
import { CategoriesService } from '@/services/categories.service'
import { Category } from '@/types'
import { useT } from '@/hooks/useT'
import { useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function CategoriesGrid() {
  const t = useT()
  const lang = useLang()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoriesService.getAll()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  return (
    <section className="section bg-white">
      <div className="container-main">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="section-title">{t(translations.categories.title)}</h2>
            <p className="text-gray-500 mt-2">{t(translations.categories.subtitle)}</p>
          </div>
          <Link
            href="/categories"
            className="hidden sm:flex items-center gap-1.5 text-[#C2517A] hover:text-[#a8365f] font-medium text-sm transition-colors"
          >
            {t(translations.common.seeAll)}
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-pink-100 border-t-[#C2517A] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat) => {
              const catTrans = translations.categories.items[cat.slug as keyof typeof translations.categories.items]
            const catName = catTrans ? (lang === 'ar' ? catTrans.ar : catTrans.fr) : cat.name

            return (
              <Link
                key={cat.slug}
                href={`/search?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl p-5 text-center
                           bg-white border border-pink-100
                           hover:border-[#C2517A]/30 hover:shadow-lg hover:shadow-pink-100/50
                           transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient bg on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                {/* Icon */}
                <div className="relative mb-3 transform group-hover:scale-110 transition-transform duration-300 flex justify-center text-gray-700 group-hover:text-[#C2517A]">
                  <CategoryIcon slug={cat.slug} size={32} />
                </div>

                {/* Name */}
                <h3 className="relative text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-[#C2517A] transition-colors leading-tight">
                  {catName}
                </h3>

                {/* Partner count */}
                {cat.partnerCount && (
                  <p className="relative text-xs text-gray-400 mt-1">
                    {cat.partnerCount} {t(translations.common.pros)}
                  </p>
                )}

                {/* Arrow */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={14} className="text-[#C2517A]" />
                </div>
              </Link>
            )
          })}
        </div>
        )}

        {/* Mobile "Voir tout" */}
        <div className="sm:hidden text-center mt-6">
          <Link href="/categories" className="btn-outline text-sm px-6">
            {t(translations.common.allCategories2)}
          </Link>
        </div>

      </div>
    </section>
  )
}
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Search, Shirt, Smartphone, Sparkles, Utensils, Home, GraduationCap, Wrench, Camera, HeartPulse, Car } from 'lucide-react'
import { CategoryIcon } from '@/components/CategoryIcon'
import { Category } from '@/types'

import { API_URL } from '@/lib/constants'

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  } catch (error) {
    console.error(error)
    return []
  }
}

export const metadata: Metadata = {
  title: 'Toutes les catégories | Sanne DZ',
  description: 'Explorez tous les secteurs disponibles sur Sanne DZ : ateliers de couture, merceries, magasins de tissus, et plus encore.',
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/40 to-white">

      {/* Hero */}
      <div className="gradient-bg py-14">
        <div className="container-main text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Toutes les catégories</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Explorez les professionnels par secteur d&apos;activité dans toute l&apos;Algérie
          </p>
        </div>
      </div>

      <div className="container-main py-12">

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div key={cat.slug} className="card p-6 group hover:-translate-y-1">
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color}
                                  flex items-center justify-center shadow-md
                                  group-hover:scale-110 transition-transform duration-300`}>
                  <CategoryIcon slug={cat.slug} size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 group-hover:text-[#C2517A] transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-gray-400">{cat.partnerCount} partenaires</p>
                </div>
              </div>

              {/* Description */}
              {cat.description && (
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{cat.description}</p>
              )}

              {/* Subcategories */}
              {cat.subCategories && cat.subCategories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cat.subCategories.slice(0, 3).map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/search?category=${cat.slug}&sub=${sub.slug}`}
                      className="text-xs px-2.5 py-1 rounded-full bg-pink-50 text-[#C2517A]
                                 hover:bg-pink-100 transition-colors font-medium"
                    >
                      {sub.name}
                    </Link>
                  ))}
                  {cat.subCategories.length > 3 && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gray-50 text-gray-400">
                      +{cat.subCategories.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* CTA */}
              <Link
                href={`/search?category=${cat.slug}`}
                className="flex items-center gap-1.5 text-sm font-semibold text-[#C2517A]
                           hover:gap-2.5 transition-all duration-200"
              >
                Voir les partenaires
                <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>

        {/* Search CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Vous ne trouvez pas votre secteur ?</p>
          <Link href="/search" className="btn-primary inline-flex">
            <Search size={16} />
            Recherche avancée
          </Link>
        </div>

      </div>
    </div>
  )
}
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, MessageCircle, Heart, ArrowRight, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { PartnersService } from '@/services/partners.service'
import { Partner } from '@/types'
import { buildWhatsAppLink, getImageUrl } from '@/lib/utils'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function FeaturedPartners() {
  const t = useT()
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await PartnersService.getFeatured()
        setPartners(data)
      } catch (error) {
        console.error("Failed to fetch featured partners", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPartners()
  }, [])

  return (
    <section className="section gradient-bg-soft">
      <div className="container-main">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 badge-pro mb-3">
              <Sparkles size={12} />
              {t(translations.featured.badge)}
            </div>
            <h2 className="section-title">{t(translations.featured.title)}</h2>
            <p className="text-gray-500 mt-2">{t(translations.featured.subtitle)}</p>
          </div>
          <Link
            href="/search?plan=pro"
            className="hidden sm:flex items-center gap-1.5 text-[#C2517A] hover:text-[#a8365f] font-medium text-sm"
          >
            {t(translations.featured.seeAll)}
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-pink-100 border-t-[#C2517A] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-2xl border border-pink-100 shadow-sm
                         hover:shadow-xl hover:shadow-pink-100/40 hover:-translate-y-1
                         transition-all duration-300 overflow-hidden group"
            >
              {/* Cover Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={getImageUrl(partner.coverUrl)}
                  alt={partner.businessName}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Pro Badge */}
                {partner.isPro && (
                  <div className="absolute top-2 right-2">
                    <span className="badge-pro">
                      <Sparkles size={10} />
                      {t(translations.featured.pro)}
                    </span>
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm
                              flex items-center justify-center shadow-sm
                              hover:bg-white hover:scale-110 transition-all duration-200
                              group/fav"
                  aria-label="Sauvegarder"
                >
                  <Heart size={14} className="text-gray-400 group-hover/fav:text-[#C2517A] group-hover/fav:fill-[#C2517A] transition-colors" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4">
                {/* Logo + Info */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-pink-100 shrink-0 -mt-7 relative z-10 shadow-md">
                    <img
                      src={getImageUrl(partner.logoUrl)}
                      alt={partner.businessName}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {partner.businessName}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} />
                      {typeof partner.wilaya === 'string' ? partner.wilaya : partner.wilaya?.name}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <span className="text-xs text-[#C2517A] bg-pink-50 px-2 py-0.5 rounded-full font-medium">
                  {partner.categories && partner.categories.length > 0 ? partner.categories[0].category.name : (partner.category?.name || '')}
                </span>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-2.5">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < Math.round(partner.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-800">{partner.rating}</span>
                  <span className="text-xs text-gray-400">({partner.reviewCount} {t(translations.featured.reviews)})</span>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                  {partner.description}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/partner/${partner.slug}`}
                    className="flex-1 text-center text-xs font-semibold text-[#C2517A] bg-pink-50
                               hover:bg-[#C2517A] hover:text-white py-2.5 rounded-xl transition-all duration-200"
                  >
                    {t(translations.featured.viewProfile)}
                  </Link>
                  <a
                    href={buildWhatsAppLink(partner.whatsapp, partner.businessName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp py-2.5 px-3 rounded-xl"
                  >
                    <MessageCircle size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Mobile CTA */}
        <div className="text-center mt-8">
          <Link href="/search?plan=pro" className="btn-primary">
            <Sparkles size={16} />
            {t(translations.featured.seeAll)}
          </Link>
        </div>

      </div>
    </section>
  )
}
'use client'

import Link from 'next/link'
import { ArrowLeft, Eye, Phone, Star, MapPin, Sparkles } from 'lucide-react'
import type { Partner } from '@/types'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function PartnerPageClient({ partner }: { partner: Partner }) {
  const t = useT()
  const d = translations.partnerPage

  return (
    <>
      {/* Back link */}
      <Link
        href="/search"
        className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm
                   text-white text-sm px-3 py-2 rounded-xl hover:bg-black/60 transition-colors"
      >
        <ArrowLeft size={15} className="rtl:rotate-180" />
        {t(d.back)}
      </Link>

      {/* Pro badge */}
      {partner.isPro && (
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
          <span className="badge-pro text-sm px-3 py-1.5">
            <Sparkles size={13} />
            {t(d.premiumBadge)}
          </span>
        </div>
      )}

      {/* Partner Header content */}
      <div className="pt-12 pb-6 border-b border-pink-100">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
              {partner.businessName}
              {partner.isPro && (
                <span className="badge-pro text-xs">
                  <Sparkles size={10} /> Pro
                </span>
              )}
            </h1>
            <div className="flex items-center flex-wrap gap-3 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-[#C2517A]" />
                {partner.wilaya}
              </span>
              <span className="text-pink-200">·</span>
              {partner.category && (
                <span className="text-[#C2517A] bg-pink-50 px-2 py-0.5 rounded-full text-xs font-medium">
                  {partner.category.icon} {partner.category.name}
                </span>
              )}
              {partner.address && (
                <>
                  <span className="text-pink-200">·</span>
                  <span className="text-gray-500 text-xs">{partner.address}</span>
                </>
              )}
            </div>

            {/* Rating + stats */}
            <div className="flex items-center flex-wrap gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={i < Math.round(partner.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200 fill-gray-200'}
                    />
                  ))}
                </div>
                <span className="font-bold text-gray-900">{partner.rating}</span>
                <span className="text-gray-500 text-sm">({partner.reviewCount} {t(d.reviews)})</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Eye size={14} />
                <span dir="ltr">{partner.stats.profileViews.toLocaleString('fr-DZ')}</span> {t(d.views)}
              </div>
            </div>
          </div>

          {/* Quick contact (desktop) */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <a
              href={`tel:${partner.phone}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-sm font-semibold transition-colors"
            >
              <Phone size={15} />
              {t(d.call)}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

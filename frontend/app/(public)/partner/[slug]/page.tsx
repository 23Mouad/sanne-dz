import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Star, Sparkles, ArrowLeft, Eye, Phone } from 'lucide-react'
import { Suspense } from 'react'
import { Partner } from '@/types'
import { API_URL } from '@/lib/constants'
import { getImageUrl } from '@/lib/utils'

async function getPartnerBySlug(slug: string): Promise<Partner | null> {
  try {
    const res = await fetch(`${API_URL}/partners/${slug}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const json = await res.json()
    return json.data || null
  } catch (error) {
    console.error(error)
    return null
  }
}
import ContactButtons from '@/components/partner/ContactButtons'
import PortfolioTabs from '@/components/partner/PortfolioTabs'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const partner = await getPartnerBySlug(slug)
  if (!partner) return { title: 'Partenaire introuvable' }
  return {
    title: `${partner.businessName} — ${typeof partner.wilaya === 'string' ? partner.wilaya : partner.wilaya?.name} | Sanne DZ`,
    description: (partner.description || '').slice(0, 155),
  }
}

export default async function PartnerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const partner = await getPartnerBySlug(slug)

  if (!partner) notFound()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/40 to-white pb-24 lg:pb-10">

      {/* ── Hero Cover ── */}
      <div className="relative h-56 sm:h-72 lg:h-80 w-full">
        <img
          src={getImageUrl(partner.coverUrl)}
          alt={partner.businessName}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back link */}
        <Link
          href="/search"
          className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm
                     text-white text-sm px-3 py-2 rounded-xl hover:bg-black/60 transition-colors"
        >
          <ArrowLeft size={15} />
          Retour
        </Link>

        {/* Pro badge */}
        {partner.isPro && (
          <div className="absolute top-4 right-4">
            <span className="badge-pro text-sm px-3 py-1.5">
              <Sparkles size={13} />
              Partenaire Premium
            </span>
          </div>
        )}

        {/* Logo overlapping */}
        <div className="absolute -bottom-8 left-5 sm:left-8 z-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden
                          border-4 border-white shadow-xl bg-white">
            <img
              src={getImageUrl(partner.logoUrl)}
              alt={partner.businessName}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      <div className="container-main">
        {/* ── Partner Header ── */}
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
                  {typeof partner.wilaya === 'string' ? partner.wilaya : partner.wilaya?.name}
                </span>
                <span className="text-pink-200">·</span>
                <span className="text-[#C2517A] bg-pink-50 px-2 py-0.5 rounded-full text-xs font-medium">
                  {Array.isArray(partner.categories) && partner.categories.length > 0 
                    ? `${partner.categories[0].category.icon || ''} ${partner.categories[0].category.name}`
                    : `${partner.category?.icon || ''} ${partner.category?.name || ''}`}
                </span>
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
                  <span className="text-gray-500 text-sm">({partner.reviewCount} avis)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Eye size={14} />
                  {(partner.stats?.profileViews || 0).toLocaleString('fr-DZ')} vues
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
                Appeler
              </a>
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left column — Portfolio tabs */}
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="h-40 bg-gray-100 rounded-xl animate-pulse"></div>}>
              <PortfolioTabs partner={partner} />
            </Suspense>
          </div>

          {/* Right column — sticky contact */}
          <div className="space-y-5">
            <ContactButtons partner={partner} />

            {/* Quick info card */}
            <div className="card p-5 space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">Infos rapides</h3>
              {[
                { 
                  label: 'Catégorie', 
                  value: Array.isArray(partner.categories) && partner.categories.length > 0 
                    ? `${partner.categories[0].category.icon || ''} ${partner.categories[0].category.name}`
                    : `${partner.category?.icon || ''} ${partner.category?.name || ''}` 
                },
                { label: 'Wilaya', value: typeof partner.wilaya === 'string' ? partner.wilaya : partner.wilaya?.name },
                { label: 'Note', value: `⭐ ${partner.rating} / 5` },
                { label: 'Avis', value: `${partner.reviewCount} avis clients` },
                { label: 'Plan', value: partner.isPro ? '✨ Partenaire Pro' : 'Standard' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-sm border-b border-pink-50 pb-2 last:border-0 last:pb-0">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-semibold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
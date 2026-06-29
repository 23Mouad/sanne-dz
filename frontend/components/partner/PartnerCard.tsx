'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, MessageCircle, Phone, Heart, Sparkles } from 'lucide-react'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { buildWhatsAppLink, getImageUrl } from '@/lib/utils'
import type { Partner } from '@/types'
import api from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'
import toast from 'react-hot-toast'

interface PartnerCardProps {
  partner: Partner
  compact?: boolean
}

export default function PartnerCard({ partner, compact = false }: PartnerCardProps) {
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const [mounted, setMounted] = useState(false)

  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated || !user) {
      toast.error('Vous devez être connecté pour ajouter aux favoris')
      return
    }
    await toggleFavorite(partner.id)
  }

  const handleWhatsappClick = () => api.post(`/partners/${partner.id}/whatsapp-click`).catch(() => {})
  const handlePhoneClick = () => api.post(`/partners/${partner.id}/phone-click`).catch(() => {})

  const fav = mounted ? isFavorite(partner.id) : false

  return (
    <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden
                    hover:shadow-xl hover:shadow-pink-100/40 hover:-translate-y-1
                    transition-all duration-300 group">

      {/* Cover */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={getImageUrl(partner.coverUrl)}
          alt={partner.businessName}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Pro Badge */}
        {partner.isPro && (
          <div className="absolute top-2 right-2">
            <span className="badge-pro">
              <Sparkles size={10} />
              Premium
            </span>
          </div>
        )}

        {/* Favorite */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm
                      flex items-center justify-center shadow-sm
                      hover:scale-110 transition-all duration-200 group/fav"
          aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart
            size={14}
            className={fav
              ? 'text-[#C2517A] fill-[#C2517A]'
              : 'text-gray-400 group-hover/fav:text-[#C2517A]'}
          />
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-2.5">
          {/* Logo */}
          <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-pink-100 shrink-0 -mt-7 relative z-10 shadow-md bg-white">
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
              <MapPin size={11} className="text-[#C2517A]" />
              {typeof partner.wilaya === 'string' ? partner.wilaya : partner.wilaya?.name}
            </p>
          </div>
        </div>

        {/* Category */}
        <span className="inline-block text-xs text-[#C2517A] bg-pink-50 px-2 py-0.5 rounded-full font-medium">
          {partner.categories && partner.categories.length > 0 ? (
            <>
              {partner.categories[0].category.icon} {partner.categories[0].category.name}
            </>
          ) : (
            <>
              {partner.category?.icon} {partner.category?.name}
            </>
          )}
        </span>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.round(partner.rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-200 fill-gray-200'}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-gray-800">{partner.rating}</span>
          <span className="text-xs text-gray-400">({partner.reviewCount} avis)</span>
        </div>

        {!compact && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {partner.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Link
            href={`/partner/${partner.slug}`}
            className="flex-1 text-center text-xs font-semibold text-[#C2517A] bg-pink-50
                       hover:bg-[#C2517A] hover:text-white py-2.5 rounded-xl transition-all duration-200"
          >
            Voir le profil
          </Link>
          <a
            href={buildWhatsAppLink(partner.whatsapp, partner.businessName)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              handleWhatsappClick();
            }}
            className="btn-whatsapp py-2.5 px-3 rounded-xl"
            aria-label="WhatsApp"
          >
            <MessageCircle size={14} />
          </a>
          <a
            href={`tel:${partner.phone}`}
            onClick={(e) => {
              e.stopPropagation();
              handlePhoneClick();
            }}
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 py-2.5 px-3 rounded-xl
                       flex items-center justify-center transition-colors"
            aria-label="Appeler"
          >
            <Phone size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}
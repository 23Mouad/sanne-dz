'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Phone, Share2, Heart } from 'lucide-react'
import { buildWhatsAppLink } from '@/lib/utils'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { useAuthStore } from '@/store/useAuthStore'
import type { Partner } from '@/types'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function ContactButtons({ partner }: { partner: Partner }) {
  const t = useT()
  const d = translations.contactButtons
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const { isAuthenticated, user } = useAuthStore()

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const fav = mounted ? isFavorite(partner.id) : false

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: partner.businessName, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleFavoriteClick = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Vous devez être connecté pour ajouter aux favoris')
      return
    }
    const currentlyFav = isFavorite(partner.id)
    toggleFavorite(partner.id) // Optimistic update
    
    try {
      if (currentlyFav) {
        await api.delete(`/favorites/${partner.id}`)
        toast.success('Retiré des favoris')
      } else {
        await api.post(`/favorites/${partner.id}`)
        toast.success('Ajouté aux favoris')
      }
    } catch (err) {
      // Revert on error
      toggleFavorite(partner.id)
      toast.error('Erreur lors de la mise à jour des favoris')
    }
  }

  const handleWhatsappClick = () => api.post(`/partners/${partner.id}/whatsapp-click`).catch(() => {})
  const handlePhoneClick = () => api.post(`/partners/${partner.id}/phone-click`).catch(() => {})

  return (
    <>
      {/* Desktop sticky contact box */}
      <div className="card p-5 space-y-3">
        <h3 className="font-bold text-gray-900">{t(d.contactTitle)} {partner.businessName}</h3>

        <a
          href={buildWhatsAppLink(partner.whatsapp, partner.businessName)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsappClick}
          className="btn-whatsapp w-full py-3 text-sm"
        >
          <MessageCircle size={18} />
          {t(d.whatsappBtn)}
        </a>

        <a
          href={`tel:${partner.phone}`}
          onClick={handlePhoneClick}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl
                     bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-sm
                     transition-colors"
        >
          <Phone size={18} />
          {t(d.callBtn)} <span dir="ltr">{partner.phone}</span>
        </a>

        <div className="flex gap-2">
          <button
            onClick={handleFavoriteClick}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium
                        border transition-all duration-200
                        ${fav
                          ? 'border-[#C2517A] bg-pink-50 text-[#C2517A]'
                          : 'border-gray-200 text-gray-600 hover:border-[#C2517A] hover:text-[#C2517A]'
                        }`}
          >
            <Heart size={15} className={fav ? 'fill-[#C2517A]' : ''} />
            {fav ? t(d.saved) : t(d.save)}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                       border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
          >
            <Share2 size={15} />
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center">
          {t(d.noAccount)}
        </p>
      </div>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-pink-100 px-4 py-3 flex gap-2 shadow-2xl shadow-pink-100/50">
        <a
          href={buildWhatsAppLink(partner.whatsapp, partner.businessName)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsappClick}
          className="btn-whatsapp flex-1 py-3 text-sm"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
        <a
          href={`tel:${partner.phone}`}
          onClick={handlePhoneClick}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600
                     hover:bg-blue-100 py-3 rounded-xl font-semibold text-sm transition-colors"
        >
          <Phone size={16} />
          {t(d.callMobile)}
        </a>
        <button
          onClick={handleFavoriteClick}
          className={`px-4 py-3 rounded-xl border transition-all ${
            fav ? 'border-[#C2517A] bg-pink-50 text-[#C2517A]' : 'border-gray-200 text-gray-400'
          }`}
        >
          <Heart size={16} className={fav ? 'fill-[#C2517A]' : ''} />
        </button>
      </div>
    </>
  )
}

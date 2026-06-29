'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin, Star, MessageCircle, Trash2 } from 'lucide-react'
import { buildWhatsAppLink, getImageUrl } from '@/lib/utils'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function ClientFavoritesPage() {
  const t = useT()
  const d = translations.clientDashboard
  const toggleFavorite = useFavoritesStore(s => s.toggleFavorite)

  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/favorites')
      const payload = res.data?.data ?? res.data
      setFavorites(Array.isArray(payload) ? payload.map((f: any) => f.partner) : [])
    } catch (err) {
      toast.error('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleRemove = async (id: string) => {
    try {
      await toggleFavorite(id) // This will call api.delete under the hood since it's already favored
      setFavorites(prev => prev.filter(p => p.id !== id))
      toast.success('Retiré des favoris')
    } catch (err) {
      toast.error('Failed to remove favorite')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-pink-100 border-t-[#C2517A] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Heart size={28} className="text-[#C2517A]" />
          {t(d.favTitle)}
        </h1>
        <p className="page-subtitle">
          {favorites.length} {t(d.favSaved)}
        </p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map(p => (
            <div key={p.id} className="card overflow-hidden hover:-translate-y-1 group">
              <div className="relative h-40">
                <Image src={getImageUrl(p.coverUrl)} alt={p.businessName} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <button onClick={() => handleRemove(p.id)}
                  className="absolute top-2 right-2 rtl:right-auto rtl:left-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm
                             flex items-center justify-center hover:scale-110 transition-transform">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{p.businessName}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin size={12} className="text-[#C2517A]" />{p.wilaya?.name || p.wilaya}
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-semibold text-gray-800">{p.rating}</span>
                  <span className="text-xs text-gray-400">({p.reviewCount})</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href={`/partner/${p.slug}`} className="flex-1 text-center text-xs font-semibold text-[#C2517A]
                    bg-pink-50 hover:bg-[#C2517A] hover:text-white py-2 rounded-xl transition-all">
                    {t(d.viewProfile)}
                  </Link>
                  <a href={buildWhatsAppLink(p.whatsapp, p.businessName)} target="_blank" rel="noopener noreferrer"
                    className="btn-whatsapp py-2 px-3 rounded-xl">
                    <MessageCircle size={13} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mx-auto mb-5">
            <Heart size={36} className="text-pink-200" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t(d.noFavTitle)}</h3>
          <p className="text-gray-500 mb-6">{t(d.noFavDesc)}</p>
          <Link href="/search" className="btn-primary inline-flex">{t(d.exploreBtn)}</Link>
        </div>
      )}
    </div>
  )
}

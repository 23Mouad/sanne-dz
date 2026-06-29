'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, MapPin, Trash2, AlertTriangle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import StarRating from '@/components/ui/StarRating'
import Modal from '@/components/ui/Modal'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function ClientReviewsPage() {
  const t = useT()
  const d = translations.clientDashboard

  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/reviews/me')
      const payload = res.data?.data ?? res.data
      setReviews(Array.isArray(payload) ? payload : [])
    } catch (err) {
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async () => {
    if (!reviewToDelete) return
    try {
      await api.delete(`/reviews/${reviewToDelete}`)
      setReviews(prev => prev.filter(r => r.id !== reviewToDelete))
      toast.success(t(d.delRevModalTitle))
      setReviewToDelete(null)
    } catch (err) {
      toast.error('Failed to delete review')
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
          <Star size={28} className="text-yellow-400 fill-yellow-400" />
          {t(d.reviewsTitle)}
        </h1>
        <p className="page-subtitle">{reviews.length} {t(d.reviewsSub)}</p>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map(review => {
            const partner = review.partner
            return (
              <div key={review.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Partner name */}
                    {partner && (
                      <Link href={`/partner/${partner.slug}`}
                        className="font-bold text-gray-900 hover:text-[#C2517A] transition-colors text-sm">
                        {partner.businessName}
                      </Link>
                    )}
                    {partner && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-[#C2517A]" />
                        {partner.wilaya?.name || partner.wilaya} · {partner.categories?.[0]?.category?.name || partner.category?.name || ''}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <StarRating rating={review.rating} size={14} />
                      <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mt-3">{review.comment}</p>
                  </div>
                  <button
                    onClick={() => setReviewToDelete(review.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors p-2 rounded-xl hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-pink-50 flex items-center justify-end">
                  {partner && (
                    <Link href={`/partner/${partner.slug}`}
                      className="text-xs text-[#C2517A] hover:underline">
                      {t(d.viewProfileArrow)}
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <Star size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t(d.noRevTitle)}</h3>
          <p className="text-gray-500 mb-6">{t(d.noRevDesc)}</p>
          <Link href="/search" className="btn-primary inline-flex">{t(d.exploreBtn)}</Link>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        title={t(d.delRevModalTitle)}
        size="sm"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <div>
            <p className="text-gray-700 font-medium">{t(d.delRevModalDesc)}</p>
            <p className="text-gray-400 text-sm mt-1">{t(d.delRevIrrev)}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setReviewToDelete(null)}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {t(d.cancel)}
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              {t(d.confirmDelete)}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

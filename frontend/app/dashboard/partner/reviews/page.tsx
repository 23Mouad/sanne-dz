'use client'

import { useState, useEffect } from 'react'
import { Star, Flag, MessageSquare, Check, X } from 'lucide-react'
import { formatDate, getImageUrl } from '@/lib/utils'
import Image from 'next/image'
import StarRating from '@/components/ui/StarRating'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import api from '@/lib/api'
import { PartnersService } from '@/services/partners.service'

export default function PartnerReviewsPage() {
  const t = useT()
  const d = translations.partnerReviews

  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const load = async (p = 1) => {
    setLoading(true)
    try {
      await PartnersService.getMyProfile()
      const res = await api.get(`/reviews/partner-dashboard?page=${p}`)
      const payload = res.data
      setReviews(payload?.data || [])
      setTotalPages(payload?.meta?.totalPages || 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(page)
  }, [page])

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  const breakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(r.rating) === star).length,
    pct: reviews.length ? Math.round(reviews.filter(r => Math.round(r.rating) === star).length / reviews.length * 100) : 0,
  }))

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
          {t(d.title)}
        </h1>
        <p className="page-subtitle">{reviews.length} {t(d.subtitle)}</p>
      </div>

      {/* Summary */}
      <div className="card p-6">
        <div className="flex items-center gap-8">
          <div className="text-center shrink-0">
            <div className="text-5xl font-bold gradient-text">{avg.toFixed(1)}</div>
            <StarRating rating={avg} size={18} />
            <p className="text-xs text-gray-400 mt-1">{reviews.length} {t(d.reviews)}</p>
          </div>
          <div className="flex-1 space-y-2">
            {breakdown.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-gray-500 shrink-0">{star}</span>
                <Star size={11} className="text-yellow-400 fill-yellow-400 shrink-0" />
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-[#C2517A] to-[#7F77DD]"
                    style={{ width: `${pct}%` }} />
                </div>
                <span className="w-5 text-gray-400 text-right rtl:text-left shrink-0">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-100 to-purple-100
                                  flex items-center justify-center text-[#C2517A] font-bold text-sm shrink-0 overflow-hidden relative">
                    {r.author?.avatar ? (
                      <Image src={getImageUrl(r.author.avatar)} alt={r.author?.firstName || 'Avatar'} width={36} height={36} className="object-cover w-full h-full absolute inset-0" unoptimized={true} />
                    ) : (
                      <>{r.author?.firstName?.[0] || '?'}</>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{r.author?.firstName} {r.author?.lastName}</p>
                    <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end rtl:items-start gap-1">
                  <StarRating rating={r.rating} size={13} />
              
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>

              {/* Partner reply area */}
              {/* <div className="mt-4 pt-3 border-t border-pink-50 flex items-center gap-3">
                <button className="flex items-center gap-1.5 text-xs text-[#C2517A] hover:underline font-medium">
                  <MessageSquare size={13} />
                  {t(d.reply)}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-amber-500 transition-colors">
                  <Flag size={13} />
                  {t(d.report)}
                </button>
              </div> */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Star size={40} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t(d.noReviewsTitle)}</h3>
          <p className="text-gray-500 text-sm">{t(d.noReviewsSub)}</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            className="px-3 py-1.5 text-sm rounded-xl border border-pink-100 disabled:opacity-40 hover:bg-pink-50 transition-colors">
            ←
          </button>
          <span className="text-sm text-gray-500">Page {page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
            className="px-3 py-1.5 text-sm rounded-xl border border-pink-100 disabled:opacity-40 hover:bg-pink-50 transition-colors">
            →
          </button>
        </div>
      )}
    </div>
  )
}

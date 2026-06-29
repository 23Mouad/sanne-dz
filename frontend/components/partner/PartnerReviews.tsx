'use client'

import { useState, useEffect } from 'react'
import { Star, Flag, ThumbsUp } from 'lucide-react'
import { formatDate, getImageUrl } from '@/lib/utils'
import Image from 'next/image'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import StarRating from '@/components/ui/StarRating'
import Modal from '@/components/ui/Modal'
import { useAuthStore } from '@/store/useAuthStore'

interface PartnerReviewsProps {
  partnerId: string
  rating: number
  reviewCount: number
}

export default function PartnerReviews({ partnerId, rating, reviewCount }: PartnerReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [myReview, setMyReview] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [otherReason, setOtherReason] = useState('')
  const [reportSubmitted, setReportSubmitted] = useState(false)

  const { isAuthenticated, user } = useAuthStore()

  const loadReviews = async () => {
    try {
      const res = await api.get(`/reviews/partner/${partnerId}`)
      const payload = res.data?.data ?? res.data
      setReviews(Array.isArray(payload) ? payload : (payload?.data || []))

      if (isAuthenticated && user?.role === 'client') {
        try {
          const myRes = await api.get(`/reviews/me/partner/${partnerId}`)
          setMyReview(myRes.data?.data ?? null)
        } catch (e) {
          // Ignore 404 or errors for my-review
          setMyReview(null)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [partnerId, isAuthenticated, user])

  const safeReviews = Array.isArray(reviews) ? reviews : []
  const canReview = isAuthenticated && user?.role === 'client'

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: safeReviews.filter((r) => Math.round(r.rating) === star).length,
    pct: safeReviews.length ? Math.round((safeReviews.filter((r) => Math.round(r.rating) === star).length / safeReviews.length) * 100) : 0,
  }))

  const openReviewModal = () => {
    if (myReview?.status === 'PENDING') return // Should be disabled anyway
    
    if (myReview) {
      setNewRating(myReview.rating)
      setNewComment(myReview.comment)
    } else {
      setNewRating(0)
      setNewComment('')
    }
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newRating === 0 || !newComment.trim()) return
    
    try {
      if (myReview) {
        await api.put(`/reviews/${myReview.id}`, { rating: newRating, comment: newComment })
        setMyReview({ ...myReview, rating: newRating, comment: newComment, status: 'PENDING' })
      } else {
        await api.post('/reviews', { partnerId, rating: newRating, comment: newComment })
        setMyReview({ id: 'temp', rating: newRating, comment: newComment, status: 'PENDING' })
      }
      setSubmitted(true)
      setTimeout(() => { 
        setShowModal(false); 
        setSubmitted(false); 
        setNewRating(0); 
        setNewComment('');
        loadReviews();
      }, 2000)
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Échec de la soumission de l\'avis'
      toast.error(msg)
    }
  }

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportReason) return
    if (reportReason === 'Autre' && !otherReason.trim()) return
    setReportSubmitted(true)
    setTimeout(() => { setReportModalOpen(false); setReportSubmitted(false); setReportReason(''); setOtherReason('') }, 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Avis clients ({reviewCount})
        </h2>
        {canReview && (
          <button 
            onClick={openReviewModal} 
            disabled={myReview?.status === 'PENDING'}
            className={`text-sm py-2 px-4 rounded-xl font-medium transition-colors ${
              myReview?.status === 'PENDING' 
                ? 'bg-amber-50 text-amber-600 cursor-not-allowed opacity-80' 
                : 'btn-primary'
            }`}
          >
            {myReview?.status === 'PENDING' ? 'Avis en cours d\'examen' : 
             myReview?.status === 'REJECTED' ? 'Avis rejeté (Modifier)' : 
             myReview ? 'Modifier mon avis' : 'Laisser un avis'}
          </button>
        )}
      </div>

      {/* Rating summary */}
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-5xl font-bold gradient-text">{rating.toFixed(1)}</div>
            <StarRating rating={rating} size={16} />
            <p className="text-xs text-gray-400 mt-1">{reviewCount} avis</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingBreakdown.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-4 text-gray-500">{star}</span>
                <Star size={11} className="text-yellow-400 fill-yellow-400 shrink-0" />
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#C2517A] to-[#7F77DD] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-gray-400 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review List */}
      {safeReviews.length > 0 ? (
        <div className="space-y-4">
          {safeReviews.map((review) => (
            <div key={review.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C2517A]/20 to-[#7F77DD]/20
                                  flex items-center justify-center text-[#C2517A] font-bold text-sm shrink-0 overflow-hidden relative">
                    {review.author?.avatar ? (
                      <Image src={getImageUrl(review.author.avatar)} alt={review.author?.firstName || 'Avatar'} width={36} height={36} className="object-cover w-full h-full absolute inset-0" unoptimized={true} />
                    ) : (
                      <>{review.author?.firstName?.[0] || 'A'}</>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{review.author?.firstName} {review.author?.lastName}</p>
                    <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} size={13} />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-3">{review.comment}</p>
              {/* <div className="flex items-center gap-4 mt-3">
                <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#C2517A] transition-colors">
                  <ThumbsUp size={12} />
                  Utile
                </button>
                <button
                  onClick={() => { setReportReason(''); setOtherReason(''); setReportSubmitted(false); setReportModalOpen(true); }}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Flag size={12} />
                  Signaler
                </button>
              </div> */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400">
          <Star size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Aucun avis pour le moment. Soyez le premier !</p>
        </div>
      )}

      {/* Add Review Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Laisser un avis" size="md">
        {submitted ? (
          <div className="text-center py-6">
            <Star size={48} className="text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900">Merci pour votre avis !</h3>
            <p className="text-gray-500 text-sm mt-1">Il sera publié après vérification.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Votre note *</label>
              <StarRating rating={newRating} size={28} interactive onChange={setNewRating} />
            </div>
            <div>
              <label className="label">Votre commentaire *</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Décrivez votre expérience avec ce professionnel..."
                rows={4}
                className="input-field resize-none"
                required
                minLength={20}
              />
              <p className="text-xs text-gray-400 mt-1">{newComment?.length || 0}/20 caractères minimum</p>
            </div>
            <button
              type="submit"
              disabled={newRating === 0 || (newComment || '').trim().length < 20}
              className="btn-primary w-full"
            >
              Publier mon avis
            </button>
          </form>
        )}
      </Modal>

      {/* Report Review Modal */}
      <Modal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} title="Signaler un avis" size="md">
        {reportSubmitted ? (
          <div className="text-center py-6">
            <Flag size={48} className="text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900">Signalement envoyé</h3>
            <p className="text-gray-500 text-sm mt-1">Notre équipe va examiner cet avis. Merci !</p>
          </div>
        ) : (
          <form onSubmit={handleReport} className="space-y-4">
            <p className="text-sm text-gray-600 mb-2">Pourquoi souhaitez-vous signaler cet avis ?</p>
            <div className="space-y-2">
              {['Spam ou publicité', 'Contenu inapproprié ou offensant', 'Faux avis', 'Harcèlement', 'Autre'].map((reason) => (
                <div key={reason}>
                  <label className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      checked={reportReason === reason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-4 h-4 text-[#C2517A] border-gray-300 focus:ring-[#C2517A]"
                    />
                    <span className="text-sm text-gray-700">{reason}</span>
                  </label>
                  {reason === 'Autre' && reportReason === 'Autre' && (
                    <div className="mt-2 ml-7">
                      <textarea
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        placeholder="Veuillez préciser la raison..."
                        className="input-field resize-none text-sm"
                        rows={2}
                        required
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={!reportReason || (reportReason === 'Autre' && !otherReason.trim())}
              className="btn-primary w-full mt-4"
            >
              Envoyer le signalement
            </button>
          </form>
        )}
      </Modal>
    </div>
  )
}

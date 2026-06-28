'use client'

import { useState, useEffect } from 'react'
import { Star, Search, Eye, ArrowRight, ArrowLeft, Trash2, AlertTriangle, CheckCircle, Mail, Ban, XCircle, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import StarRating from '@/components/ui/StarRating'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Modal from '@/components/ui/Modal'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import api from '@/lib/api'
import { AdminService } from '@/services/admin.service'

export default function AdminReviewsPage() {
  const t = useT()
  const lang = useLang()
  const d = translations.adminReviews

  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL')
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null)
  const [userToBan, setUserToBan] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/reviews/admin/all?status=${statusFilter}&page=1`)
      const payload = res.data.data
      setReviews(Array.isArray(payload) ? payload : (payload?.data || []))
    } catch (err) {
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [statusFilter])

  const filtered = reviews.filter(r => {
    return !search ||
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      (r.author?.firstName + ' ' + r.author?.lastName).toLowerCase().includes(search.toLowerCase())
  })

  const handleReject = async (id: string) => {
    try {
      await api.put(`/reviews/${id}/reject`, { reason: 'Admin rejected' })
      toast.success(t(d.deletedMsg))
      load()
    } catch (err) {
      toast.error('Failed to reject review')
    }
  }

  const handleDelete = async () => {
    if (!reviewToDelete) return
    try {
      await api.delete(`/reviews/admin/${reviewToDelete}`)
      toast.success('Commentaire supprimé définitivement')
      setReviewToDelete(null)
      load()
    } catch (err) {
      toast.error('Failed to delete review')
    }
  }

  const handleBanUser = async () => {
    if (!userToBan) return
    try {
      await AdminService.banUser(userToBan)
      toast.success('Utilisateur banni avec succès')
      setUserToBan(null)
    } catch (err) {
      toast.error('Échec du bannissement')
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await api.put(`/reviews/${id}/approve`)
      toast.success('Review approved')
      load()
    } catch (err) {
      toast.error('Failed to approve review')
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
          {t(d.title)}
        </h1>
        <p className="page-subtitle">{reviews.length} {t(d.sub)}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-xs w-full">
          <Search size={14} className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder={t(d.search)} className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto custom-scrollbar">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(s => {
            const lbl = s === 'ALL' ? 'Tous' : s === 'PENDING' ? 'En attente' : s === 'APPROVED' ? 'Approuvés' : 'Rejetés'
            return (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative whitespace-nowrap ${
                  statusFilter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {lbl}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(r => {
          const partner = r.partner
          return (
            <div key={r.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="font-semibold text-gray-900 text-sm">{r.author?.firstName} {r.author?.lastName}</span>
                    {r.author?.email && (
                      <a href={`mailto:${r.author.email}`} className="text-gray-400 hover:text-blue-500 transition-colors" title="Contacter">
                        <Mail size={13} />
                      </a>
                    )}
                    {lang === 'ar' ? <ArrowLeft size={14} className="text-gray-300" /> : <ArrowRight size={14} className="text-gray-300" />}
                    {partner && (
                      <span className="text-xs text-[#C2517A] bg-pink-50 px-2 py-0.5 rounded-full font-medium">
                        {partner.businessName}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                      r.status === 'APPROVED' ? 'bg-green-50 text-green-600' :
                      r.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {r.status === 'APPROVED' ? 'Approuvé' : r.status === 'PENDING' ? 'En attente' : 'Rejeté'}
                    </span>
                  </div>
                  <StarRating rating={r.rating} size={14} />
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{r.comment}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex gap-2">
                    {partner && (
                      <Link href={`/partner/${partner.slug || partner.id}?tab=avis`}
                        className="flex items-center justify-center p-2 text-gray-400 hover:text-[#C2517A] bg-gray-50 hover:bg-pink-50
                                   rounded-lg transition-colors" title={t(d.viewListing)}>
                        <Eye size={16} />
                      </Link>
                    )}
                    {r.status !== 'APPROVED' && (
                      <button onClick={() => handleApprove(r.id)}
                        className="flex items-center justify-center p-2 text-gray-400 hover:text-green-600 bg-gray-50 hover:bg-green-50
                                   rounded-lg transition-colors" title="Approuver">
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {r.status !== 'REJECTED' && (
                      <button onClick={() => handleReject(r.id)}
                        className="flex items-center justify-center p-2 text-gray-400 hover:text-orange-500 bg-gray-50 hover:bg-orange-50
                                   rounded-lg transition-colors" title="Rejeter">
                        <XCircle size={16} />
                      </button>
                    )}
                    <button onClick={() => setReviewToDelete(r.id)}
                      className="flex items-center justify-center p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50
                                 rounded-lg transition-colors" title="Supprimer définitivement">
                      <Trash2 size={16} />
                    </button>
                    <button onClick={() => setUserToBan(r.author?.id)}
                      className="flex items-center justify-center p-2 text-gray-400 hover:text-red-600 bg-red-50 hover:bg-red-100
                                 rounded-lg transition-colors" title="Bannir l'utilisateur">
                      <Ban size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Star size={32} className="mx-auto mb-3 opacity-30" />
            <p>{t(d.noReviews)}</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        title={t(d.deleteTitle)}
        size="sm"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <div>
            <p className="text-gray-700 font-medium">{t(d.deleteConfirm)}</p>
            <p className="text-gray-400 text-sm mt-1">{t(d.deleteWarning)}</p>
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
              {t(d.delete)}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={!!userToBan}
        onClose={() => setUserToBan(null)}
        title="Bannir l'utilisateur"
        size="sm"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <Ban size={28} className="text-red-500" />
          </div>
          <div>
            <p className="text-gray-700 font-medium">Êtes-vous sûr de vouloir bannir cet utilisateur ?</p>
            <p className="text-gray-400 text-sm mt-1">Son compte sera désactivé.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setUserToBan(null)}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleBanUser}
              className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Bannir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Users, Search, MapPin, Mail, Star, Heart, Eye, Phone, AlertTriangle } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { formatDate } from '@/lib/utils'
import StarRating from '@/components/ui/StarRating'
import toast from 'react-hot-toast'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import { AdminService } from '@/services/admin.service'
import api from '@/lib/api'



export default function AdminClientsPage() {
  const t = useT()
  const lang = useLang()
  const d = translations.adminClients

  const [search, setSearch] = useState('')
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClientReviews, setSelectedClientReviews] = useState<string | null>(null)
  const [clientReviews, setClientReviews] = useState<any[]>([])
  const [clientToBlock, setClientToBlock] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await AdminService.getUsers()
        setClients(res.data || [])
      } catch (err) {
        toast.error('Failed to load clients')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = clients.filter(c => {
    const wilayaName = typeof c.wilaya === 'string' ? c.wilaya : (c.wilaya?.name || '');
    return !search ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      wilayaName.toLowerCase().includes(search.toLowerCase());
  })

  const selectedClient = clients.find(c => c.id === selectedClientReviews)

  useEffect(() => {
    if (selectedClientReviews) {
      // Simulate fetching reviews for the user
      setClientReviews([]) // TODO fetch from api
    }
  }, [selectedClientReviews])

  const handleBlock = async () => {
    if (!clientToBlock) return
    try {
      await AdminService.banUser(clientToBlock)
      setClients(prev => prev.filter(c => c.id !== clientToBlock))
      toast.success(t(d.blockedMsg))
    } catch (err) {
      toast.error('Failed to block client')
    } finally {
      setClientToBlock(null)
    }
  }

  const dateLocale = lang === 'ar' ? 'ar-DZ' : 'fr-DZ'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Users size={28} className="text-[#C2517A]" />
          {t(d.title)}
        </h1>
        <p className="page-subtitle">{clients.length} {t(d.sub)}</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder={t(d.search)}
          className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm" value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-pink-50/80 border-b border-pink-100">
              <tr>
                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-gray-700">{t(d.colClient)}</th>
                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-gray-700">{t(d.colWilaya)}</th>
                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-gray-700">{t(d.colReviews)}</th>
                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-gray-700">{t(d.colFavorites)}</th>
                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-gray-700">{t(d.colJoined)}</th>
                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-gray-700">{t(d.colActions)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-pink-50/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C2517A]/20 to-[#7F77DD]/20
                                      flex items-center justify-center text-[#C2517A] font-bold text-xs shrink-0">
                        {c.firstName[0]}{c.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{c.firstName} {c.lastName}</p>
                        <div className="flex flex-col gap-0.5 mt-0.5">
                          <p className="text-xs text-gray-400 flex items-center gap-1.5">
                            <Mail size={10} />{c.email}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1.5" dir="ltr">
                            <Phone size={10} />{c.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-gray-600 text-xs">
                      <MapPin size={11} className="text-[#C2517A]" />{typeof c.wilaya === 'string' ? c.wilaya : c.wilaya?.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-gray-700">
                        <Star size={11} className="text-yellow-400 fill-yellow-400" />{c.reviewCount}
                      </span>
                      {c.reviewCount > 0 && (
                        <button onClick={() => setSelectedClientReviews(c.id)}
                          className="p-1 text-gray-400 hover:text-[#C2517A] hover:bg-pink-50 rounded-lg transition-colors">
                          <Eye size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-gray-700 text-xs">
                      <Heart size={11} className="text-red-400 fill-red-400" /> {c.favCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(c.createdAt || c.joinedAt || Date.now()).toLocaleDateString(dateLocale)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`mailto:${c.email}`}
                        className="text-xs text-[#C2517A] hover:text-[#a8365f] hover:bg-pink-50
                                         px-2 py-1 rounded-lg transition-colors font-medium flex items-center gap-1">
                        <Mail size={12} />
                        {t(d.contact)}
                      </a>
                      <button
                        onClick={() => setClientToBlock(c.id)}
                        className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50
                                         px-2 py-1 rounded-lg transition-colors font-medium">
                        {t(d.block)}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">{t(d.noClients)}</div>
          )}
        </div>
      </div>

      {/* Reviews Modal */}
      <Modal
        isOpen={!!selectedClientReviews}
        onClose={() => setSelectedClientReviews(null)}
        title={`${t(d.reviewsOf)} ${selectedClient?.firstName || ''}`}
        size="md"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {clientReviews.length > 0 ? (
            clientReviews.map(review => {
              return (
                <div key={review.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{review.partner?.businessName || '—'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={review.rating} size={12} />
                        <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              {t(d.noReviews)}
            </div>
          )}
        </div>
      </Modal>

      {/* Block Confirmation Modal */}
      <Modal
        isOpen={!!clientToBlock}
        onClose={() => setClientToBlock(null)}
        title={t(d.blockTitle)}
        size="sm"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <div>
            <p className="text-gray-700 font-medium">{t(d.blockConfirm)}</p>
            <p className="text-gray-400 text-sm mt-1">{t(d.blockDesc)}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setClientToBlock(null)}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {t(d.cancel)}
            </button>
            <button
              onClick={handleBlock}
              className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors"
            >
              {t(d.blockYes)}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

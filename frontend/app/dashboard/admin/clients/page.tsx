'use client'

import { useState, useEffect } from 'react'
import { Users, Search, MapPin, Mail, Star, Heart, Eye, Phone, AlertTriangle, ShieldOff, ShieldCheck, X } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { formatDate } from '@/lib/utils'
import StarRating from '@/components/ui/StarRating'
import toast from 'react-hot-toast'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import { AdminService } from '@/services/admin.service'
import api from '@/lib/api'

type FilterStatus = 'all' | 'active' | 'blocked'

export default function AdminClientsPage() {
  const t = useT()
  const lang = useLang()
  const d = translations.adminClients

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClientReviews, setSelectedClientReviews] = useState<string | null>(null)
  const [clientReviews, setClientReviews] = useState<any[]>([])
  const [clientToBlock, setClientToBlock] = useState<string | null>(null)
  const [clientToUnblock, setClientToUnblock] = useState<string | null>(null)

  const load = async (status?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (status && status !== 'all') params.set('status', status)
      const res = await api.get(`/admin/users?${params.toString()}`)
      setClients((res.data?.data ?? res.data) || [])
    } catch (err) {
      toast.error('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(filterStatus)
  }, [filterStatus])

  const filtered = clients.filter(c => {
    const wilayaName = typeof c.wilaya === 'string' ? c.wilaya : (c.wilaya?.name || '')
    return !search ||
      `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase().includes(search.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
      wilayaName.toLowerCase().includes(search.toLowerCase())
  })

  const selectedClient = clients.find(c => c.id === selectedClientReviews)

  useEffect(() => {
    if (selectedClientReviews) {
      setClientReviews([]) // TODO: fetch reviews for this user
    }
  }, [selectedClientReviews])

  const handleBlock = async () => {
    if (!clientToBlock) return
    try {
      await AdminService.banUser(clientToBlock)
      // Update local state: mark user as blocked, don't remove
      setClients(prev => prev.map(c => c.id === clientToBlock ? { ...c, isActive: false } : c))
      toast.success(t(d.blockedMsg))
    } catch (err) {
      toast.error('Failed to block client')
    } finally {
      setClientToBlock(null)
    }
  }

  const handleUnblock = async () => {
    if (!clientToUnblock) return
    try {
      await api.put(`/admin/users/${clientToUnblock}/unban`)
      // Update local state: mark user as active again
      setClients(prev => prev.map(c => c.id === clientToUnblock ? { ...c, isActive: true } : c))
      toast.success('Client débloqué avec succès')
    } catch (err) {
      toast.error('Failed to unblock client')
    } finally {
      setClientToUnblock(null)
    }
  }

  const dateLocale = lang === 'ar' ? 'ar-DZ' : 'fr-DZ'

  const activeCount = clients.filter(c => c.isActive !== false).length
  const blockedCount = clients.filter(c => c.isActive === false).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Users size={28} className="text-[#C2517A]" />
          {t(d.title)}
        </h1>
        <p className="page-subtitle">{clients.length} {t(d.sub)}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <Search size={15} className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder={t(d.search)}
            className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm" value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {([
            { key: 'all', label: `Tous (${clients.length})` },
            { key: 'active', label: `Actifs (${activeCount})` },
            { key: 'blocked', label: `Bloqués (${blockedCount})` },
          ] as { key: FilterStatus; label: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterStatus === tab.key
                  ? 'bg-white shadow-sm text-[#C2517A]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-pink-50/80 border-b border-pink-100">
              <tr>
                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-gray-700">{t(d.colClient)}</th>
                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-gray-700">{t(d.colWilaya)}</th>
                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-gray-700">Statut</th>
                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-gray-700">{t(d.colJoined)}</th>
                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-gray-700">{t(d.colActions)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {filtered.map(c => (
                <tr key={c.id} className={`hover:bg-pink-50/30 transition-colors ${c.isActive === false ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C2517A]/20 to-[#7F77DD]/20
                                      flex items-center justify-center text-[#C2517A] font-bold text-xs shrink-0">
                        {c.firstName?.[0]}{c.lastName?.[0]}
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
                      <MapPin size={11} className="text-[#C2517A]" />{typeof c.wilaya === 'string' ? c.wilaya : c.wilaya?.name || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {c.isActive === false ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                        <ShieldOff size={10} /> Bloqué
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <ShieldCheck size={10} /> Actif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(c.createdAt || Date.now()).toLocaleDateString(dateLocale)}
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
                      {c.isActive === false ? (
                        <button
                          onClick={() => setClientToUnblock(c.id)}
                          className="text-xs text-green-600 hover:text-green-700 hover:bg-green-50
                                           px-2 py-1 rounded-lg transition-colors font-medium flex items-center gap-1">
                          <ShieldCheck size={12} />
                          Débloquer
                        </button>
                      ) : (
                        <button
                          onClick={() => setClientToBlock(c.id)}
                          className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50
                                           px-2 py-1 rounded-lg transition-colors font-medium flex items-center gap-1">
                          <ShieldOff size={12} />
                          {t(d.block)}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-pink-100 border-t-[#C2517A] rounded-full animate-spin" />
            </div>
          )}
          {!loading && filtered.length === 0 && (
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
            clientReviews.map(review => (
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
            ))
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
            <ShieldOff size={28} className="text-red-400" />
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
              className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ShieldOff size={14} /> {t(d.blockYes)}
            </button>
          </div>
        </div>
      </Modal>

      {/* Unblock Confirmation Modal */}
      <Modal
        isOpen={!!clientToUnblock}
        onClose={() => setClientToUnblock(null)}
        title="Débloquer le client"
        size="sm"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto">
            <ShieldCheck size={28} className="text-green-500" />
          </div>
          <div>
            <p className="text-gray-700 font-medium">Confirmer le déblocage ?</p>
            <p className="text-gray-400 text-sm mt-1">Ce client pourra à nouveau se connecter à son compte. Un email de notification lui sera envoyé.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setClientToUnblock(null)}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleUnblock}
              className="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck size={14} /> Débloquer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

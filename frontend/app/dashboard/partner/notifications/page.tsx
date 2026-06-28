'use client'

import { useState, useEffect } from 'react'
import { Bell, Star, CreditCard, CheckSquare, Megaphone, Trash2, Check, RefreshCw } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import { NotificationsService, type Notification } from '@/services/notifications.service'
import toast from 'react-hot-toast'

function getNotifIcon(type: string) {
  switch (type) {
    case 'NEW_REVIEW': return Star
    case 'SUBSCRIPTION': return CreditCard
    case 'PROFILE_VALIDATED': return CheckSquare
    case 'BROADCAST': return Megaphone
    default: return Bell
  }
}

function getNotifColor(type: string): string {
  switch (type) {
    case 'NEW_REVIEW': return 'text-yellow-400'
    case 'SUBSCRIPTION': return 'text-[#7F77DD]'
    case 'PROFILE_VALIDATED': return 'text-green-500'
    case 'BROADCAST': return 'text-[#C2517A]'
    default: return 'text-gray-400'
  }
}

export default function PartnerNotificationsPage() {
  const t = useT()
  const lang = useLang()
  const d = translations.clientNotifications

  const [notifs, setNotifs] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadNotifs = async (p = 1) => {
    setLoading(true)
    try {
      const result = await NotificationsService.getAll(p)
      setNotifs(result.data)
      setTotalPages(result.meta.totalPages)
    } catch (err) {
      toast.error('Erreur lors du chargement des notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifs(page)
  }, [page])

  const unread = notifs.filter(n => !n.isRead).length

  const handleMarkRead = async (id: string) => {
    try {
      await NotificationsService.markRead(id)
      setNotifs(ns => ns.map(x => x.id === id ? { ...x, isRead: true } : x))
    } catch {
      // silent fail
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await NotificationsService.markAllRead()
      setNotifs(ns => ns.map(n => ({ ...n, isRead: true })))
      toast.success('Toutes les notifications marquées comme lues')
    } catch {
      toast.error('Erreur')
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      await NotificationsService.deleteOne(id)
      setNotifs(ns => ns.filter(x => x.id !== id))
    } catch {
      toast.error('Erreur lors de la suppression')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Bell size={28} className="text-[#C2517A]" />
            {t(d.title)}
            {unread > 0 && <span className="badge-pro text-xs">{unread}</span>}
          </h1>
          <p className="page-subtitle">
            {unread} {unread !== 1 ? t(d.unreadSubPlural) : t(d.unreadSub)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => loadNotifs(page)}
            className="p-2 text-gray-400 hover:text-[#C2517A] hover:bg-pink-50 rounded-xl transition-colors"
            title="Actualiser">
            <RefreshCw size={16} />
          </button>
          {unread > 0 && (
            <button onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 text-sm text-[#C2517A] hover:underline">
              <Check size={14} /> {t(d.markAllRead)}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-pink-100 border-t-[#C2517A] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {notifs.length === 0 ? (
            <div className="card p-8 flex flex-col items-center justify-center text-center text-gray-400">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <Bell size={28} className="text-gray-300" />
              </div>
              <p className="font-semibold text-gray-600 mb-1">{t(d.noNotifsTitle)}</p>
              <p className="text-sm text-gray-400">{t(d.noNotifsSub)}</p>
            </div>
          ) : notifs.map(n => {
            const Icon = getNotifIcon(n.type)
            return (
              <div key={n.id}
                className={`card p-4 flex items-start gap-4 cursor-pointer transition-all duration-150
                            ${!n.isRead ? 'border-[#C2517A]/20 bg-pink-50/30' : ''}`}
                onClick={() => !n.isRead && handleMarkRead(n.id)}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-pink-100 flex items-center justify-center shadow-sm shrink-0">
                  <Icon size={18} className={getNotifColor(n.type)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-semibold ${!n.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {n.title}
                      {!n.isRead && <span className="ml-2 rtl:mr-2 rtl:ml-0 inline-block w-2 h-2 rounded-full bg-[#C2517A] align-middle" />}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap" dir="ltr">{formatDate(n.createdAt)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  {n.link && (
                    <a href={n.link} className="text-xs text-[#C2517A] hover:underline mt-1 block" onClick={e => e.stopPropagation()}>
                      Voir plus →
                    </a>
                  )}
                </div>
                <button onClick={(e) => handleDelete(e, n.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50 shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
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

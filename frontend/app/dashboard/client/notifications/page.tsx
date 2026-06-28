'use client'

import { useState } from 'react'
import { Bell, Heart, Star, Shield, Info, Check, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

import { useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { NotificationsService, type Notification } from '@/services/notifications.service'
import toast from 'react-hot-toast'

function getNotifIcon(type: string) {
  switch (type) {
    case 'NEW_REVIEW': return Star
    case 'SUBSCRIPTION': return Shield
    case 'PROFILE_VALIDATED': return Check
    case 'BROADCAST': return Info
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

export default function ClientNotificationsPage() {
  const t = useT()
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

  const markAll = async () => {
    try {
      await NotificationsService.markAllRead()
      setNotifs(ns => ns.map(n => ({ ...n, isRead: true })))
    } catch {
      toast.error('Erreur')
    }
  }

  const markRead = async (id: string) => {
    try {
      await NotificationsService.markRead(id)
      setNotifs(ns => ns.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch {
      // silent fail
    }
  }

  const remove = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      await NotificationsService.deleteOne(id)
      setNotifs(ns => ns.filter(n => n.id !== id))
    } catch {
      toast.error('Erreur lors de la suppression')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Bell size={28} className="text-[#C2517A]" />
            {t(d.title)}
            {unread > 0 && (
              <span className="badge-pro text-xs">{unread}</span>
            )}
          </h1>
          <p className="page-subtitle">{unread} {unread > 1 ? t(d.unreadSubPlural) : t(d.unreadSub)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => loadNotifs(page)}
            className="p-2 text-gray-400 hover:text-[#C2517A] hover:bg-pink-50 rounded-xl transition-colors"
            title="Actualiser">
            <RefreshCw size={16} />
          </button>
          {unread > 0 && (
            <button onClick={markAll} className="flex items-center gap-1.5 text-sm text-[#C2517A] hover:underline">
              <Check size={14} /> {t(d.markAllRead)}
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-pink-100 border-t-[#C2517A] rounded-full animate-spin" />
        </div>
      ) : notifs.length > 0 ? (
        <div className="space-y-3">
          {notifs.map(n => {
            const Icon = getNotifIcon(n.type)
            return (
              <div key={n.id}
                className={`card p-4 flex items-start gap-4 transition-all duration-200 cursor-pointer
                            ${!n.isRead ? 'border-[#C2517A]/20 bg-pink-50/30' : ''}`}
                onClick={() => !n.isRead && markRead(n.id)}
              >
                <div className={`w-10 h-10 rounded-xl bg-white border border-pink-100 flex items-center justify-center shrink-0 shadow-sm`}>
                  <Icon size={18} className={getNotifColor(n.type)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${!n.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {n.title}
                      {!n.isRead && <span className="ml-2 rtl:mr-2 inline-block w-2 h-2 rounded-full bg-[#C2517A] align-middle" />}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{formatDate(n.createdAt)}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{n.message}</p>
                </div>
                <button onClick={(e) => remove(e, n.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50 shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <Bell size={40} className="mx-auto text-gray-200 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t(d.noNotifsTitle)}</h3>
          <p className="text-gray-500">{t(d.noNotifsSub)}</p>
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

'use client'

import { useState, useRef, useEffect } from 'react'
import { Megaphone, Plus, Trash2, Send, Users, Briefcase, Bell, Calendar, ArrowRight, ArrowLeft, AlertTriangle, MapPin, Tag, Search, X, ChevronDown, RefreshCw, User } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/Modal'
import { WILAYAS } from '@/lib/constants'
import { CategoriesService } from '@/services/categories.service'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import api from '@/lib/api'

// --- SearchSelect Component ---
function SearchSelect({
  label, placeholder, items, value, onChange, icon: Icon, noResultsTxt
}: {
  label: string
  placeholder: string
  items: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  icon?: React.ElementType
  noResultsTxt: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const filtered = items.filter(i =>
    i.label.toLowerCase().includes(query.toLowerCase())
  )

  const selected = items.find(i => i.value === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="form-group">
      <label className="label">{label}</label>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => { setOpen(!open); setQuery('') }}
          className="input-field text-sm flex items-center justify-between w-full"
        >
          <span className="flex items-center gap-2 text-gray-700">
            {Icon && <Icon size={14} className="text-gray-400" />}
            {selected ? selected.label : <span className="text-gray-400">{placeholder}</span>}
          </span>
          <div className="flex items-center gap-1">
            {value && (
              <span onClick={e => { e.stopPropagation(); onChange(''); setQuery('') }}
                className="p-0.5 hover:text-red-500 text-gray-400 rounded">
                <X size={12} />
              </span>
            )}
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 rtl:left-auto rtl:right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-8 pr-3 rtl:pr-8 rtl:pl-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#C2517A]"
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">{noResultsTxt}</p>
              ) : filtered.map(item => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => { onChange(item.value); setOpen(false); setQuery('') }}
                  className={`w-full text-left rtl:text-right px-3 py-2 text-sm transition-colors hover:bg-pink-50 hover:text-[#C2517A] ${
                    value === item.value ? 'bg-pink-50 text-[#C2517A] font-medium' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface BroadcastLog {
  id: string
  title: string
  message: string
  target: string
  sentAt: string
  count: number
}

export default function AdminNotificationsPage() {
  const t = useT()
  const lang = useLang()
  const d = translations.adminNotifications

  const [notifs, setNotifs] = useState<BroadcastLog[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', target: 'all', wilaya: '', category: '', specificEmails: '' })
  const [sending, setSending] = useState(false)
  const [notifToDelete, setNotifToDelete] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])

  const loadHistory = async () => {
    setLoadingHistory(true)
    try {
      const res = await api.get('/notifications/broadcast/history')
      const payload = res.data?.data ?? res.data
      const logs = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : [])
      setNotifs(logs)
    } catch (err) {
      console.error('Failed to load broadcast history', err)
      setNotifs([])
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    CategoriesService.getAll().then(res => setCategories(res)).catch(console.error)
    loadHistory()
  }, [])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    
    try {
      const res = await api.post('/notifications/broadcast', {
        title: form.title,
        message: form.body,
        target: form.target,
        wilayaId: form.wilaya || undefined,
        categorySlug: form.category || undefined,
        specificEmails: form.specificEmails || undefined,
      })

      const targetStr = form.target === 'all' ? t(d.targetAll) : form.target === 'partners' ? t(d.targetPartners) : form.target === 'specific' ? t((d as any).targetSpecific) : t(d.targetClients)
      const filterStr = [
        form.wilaya ? `${t(d.wilayaOpt)} : ${WILAYAS.find(w => w.id === form.wilaya)?.name}` : '',
        form.category ? `${t(d.catOpt)} : ${categories.find(c => c.slug === form.category)?.name}` : '',
      ].filter(Boolean).join(', ')
      
      toast.success(`${t(d.sentMsgPart1)} ${targetStr}${filterStr ? ` (${filterStr})` : ''} !`)
      setShowForm(false)
      setForm({ title: '', body: '', target: 'all', wilaya: '', category: '', specificEmails: '' })
      // Reload history from backend
      await loadHistory()
    } catch (err) {
      toast.error('Failed to send broadcast')
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async () => {
    if (!notifToDelete) return
    try {
      await api.delete(`/notifications/broadcast/log/${notifToDelete}`)
      toast.success(t(d.deletedMsg))
      setNotifToDelete(null)
      await loadHistory()
    } catch (err) {
      // If API fails, remove from local state only
      setNotifs(prev => prev.filter(n => n.id !== notifToDelete))
      toast.success(t(d.deletedMsg))
      setNotifToDelete(null)
    }
  }

  const targetIcon = { all: Bell, partners: Briefcase, clients: Users, specific: User }
  const targetLabel = { all: t(d.targetAll), partners: t(d.targetPartners), clients: t(d.targetClients), specific: t((d as any).targetSpecific) }

  const wilayaItems = WILAYAS.map(w => ({ value: w.id, label: w.name }))
  const categoryItems = categories.map(c => ({ value: c.slug, label: c.name }))

  const showFilters = form.target === 'partners' || form.target === 'clients'

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Megaphone size={28} className="text-[#C2517A]" />
            {t(d.title)}
          </h1>
          <p className="page-subtitle">{t(d.sub)}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
          <Plus size={15} /> {t(d.newNotif)}
        </button>
      </div>

      {/* Compose Form */}
      {showForm && (
        <div className="card p-6 border-[#C2517A]/30">
          <h3 className="font-bold text-gray-900 mb-4">{t(d.compose)}</h3>
          <form onSubmit={handleSend} className="space-y-4">
            {/* Cible */}
            <div className="form-group">
              <label className="label">{t(d.target)}</label>
              <select className="input-field text-sm" value={form.target}
                onChange={e => setForm(p => ({ ...p, target: e.target.value, wilaya: '', category: '', specificEmails: '' }))}>
                <option value="all">{t(d.targetAll)}</option>
                <option value="partners">{t(d.targetPartners)}</option>
                <option value="clients">{t(d.targetClients)}</option>
                <option value="specific">{t((d as any).targetSpecific)}</option>
              </select>
            </div>

            {/* Email Input for Specific target */}
            {form.target === 'specific' && (
              <div className="form-group">
                <label className="label">{t((d as any).emailsField)}</label>
                <input type="text" required className="input-field text-sm"
                  value={form.specificEmails} onChange={e => setForm(p => ({ ...p, specificEmails: e.target.value }))}
                  placeholder={t((d as any).emailsPlaceholder)} />
              </div>
            )}

            {/* Filtres selon la cible */}
            {showFilters && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t(d.refineBy)}</p>
                <div className="grid grid-cols-2 gap-3">
                  <SearchSelect
                    label={t(d.wilayaOpt)}
                    placeholder={t(d.allWilayas)}
                    items={wilayaItems}
                    value={form.wilaya}
                    onChange={v => setForm(p => ({ ...p, wilaya: v }))}
                    icon={MapPin}
                    noResultsTxt={t(d.noResults)}
                  />
                  {form.target === 'partners' && (
                    <SearchSelect
                      label={t(d.catOpt)}
                      placeholder={t(d.allCats)}
                      items={categoryItems}
                      value={form.category}
                      onChange={v => setForm(p => ({ ...p, category: v }))}
                      icon={Tag}
                      noResultsTxt={t(d.noResults)}
                    />
                  )}
                </div>
                {(form.wilaya || form.category) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {form.wilaya && (
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                        <MapPin size={10} />
                        {WILAYAS.find(w => w.id === form.wilaya)?.name}
                        <button type="button" onClick={() => setForm(p => ({ ...p, wilaya: '' }))} className="ml-1 rtl:mr-1 hover:text-red-500">
                          <X size={10} />
                        </button>
                      </span>
                    )}
                    {form.category && (
                      <span className="inline-flex items-center gap-1 text-xs bg-pink-50 text-[#C2517A] px-2 py-1 rounded-full font-medium">
                        <Tag size={10} />
                        {categories.find(c => c.slug === form.category)?.name}
                        <button type="button" onClick={() => setForm(p => ({ ...p, category: '' }))} className="ml-1 rtl:mr-1 hover:text-red-500">
                          <X size={10} />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="label">{t(d.titleField)}</label>
              <input type="text" required maxLength={80} className="input-field text-sm"
                value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder={t(d.titlePlaceholder)} />
            </div>
            <div className="form-group">
              <label className="label">{t(d.messageField)}</label>
              <textarea required rows={3} maxLength={200} className="input-field text-sm resize-none"
                value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                placeholder={t(d.messagePlaceholder)} />
              <p className="text-xs text-gray-400 mt-1" dir="ltr">{form.body.length}/200</p>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={sending} className="btn-primary text-sm py-2.5">
                {sending
                  ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t(d.sending)}</span>
                  : <span className="flex items-center gap-2"><Send size={15} />{t(d.send)}</span>
                }
              </button>
              <button type="button" onClick={() => { setShowForm(false); setForm({ title: '', body: '', target: 'all', wilaya: '', category: '', specificEmails: '' }) }} className="btn-ghost text-sm">
                {t(d.cancel)}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sent notifications */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">{t(d.historyTitle)}</h2>
        <button onClick={loadHistory} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Rafraîchir">
          <RefreshCw size={14} className={loadingHistory ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="space-y-4">
        {loadingHistory ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-pink-100 border-t-[#C2517A] rounded-full animate-spin" />
          </div>
        ) : notifs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Megaphone size={32} className="mx-auto mb-3 opacity-30" />
            <p>{t(d.noNotifs)}</p>
          </div>
        ) : notifs.map(n => {
          const TargetIcon = targetIcon[n.target as keyof typeof targetIcon] ?? Bell
          const sentDate = new Date(n.sentAt).toLocaleDateString('fr-DZ')
          return (
            <div key={n.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C2517A] to-[#7F77DD]
                                  flex items-center justify-center shadow-md shrink-0">
                    <TargetIcon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1" dir="ltr"><Calendar size={12} /> {sentDate}</span>
                      <span className="flex items-center gap-1"><Users size={12} /> <span dir="ltr">{n.count.toLocaleString('fr-DZ')}</span> {t(d.recipients)}</span>
                      <span className="text-[#C2517A] flex items-center gap-1">
                        {lang === 'ar' ? <ArrowLeft size={12} /> : <ArrowRight size={12} />} 
                        {targetLabel[n.target as keyof typeof targetLabel] ?? n.target}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setNotifToDelete(n.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!notifToDelete}
        onClose={() => setNotifToDelete(null)}
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
              onClick={() => setNotifToDelete(null)}
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
    </div>
  )
}

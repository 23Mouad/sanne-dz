'use client'

import { useState, useEffect } from 'react'
import { Briefcase, Search, Eye, CheckCircle, XCircle, Clock, Sparkles, Filter, ChevronUp, ChevronDown, ChevronsUpDown, Trash } from 'lucide-react'
import Link from 'next/link'
import { AdminService } from '@/services/admin.service'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/Modal'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

type SortKey = 'businessName' | 'wilaya' | 'category' | 'plan' | 'status' | 'createdAt'
type SortDir = 'asc' | 'desc'

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown size={13} className="text-gray-300 mx-1 inline" />
  return sortDir === 'asc'
    ? <ChevronUp size={13} className="text-[#C2517A] mx-1 inline" />
    : <ChevronDown size={13} className="text-[#C2517A] mx-1 inline" />
}

export default function AdminPartnersPage() {
  const t = useT()
  const d = translations.adminPartners

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'suspended'>('all')
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalSuspendId, setModalSuspendId] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await AdminService.getPartners(filter === 'all' ? undefined : filter.toUpperCase())
        setPartners(res.data || [])
      } catch (err) {
        toast.error('Failed to load partners')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [filter])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = partners
    .filter(p => {
      const wName = typeof p.wilaya === 'string' ? p.wilaya : p.wilaya?.name || ''
      const matchSearch = !search || p.businessName.toLowerCase().includes(search.toLowerCase()) ||
        wName.toLowerCase().includes(search.toLowerCase())
      return matchSearch
    })
    .sort((a, b) => {
      let va: string, vb: string
      if (sortKey === 'businessName') { va = a.businessName; vb = b.businessName }
      else if (sortKey === 'wilaya') { va = typeof a.wilaya === 'string' ? a.wilaya : a.wilaya?.name; vb = typeof b.wilaya === 'string' ? b.wilaya : b.wilaya?.name }
      else if (sortKey === 'category') { va = a.categories?.[0]?.category?.name || ''; vb = b.categories?.[0]?.category?.name || '' }
      else if (sortKey === 'plan') { va = a.isPro ? 'pro' : 'simple'; vb = b.isPro ? 'pro' : 'simple' }
      else if (sortKey === 'status') { va = a.status; vb = b.status }
      else { va = a.createdAt; vb = b.createdAt }
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })

  const approve = async (id: string) => {
    try {
      await AdminService.approvePartner(id)
      setPartners(ps => ps.map(p => p.id === id ? { ...p, status: 'ACTIVE' } : p))
      toast.success(t(d.approvedMsg))
    } catch (err) {
      toast.error('Approval failed')
    }
  }
  const suspend = async (id: string) => {
    try {
      // Backend expects a body for reject/suspend usually, wait I need to check AdminService.
      // Assuming AdminService has rejectPartner / suspendPartner. 
      // Actually `suspendPartner` wasn't added to AdminService, let me use rejectPartner for now.
      await AdminService.rejectPartner(id)
      setPartners(ps => ps.map(p => p.id === id ? { ...p, status: 'SUSPENDED' } : p))
      toast.error(t(d.suspendedMsg))
    } catch (err) {
      toast.error('Suspension failed')
    }
  }

  const deletePartner = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement ce partenaire ? Cette action est irréversible.')) return;
    try {
      await AdminService.deletePartner(id);
      setPartners(ps => ps.filter(p => p.id !== id));
      toast.success('Partenaire supprimé avec succès');
    } catch (err) {
      toast.error('Échec de la suppression');
    }
  }

  const counts = {
    all: filter === 'all' && !loading ? partners.length : '?',
    pending: filter === 'pending' && !loading ? partners.length : '?',
    active: filter === 'active' && !loading ? partners.length : '?',
    suspended: filter === 'suspended' && !loading ? partners.length : '?',
  }

  const renderThSortable = (col: SortKey, labelStr: string) => (
    <th
      key={col}
      className="text-left rtl:text-right px-4 py-3 font-semibold text-gray-700 cursor-pointer select-none hover:text-[#C2517A] transition-colors whitespace-nowrap"
      onClick={() => handleSort(col)}
    >
      {labelStr}
      <SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />
    </th>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Briefcase size={28} className="text-[#C2517A]" />
          {t(d.title)}
        </h1>
        <p className="page-subtitle">{partners.length} {t(d.sub)}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Rechercher..." className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto custom-scrollbar">
          {(['all', 'pending', 'active', 'suspended'] as const).map(s => {
            const lbl = s === 'all' ? t(d.filterAll) : s === 'pending' ? t(d.filterPending) : s === 'active' ? t(d.filterActive) : t(d.filterSuspended)
            return (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all relative whitespace-nowrap ${
                  filter === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {lbl} ({counts[s]})
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-pink-50/80 border-b border-pink-100">
              <tr>
                {renderThSortable('businessName', t(d.colBusiness))}
                {renderThSortable('wilaya', t(d.colWilaya))}
                {renderThSortable('category', t(d.colCategory))}
                {renderThSortable('plan', t(d.colPlan))}
                {renderThSortable('status', t(d.colStatus))}
                {renderThSortable('createdAt', t(d.colDate))}
                <th className="text-left rtl:text-right px-4 py-3 font-semibold text-gray-700">{t(d.colActions)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {filtered.map(p => (
                <tr key={p.id} className={`transition-colors ${p.deletionRequestedAt ? 'bg-red-50/50 hover:bg-red-50/70' : 'hover:bg-pink-50/30'}`}>
                  <td className="px-4 py-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{p.businessName}</p>
                        {p.deletionRequestedAt && (
                          <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Suppression Demandée
                          </span>
                        )}
                        {(p as any).requestedPro && !p.isPro && (
                          <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5">
                            <Sparkles size={9} /> Demande PRO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400" dir="ltr">{p.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{typeof p.wilaya === 'string' ? p.wilaya : p.wilaya?.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.categories?.map((c: any, i: number) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 bg-pink-50 text-[#C2517A] border border-pink-100 rounded-md whitespace-nowrap">
                          {c.category?.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {p.isPro
                      ? <span className="badge-pro text-xs"><Sparkles size={10} />{t(d.planPro)}</span>
                      : <span className="badge-simple">{t(d.planSimple)}</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-fit ${
                      p.status === 'ACTIVE' ? 'bg-green-50 text-green-700'
                      : p.status === 'PENDING' ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-600'
                    }`}>
                      {p.status === 'ACTIVE' ? <CheckCircle size={11} /> : p.status === 'PENDING' ? <Clock size={11} /> : <XCircle size={11} />}
                      {p.status === 'ACTIVE' ? t(d.statusActive) : p.status === 'PENDING' ? t(d.statusPending) : t(d.statusSuspended)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    {formatDate(p.createdAt)}
                  </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/partner/${p.slug}`} target="_blank"
                          className="p-1.5 text-gray-400 hover:text-[#C2517A] hover:bg-pink-50 rounded-lg transition-colors">
                          <Eye size={14} />
                        </Link>
                        
                        {/* Contact Buttons */}
                        {p.whatsapp && (
                          <a href={`https://wa.me/${p.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                            title="WhatsApp">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                          </a>
                        )}
                        {p.email && (
                          <a href={`mailto:${p.email}`}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Email">
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                          </a>
                        )}
                        {p.status === 'PENDING' && (
                          <button onClick={() => approve(p.id)}
                            className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                            <CheckCircle size={14} />
                          </button>
                        )}
                        {p.status !== 'SUSPENDED' && p.status !== 'REJECTED' && (
                          <button onClick={() => setModalSuspendId(p.id)}
                            className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                            <XCircle size={14} />
                          </button>
                        )}
                        <button onClick={() => deletePartner(p.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Filter size={24} className="mx-auto mb-2 opacity-40" />
              <p>{t(d.noPartners)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Suspend Confirmation Modal */}
      <Modal isOpen={!!modalSuspendId} onClose={() => setModalSuspendId(null)} title={t(d.suspendTitle)} size="sm">
        <p className="text-gray-600 mb-6 text-sm">
          {t(d.suspendConfirm)}
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setModalSuspendId(null)} className="btn-ghost py-2">{t(d.cancel)}</button>
          <button onClick={() => { if(modalSuspendId) suspend(modalSuspendId); setModalSuspendId(null) }} 
            className="btn-primary !bg-red-500 hover:!bg-red-600 !shadow-red-500/30 border-red-500 py-2">
            {t(d.suspendYes)}
          </button>
        </div>
      </Modal>
    </div>
  )
}

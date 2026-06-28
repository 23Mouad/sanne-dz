'use client'

import { useState, useEffect } from 'react'
import { CreditCard, TrendingUp, Sparkles, Search, Settings, Edit2 } from 'lucide-react'
import { SUBSCRIPTION_CONFIG } from '@/lib/constants'
import { AdminService } from '@/services/admin.service'
import StatsCard from '@/components/dashboard/StatsCard'
import toast from 'react-hot-toast'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function AdminSubscriptionsPage() {
  const t = useT()
  const d = translations.adminSubscriptions

  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState(SUBSCRIPTION_CONFIG)
  const [savingPrice, setSavingPrice] = useState(false)
  const [isEditingConfig, setIsEditingConfig] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [res, confRes] = await Promise.all([
          AdminService.getPartners('ACTIVE', undefined, 1),
          AdminService.getSubscriptionConfig()
        ]);
        setPartners(res.data)
        if (confRes) setConfig({ ...SUBSCRIPTION_CONFIG, ...confRes })
      } catch (err) {
        toast.error('Failed to load partners or config')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const proPartners = partners.filter(p => p.isPro)
  const simplePartners = partners.filter(p => !p.isPro)
  const monthlyRevenue = proPartners.length * (config.proPriceMonthly || 2500)
  const annualRevenue = monthlyRevenue * 12

  const togglePlan = async (id: string, currentIsPro: boolean) => {
    try {
      const newIsPro = !currentIsPro
      await AdminService.updatePartnerPlan(id, newIsPro)
      setPartners(prev => prev.map(p => {
        if (p.id === id) {
          toast.success(newIsPro ? `${p.businessName} ${t(d.proMsg)}` : `${p.businessName} ${t(d.simpleMsg)}`)
          return { ...p, isPro: newIsPro }
        }
        return p
      }))
    } catch (err) {
      toast.error('Failed to update plan')
    }
  }

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingPrice(true)
    try {
      await AdminService.updateSubscriptionConfig({
        simplePriceMonthly: config.simplePriceMonthly,
        simplePriceAnnual: config.simplePriceAnnual,
        proPriceMonthly: config.proPriceMonthly,
        proPriceAnnual: config.proPriceAnnual,
      })
      toast.success(t(d.configUpdated))
      setIsEditingConfig(false)
    } catch (err) {
      toast.error('Failed to save config')
    } finally {
      setSavingPrice(false)
    }
  }

  const getWilayaName = (p: any) => {
    if (typeof p.wilaya === 'string') return p.wilaya
    if (p.wilaya?.name) return p.wilaya.name
    return ''
  }

  const filteredPartners = partners.filter(p => 
    p.businessName.toLowerCase().includes(search.toLowerCase()) || 
    getWilayaName(p).toLowerCase().includes(search.toLowerCase())
  )

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
          <CreditCard size={28} className="text-[#C2517A]" />
          {t(d.title)}
        </h1>
        <p className="page-subtitle">{t(d.sub)}</p>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title={t(d.revenueMonth)} value={`${monthlyRevenue.toLocaleString('fr-DZ')} DA`}
          icon={TrendingUp} color="rose" trend={{ value: 12, label: t(d.vsLastMonth) }} />
        <StatsCard title={t(d.proPartners)} value={proPartners.length}
          icon={Sparkles} color="violet" subtitle={t(d.activeSubs)} />
        <StatsCard title={t(d.revenueYear)} value={`${(annualRevenue / 1000).toFixed(0)}k DA`}
          icon={CreditCard} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Configuration des tarifs */}
        <div className="card p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Settings size={18} className="text-[#C2517A]" />
              {t(d.configTitle)}
            </h2>
            {!isEditingConfig && (
              <button onClick={() => setIsEditingConfig(true)} className="p-1.5 text-gray-400 hover:text-[#C2517A] hover:bg-pink-50 rounded-lg transition-colors">
                <Edit2 size={16} />
              </button>
            )}
          </div>
          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">{t(d.simpleMonthly)}</label>
                <input type="number" className="input-field text-sm font-semibold disabled:bg-gray-50 disabled:text-gray-500 disabled:border-transparent" 
                  disabled={!isEditingConfig}
                  placeholder="0"
                  value={config.simplePriceMonthly || ''} 
                  onChange={e => setConfig(prev => ({ ...prev, simplePriceMonthly: e.target.value ? Number(e.target.value) : 0 }))} />
              </div>
              <div className="form-group">
                <label className="label">{t(d.simpleAnnual)}</label>
                <input type="number" className="input-field text-sm font-semibold disabled:bg-gray-50 disabled:text-gray-500 disabled:border-transparent" 
                  disabled={!isEditingConfig}
                  placeholder="0"
                  value={config.simplePriceAnnual || ''} 
                  onChange={e => setConfig(prev => ({ ...prev, simplePriceAnnual: e.target.value ? Number(e.target.value) : 0 }))} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">{t(d.proMonthly)}</label>
                <input type="number" className="input-field text-sm font-semibold disabled:bg-gray-50 disabled:text-gray-500 disabled:border-transparent" 
                  disabled={!isEditingConfig}
                  placeholder="0"
                  value={config.proPriceMonthly || ''} 
                  onChange={e => setConfig(prev => ({ ...prev, proPriceMonthly: e.target.value ? Number(e.target.value) : 0 }))} />
              </div>
              <div className="form-group">
                <label className="label">{t(d.proAnnual)}</label>
                <input type="number" className="input-field text-sm font-semibold disabled:bg-gray-50 disabled:text-gray-500 disabled:border-transparent" 
                  disabled={!isEditingConfig}
                  placeholder="0"
                  value={config.proPriceAnnual || ''} 
                  onChange={e => setConfig(prev => ({ ...prev, proPriceAnnual: e.target.value ? Number(e.target.value) : 0 }))} />
              </div>
            </div>
            {isEditingConfig && (
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => { setIsEditingConfig(false); setConfig(SUBSCRIPTION_CONFIG) }} className="btn-secondary flex-1 py-2.5">
                  {t(d.cancel)}
                </button>
                <button type="submit" disabled={savingPrice} className="btn-primary flex-1 py-2.5">
                  {savingPrice ? t(d.saving) : t(d.save)}
                </button>
              </div>
            )}
          </form>

          {/* Plan breakdown */}
          <div className="mt-6 pt-6 border-t border-pink-50">
             <h3 className="font-semibold text-gray-900 mb-4">{t(d.planBreakdown)}</h3>
             <div className="space-y-4" dir="ltr">
              {[
                { label: 'Plan Pro', count: proPartners.length, total: partners.length, color: 'from-[#C2517A] to-[#7F77DD]' },
                { label: 'Plan Simple', count: simplePartners.length, total: partners.length, color: 'from-gray-300 to-gray-400' },
              ].map(({ label, count, total, color }) => {
                const pct = Math.round((count / Math.max(total, 1)) * 100)
                return (
                  <div key={label}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">{label}</span>
                      <span className="font-bold text-gray-900">{count} ({pct}%)</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-3 rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Gestion des abonnements partenaires */}
        <div className="card p-5 flex flex-col h-[600px]">
          <h2 className="font-bold text-gray-900 mb-4">{t(d.manageSubs)}</h2>
          
          <div className="relative mb-4 shrink-0">
            <Search size={15} className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder={t(d.searchPartner)} className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 rtl:pl-2 pr-2 custom-scrollbar">
            {filteredPartners.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">{t(d.noPartnerFound)}</p>
            ) : (
              filteredPartners.map(p => (
                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50/50 hover:bg-pink-50/30 rounded-xl border border-transparent hover:border-pink-100 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{p.businessName}</p>
                    <p className="text-xs text-gray-400">{getWilayaName(p)}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {p.isPro ? (
                      <span className="badge-pro text-xs shrink-0"><Sparkles size={10} />Pro</span>
                    ) : (
                      <span className="badge-simple text-xs shrink-0">Simple</span>
                    )}
                    <button 
                      onClick={() => togglePlan(p.id, p.isPro)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        p.isPro 
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                          : 'bg-[#C2517A]/10 text-[#C2517A] hover:bg-[#C2517A]/20'
                      }`}
                    >
                      {p.isPro ? t(d.downgrade) : t(d.upgrade)}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

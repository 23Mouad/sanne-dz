'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Briefcase, Star, MapPin, Tag } from 'lucide-react'
import StatsCard from '@/components/dashboard/StatsCard'
import { WILAYAS } from '@/lib/constants'
import { AdminService } from '@/services/admin.service'
import { translations } from '@/lib/i18n/translations'
import { useT, useLang } from '@/hooks/useT'

interface BarProps { label: string; value: number; max: number; color: string }
function HBar({ label, value, max, color }: BarProps) {
  return (
    <div className="flex items-center gap-3" dir="ltr">
      <span className="text-xs text-gray-500 truncate w-28 shrink-0 text-right">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-700 w-8">{value}</span>
    </div>
  )
}

export default function AdminStatsPage() {
  const t = useT()
  const d = translations.adminStats

  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await AdminService.getStats()
        setStats(res)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-pink-100 border-t-[#C2517A] rounded-full animate-spin" />
      </div>
    )
  }

  // Use real top wilayas or fallback if none
  const wilayaStats = (stats.topWilayas || []).map((w: any) => ({ name: w.wilaya, count: w.count }))
  const catStats = (stats.topCategories || []).map((c: any) => ({ name: c.category.name, count: c.count }))
  
  const maxWilaya = wilayaStats[0]?.count || 1
  const maxCat    = catStats[0]?.count || 1

  // Real calculations
  const growthData = stats.monthlyGrowth || []
  const lastMonth = growthData[growthData.length - 1]
  const prevMonth = growthData[growthData.length - 2]
  const reviewGrowthPct = prevMonth?.users > 0
    ? Math.round(((lastMonth?.users - prevMonth?.users) / prevMonth.users) * 100)
    : 0

  // Activation rate: active partners / total partners
  const activationRate = stats.totalPartners > 0
    ? Math.round((stats.activePartners / stats.totalPartners) * 100)
    : 0

  // Pro rate
  const proRate = stats.totalPartners > 0
    ? Math.round(((stats.proPartners || 0) / stats.totalPartners) * 100)
    : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <TrendingUp size={28} className="text-[#C2517A]" />
          {t(d.title)}
        </h1>
        <p className="page-subtitle">{t(d.sub)}</p>
      </div>

      {/* Revenue Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#C2517A] via-[#9b4568] to-[#7F77DD] p-6 shadow-xl shadow-[#C2517A]/20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-8 -top-8 rtl:-left-8 rtl:right-auto w-48 h-48 rounded-full bg-white" />
          <div className="absolute -left-8 -bottom-8 rtl:-right-8 rtl:left-auto w-36 h-36 rounded-full bg-white" />
        </div>
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">{t(d.totalRevenue)}</p>
            <p className="text-white text-4xl font-bold tracking-tight">{(stats.totalRevenue || 0).toLocaleString('fr-DZ')} <span className="text-2xl font-semibold opacity-80" dir="ltr">DA</span></p>
            <div className="flex items-center gap-4 mt-3">
              <div className="text-center">
                <p className="text-white text-lg font-bold" dir="ltr">{(stats.monthlyRevenue || 0).toLocaleString('fr-DZ')} DA</p>
                <p className="text-white/60 text-xs">Ce mois</p>
              </div>
            </div>
          </div>
          <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <span className="text-white text-2xl font-extrabold tracking-tight" dir="ltr">DA</span>
          </div>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title={t(d.totalPartners)} value={stats.totalPartners || 0} icon={Briefcase} color="rose" />
        <StatsCard title={t(d.clientsReg)} value={(stats.totalUsers || 0).toLocaleString()} icon={Users} color="violet" />
        <StatsCard title={t(d.reviewsPub)} value={stats.totalReviews || 0} icon={Star} color="amber" />
        <StatsCard title={t(d.activeWilayas)} value={stats.activeWilayas || 0} icon={MapPin} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Wilayas */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <MapPin size={16} className="text-[#C2517A]" />
            {t(d.topWilayas)}
          </h2>
          <div className="space-y-3">
            {wilayaStats.map((w: any) => (
              <HBar key={w.name} label={w.name} value={w.count} max={maxWilaya}
                color="bg-gradient-to-r from-[#C2517A] to-[#7F77DD]" />
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <Tag size={16} className="text-[#C2517A]" />
            {t(d.topCategories)}
          </h2>
          <div className="space-y-3">
            {catStats.map((c: any) => (
              <HBar key={c.name} label={c.name} value={c.count} max={maxCat}
                color="bg-gradient-to-r from-[#7F77DD] to-[#C2517A]" />
            ))}
          </div>
        </div>

      </div>

      {/* Growth indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: t(d.activationRate), value: `${activationRate}%`, desc: t(d.completeProfiles), color: 'text-[#C2517A]' },
          { label: t(d.avgRating), value: `${(stats.avgRating || 0).toFixed(1)}/5`, desc: t(d.onAllReviews), color: 'text-yellow-500' },
          { label: t(d.proRate), value: `${proRate}%`, desc: t(d.ofPartners), color: 'text-[#7F77DD]' },
        ].map(({ label, value, desc, color }) => (
          <div key={label} className="card p-5 text-center">
            <div className={`text-4xl font-bold ${color}`} dir="ltr">{value}</div>
            <div className="font-semibold text-gray-800 mt-1 text-sm">{label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

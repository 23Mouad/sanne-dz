'use client'

import { BarChart2, Eye, MessageCircle, Heart, Star, Lock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { translations } from '@/lib/i18n/translations'
import { useT, useLang } from '@/hooks/useT'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect, useState } from 'react'
import { PartnersService } from '@/services/partners.service'

interface ChartBarProps {
  label: string
  value: number
  max: number
  color: string
}

function ChartBar({ label, value, max, color }: ChartBarProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-8 text-right rtl:text-left shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className={`h-3 rounded-full ${color} transition-all duration-500`}
          style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-8 shrink-0">{value}</span>
    </div>
  )
}

export default function PartnerStatsPage() {
  const { user } = useAuthStore()
  const isPro = user?.isPro === true
  const t = useT()
  const lang = useLang()
  const d = translations.partnerStats

  const [stats, setStats] = useState<any>(null)
  const [period, setPeriod] = useState<number>(7) // 7, 30, 90
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isPro) {
      PartnersService.getMyStats()
        .then(data => {
          setStats(data?.stats || null)
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [isPro])

  // Parse history safely
  let viewsHistory: { date: string; count: number }[] = []
  let clicksHistory: { date: string; whatsapp: number; phone: number }[] = []
  
  if (stats?.viewsHistory) {
    try {
      viewsHistory = typeof stats.viewsHistory === 'string' ? JSON.parse(stats.viewsHistory) : stats.viewsHistory
    } catch(e) {}
  }
  if (stats?.clicksHistory) {
    try {
      clicksHistory = typeof stats.clicksHistory === 'string' ? JSON.parse(stats.clicksHistory) : stats.clicksHistory
    } catch(e) {}
  }

  // Calculate current period vs previous period for trend
  const calculateTrend = (data: number[]) => {
    if (data.length < period * 2) return '+0%'
    const current = data.slice(-period).reduce((a, b) => a + b, 0)
    const previous = data.slice(-(period * 2), -period).reduce((a, b) => a + b, 0)
    if (previous === 0) return current > 0 ? '+100%' : '+0%'
    const percent = Math.round(((current - previous) / previous) * 100)
    return percent > 0 ? `+${percent}%` : `${percent}%`
  }

  // Ensure arrays have the right length (padding with 0s)
  const paddedViews = Array(period).fill(0).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (period - 1 - i))
    const dateStr = d.toISOString().split('T')[0]
    const found = viewsHistory.find(v => v.date === dateStr)
    return found ? found.count : 0
  })

  const paddedClicks = Array(period).fill(0).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (period - 1 - i))
    const dateStr = d.toISOString().split('T')[0]
    const found = clicksHistory.find(v => v.date === dateStr)
    return found ? (found.whatsapp || 0) : 0
  })

  const maxViews  = Math.max(...paddedViews, 1)
  const maxClicks = Math.max(...paddedClicks, 1)

  const kpis = [
    { icon: Eye,           label: t(d.viewsMonth), value: stats?.profileViews || 0, trend: calculateTrend(viewsHistory.map(v => v.count)), color: 'from-[#C2517A] to-[#a8365f]' },
    { icon: MessageCircle, label: t(d.clicksWa),   value: stats?.whatsappClicks || 0, trend: calculateTrend(clicksHistory.map(c => c.whatsapp || 0)), color: 'from-[#25D366] to-[#1da851]' },
    { icon: Heart,         label: t(d.favorites),  value: stats?.favoritesCount || 0, trend: '+0%', color: 'from-[#7F77DD] to-[#6059c4]' },
    { icon: Star,          label: t(d.newReviews), value: 0, trend: '+0', color: 'from-amber-400 to-orange-500' },
  ]

  // Generate dynamic labels (last X days)
  const getDayLabel = (dateOffset: number) => {
    const d = new Date()
    d.setDate(d.getDate() - dateOffset)
    return d.toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'fr-FR', { weekday: 'short' })
  }
  
  // Show labels only for 7 days. For 30 or 90 days, we might want different labels.
  const chartLabels = Array(period).fill(0).map((_, i) => period <= 7 ? getDayLabel(period - 1 - i) : '')

  if (isLoading) {
    return <div className="animate-pulse space-y-8 h-96 bg-gray-50 rounded-xl"></div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <BarChart2 size={28} className="text-[#C2517A]" />
            {t(d.title)}
          </h1>
          <p className="page-subtitle">{t(d.sub)}</p>
        </div>
        {/* Period selector */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {[7, 30, 90].map(p => (
            <button key={p} disabled={!isPro}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              } disabled:opacity-50`}>
              {p}j
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        {!isPro && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-white/90 shadow-xl flex items-center justify-center mx-auto mb-5">
              <Lock size={28} className="text-pink-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2 drop-shadow-md bg-white/70 px-4 py-1 rounded-lg">{t(d.proFeature)}</h2>
            <p className="text-gray-800 font-bold mb-6 text-center max-w-md drop-shadow-md bg-white/70 px-4 py-2 rounded-lg">{t(d.proDesc)}</p>
            <Link href="/dashboard/partner/subscription" className="btn-primary inline-flex">
              <Sparkles size={16} />{t(d.upgradePro)}
            </Link>
          </div>
        )}

        <div className={`space-y-8 ${!isPro ? 'opacity-40 blur-[4px] pointer-events-none select-none' : ''}`}>
          {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ icon: Icon, label, value, trend, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                <Icon size={18} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full" dir="ltr">
                {trend}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Views chart */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Eye size={16} className="text-[#C2517A]" />
            {t(d.viewsChart)}
          </h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar" dir="ltr">
            {paddedViews.map((val, i) => (
              <ChartBar key={i} label={chartLabels[i]} value={val} max={maxViews}
                color="bg-gradient-to-r from-[#C2517A] to-[#7F77DD]" />
            ))}
          </div>
        </div>

        {/* WhatsApp clicks chart */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageCircle size={16} className="text-green-500" />
            {t(d.clicksChart)}
          </h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar" dir="ltr">
            {paddedClicks.map((val, i) => (
              <ChartBar key={i} label={chartLabels[i]} value={val} max={maxClicks}
                color="bg-gradient-to-r from-[#25D366] to-[#1da851]" />
            ))}
          </div>
        </div>

        </div>
        </div>
      </div>
    </div>
  )
}

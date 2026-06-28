'use client'

import { useState, useEffect } from 'react'
import { Briefcase, Users, Star, CreditCard, TrendingUp, ArrowRight, AlertCircle, Building2, Download } from 'lucide-react'
import Link from 'next/link'
import StatsCard from '@/components/dashboard/StatsCard'
import { AdminService } from '@/services/admin.service'
import api from '@/lib/api'
import { AdminStats } from '@/types'
import { formatDate } from '@/lib/utils'
import CustomChart from '@/components/ui/Chart'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function AdminDashboardPage() {
  const t = useT()
  const lang = useLang()
  const d = translations.adminDash
  const months = [...d.months[lang]]

  const [stats, setStats] = useState<AdminStats | null>(null)
  const [pendingPartners, setPendingPartners] = useState<any[]>([])
  const [pendingReviews, setPendingReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, partnersRes, reviewsRes] = await Promise.all([
          AdminService.getStats(),
          AdminService.getPartners('PENDING'),
          api.get('/reviews/pending?page=1').catch(() => ({ data: { data: [] } }))
        ])
        setStats(statsData)
        setPendingPartners(partnersRes.data || [])
        setPendingReviews(reviewsRes.data.data || [])
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

  const chartData = {
    labels: stats.monthlyGrowth?.map(g => g.month) || months,
    datasets: [
      { label: t(d.newPartners), data: stats.monthlyGrowth?.map(g => g.partners) || [], borderColor: '#C2517A', backgroundColor: 'rgba(194, 81, 122, 0.1)', fill: true, tension: 0.4 },
      { label: t(d.newClients),  data: stats.monthlyGrowth?.map(g => g.users) || [], borderColor: '#7F77DD', backgroundColor: 'rgba(127, 119, 221, 0.1)', fill: true, tension: 0.4 }
    ]
  }

  const revenueData = {
    labels: stats.monthlyGrowth?.map(g => g.month) || months,
    datasets: [
      { label: t(d.revPro), data: stats.monthlyGrowth?.map(g => g.revenue) || [], borderColor: '#C2517A', backgroundColor: 'rgba(194, 81, 122, 0.12)', fill: true, tension: 0.4 }
    ]
  }

  const statusLabel = (s: string) =>
    s === 'active'  ? t(d.statusActive) :
    s === 'pending' ? t(d.statusPending) :
    t(d.statusSuspended)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">{t(d.title)}</h1>
        <p className="page-subtitle">{t(d.subtitle)}</p>
      </div>

      {/* Alerts */}
      {(pendingPartners.length > 0 || pendingReviews.length > 0) && (
        <div className="space-y-3">
          {pendingPartners.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <AlertCircle size={18} className="text-amber-500 shrink-0" />
                <p className="text-sm font-semibold text-amber-800">
                  {pendingPartners.length} {t(d.pendingPartners)}
                </p>
              </div>
              <Link href="/dashboard/admin/partners" className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline whitespace-nowrap">
                {t(d.process)} <ArrowRight size={12} />
              </Link>
            </div>
          )}
          {pendingReviews.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <AlertCircle size={18} className="text-blue-500 shrink-0" />
                <p className="text-sm font-semibold text-blue-800">
                  {pendingReviews.length} {t(d.pendingReviews)}
                </p>
              </div>
              <Link href="/dashboard/admin/reviews" className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline whitespace-nowrap">
                {t(d.moderate)} <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Global Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title={t(d.totalPartners)} value={stats.totalPartners} icon={Briefcase} color="rose" />
        <StatsCard title={t(d.totalClients)} value={stats.totalUsers.toLocaleString('fr-DZ')} icon={Users} color="violet" />
        <StatsCard title={t(d.totalReviews)} value={stats.totalReviews || 0} icon={Star} color="amber" />
        <StatsCard title={t(d.proPartners)} value={`${stats.proPartners ?? 0}`} icon={CreditCard} color="green" subtitle={`${Math.round((stats.proPartners ?? 0) / (stats.totalPartners || 1) * 100)}${t(d.ofTotal)}`} />
      </div>

      {/* Revenue Chart */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#C2517A]" />
              {t(d.monthRevenue)}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{t(d.last6months)}</p>
          </div>
          <div className="flex items-center gap-1 bg-gradient-to-r from-[#C2517A]/10 to-[#7F77DD]/10 border border-pink-100 rounded-xl px-3 py-1.5">
            <span className="text-sm font-bold gradient-text">{(stats.totalRevenue || 0).toLocaleString('fr-DZ')} DA</span>
            <span className="text-xs text-gray-400 ml-1">{t(d.total)}</span>
          </div>
        </div>
        <CustomChart type="line" data={revenueData} height={280} />
      </div>

      {/* Growth Chart */}
      <div className="card p-5">
        <h2 className="font-bold text-gray-900 mb-4">{t(d.growth)}</h2>
        <CustomChart type="line" data={chartData} height={260} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pending partners list */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{t(d.lastRegistered)}</h2>
            <Link href="/dashboard/admin/partners" className="text-sm text-[#C2517A] hover:underline flex items-center gap-1">
              {t(d.seeAll)} <ArrowRight size={13} />
            </Link>
          </div>
          <div className="space-y-3">
            {pendingPartners.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-pink-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{p.businessName}</p>
                  <p className="text-xs text-gray-400">{typeof p.wilaya === 'string' ? p.wilaya : p.wilaya?.name} · {p.category?.name}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  p.status === 'ACTIVE'  ? 'bg-green-50 text-green-600' :
                  p.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                  'bg-red-50 text-red-500'
                }`}>
                  {statusLabel(p.status.toLowerCase())}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick admin actions */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4">{t(d.quickActions)}</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/dashboard/admin/partners', icon: Building2, label: t(d.validatePartners), badge: pendingPartners.length },
              { href: '/dashboard/admin/reviews',  icon: Star,      label: t(d.moderateReviews),  badge: pendingReviews.length },
              { href: '/dashboard/admin/export',   icon: Download,  label: t(d.exportData),       badge: 0 },
            ].map(({ href, icon: Icon, label, badge }) => (
              <Link key={href} href={href}
                className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-4 flex flex-col items-center gap-2
                           text-center hover:from-pink-100 hover:to-purple-100 transition-colors relative group">
                <span className="text-[#C2517A]"><Icon size={24} /></span>
                <span className="text-xs font-semibold text-gray-700">{label}</span>
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#C2517A] rounded-full text-white text-xs flex items-center justify-center font-bold">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Revenue insight */}
          <div className="mt-4 p-4 bg-gradient-to-r from-[#C2517A]/10 to-[#7F77DD]/10 rounded-xl border border-pink-100">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-[#C2517A]" />
              <span className="text-xs font-semibold text-gray-700">{t(d.estRevenue)}</span>
            </div>
            <p className="text-2xl font-bold gradient-text">
              {(stats.monthlyRevenue || 0).toLocaleString('fr-DZ')} DA
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {t(d.basedOn)} {stats.proPartners ?? 0} {t(d.proPartnersLbl)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

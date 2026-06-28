'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Eye, Star, Heart, MessageCircle, ArrowRight, Sparkles, AlertCircle, Camera, Pencil, BarChart2, Lock } from 'lucide-react'
import StatsCard from '@/components/dashboard/StatsCard'
import { PartnersService } from '@/services/partners.service'
import { SubscriptionsService } from '@/services/subscriptions.service'
import { Partner } from '@/types'
import { formatDate } from '@/lib/utils'
import { X } from 'lucide-react'
import StarRating from '@/components/ui/StarRating'
import CustomChart from '@/components/ui/Chart'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function PartnerDashboardPage() {
  const t = useT()
  const lang = useLang()
  const d = translations.partnerDash
  
  const [partner, setPartner] = useState<Partner | null>(null)
  const [loading, setLoading] = useState(true)
  const [latestPayment, setLatestPayment] = useState<any>(null)
  const [showStatusAlert, setShowStatusAlert] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [data, historyRes] = await Promise.all([
          PartnersService.getMyProfile(),
          SubscriptionsService.getHistory()
        ])
        setPartner(data)
        
        if (historyRes?.history && historyRes.history.length > 0) {
          const latest = historyRes.history[0]
          setLatestPayment(latest)
          
          // If it's SUCCESS or FAILED, check if we've already dismissed it
          if (latest.status !== 'PENDING') {
            const dismissed = localStorage.getItem(`dismissed_payment_${latest.id}`)
            if (dismissed) {
              setShowStatusAlert(false)
            }
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-pink-100 border-t-[#C2517A] rounded-full animate-spin" />
      </div>
    )
  }

  if (!partner) {
    return <div>Failed to load partner profile.</div>
  }

  // TODO: Fetch reviews from API
  const recentReviews: any[] = []

  // Build real last-7-days labels
  const getLast7DayLabels = (): string[] => {
    const labels: string[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      labels.push(date.toLocaleDateString(lang === 'ar' ? 'ar-DZ' : 'fr-DZ', { weekday: 'short', day: 'numeric' }))
    }
    return labels
  }

  const weekLabels = getLast7DayLabels()

  // Use real stats if available, fallback to zeros
  const weeklyViews = (partner.stats as any)?.weeklyViews ?? [0, 0, 0, 0, 0, 0, 0]
  const weeklyFavorites = (partner.stats as any)?.weeklyFavorites ?? [0, 0, 0, 0, 0, 0, 0]

  const chartData = {
    labels: weekLabels,
    datasets: [
      {
        label: t(d.chartProfileViews),
        data: weeklyViews,
        backgroundColor: 'rgba(194, 81, 122, 0.6)',
        borderRadius: 4,
      },
      {
        label: t(d.chartFavorites),
        data: weeklyFavorites,
        backgroundColor: 'rgba(127, 119, 221, 0.6)',
        borderRadius: 4,
      }
    ]
  }

  const dismissAlert = () => {
    if (latestPayment) {
      localStorage.setItem(`dismissed_payment_${latestPayment.id}`, 'true')
    }
    setShowStatusAlert(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">{t(d.title)}</h1>
          <p className="page-subtitle">{partner.businessName} — Plan <span className="font-bold text-[#C2517A]">{partner.isPro ? <>Pro <Sparkles size={14} className="inline ml-0.5" /></> : 'Basic'}</span></p>
        </div>
        <Link href={`/partner/${partner.slug}`} target="_blank"
          className="btn-outline text-sm py-2 px-4 flex items-center gap-1.5 self-start">
          <Eye size={15} />
          {t(d.viewPublic)}
        </Link>
      </div>

      {/* Subscription Status Alert */}
      {latestPayment && showStatusAlert && (
        <div className={`border rounded-2xl p-4 flex items-start gap-3 relative overflow-hidden ${
          latestPayment.status === 'PENDING' ? 'bg-blue-50 border-blue-200' :
          latestPayment.status === 'SUCCESS' ? 'bg-green-50 border-green-200' :
          'bg-red-50 border-red-200'
        }`}>
          <AlertCircle size={18} className={`mt-0.5 shrink-0 ${
            latestPayment.status === 'PENDING' ? 'text-blue-500' :
            latestPayment.status === 'SUCCESS' ? 'text-green-500' :
            'text-red-500'
          }`} />
          <div className="flex-1 pr-6">
            <p className={`text-sm font-semibold ${
              latestPayment.status === 'PENDING' ? 'text-blue-800' :
              latestPayment.status === 'SUCCESS' ? 'text-green-800' :
              'text-red-800'
            }`}>
              {latestPayment.status === 'PENDING' && "Votre demande d'abonnement Pro est en cours de traitement."}
              {latestPayment.status === 'SUCCESS' && "Félicitations ! Votre abonnement Pro a été activé avec succès."}
              {latestPayment.status === 'FAILED' && "Votre demande d'abonnement Pro a été refusée ou a échoué."}
            </p>
            <p className={`text-xs mt-0.5 ${
              latestPayment.status === 'PENDING' ? 'text-blue-600' :
              latestPayment.status === 'SUCCESS' ? 'text-green-600' :
              'text-red-600'
            }`}>
              {latestPayment.status === 'PENDING' && "Veuillez patienter, cela peut prendre jusqu'à 24h ouvrables."}
              {latestPayment.status === 'SUCCESS' && "Vous bénéficiez maintenant de tous les avantages Premium."}
              {latestPayment.status === 'FAILED' && "Veuillez vérifier les informations de paiement ou contacter le support."}
            </p>
          </div>
          {latestPayment.status !== 'PENDING' && (
            <button onClick={dismissAlert} className="absolute right-3 top-4 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* Profile completion warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle size={18} className="text-amber-500 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800">{t(d.profilePct)}</p>
          <p className="text-xs text-amber-600 mt-0.5">{t(d.profileHint)}</p>
        </div>
        <Link href="/dashboard/partner/profile" className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline whitespace-nowrap">
          {t(d.complete)} <ArrowRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title={t(d.profileViews)}   value={(partner.stats?.profileViews || 0).toLocaleString('fr-DZ')} icon={Eye}           color="rose"   isBlurred={!partner.isPro} />
        <StatsCard title={t(d.waClicks)}       value={partner.stats?.whatsappClicks || 0}                        icon={MessageCircle} color="green"  isBlurred={!partner.isPro} />
        <StatsCard title={t(d.favorites)}      value={partner.stats?.favoritesCount || 0}                        icon={Heart}         color="violet" isBlurred={!partner.isPro} />
        <StatsCard title={t(d.avgRating)}      value={`${partner.rating || 0}/5`}                               icon={Star}          color="amber"  subtitle={`${partner.reviewCount || 0} ${t(d.reviews)}`} />
      </div>

      {/* Chart Section — blurred for Basic partners */}
      <div className="card p-5 relative">
        <h2 className="font-bold text-gray-900 mb-4">{t(d.weekActivity)}</h2>
        <CustomChart type="bar" data={chartData} height={260} />
        {!partner.isPro && (
          <div className="absolute inset-0 rounded-2xl backdrop-blur-sm bg-white/60 flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-12 h-12 rounded-full bg-[#C2517A]/10 flex items-center justify-center">
              <Lock size={22} className="text-[#C2517A]" />
            </div>
            <p className="font-bold text-gray-800 text-sm">Statistiques réservées aux Pro</p>
            <Link href="/dashboard/partner/subscription"
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
              <Sparkles size={12} /> Passer en Pro
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Reviews */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{t(d.latestReviews)}</h2>
            <Link href="/dashboard/partner/reviews" className="text-sm text-[#C2517A] hover:underline flex items-center gap-1">
              {t(d.seeAll)} <ArrowRight size={13} />
            </Link>
          </div>
          {recentReviews.length > 0 ? (
            <div className="space-y-3">
              {recentReviews.map(r => (
                <div key={r.id} className="p-3 bg-pink-50/50 rounded-xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm text-gray-800">{r.authorName}</span>
                    <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                  </div>
                  <StarRating rating={r.rating} size={12} />
                  <p className="text-xs text-gray-600 mt-1.5 line-clamp-2">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">{t(d.noReviews)}</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4">{t(d.quickActions)}</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/dashboard/partner/products',     icon: Sparkles, label: "Produits",          color: 'bg-indigo-50 hover:bg-indigo-100' },
              { href: '/dashboard/partner/portfolio',    icon: Camera,   label: t(d.addPhotos),      color: 'bg-pink-50 hover:bg-pink-100' },
              { href: '/dashboard/partner/profile',      icon: Pencil,   label: t(d.editProfile),    color: 'bg-purple-50 hover:bg-purple-100' },
              { href: '/dashboard/partner/stats',        icon: BarChart2,label: t(d.seeStats),       color: 'bg-blue-50 hover:bg-blue-100' },
            ].map(({ href, icon: Icon, label, color }) => (
              <Link key={href} href={href}
                className={`${color} rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-colors`}>
                <span className="text-[#C2517A]"><Icon size={24} /></span>
                <span className="text-xs font-semibold text-gray-700">{label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Upgrade CTA — only shown for Basic partners */}
      {!partner.isPro && (
        <div className="gradient-bg rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-yellow-300" />
              <h3 className="text-xl font-bold text-white">{t(d.upgradePro)}</h3>
            </div>
            <p className="text-white/70 text-sm">{t(d.upgradeDesc)}</p>
          </div>
          <Link href="/dashboard/partner/subscription"
            className="flex items-center gap-1 bg-white text-[#C2517A] font-bold px-6 py-3 rounded-xl
                       hover:bg-pink-50 active:scale-95 transition-all whitespace-nowrap text-sm">
            {t(d.viewPlans)} <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  )
}

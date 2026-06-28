'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { CreditCard, Check, Sparkles, AlertCircle, Calendar, ArrowRight } from 'lucide-react'
import { SUBSCRIPTION_CONFIG } from '@/lib/constants'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import { PartnersService } from '@/services/partners.service'
import { SubscriptionsService } from '@/services/subscriptions.service'

export default function PartnerSubscriptionPage() {
  const t = useT()
  const lang = useLang()
  const d = translations.partnerSub

  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pendingRequest, setPendingRequest] = useState<any>(null)
  const [config, setConfig] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [p, req, cfg, hist] = await Promise.all([
          PartnersService.getMyProfile(),
          SubscriptionsService.getPendingRequest().catch(() => null),
          SubscriptionsService.getConfig().catch(() => null),
          SubscriptionsService.getHistory().catch(() => [])
        ])
        setIsPro(p.isPro || false)
        setPendingRequest(req)
        if (cfg) setConfig(cfg)
        if (hist) setHistory(hist)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const plan = isPro ? 'pro' : 'simple'
  // Determine if there's an active sub and its end date
  // Since we fetch history, we can assume the renewal date is related to the last SUCCESS payment
  // but for simplicity we'll just keep a generic label or if backend provided subscription endDate, use it.
  const renewalDate = '15 Juillet 2025' // This would ideally come from the user's subscription profile
  const proPriceMonthly = config?.proPriceMonthly ?? SUBSCRIPTION_CONFIG.proPriceMonthly
  
  const proFeatures = d.features[lang]

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-pink-100 border-t-[#C2517A] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <CreditCard size={28} className="text-[#C2517A]" />
          {t(d.title)}
        </h1>
        <p className="page-subtitle">{t(d.subtitle)}</p>
      </div>

      {/* Pending Request Alert */}
      {pendingRequest && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="text-yellow-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-yellow-800">Votre demande est en cours de traitement</h3>
            <p className="text-sm text-yellow-700 mt-1">Notre équipe vérifie votre paiement. Votre compte passera en mode PRO très prochainement.</p>
          </div>
        </div>
      )}

      {/* Current Plan Card */}
      <div className={`rounded-2xl p-6 border-2 ${isPro ? 'border-[#7F77DD]/40 bg-gradient-to-br from-purple-50 to-pink-50' : 'border-pink-100 bg-pink-50/50'}`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isPro && <span className="badge-pro"><Sparkles size={10} />Premium</span>}
              <h2 className="text-2xl font-bold text-gray-900">Plan {isPro ? 'Pro' : 'Simple'}</h2>
            </div>
            <p className="text-gray-600 text-sm">
              {isPro
                ? `${proPriceMonthly.toLocaleString('fr-DZ')} DA/mois`
                : t(d.free)}
            </p>
          </div>
          <div className="text-right">
            <span className="badge-active">{t(d.active)}</span>
            {isPro && (
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                <Calendar size={11} />
                {t(d.renewal)} {renewalDate}
              </p>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          {proFeatures.map((f: string) => (
            <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
              <Check size={14} className="text-green-500 shrink-0" />
              {f}
            </div>
          ))}
        </div>

        {/* Actions section removed because PRO plan cannot be canceled manually */}
      </div>

      {/* Upgrade CTA (if Simple) */}
      {!isPro && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-[#C2517A]" />
            <h2 className="font-bold text-gray-900">{t(d.upgradeTitle)}</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {proFeatures.map((f: string) => (
              <div key={f} className="flex items-start gap-2 text-sm text-gray-700">
                <Sparkles size={12} className="text-[#7F77DD] mt-0.5 shrink-0" />
                {f}
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard/partner/subscription/payment" className="btn-primary flex-1 text-center">
              <Sparkles size={16} />
              {t(d.upgradeBtn)} — {proPriceMonthly.toLocaleString('fr-DZ')} DA/mois
            </Link>
          </div>
        </div>
      )}

      {/* Billing History */}
      <div className="card p-5">
        <h2 className="font-bold text-gray-900 mb-4">{t(d.billingTitle)}</h2>
        {history.length > 0 ? (
          <div className="space-y-2">
            {history.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between py-2.5 border-b border-pink-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{payment.metadata?.cycle === 'ANNUAL' ? 'Plan Pro (Annuel)' : t(d.planProLabel)}</p>
                  <p className="text-xs text-gray-400">{new Date(payment.createdAt).toLocaleDateString('fr-DZ')}</p>
                </div>
                <div className="text-right rtl:text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {payment.amount.toLocaleString('fr-DZ')} DA
                  </p>
                  {payment.status === 'SUCCESS' ? (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{t(d.paid)}</span>
                  ) : payment.status === 'FAILED' ? (
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Refusé</span>
                  ) : (
                    <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">En attente</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <AlertCircle size={24} className="text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">{t(d.noInvoice)}</p>
          </div>
        )}
      </div>

    </div>
  )
}

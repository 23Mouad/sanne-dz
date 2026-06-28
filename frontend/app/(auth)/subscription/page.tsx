'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { SUBSCRIPTION_CONFIG } from '@/lib/constants'
import toast from 'react-hot-toast'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function SubscriptionPage() {
  const t = useT()
  const lang = useLang()
  const d = translations.planSelection

  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<'simple' | 'pro'>('simple')
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('monthly')
  const [loading, setLoading] = useState(false)

  const proPrice = cycle === 'monthly'
    ? SUBSCRIPTION_CONFIG.proPriceMonthly
    : Math.round(SUBSCRIPTION_CONFIG.proPriceAnnual / 12)

  const handleConfirm = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    toast.success(selectedPlan === 'pro'
      ? t(d.proActivated)
      : t(d.simpleActivated))
    router.push('/pending')
    setLoading(false)
  }

  const simpleFeatures = d.simpleFeats[lang]
  const proExtra = d.proExtra[lang]
  
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight

  return (
    <div className="w-full max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t(d.title)}</h1>
        <p className="text-gray-500 mt-2">{t(d.sub)}</p>

        {/* Cycle Toggle */}
        <div className="inline-flex items-center gap-1 bg-gray-100 rounded-xl p-1 mt-5">
          {(['monthly', 'annual'] as const).map((c) => (
            <button key={c} onClick={() => setCycle(c)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                cycle === c
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              {c === 'monthly' ? t(d.monthly) : (
                <span>{t(d.annual)} <span className="text-green-600 font-bold">{t(d.save20)}</span></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* Simple */}
        <button
          onClick={() => setSelectedPlan('simple')}
          className={`text-left rtl:text-right p-6 rounded-2xl border-2 transition-all duration-200 ${
            selectedPlan === 'simple'
              ? 'border-[#C2517A] bg-pink-50/50 shadow-lg shadow-pink-100/50'
              : 'border-gray-200 bg-white hover:border-pink-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{t(d.simpleName)}</h2>
            {selectedPlan === 'simple' && (
              <div className="w-6 h-6 rounded-full bg-[#C2517A] flex items-center justify-center shrink-0">
                <Check size={14} className="text-white" />
              </div>
            )}
          </div>
          <div className="mb-4">
            <span className="text-4xl font-bold text-gray-900">{t(d.free)}</span>
            <p className="text-gray-400 text-sm mt-1">{t(d.launchOffer)}</p>
          </div>
          <ul className="space-y-2">
            {simpleFeatures.map((f: string) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                <Check size={14} className="text-green-500 mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </button>

        {/* Pro */}
        <button
          onClick={() => setSelectedPlan('pro')}
          className={`text-left rtl:text-right p-6 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden ${
            selectedPlan === 'pro'
              ? 'border-[#7F77DD] shadow-xl shadow-purple-100/50'
              : 'border-gray-200 bg-white hover:border-purple-200'
          }`}
        >
          {/* Gradient bg */}
          <div className={`absolute inset-0 bg-gradient-to-br from-[#7F77DD]/5 to-[#C2517A]/5 transition-opacity ${
            selectedPlan === 'pro' ? 'opacity-100' : 'opacity-0'
          }`} />

          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold text-gray-900">{t(d.proName)}</h2>
              {selectedPlan === 'pro' && (
                <div className="w-6 h-6 rounded-full bg-[#7F77DD] flex items-center justify-center shrink-0">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </div>
            <span className="badge-pro mb-4 inline-flex">
              <Sparkles size={10} /> {t(d.recommended)}
            </span>
            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">{proPrice.toLocaleString('fr-DZ')}</span>
                <span className="text-gray-500 text-sm">{t(d.daMonth)}</span>
              </div>
              {cycle === 'annual' && (
                <p className="text-green-600 text-xs font-medium mt-0.5">
                  {SUBSCRIPTION_CONFIG.proPriceAnnual.toLocaleString('fr-DZ')} {t(d.daYearSave)}
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-3">{t(d.allSimplePlus)}</p>
            <ul className="space-y-2">
              {proExtra.map((f: string) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                  <Sparkles size={13} className="text-[#7F77DD] mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </button>
      </div>

      <div className="mt-6">
        <button onClick={handleConfirm} disabled={loading} className="btn-primary w-full py-4 text-base">
          {loading
            ? <span className="flex items-center justify-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t(d.activating)}</span>
            : <span className="flex items-center justify-center gap-2">
                {t(d.continueWith)} {selectedPlan === 'pro' ? t(d.proName) : t(d.simpleName)}
                <ArrowIcon size={18} />
              </span>
          }
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          {t(d.changeAnytime)}
        </p>
      </div>
    </div>
  )
}

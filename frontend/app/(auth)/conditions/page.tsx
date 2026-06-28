'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, CheckCircle, Shield, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function ConditionsPage() {
  const t = useT()
  const lang = useLang()
  const d = translations.conditions

  const router = useRouter()
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)

  const conditionsList = [
    {
      icon: Shield,
      title: t(d.c1Title),
      items: d.c1Items[lang],
    },
    {
      icon: CheckCircle,
      title: t(d.c2Title),
      items: d.c2Items[lang],
    },
    {
      icon: AlertTriangle,
      title: t(d.c3Title),
      items: d.c3Items[lang],
    },
  ]

  const handleAccept = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success(t(d.successMsg))
    router.push('/subscription')
    setLoading(false)
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="card-glass p-8">
        <div className="text-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C2517A] to-[#7F77DD]
                          flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t(d.title)}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {t(d.sub)}
          </p>
        </div>

        {/* Conditions */}
        <div className="space-y-5 mb-6 max-h-96 overflow-y-auto pr-1">
          {conditionsList.map(({ icon: Icon, title, items }) => (
            <div key={title} className="bg-pink-50/50 rounded-xl p-5 border border-pink-100">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C2517A] to-[#7F77DD]
                                flex items-center justify-center shadow-sm">
                  <Icon size={16} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
              </div>
              <ul className="space-y-2">
                {items.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#C2517A] mt-0.5 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Policy moderation */}
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
            <p className="flex items-center text-sm text-amber-800 font-semibold mb-1">
              <AlertTriangle size={16} className="mr-1.5 rtl:ml-1.5" /> {t(d.modPolicy)}
            </p>
            <p className="text-sm text-amber-700">
              {t(d.modDesc)}
            </p>
          </div>
        </div>

        {/* Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-xl border border-pink-100 bg-white hover:border-[#C2517A]/30 transition-colors mb-5">
          <input 
            type="checkbox" 
            className="hidden" 
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
            accepted ? 'bg-[#C2517A] border-[#C2517A]' : 'border-gray-300 group-hover:border-[#C2517A]'
          }`}>
            {accepted && <Check size={16} strokeWidth={3} className="text-white" />}
          </div>
          <span className="text-sm text-gray-700 font-medium">
            {t(d.agreeText)}
          </span>
        </label>

        <button
          onClick={handleAccept}
          disabled={!accepted || loading}
          className="btn-primary w-full py-3"
        >
          {loading
            ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t(d.processing)}</span>
            : t(d.acceptBtn)}
        </button>
      </div>
    </div>
  )
}

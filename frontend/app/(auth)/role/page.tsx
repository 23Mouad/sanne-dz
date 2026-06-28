'use client'

import Link from 'next/link'
import { User, Store, ArrowRight, Check, ArrowLeft } from 'lucide-react'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function RolePage() {
  const t = useT()
  const lang = useLang()
  const d = translations.auth

  const clientPerks = d.clientPerks[lang]
  const partnerPerks = d.partnerPerks[lang]

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight

  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t(d.roleTitle)}</h1>
        <p className="text-gray-500 mt-2">{t(d.roleSub)}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* Client */}
        <Link
          href="/register/client"
          className="group card p-7 text-center hover:-translate-y-1 hover:border-[#C2517A]/30 hover:shadow-xl hover:shadow-pink-100/50"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C2517A] to-[#a8365f]
                          flex items-center justify-center mx-auto mb-5 shadow-md
                          group-hover:scale-110 transition-transform duration-300">
            <User size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#C2517A] transition-colors mb-2">
            {t(d.imClient)}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            {t(d.clientDesc)}
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center mb-5">
            {clientPerks.map((p: string) => (
              <span key={p} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-pink-50 text-[#C2517A] rounded-full font-medium">
                <Check size={12} /> {p}
              </span>
            ))}
          </div>
          <span className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[#C2517A]
                           group-hover:gap-3 transition-all duration-200">
            {t(d.createClientBtn)}
            <ArrowIcon size={15} />
          </span>
        </Link>

        {/* Partner */}
        <Link
          href="/register/partner"
          className="group card p-7 text-center hover:-translate-y-1 hover:border-[#7F77DD]/30 hover:shadow-xl hover:shadow-purple-100/50"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7F77DD] to-[#6059c4]
                          flex items-center justify-center mx-auto mb-5 shadow-md
                          group-hover:scale-110 transition-transform duration-300">
            <Store size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#7F77DD] transition-colors mb-2">
            {t(d.imPartner)}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            {t(d.partnerDesc)}
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center mb-5">
            {partnerPerks.map((p: string) => (
              <span key={p} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-purple-50 text-[#7F77DD] rounded-full font-medium">
                <Check size={12} /> {p}
              </span>
            ))}
          </div>
          <span className="flex items-center justify-center gap-1.5 text-sm font-semibold text-[#7F77DD]
                           group-hover:gap-3 transition-all duration-200">
            {t(d.createPartnerBtn)}
            <ArrowIcon size={15} />
          </span>
        </Link>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        {t(d.alreadyReg)}{' '}
        <Link href="/login" className="text-[#C2517A] hover:underline font-medium">
          {t(d.loginBtn)}
        </Link>
      </p>
    </div>
  )
}

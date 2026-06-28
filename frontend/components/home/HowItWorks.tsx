'use client'

import { Search, UserCheck, Star } from 'lucide-react'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

const stepColors = [
  { color: 'from-[#C2517A] to-[#a8365f]', bgColor: 'bg-pink-50', borderColor: 'border-pink-200', icon: Search },
  { color: 'from-[#7F77DD] to-[#6059c4]', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', icon: UserCheck },
  { color: 'from-[#C2517A] to-[#7F77DD]', bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50', borderColor: 'border-pink-200', icon: Star },
]

export default function HowItWorks() {
  const t = useT()
  const steps = translations.how.steps

  return (
    <section className="section bg-white">
      <div className="container-main">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">{t(translations.how.title)}</h2>
          <p className="page-subtitle max-w-xl mx-auto">
            {t(translations.how.subtitle)}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">

          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-[#C2517A] to-[#7F77DD] z-0" />

          {steps.map((step, index) => {
            const { icon: Icon, color, bgColor, borderColor } = stepColors[index]
            return (
              <div
                key={step.number}
                className={`relative ${bgColor} ${borderColor} border rounded-2xl p-6 lg:p-8
                            hover:shadow-lg transition-all duration-300 hover:-translate-y-1 z-10`}
              >
                {/* Number */}
                <div className="absolute -top-3 left-6">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full
                                   bg-gradient-to-br ${color} text-white text-xs font-bold shadow-md`}>
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color}
                                  flex items-center justify-center shadow-md mb-5 mt-2`}>
                  <Icon size={24} className="text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t(step.title)}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{t(step.description)}</p>

                {/* Connector dot (mobile) */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center mt-6">
                    <div className="w-px h-6 bg-gradient-to-b from-[#C2517A] to-[#7F77DD]" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
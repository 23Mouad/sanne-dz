'use client'

import React from 'react'
import { MapPin, Target, Sparkles, Heart, Shield, Zap } from 'lucide-react'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

const valueIcons: Record<string, React.ElementType> = {
  local: MapPin,
  trust: Shield,
  feminine: Heart,
  fast: Zap,
  digital: Sparkles,
  freemium: Target,
}

const valueColors: Record<string, string> = {
  local: 'from-[#C2517A] to-[#a8365f]',
  trust: 'from-[#7F77DD] to-[#6059c4]',
  feminine: 'from-pink-400 to-[#C2517A]',
  fast: 'from-amber-400 to-orange-500',
  digital: 'from-emerald-400 to-teal-500',
  freemium: 'from-blue-400 to-indigo-500',
}

export default function AboutClient() {
  const t = useT()
  const lang = useLang()

  const stats = [
    { value: '2 300+', labelKey: translations.about.stats.partners },
    { value: '69', labelKey: translations.about.stats.wilayas },
    { value: '12 800+', labelKey: translations.about.stats.clients },
    { value: '10+', labelKey: translations.about.stats.sectors },
  ]

  const valuesKeys = Object.keys(translations.about.values) as Array<keyof typeof translations.about.values>

  const tags = lang === 'ar' ? translations.about.tagsAr : translations.about.tagsFr
  const sectors = lang === 'ar' ? translations.about.sectorsList.ar : translations.about.sectorsList.fr

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/40 to-white">

      {/* Hero */}
      <div className="gradient-bg py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="container-main relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30
                          px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-5">
            <Sparkles size={13} className="text-yellow-300" />
            {t(translations.about.badge)}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {t(translations.about.title)}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            {t(translations.about.subtitle)}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="container-main -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ value, labelKey }) => (
            <div key={value} className="card p-5 text-center">
              <div className="text-3xl font-bold gradient-text">{value}</div>
              <div className="text-sm text-gray-500 mt-1">{t(labelKey)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-main py-16 space-y-20">

        {/* Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target size={18} className="text-[#C2517A]" />
              <span className="text-sm font-semibold text-[#C2517A] uppercase tracking-wide">{t(translations.about.missionBadge)}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              {t(translations.about.missionTitle)}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>{t(translations.about.missionP1)}</p>
              <p>{t(translations.about.missionP2)}</p>
              <p>{t(translations.about.missionP3)}</p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 text-center">
              <div className="mb-4 flex justify-center rounded-lg">
                <svg viewBox="0 0 900 600" width="200px" height="200px" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M0 0h900v600H0z" /><path fill="#063" d="M0 0h450v600H0z" /><path fill="#d21034" d="M579.903811 225a150 150 0 1 0 0 150 120 120 0 1 1 0-150M585.676275 300 450 255.916106 533.852549 371.329239v-142.658277L450 344.083894z" /></svg>
              </div>
              <p className="text-2xl font-bold gradient-text">{t(translations.about.madeIn)}</p>
              <p className="text-gray-500 mt-2">{t(translations.about.madeInSub)}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {tags.map(t => (
                  <span key={t} className="tag text-xs">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">{t(translations.about.valuesTitle)}</h2>
            <p className="text-gray-500 mt-2">{t(translations.about.valuesSub)}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {valuesKeys.map((key) => {
              const Icon = valueIcons[key]
              const color = valueColors[key]
              const valueObj = translations.about.values[key]

              return (
                <div key={key} className="card p-6 hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md mb-4`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{t(valueObj.title)}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{t(valueObj.desc)}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sectors */}
        <div className="card p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t(translations.about.sectorsTitle)}</h2>
          <p className="text-gray-500 mb-6">{t(translations.about.sectorsSub)}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {sectors.map(s => (
              <span key={s} className="px-4 py-2 bg-gradient-to-r from-pink-50 to-purple-50
                                        border border-pink-100 rounded-full text-sm font-medium text-gray-700">
                {s}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

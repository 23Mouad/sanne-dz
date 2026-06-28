import Link from 'next/link'
import { Clock, CheckCircle, Mail, MessageCircle } from 'lucide-react'
import { translations } from '@/lib/i18n/translations'

export default function PendingPage({ searchParams }: { searchParams: { lang?: string } }) {
  // Simple server-side lang logic since it's a server component
  const lang = (searchParams.lang === 'ar' ? 'ar' : 'fr') as 'fr' | 'ar'
  const d = translations.pending

  return (
    <div className="w-full max-w-md text-center">
      <div className="card-glass p-10">
        {/* Animated clock */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C2517A]/20 to-[#7F77DD]/20 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#C2517A] to-[#7F77DD] flex items-center justify-center shadow-lg">
            <Clock size={36} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {d.title[lang]}
        </h1>
        <p className="text-gray-500 leading-relaxed mb-6 text-sm">
          {d.desc[lang]}
        </p>

        {/* Steps */}
        <div className="text-left rtl:text-right space-y-3 mb-8">
          {[
            { icon: CheckCircle, label: d.step1[lang], done: true, color: 'text-green-500' },
            { icon: CheckCircle, label: d.step2[lang], done: false, color: 'text-[#C2517A]' },
            { icon: CheckCircle, label: d.step3[lang], done: false, color: 'text-gray-300' },
            { icon: CheckCircle, label: d.step4[lang], done: false, color: 'text-gray-300' },
          ].map(({ icon: Icon, label, done, color }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={18} className={color} />
              <span className={`text-sm ${done ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="bg-pink-50 rounded-xl p-4 border border-pink-100 mb-6">
          <p className="text-sm text-gray-600 mb-3">{d.contactTitle[lang]}</p>
          <div className="flex justify-center gap-3">
            <a href="mailto:contact@sannedz.com"
               className="flex items-center gap-1.5 text-xs font-medium text-[#C2517A] hover:underline">
              <Mail size={13} /> {d.email[lang]}
            </a>
            <a href="https://wa.me/213555000000" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:underline">
              <MessageCircle size={13} /> {d.whatsapp[lang]}
            </a>
          </div>
        </div>

        <Link href="/" className="btn-outline w-full py-2.5 text-sm">
          {d.backHome[lang]}
        </Link>
      </div>
    </div>
  )
}

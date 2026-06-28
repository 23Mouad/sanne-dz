'use client'

import { useState } from 'react'
import { Mail, Phone, MessageCircle, ChevronDown, CheckCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import { useSettings } from '@/hooks/useSettings'

export default function ContactClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', otherSubject: '', message: '' })
  const [sending, setSending] = useState(false)
  const t = useT()
  const lang = useLang()
  const { settings } = useSettings()

  const faqs = lang === 'ar' ? translations.contact.faqs.ar : translations.contact.faqs.fr
  const subjects = lang === 'ar' ? translations.contact.subjects.ar : translations.contact.subjects.fr

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    toast.success(t(translations.contact.successToast))
    setFormData({ name: '', email: '', subject: '', otherSubject: '', message: '' })
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/40 to-white">

      {/* Hero */}
      <div className="gradient-bg py-16">
        <div className="container-main text-center">
          <h1 className="text-4xl font-bold text-white mb-3">{t(translations.contact.title)}</h1>
          <p className="text-white/80 text-lg">{t(translations.contact.subtitle)}</p>
        </div>
      </div>

      <div className="container-main py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Methods */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">{t(translations.contact.reach)}</h2>

            {[
              { icon: Mail, label: t(translations.contact.contactMethods.email), value: settings.contactEmail, href: `mailto:${settings.contactEmail}`, color: 'from-[#C2517A] to-[#a8365f]' },
              { icon: Phone, label: t(translations.contact.contactMethods.phone), value: settings.contactPhone, href: `tel:${settings.contactPhone?.replace(/\s/g, '')}`, color: 'from-blue-500 to-indigo-600' },
              { icon: MessageCircle, label: t(translations.contact.contactMethods.whatsapp), value: settings.whatsapp, href: `https://wa.me/${settings.whatsapp?.replace(/[^0-9]/g, '')}`, color: 'from-green-500 to-emerald-600' },
            ].map(({ icon: Icon, label, value, href, color }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="card p-5 flex items-center gap-4 hover:-translate-y-0.5 group"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-[#C2517A] transition-colors">{value}</p>
                </div>
              </a>
            ))}

            {/* Social */}
            <div className="card p-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">{t(translations.contact.social)}</p>
              <div className="flex items-center gap-3">
                {/* Instagram */}
                <a
                  href={settings.instagram || '#'}
                  aria-label="Instagram"
                  title="Instagram"
                  target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center
                             text-[#C2517A] transition-all duration-300 hover:scale-110
                             hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href={settings.facebook || '#'}
                  aria-label="Facebook"
                  title="Facebook"
                  target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center
                             text-blue-600 transition-all duration-300 hover:scale-110
                             hover:bg-[#1877F2] hover:text-white"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 320 512">
                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href={settings.tiktok || '#'}
                  aria-label="TikTok"
                  title="TikTok"
                  target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center
                             text-gray-700 transition-all duration-300 hover:scale-110
                             hover:bg-black hover:text-white"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">{t(translations.contact.formTitle)}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="label">{t(translations.contact.nameLabel)}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t(translations.contact.namePlaceholder)}
                      className="input-field"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">{t(translations.contact.emailLabel)}</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t(translations.contact.emailPlaceholder)}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">{t(translations.contact.subjectLabel)}</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field"
                  >
                    <option value="" disabled>{t(translations.contact.subjectPlaceholder)}</option>
                    {subjects.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                
                {formData.subject === subjects[4] && ( // 'Autre' / 'أخرى'
                  <div className="form-group animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="label">{t(translations.contact.otherSubjectLabel)}</label>
                    <input
                      type="text"
                      required
                      value={formData.otherSubject}
                      onChange={e => setFormData({ ...formData, otherSubject: e.target.value })}
                      placeholder={t(translations.contact.otherSubjectPlaceholder)}
                      className="input-field"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="label">{t(translations.contact.messageLabel)}</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t(translations.contact.messagePlaceholder)}
                    className="input-field resize-none"
                  />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full py-3">
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t(translations.contact.sending)}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={16} />
                      {t(translations.contact.send)}
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t(translations.contact.faqTitle)}</h2>
          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-semibold text-gray-800 text-sm">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 shrink-0 ml-3 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-pink-50 pt-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle size={15} className="text-green-500 mt-0.5 shrink-0" />
                      {faq.a}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

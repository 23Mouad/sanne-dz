'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useCategories } from '@/hooks/useCategories'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import { useSettings } from '@/hooks/useSettings'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const t = useT()
  const lang = useLang()
  const { categories } = useCategories()
  const { settings } = useSettings()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-[#1a0a12] to-gray-900 text-white">

      {/* ===== Main Footer Content ===== */}
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Column 1 — Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C2517A] to-[#7F77DD] flex items-center justify-center shadow-lg overflow-hidden">
                <Image src="/logoMain.png" alt="Sanne Logo" width={36} height={36} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-[#ec6fa1]">Sanne</span>
                <span className="text-[#9490e7]"> Textile DZ</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {t(translations.footer.description)}
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href={settings.instagram || '#'}
                aria-label="Instagram"
                title="Instagram"
                target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center
                           text-gray-400 transition-all duration-300 hover:scale-110
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
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center
                           text-gray-400 transition-all duration-300 hover:scale-110
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
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center
                           text-gray-400 transition-all duration-300 hover:scale-110
                           hover:bg-black hover:text-white"
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t(translations.footer.navigation)}</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: t(translations.footer.links.home) },
                { href: '/search', label: t(translations.footer.links.search) },
                { href: '/categories', label: t(translations.footer.links.categories) },
                { href: '/about', label: t(translations.footer.links.about) },
                { href: '/contact', label: t(translations.footer.links.contact) },
                { href: '/terms', label: t(translations.footer.links.terms) },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-[#ec6fa1] text-sm transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#C2517A] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Catégories */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t(translations.footer.categoriesTitle)}</h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((cat) => {
                 const catTrans = translations.categories.items[cat.slug as keyof typeof translations.categories.items]
                 const catName = catTrans ? (lang === 'ar' ? catTrans.ar : catTrans.fr) : cat.name
                 return (
                <li key={cat.slug}>
                  <Link
                    href={`/categories?cat=${cat.slug}`}
                    className="text-gray-400 hover:text-[#ec6fa1] text-sm transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#C2517A] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {catName}
                  </Link>
                </li>
                )
              })}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t(translations.footer.contact)}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <Mail size={15} className="text-[#C2517A] mt-0.5 shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-[#ec6fa1] transition-colors">
                  {settings.contactEmail}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <Phone size={15} className="text-[#C2517A] mt-0.5 shrink-0" />
                <a href={`tel:${settings.contactPhone?.replace(/\s/g, '')}`} className="hover:text-[#ec6fa1] transition-colors">
                  {settings.contactPhone}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin size={15} className="text-[#C2517A] mt-0.5 shrink-0" />
                <span>{settings.address}</span>
              </li>
            </ul>

            {/* Partner CTA */}
            <div className="mt-6 p-4 bg-gradient-to-r from-[#C2517A]/20 to-[#7F77DD]/20 rounded-xl border border-white/10">
              <p className="text-xs text-gray-400 mb-2">{t(translations.footer.hasBusiness)}</p>
              <Link
                href="/role"
                className="flex items-center text-sm font-semibold text-[#ec6fa1] hover:text-white transition-colors"
              >
                {t(translations.footer.registerBusiness)} <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ===== Bottom Bar ===== */}
      <div className="border-t border-white/10">
        <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Sanne Textile DZ · {t(translations.footer.rights)}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <Link href="/terms" className="hover:text-[#ec6fa1] transition-colors">
              {t(translations.footer.privacy)}
            </Link>
            <Link href="/terms" className="hover:text-[#ec6fa1] transition-colors">
              {t(translations.footer.terms)}
            </Link>
            <Link href="/terms" className="hover:text-[#ec6fa1] transition-colors">
              {t(translations.footer.partnerRules)}
            </Link>
          </div>
        </div>
      </div>

    </footer>
  )
}
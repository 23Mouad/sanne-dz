'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import {
  Search, Menu, X, ChevronDown, Heart, Bell,
  User, LogOut, LayoutDashboard, Sparkles, Languages
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useLanguageStore } from '@/store/useLanguageStore'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { lang, toggleLang } = useLanguageStore()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const t = useT()

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { href: '/categories', label: t(translations.nav.categories) },
    { href: '/search', label: t(translations.nav.search) },
    { href: '/about', label: t(translations.nav.about) },
    { href: '/contact', label: t(translations.nav.contact) },
  ]

  const getDashboardLink = () => {
    if (!user) return '/login'
    if (user.role === 'admin') return '/dashboard/admin'
    if (user.role === 'partner') return '/dashboard/partner'
    return '/dashboard/client'
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-pink-100/50 border-b border-pink-100'
            : 'bg-white border-b border-pink-50'
        }`}
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* ===== Logo ===== */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-1 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C2517A] to-[#7F77DD] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Image src='/logoMain.png' alt="Sanne Logo" width={32} height={32} style={{ width: 'auto', height: 'auto' }} />
              </div>
              <span className="text-xl font-bold text-[#C2517A] ml-1">Sanne Textile</span>
              <span className="text-xl font-bold text-[#C2517A]">DZ</span>
            </Link>

            {/* ===== Search Bar (desktop) ===== */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md mx-4"
            >
              <div className="relative w-full">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t(translations.common.searchPlaceholder)}
                  className="w-full pl-9 pr-4 py-2.5 bg-pink-50 border border-pink-200 rounded-xl text-sm
                             focus:outline-none focus:border-[#C2517A] focus:ring-2 focus:ring-pink-100
                             transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
              </div>
            </form>

            {/* ===== Desktop Navigation ===== */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    pathname === link.href
                      ? 'text-[#C2517A] bg-pink-50'
                      : 'text-gray-600 hover:text-[#C2517A] hover:bg-pink-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* ===== Auth Buttons ===== */}
            <div className="hidden md:flex items-center gap-2">

              {/* ===== Lang Toggle ===== */}
              <button
                onClick={toggleLang}
                title={lang === 'fr' ? 'العربية' : 'Français'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pink-200
                           text-sm font-semibold text-[#C2517A] hover:bg-pink-50 transition-colors"
              >
                <Languages size={15} />
                {lang === 'fr' ? 'AR' : 'FR'}
              </button>

              {isAuthenticated && user ? (
                <>
                  {/* Notifications */}
                  <Link href={`${getDashboardLink()}/notifications`} className="relative p-2 text-gray-500 hover:text-[#C2517A] hover:bg-pink-50 rounded-xl transition-colors">
                    <Bell size={18} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#C2517A] rounded-full" />
                  </Link>

                  {/* Favorites (clients) */}
                  {user.role === 'client' && (
                    <Link
                      href="/dashboard/client/favorites"
                      className="relative p-2 text-gray-500 hover:text-[#C2517A] hover:bg-pink-50 rounded-xl transition-colors"
                    >
                      <Heart size={18} />
                    </Link>
                  )}

                  {/* User menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl
                                 hover:bg-pink-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C2517A] to-[#7F77DD]
                                      flex items-center justify-center text-white text-sm font-bold">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-[#C2517A]">
                        {user.firstName}
                      </span>
                      <ChevronDown size={14} className={`text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-pink-100 py-1 z-50">
                        <Link
                          href={getDashboardLink()}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-[#C2517A] transition-colors"
                        >
                          <LayoutDashboard size={15} />
                          {t(translations.nav.myDashboard)}
                        </Link>
                        <Link
                          href={user.role === 'client' ? '/dashboard/client/profile' : '/dashboard/partner/profile'}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-[#C2517A] transition-colors"
                        >
                          <User size={15} />
                          {t(translations.nav.myProfile)}
                        </Link>
                        <div className="border-t border-pink-100 my-1" />
                        <button
                          onClick={() => { logout(); setShowUserMenu(false) }}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut size={15} />
                          {t(translations.nav.logout)}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-600 hover:text-[#C2517A] px-3 py-2 rounded-xl hover:bg-pink-50 transition-colors"
                  >
                    {t(translations.nav.login)}
                  </Link>
                  <Link
                    href="/role"
                    className="btn-primary text-sm py-2 px-4"
                  >
                    <Sparkles size={14} />
                    {t(translations.nav.registerBusiness)}
                  </Link>
                </>
              )}
            </div>

            {/* ===== Mobile actions ===== */}
            <div className="flex md:hidden items-center gap-2">
              {/* Lang toggle mobile */}
              <button
                onClick={toggleLang}
                className="px-2 py-1 rounded-lg border border-pink-200 text-xs font-bold text-[#C2517A]"
              >
                {lang === 'fr' ? 'AR' : 'FR'}
              </button>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-gray-500 hover:text-[#C2517A] transition-colors"
              >
                <Search size={20} />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 hover:text-[#C2517A] rounded-xl hover:bg-pink-50 transition-colors"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>

          {/* ===== Mobile Search Bar ===== */}
          {showSearch && (
            <div className="md:hidden pb-3">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t(translations.common.searchMobilePlaceholder)}
                    autoFocus
                    className="w-full pl-9 pr-4 py-2.5 bg-pink-50 border border-pink-200 rounded-xl text-sm
                               focus:outline-none focus:border-[#C2517A] focus:ring-2 focus:ring-pink-100"
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ===== Mobile Menu ===== */}
        {isOpen && (
          <div className="md:hidden border-t border-pink-100 bg-white">
            <div className="container-main py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-[#C2517A] bg-pink-50'
                      : 'text-gray-600 hover:text-[#C2517A] hover:bg-pink-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-pink-100 mt-2 pt-3 flex flex-col gap-2">
                {isAuthenticated && user ? (
                  <>
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-pink-50"
                    >
                      <LayoutDashboard size={16} />
                      {t(translations.nav.dashboard)}
                    </Link>
                    <button
                      onClick={() => { logout(); setIsOpen(false) }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      {t(translations.nav.logout)}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="btn-outline text-center text-sm py-2.5"
                    >
                      {t(translations.nav.login)}
                    </Link>
                    <Link
                      href="/role"
                      onClick={() => setIsOpen(false)}
                      className="btn-primary text-sm py-2.5"
                    >
                      {t(translations.nav.registerBusiness)}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
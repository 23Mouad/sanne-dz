'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Heart, Star, User, Bell,
  Briefcase, Image, CreditCard, BarChart2,
  Users, Settings, CheckSquare, Tag, Megaphone,
  TrendingUp, Download, LogOut, Sparkles, Home, X
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { useRouter } from 'next/navigation'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import api from '@/lib/api'
import { NotificationsService } from '@/services/notifications.service'

interface NavItem {
  href: string
  labelKey: { fr: string; ar: string }
  icon: React.ElementType
  badge?: string | number
}

export default function DashboardSidebar({ mobileOpen = false, onMobileClose }: { mobileOpen?: boolean; onMobileClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const t = useT()
  const s = translations.sidebar

  const [pendingCounts, setPendingCounts] = useState({ partners: 0, reviews: 0, payments: 0 })
  const { unreadCount: unreadNotifs, setUnreadCount: setUnreadNotifs } = useNotificationStore()

  const clientNav: NavItem[] = [
    { href: '/dashboard/client/favorites',     labelKey: s.nav.favorites,     icon: Heart },
    { href: '/dashboard/client/reviews',       labelKey: s.nav.myReviews,     icon: Star },
    { href: '/dashboard/client/profile',       labelKey: s.nav.myProfile,     icon: User },
    { href: '/dashboard/client/notifications', labelKey: s.nav.notifications, icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs.toString() : undefined },
    { href: '/dashboard/client/settings',      labelKey: s.nav.settings,      icon: Settings },
  ]

  const partnerNav: NavItem[] = [
    { href: '/dashboard/partner',              labelKey: s.nav.overview,      icon: LayoutDashboard },
    { href: '/dashboard/partner/profile',      labelKey: s.nav.bizProfile,    icon: Briefcase },
    { href: '/dashboard/partner/portfolio',    labelKey: s.nav.portfolio,     icon: Image },
    { href: '/dashboard/partner/products',     labelKey: { fr: 'Produits', ar: 'المنتجات' }, icon: Sparkles },
    { href: '/dashboard/partner/reviews',      labelKey: s.nav.receivedRevs,  icon: Star },
    { href: '/dashboard/partner/stats',        labelKey: s.nav.stats,         icon: BarChart2, badge: 'Pro' },
    { href: '/dashboard/partner/subscription', labelKey: s.nav.subscription,  icon: CreditCard },
    { href: '/dashboard/partner/notifications',labelKey: s.nav.notifications, icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs.toString() : undefined },
    { href: '/dashboard/partner/settings',     labelKey: s.nav.settings,      icon: Settings },
  ]

  useEffect(() => {
    if (user?.role === 'admin') {
      Promise.all([
        api.get('/admin/partners?status=PENDING&page=1').catch(() => ({ data: { meta: { total: 0 } } })),
        api.get('/reviews/admin/all?status=PENDING&page=1').catch(() => ({ data: { meta: { total: 0 } } })),
        api.get('/subscriptions/payments/pending?page=1').catch(() => ({ data: { meta: { total: 0 } } }))
      ]).then(([partnersRes, reviewsRes, paymentsRes]) => {
        setPendingCounts({
          partners: partnersRes.data?.meta?.total || 0,
          reviews: reviewsRes.data?.meta?.total || 0,
          payments: paymentsRes.data?.meta?.total || 0
        })
      })
    } else if (user?.role === 'partner' || user?.role === 'client') {
      NotificationsService.getUnreadCount().then(setUnreadNotifs).catch(console.error)
    }
  }, [user, setUnreadNotifs])

  const adminNav: NavItem[] = [
    { href: '/dashboard/admin',               labelKey: s.nav.globalView,      icon: LayoutDashboard },
    { href: '/dashboard/admin/partners',      labelKey: s.nav.partners,        icon: Briefcase, badge: pendingCounts.partners > 0 ? pendingCounts.partners : undefined },
    { href: '/dashboard/admin/clients',       labelKey: s.nav.clients,         icon: Users },
    { href: '/dashboard/admin/categories',    labelKey: s.nav.categories,      icon: Tag },
    { href: '/dashboard/admin/subscriptions', labelKey: s.nav.subscriptions,   icon: CreditCard },
    { href: '/dashboard/admin/payments',      labelKey: { fr: 'Paiements PRO', ar: 'مدفوعات برو' }, icon: CreditCard, badge: pendingCounts.payments > 0 ? pendingCounts.payments : undefined },
    { href: '/dashboard/admin/reviews',       labelKey: s.nav.modReviews,      icon: CheckSquare, badge: pendingCounts.reviews > 0 ? pendingCounts.reviews : undefined },
    { href: '/dashboard/admin/notifications', labelKey: s.nav.adminNotifs,     icon: Megaphone },
    { href: '/dashboard/admin/stats',         labelKey: s.nav.adminStats,      icon: TrendingUp },
    { href: '/dashboard/admin/export',        labelKey: s.nav.export,          icon: Download },
    { href: '/dashboard/admin/settings',      labelKey: s.nav.settings,        icon: Settings },
  ]

  const navItems =
    user?.role === 'admin'   ? adminNav :
    user?.role === 'partner' ? partnerNav :
    clientNav

  const roleLabel =
    user?.role === 'admin'   ? t(s.roleAdmin) :
    user?.role === 'partner' ? t(s.rolePart) :
    t(s.roleClient)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-pink-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C2517A] to-[#7F77DD] flex items-center justify-center">
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">Sanne<span className="text-[#7F77DD]"> Textile DZ</span></span>
        </Link>
        {onMobileClose && (
          <button onClick={onMobileClose} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-pink-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C2517A] to-[#7F77DD]
                          flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-[#C2517A] font-medium">{roleLabel}</p>
            {user?.role === 'partner' && user.plan && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                user.plan === 'pro' ? 'bg-gradient-to-r from-[#C2517A] to-[#7F77DD] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {user.plan === 'pro' ? t(s.planPro) : t(s.planSimple)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                          transition-all duration-150 group
                          ${isActive
                            ? 'bg-gradient-to-r from-[#C2517A] to-[#a8365f] text-white shadow-sm'
                            : 'text-gray-600 hover:bg-pink-50 hover:text-[#C2517A]'
                          }`}
            >
              <Icon size={17} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#C2517A]'} />
              <span className="flex-1">{t(item.labelKey)}</span>
              {item.badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  item.badge === 'Pro'
                    ? 'bg-yellow-100 text-yellow-700'
                    : isActive
                    ? 'bg-white/30 text-white'
                    : 'bg-[#C2517A]/10 text-[#C2517A]'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-pink-100 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                     text-gray-500 hover:bg-pink-50 hover:text-[#C2517A] transition-colors"
        >
          <Home size={17} />
          {t(s.backToSite)}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                     text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={17} />
          {t(s.logout)}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-pink-100 min-h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="relative w-72 bg-white shadow-2xl flex flex-col h-full">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}

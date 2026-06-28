'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  const t = useT()
  const d = translations.clientLayout
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <ProtectedRoute allowedRole="client">
      <div className="flex min-h-screen bg-gradient-to-br from-pink-50/30 to-white">
        <DashboardSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile topbar */}
          <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-pink-100 px-4 py-3 flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-500 hover:text-[#C2517A] rounded-xl hover:bg-pink-50">
              <Menu size={20} />
            </button>
            <span className="font-bold gradient-text">{t(d.title)}</span>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

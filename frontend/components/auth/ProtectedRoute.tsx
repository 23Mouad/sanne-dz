'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

export default function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole: 'client' | 'partner' | 'admin' }) {
  const { user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // If we're not hydrated or user is not loaded yet, just wait.
    // Assuming useAuthStore handles initialization separately.
    if (!user) {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.replace('/login')
      } else if (!useAuthStore.getState().isLoading) {
        // We have a token but no user, trigger initialization
        useAuthStore.getState().initialize()
      }
      return
    }

    const userRole = (user.role as string).toLowerCase()
    
    if (userRole !== allowedRole) {
      // Redirect to their actual dashboard
      if (userRole === 'admin') router.replace('/dashboard/admin')
      else if (userRole === 'partner') router.replace('/dashboard/partner')
      else router.replace('/dashboard/client')
    } else {
      setIsAuthorized(true)
    }
  }, [user, allowedRole, router])

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-pink-100 border-t-[#C2517A] rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}

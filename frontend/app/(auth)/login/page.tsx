'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, Zap } from 'lucide-react'
import Image from 'next/image'
import { useAuthStore } from '@/store/useAuthStore'
import { AuthService } from '@/services/auth.service'
import toast from 'react-hot-toast'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function LoginPage() {
  const t = useT()
  const d = translations.auth

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, logout, user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      // If there's no token but Zustand thinks we're authenticated (cache issue), clear it.
      if (isAuthenticated) {
        logout()
      }
    } else if (isAuthenticated && user) {
      // If token exists and user is authenticated, redirect to their dashboard
      const role = user.role?.toLowerCase()
      if (role === 'admin') router.push('/dashboard/admin')
      else if (role === 'partner') router.push('/dashboard/partner')
      else router.push('/dashboard/client')
    }
  }, [isAuthenticated, user, logout, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))

    try {
      const res = await AuthService.login({ email, password });
      if (res.accessToken) {
        localStorage.setItem('access_token', res.accessToken);
        localStorage.setItem('refresh_token', res.refreshToken);
        
        // Fetch full profile and update Zustand store
        await useAuthStore.getState().initialize();
        
        const userState = useAuthStore.getState().user;
        const userRole = (userState?.role as string)?.toLowerCase() || 'client';
        toast.success(t(d.welcomeUser) + (userState?.firstName ? ` ${userState.firstName}` : ''));
        
        if (userRole === 'admin') {
          router.push('/dashboard/admin')
        } else if (userRole === 'partner') {
          router.push('/dashboard/partner')
        } else {
          router.push('/dashboard/client')
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="card-glass p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C2517A] to-[#7F77DD]
                          flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
            <Image src="/logoMain.png" alt="Sanne Logo" width={56} height={56} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t(d.loginTitle)}</h1>
          <p className="text-gray-500 text-sm mt-1">{t(d.loginSub)}</p>
        </div>

        {/* Demo shortcuts */}
        <div className="bg-pink-50 rounded-xl p-3 mb-6 border border-pink-100">
          <p className="flex items-center text-xs font-semibold text-[#C2517A] mb-2">
            <Zap size={14} className="mr-1.5 rtl:ml-1.5" /> {t(d.demoQuick)}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: t(d.client), email: 'amina123C@gmail.com' , pass: 'amina123CC@gmail.com' },
              { label: t(d.partner), email: 'amir123K@gmail.com' , pass: 'amir123K@gmail.com' },
              { label: t(d.admin), email: 'admin@sanne.dz' , pass: 'admin123' },
            ].map(({ label, email: e  , pass: p}) => (
              <button
                key={label}
                onClick={() => { setEmail(e); setPassword(p) }}
                className="text-xs px-2.5 py-1 bg-white rounded-lg border border-pink-200
                           text-[#C2517A] hover:bg-[#C2517A] hover:text-white transition-colors font-medium"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="label">{t(d.email)}</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t(d.emailPlace)}
                className="input-field pl-10 rtl:pr-10 rtl:pl-4"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">{t(d.password)}</label>
              <Link href="/forgot-password" className="text-xs text-[#C2517A] hover:underline">
                {t(d.forgotPwd)}
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t(d.pwdPlace)}
                className="input-field pl-10 pr-10 rtl:pr-10 rtl:pl-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 rtl:left-3.5 rtl:right-auto top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t(d.loggingIn)}
              </span>
            ) : t(d.loginBtn)}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-500">
            {t(d.noAccount)}{' '}
            <Link href="/role" className="text-[#C2517A] hover:underline font-medium">
              {t(d.registerLink)}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useState, Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Lock, ArrowLeft, ArrowRight, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import { AuthService } from '@/services/auth.service'

function ResetPasswordForm() {
  const t = useT()
  const lang = useLang()
  const d = translations.resetPassword
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Fix: clear any stale token so redirecting to /login doesn't autologin to admin
  useEffect(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }, [])

  const ArrowIcon = lang === 'ar' ? ArrowRight : ArrowLeft

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t(d.noMatch))
      return
    }

    if (password.length < 8) {
      setError(t(d.tooShort))
      return
    }

    if (!token) {
      setError(t(d.invalidToken))
      return
    }

    setLoading(true)
    try {
      await AuthService.resetPassword({ token, password, confirmPassword })
      setSuccess(true)
      toast.success(t(d.successMsg))
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.data?.message || t(d.errorMsg)
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-md">
        <div className="card-glass p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">{t(d.invalidToken)}</h1>
          <p className="text-gray-500 text-sm mb-6">{t(d.invalidTokenDesc)}</p>
          <Link href="/forgot-password" className="btn-primary w-full py-3 inline-flex justify-center">
            {t(d.requestNew)}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="card-glass p-8">
        {!success ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <Link href="/login" className="text-gray-400 hover:text-[#C2517A] transition-colors">
                <ArrowIcon size={20} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t(d.title)}</h1>
                <p className="text-gray-500 text-sm">{t(d.sub)}</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="label">{t(d.newPassword)}</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10 rtl:pr-10 rtl:pl-10"
                    minLength={8}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">{t(d.passwordHint)}</p>
              </div>

              <div className="form-group">
                <label className="label">{t(d.confirmPassword)}</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10 rtl:pr-10 rtl:pl-10"
                    minLength={8}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading
                  ? <span className="flex items-center gap-2 justify-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t(d.resetting)}
                    </span>
                  : <span className="flex items-center gap-2 justify-center">
                      <Lock size={16} />
                      {t(d.resetBtn)}
                    </span>
                }
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t(d.successTitle)}</h2>
            <p className="text-gray-500 text-sm mb-6">{t(d.successDesc)}</p>
            <Link href="/login" className="btn-primary w-full py-3 inline-flex justify-center">
              {t(d.goToLogin)}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md">
        <div className="card-glass p-8 text-center">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-[#C2517A] rounded-full animate-spin mx-auto" />
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}

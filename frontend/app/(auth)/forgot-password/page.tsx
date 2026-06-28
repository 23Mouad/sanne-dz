'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { Mail, ArrowLeft, ArrowRight, Send, CheckCircle, Timer } from 'lucide-react'
import toast from 'react-hot-toast'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import { AuthService } from '@/services/auth.service'

export default function ForgotPasswordPage() {
  const t = useT()
  const lang = useLang()
  const d = translations.forgot

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cooldown > 0) return
    setLoading(true)
    try {
      await AuthService.forgotPassword({ email })
      setSent(true)
      setCooldown(60) // Start 60s cooldown
      toast.success(t(d.successMsg))
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.data?.message || ''
      if (msg.includes('patienter')) {
        // Extract remaining seconds from server message
        const match = msg.match(/(\d+)/);
        if (match) setCooldown(parseInt(match[1]))
        toast.error(msg)
      } else {
        // Always show success to prevent email enumeration
        setSent(true)
        setCooldown(60)
        toast.success(t(d.successMsg))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0) return
    setLoading(true)
    try {
      await AuthService.forgotPassword({ email })
      setCooldown(60)
      toast.success(t(d.successMsg))
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.data?.message || ''
      if (msg.includes('patienter')) {
        const match = msg.match(/(\d+)/);
        if (match) setCooldown(parseInt(match[1]))
        toast.error(msg)
      } else {
        setCooldown(60)
        toast.success(t(d.successMsg))
      }
    } finally {
      setLoading(false)
    }
  }

  const ArrowIcon = lang === 'ar' ? ArrowRight : ArrowLeft

  return (
    <div className="w-full max-w-md">
      <div className="card-glass p-8">
        {!sent ? (
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="label">{t(d.yourEmail)}</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="votre@email.com" className="input-field pl-10 rtl:pr-10 rtl:pl-4" />
                </div>
              </div>
              <button type="submit" disabled={loading || cooldown > 0} className="btn-primary w-full py-3">
                {loading
                  ? <span className="flex items-center gap-2 justify-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t(d.sending)}</span>
                  : cooldown > 0
                    ? <span className="flex items-center gap-2 justify-center"><Timer size={16} />{cooldown}s</span>
                    : <span className="flex items-center gap-2 justify-center"><Send size={16} />{t(d.sendLink)}</span>
                }
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t(d.sentTitle)}</h2>
            <p className="text-gray-500 text-sm mb-6">
              {t(d.sentSub)} <strong>{email}</strong>. {t(d.checkInbox)}
            </p>

            {/* Resend with cooldown */}
            <button
              onClick={handleResend}
              disabled={loading || cooldown > 0}
              className="flex items-center justify-center gap-2 text-sm mx-auto mb-4 transition-colors disabled:opacity-50"
              style={{ color: cooldown > 0 ? '#9ca3af' : '#C2517A' }}
            >
              {cooldown > 0 ? (
                <>
                  <Timer size={14} />
                  <span>{t(d.resendIn)} {cooldown}s</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>{t(d.resendLink)}</span>
                </>
              )}
            </button>

            <Link href="/login" className="btn-primary w-full py-3 inline-flex justify-center">
              {t(d.backToLogin)}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

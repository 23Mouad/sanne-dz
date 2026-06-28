'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, RefreshCw, CheckCircle, Timer } from 'lucide-react'
import toast from 'react-hot-toast'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import { AuthService } from '@/services/auth.service'
import { useAuthStore } from '@/store/useAuthStore'

function VerifyEmailContent() {
  const t = useT()
  const d = translations.verifyEmail

  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(60) // Start with 60s cooldown (code was just sent)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

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

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const newOtp = [...otp]
    newOtp[i] = val.slice(-1)
    setOtp(newOtp)
    if (val && i < 5) inputs.current[i + 1]?.focus()
    if (newOtp.every(d => d) && newOtp.join('').length === 6) {
      verifyOtp(newOtp.join(''))
    }
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  const verifyOtp = async (code: string) => {
    if (!email) {
      toast.error('Email manquant');
      return;
    }
    setLoading(true)
    try {
      await AuthService.verifyEmail({ email, code });
      toast.success(t(d.successMsg));
      
      const userState = useAuthStore.getState().user;
      const userRole = (userState?.role as string)?.toLowerCase() || 'client';
      if (userRole === 'admin') {
        router.push('/dashboard/admin');
      } else if (userRole === 'partner') {
        router.push('/dashboard/partner');
      } else {
        router.push('/dashboard/client');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Code invalide ou expiré');
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email || cooldown > 0) {
      if (!email) toast.error('Email manquant');
      return;
    }
    setResending(true)
    try {
      await AuthService.resendVerification({ email });
      setCooldown(60) // Reset cooldown to 60s
      toast.success(t(d.resentMsg));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.response?.data?.data?.message || 'Erreur lors du renvoi';
      if (msg.includes('patienter')) {
        const match = msg.match(/(\d+)/);
        if (match) setCooldown(parseInt(match[1]))
      }
      toast.error(msg);
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="w-full max-w-md text-center">
      <div className="card-glass p-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C2517A] to-[#7F77DD]
                        flex items-center justify-center mx-auto mb-5 shadow-lg">
          <Mail size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t(d.title)}</h1>
        <p className="text-gray-500 text-sm mb-8">
          {t(d.sub)}
        </p>

        {/* OTP Input */}
        <div className="flex items-center justify-center gap-2 mb-6" dir="ltr">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`w-11 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all outline-none
                          ${digit
                            ? 'border-[#C2517A] bg-pink-50 text-[#C2517A]'
                            : 'border-gray-200 text-gray-800 focus:border-[#C2517A] focus:ring-2 focus:ring-pink-100'
                          }`}
            />
          ))}
        </div>

        {/* Demo hint removed since we have real email */}

        {loading && (
          <div className="flex items-center justify-center gap-2 text-[#C2517A] mb-4">
            <CheckCircle size={18} />
            <span className="text-sm font-medium">{t(d.verifying)}</span>
          </div>
        )}

        <button
          onClick={() => verifyOtp(otp.join(''))}
          disabled={otp.some(d => !d) || loading}
          className="btn-primary w-full py-3 mb-4"
        >
          {t(d.verifyBtn)}
        </button>

        <button
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="flex items-center justify-center gap-2 text-sm mx-auto transition-colors disabled:opacity-50"
          style={{ color: cooldown > 0 ? '#9ca3af' : '#C2517A' }}
        >
          {cooldown > 0 ? (
            <>
              <Timer size={14} />
              <span>{t(d.resendIn)} {cooldown}s</span>
            </>
          ) : resending ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              <span>{t(d.resending)}</span>
            </>
          ) : (
            <>
              <RefreshCw size={14} />
              <span>{t(d.resend)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-full"><div className="animate-spin w-8 h-8 border-4 border-[#C2517A] border-t-transparent rounded-full" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}

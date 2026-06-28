'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, User, Mail, Phone, MapPin, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { WILAYAS } from '@/lib/constants'
import { useCategories } from '@/hooks/useCategories'
import toast from 'react-hot-toast'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import { AuthService } from '@/services/auth.service'
import { useAuthStore } from '@/store/useAuthStore'

export default function RegisterClientPage() {
  const t = useT()
  const lang = useLang()
  const d = translations.register

  const STEPS = [t(d.stepInfo), t(d.stepPrefs)]

  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { categories } = useCategories()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    wilaya: '', password: '', confirmPassword: '', acceptTerms: false,
    categorySlugs: [] as string[],
  })

  const update = (k: string, v: string | boolean | string[]) => setForm(prev => ({ ...prev, [k]: v }))

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 0) {
      const phoneRegex = /^(0(5|6|7)\d{8}|\+213(5|6|7)\d{8})$/
      if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
        toast.error(t(d.invalidPhone))
        return
      }
    }
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else handleSubmit()
  }

  const handleSubmit = async () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(form.password)) {
      toast.error(t(d.invalidPwd))
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error(t(d.pwdMismatch))
      return
    }
    setLoading(true)
    try {
      const res = await AuthService.registerClient({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmPassword: form.confirmPassword,
        wilayaId: form.wilaya,
        acceptTerms: form.acceptTerms,
      });
      
      if (res.accessToken) {
        localStorage.setItem('access_token', res.accessToken);
        localStorage.setItem('refresh_token', res.refreshToken);
        await useAuthStore.getState().initialize();
        toast.success(t(d.clientSuccess));
        
        const userState = useAuthStore.getState().user;
        router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false)
    }
  }

  const ArrowIcon = lang === 'ar' ? ArrowRight : ArrowLeft
  const NextIcon = lang === 'ar' ? ArrowLeft : ArrowRight

  if (!mounted) return null;

  return (
    <div className="w-full max-w-lg">
      <div className="card-glass p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => step > 0 ? setStep(s => s - 1) : router.push('/role')}
            className="text-gray-400 hover:text-[#C2517A] transition-colors">
            <ArrowIcon size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{t(d.clientTitle)}</h1>
            <p className="text-gray-500 text-sm">{t(d.step)} {step + 1} {t(d.on)} {STEPS.length} — {STEPS[step]}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-7">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= step ? 'bg-gradient-to-r from-[#C2517A] to-[#7F77DD]' : 'bg-gray-100'
            }`} />
          ))}
        </div>

        <form onSubmit={handleNext} className="space-y-4">
          
          {/* Step 0: Informations personnelles */}
          {step === 0 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="label">{t(d.firstName)} *</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" required placeholder={t(d.firstNamePlace)} className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm"
                      value={form.firstName} onChange={e => update('firstName', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">{t(d.lastName)} *</label>
                  <input type="text" required placeholder={t(d.lastNamePlace)} className="input-field text-sm"
                    value={form.lastName} onChange={e => update('lastName', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="label">{t(d.email)} *</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" required placeholder="amina@gmail.com" className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm"
                    value={form.email} onChange={e => update('email', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="label">{t(d.phone)} *</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" required maxLength={13} placeholder={t(d.phonePlace)} className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm"
                    value={form.phone} onChange={e => update('phone', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="label">{t(d.wilaya)} *</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select required className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm"
                    value={form.wilaya} onChange={e => update('wilaya', e.target.value)}>
                    <option value="">{t(d.chooseWilaya)}</option>
                    {WILAYAS.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Step 1: Préférences et Sécurité */}
          {step === 1 && (
            <>
              <div className="form-group mb-6">
                <label className="label">{t(d.whichCats)} <span className="text-gray-400 font-normal">{t(d.optional)}</span></label>
                <p className="text-xs text-gray-500 mb-3">{t(d.catsHelp)}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map(c => (
                    <label key={c.slug} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${form.categorySlugs.includes(c.slug) ? 'border-[#C2517A] bg-pink-50/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={form.categorySlugs.includes(c.slug)}
                        onChange={(e) => {
                          const newSlugs = e.target.checked 
                            ? [...form.categorySlugs, c.slug] 
                            : form.categorySlugs.filter(s => s !== c.slug);
                          update('categorySlugs', newSlugs);
                        }}
                      />
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${form.categorySlugs.includes(c.slug) ? 'bg-[#C2517A] border-[#C2517A]' : 'border-gray-300'}`}>
                        {form.categorySlugs.includes(c.slug) && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-sm text-gray-700">{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="label">{t(d.pwdLabel)}</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required minLength={8}
                    placeholder={t(d.pwdMin)} className="input-field pr-10 rtl:pr-4 rtl:pl-10 text-sm"
                    value={form.password} onChange={e => update('password', e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 rtl:left-3.5 rtl:right-auto top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="label">{t(d.pwdConfLabel)}</label>
                <input type={showPassword ? 'text' : 'password'} required
                  placeholder={t(d.pwdRepeat)} className="input-field text-sm"
                  value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
              </div>

              <label className="flex items-start gap-3 cursor-pointer group mt-4">
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={form.acceptTerms}
                  onChange={(e) => update('acceptTerms', e.target.checked)}
                />
                <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors
                                ${form.acceptTerms ? 'bg-[#C2517A] border-[#C2517A]' : 'border-gray-300 group-hover:border-[#C2517A]'}`}>
                  {form.acceptTerms && <Check size={14} strokeWidth={3} className="text-white" />}
                </div>
                <span className="text-sm text-gray-600">
                  {t(d.acceptTerms)}{' '}
                  <Link href="/terms" className="text-[#C2517A] hover:underline" onClick={(e) => e.stopPropagation()}>
                    {t(d.andPrivacy).replace(' *', '')}
                  </Link> *
                </span>
              </label>
            </>
          )}

          <button type="submit" disabled={loading || (step === 1 && !form.acceptTerms)} className="btn-primary w-full py-3 mt-4">
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t(d.creatingAccount)}
              </span>
            ) : step < STEPS.length - 1 ? (
              <span className="flex items-center gap-2 justify-center">{t(d.next)} <NextIcon size={16} /></span>
            ) : t(d.createAccountBtn)}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          {t(d.alreadyRegClient)}{' '}
          <Link href="/login" className="text-[#C2517A] hover:underline font-medium">Connexion</Link>
        </p>
      </div>
    </div>
  )
}

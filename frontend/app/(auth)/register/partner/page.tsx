'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Building2, MapPin, Phone, MessageCircle, Tag, Check, Eye, EyeOff, Truck } from 'lucide-react'
import { WILAYAS } from '@/lib/constants'
import { useCategories } from '@/hooks/useCategories'
import toast from 'react-hot-toast'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import { AuthService } from '@/services/auth.service'
import { useAuthStore } from '@/store/useAuthStore'

export default function RegisterPartnerPage() {
  const t = useT()
  const lang = useLang()
  const d = translations.register

  const STEPS = [t(d.stepBiz), t(d.stepLoc), t(d.stepCat), t(d.stepAcc)]

  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { categories } = useCategories()
  const [form, setForm] = useState({
    businessName: '', email: '', phone: '', whatsapp: '',
    wilaya: '', address: '', mapLink: '', deliveryType: '',
    categorySlugs: [] as string[], otherCategory: '', description: '',
    registreCommerce: '',
    password: '', confirmPassword: '',
    acceptTerms: false, acceptPartnerConditions: false, isPro: false,
  })

  const update = (k: keyof typeof form, v: string | boolean | string[]) => setForm(prev => ({ ...prev, [k]: v }))

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Step 0 validation (Phone)
    if (step === 0) {
      const phoneRegex = /^(0(5|6|7)\d{8}|\+213(5|6|7)\d{8})$/
      if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
        toast.error(t(d.invalidPhone))
        return
      }
      if (form.whatsapp && !phoneRegex.test(form.whatsapp.replace(/\s/g, ''))) {
        toast.error(t(d.invalidWa))
        return
      }
    }

    // Step 3 validation (Password)
    if (step === 3) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
      if (!passwordRegex.test(form.password)) {
        toast.error(t(d.invalidPwd))
        return
      }
      if (form.password !== form.confirmPassword) {
        toast.error(t(d.pwdMismatch))
        return
      }
    }

    if (step < STEPS.length - 1) setStep(s => s + 1)
    else handleSubmit()
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Create user
      const payload = {
        businessName: form.businessName,
        email: form.email,
        phone: form.phone,
        whatsapp: form.whatsapp,
        wilayaId: form.wilaya,
        address: form.address,
        mapLink: form.mapLink || undefined,
        deliveryType: form.deliveryType || undefined,
        registreCommerce: form.registreCommerce || undefined,
        categorySlugs: form.categorySlugs,
        description: form.description,
        password: form.password,
        confirmPassword: form.confirmPassword,
        acceptTerms: form.acceptTerms,
        acceptPartnerConditions: form.acceptPartnerConditions,
        isPro: form.isPro,
      };
      
      const res = await AuthService.registerPartner(payload);

      if (res.accessToken) {
        localStorage.setItem('access_token', res.accessToken);
        localStorage.setItem('refresh_token', res.refreshToken);
        await useAuthStore.getState().initialize();
        toast.success(t(d.partnerSuccess));
        
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
            <h1 className="text-xl font-bold text-gray-900">{t(d.partnerTitle)}</h1>
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

          {/* Step 0: Business Info */}
          {step === 0 && (
            <>
              <div className="form-group">
                <label className="label">{t(d.bizName)}</label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" required placeholder={t(d.bizNamePlace)} className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm"
                    value={form.businessName} onChange={e => update('businessName', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">{t(d.proEmail)}</label>
                <input type="email" required placeholder={t(d.proEmailPlace)} className="input-field text-sm"
                  value={form.email} onChange={e => update('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="label">{t(d.phone)}</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" required maxLength={13} placeholder={t(d.phonePlace)} className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm"
                    value={form.phone} onChange={e => update('phone', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">WhatsApp *</label>
                <div className="relative">
                  <MessageCircle size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" required maxLength={13} placeholder={t(d.waPlace)} className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm"
                    value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">{t(d.rc)} <span className="text-gray-400 font-normal">{t(d.optional)}</span></label>
                <input type="text" placeholder={t(d.rcPlace)} className="input-field text-sm"
                  value={form.registreCommerce} onChange={e => update('registreCommerce', e.target.value)} />
              </div>
            </>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <>
              <div className="form-group">
                <label className="label">{t(d.chooseWilaya)} *</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select required className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm"
                    value={form.wilaya} onChange={e => update('wilaya', e.target.value)}>
                    <option value="">{t(d.chooseWilaya)}</option>
                    {WILAYAS.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="label">{t(d.address)} <span className="text-gray-400 font-normal">{t(d.optional)}</span></label>
                <input type="text" placeholder={t(d.addressPlace)}
                  className="input-field text-sm"
                  value={form.address} onChange={e => update('address', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="label">{t(d.mapsLink)} <span className="text-gray-400 font-normal">{t(d.optional)}</span></label>
                <input type="url" placeholder="https://maps.google.com/..." className="input-field text-sm"
                  value={form.mapLink} onChange={e => update('mapLink', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="label">{t(d.delivery)} <span className="text-gray-400 font-normal">{t(d.optional)}</span></label>
                <div className="relative">
                  <Truck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder={t(d.deliveryPlace)} className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm"
                    value={form.deliveryType} onChange={e => update('deliveryType', e.target.value)} />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Category */}
          {step === 2 && (
            <>
              <div className="form-group">
                <label className="label">{t(d.catBiz)}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
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
                  <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${form.categorySlugs.includes('autre') ? 'border-[#C2517A] bg-pink-50/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={form.categorySlugs.includes('autre')}
                      onChange={(e) => {
                        const newSlugs = e.target.checked 
                          ? [...form.categorySlugs, 'autre'] 
                          : form.categorySlugs.filter(s => s !== 'autre');
                        update('categorySlugs', newSlugs);
                      }}
                    />
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${form.categorySlugs.includes('autre') ? 'bg-[#C2517A] border-[#C2517A]' : 'border-gray-300'}`}>
                      {form.categorySlugs.includes('autre') && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-sm text-gray-700">{t(d.other)}</span>
                  </label>
                </div>
                {form.categorySlugs.includes('autre') && (
                  <div className="mt-4">
                    <label className="label">{t(d.specifyCat)}</label>
                    <input type="text" required placeholder={t(d.specifyCatPlace)} className="input-field text-sm"
                      value={form.otherCategory} onChange={e => update('otherCategory', e.target.value)} />
                  </div>
                )}
              </div>
              <div className="form-group mt-6">
                <label className="label">{t(d.descBiz)}</label>
                <textarea required rows={5} minLength={20}
                  placeholder={t(d.descBizPlace)}
                  className="input-field resize-none text-sm"
                  value={form.description} onChange={e => update('description', e.target.value)} />
                <p className="text-xs text-gray-400 mt-1">{form.description.length}{t(d.charsMin)}</p>
              </div>
            </>
          )}

          {/* Step 3: Account */}
          {step === 3 && (
            <>
              {/* Plan Selection */}
              <div className="form-group mb-6">
                <label className="label">Choisissez votre abonnement *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${!form.isPro ? 'border-[#C2517A] bg-pink-50/30 shadow-md' : 'border-gray-200 hover:border-pink-200'}`}>
                    <input type="radio" name="plan" className="hidden" checked={!form.isPro} onChange={() => update('isPro', false)} />
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-900">Plan Simple</span>
                      {!form.isPro && <div className="w-4 h-4 rounded-full bg-[#C2517A] border-4 border-pink-100 shadow-sm" />}
                    </div>
                    <span className="text-sm font-semibold text-[#C2517A] mb-2">Gratuit</span>
                    <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                      <li>Profil basique</li>
                      <li>Contact direct via WhatsApp</li>
                      <li>1 Catégorie maximum</li>
                    </ul>
                  </label>

                  <label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${form.isPro ? 'border-[#C2517A] bg-pink-50/30 shadow-md' : 'border-gray-200 hover:border-pink-200'}`}>
                    <div className="absolute -top-3 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      Recommandé
                    </div>
                    <input type="radio" name="plan" className="hidden" checked={form.isPro} onChange={() => update('isPro', true)} />
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-900">Plan Pro</span>
                      {form.isPro && <div className="w-4 h-4 rounded-full bg-[#C2517A] border-4 border-pink-100 shadow-sm" />}
                    </div>
                    <span className="text-sm font-semibold text-[#C2517A] mb-2">Tarif préférentiel</span>
                    <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                      <li>Badge Premium & Priorité</li>
                      <li>Catégories illimitées</li>
                      <li>Statistiques & Vues</li>
                    </ul>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="label">{t(d.pwdLabel)}</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required minLength={8}
                    placeholder={t(d.pwdMin)} className="input-field pr-10 rtl:pr-4 rtl:pl-10 text-sm"
                    value={form.password} onChange={e => update('password', e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 rtl:left-3.5 rtl:right-auto top-1/2 -translate-y-1/2 text-gray-400">
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
              <div className="space-y-3 mt-2">
                 {[
                   { key: 'acceptTerms' as const, label: t(d.acceptCondGen) },
                   { key: 'acceptPartnerConditions' as const, label: t(d.acceptCondPart) },
                 ].map(({ key, label }) => (
                   <label key={key} className="flex items-start gap-3 cursor-pointer group">
                     <input 
                       type="checkbox" 
                       className="hidden" 
                       checked={Boolean(form[key])}
                       onChange={(e) => update(key, e.target.checked)}
                     />
                     <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors
                                     ${form[key]
                                       ? 'bg-[#C2517A] border-[#C2517A]'
                                       : 'border-gray-300 group-hover:border-[#C2517A]'
                                     }`}>
                       {form[key] && <Check size={14} strokeWidth={3} className="text-white" />}
                     </div>
                     <span className="text-sm text-gray-600">{label} *</span>
                   </label>
                 ))}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={
              loading || 
              (step === 2 && form.categorySlugs.length === 0) ||
              (step === 3 && (!form.acceptTerms || !form.acceptPartnerConditions))
            }
            className="btn-primary w-full py-3 mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t(d.submitting)}
              </span>
            ) : step < STEPS.length - 1 ? (
              <span className="flex items-center gap-2 justify-center">{t(d.next)} <NextIcon size={16} /></span>
            ) : t(d.submitBtn)}
          </button>
        </form>
      </div>
    </div>
  )
}

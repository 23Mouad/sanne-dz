'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Camera, Save, Image as ImageIcon, Briefcase, Phone, MessageCircle, Tag, CheckCircle2, Truck, Globe, Clock } from 'lucide-react'

import { WILAYAS } from '@/lib/constants'
import { useCategories } from '@/hooks/useCategories'
import { PartnersService } from '@/services/partners.service'
import { getImageUrl } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useT, useLang } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import api from '@/lib/api'

export default function PartnerProfileEditPage() {
  const t = useT()
  const d = translations.partnerProfile
  const daysMap = d.days[useLang()]
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const { categories } = useCategories()

  const [form, setForm] = useState({
    businessName: '',
    phone: '',
    whatsapp: '',
    address: '',
    wilaya: '',
    categorySlug: '',
    description: '',
    registreCommerce: '',
    mapLink: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    website: '',
    deliveryType: '',
    logoUrl: '',
    coverUrl: '',
    minOrder: '',
    remoteWork: false,
    appointmentStatus: 'Non',
    deliveryAvailable: false,
    services: [] as string[],
    achievements: [] as string[],
  })

  const [schedule, setSchedule] = useState<Record<string, { open: string; close: string; isClosed: boolean }>>({})

  useEffect(() => {
    const load = async () => {
      try {
        const p = await PartnersService.getMyProfile()
        setForm({
          businessName: p.businessName || '',
          phone: p.phone || '',
          whatsapp: p.whatsapp || '',
          address: p.address || '',
          wilaya: typeof p.wilaya === 'string' ? p.wilaya : (p.wilaya?.id || ''),
          categorySlug: p.categories && p.categories.length > 0 ? p.categories[0].category.slug : (p.category?.slug || ''),
          description: p.description || '',
          registreCommerce: p.registreCommerce || '',
          mapLink: p.mapLink || '',
          facebook: '',
          instagram: '',
          tiktok: '',
          website: p.website || '',
          deliveryType: (p as any).deliveryType || '',
          logoUrl: p.logoUrl || '',
          coverUrl: p.coverUrl || '',
          minOrder: p.minOrder || '',
          remoteWork: p.remoteWork || false,
          appointmentStatus: p.appointmentStatus || 'Non',
          deliveryAvailable: p.deliveryAvailable || false,
          services: p.services || [],
          achievements: p.achievements || [],
        })
        
        setSchedule(
          daysMap.reduce((acc, d) => {
            type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
            const dayKey = d.key as DayKey
            const daySchedule = p.schedule?.[dayKey]
            return {
              ...acc,
              [d.key]: { open: daySchedule?.open ?? '08:00', close: daySchedule?.close ?? '18:00', isClosed: daySchedule?.isClosed ?? dayKey === 'sunday' },
            }
          }, {})
        )
      } catch (err) {
        console.error(err)
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const u = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }))

  const handleArrayChange = (field: 'services' | 'achievements', index: number, value: string) => {
    const newArr = [...form[field]];
    newArr[index] = value;
    u(field, newArr);
  }

  const addArrayItem = (field: 'services' | 'achievements') => {
    u(field, [...form[field], '']);
  }

  const removeArrayItem = (field: 'services' | 'achievements', index: number) => {
    const newArr = [...form[field]];
    newArr.splice(index, 1);
    u(field, newArr);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        businessName: form.businessName,
        phone: form.phone,
        whatsapp: form.whatsapp,
        address: form.address,
        wilayaId: form.wilaya,
        description: form.description,
        registreCommerce: form.registreCommerce,
        mapLink: form.mapLink,
        facebook: form.facebook,
        instagram: form.instagram,
        tiktok: form.tiktok,
        website: form.website,
        deliveryType: form.deliveryType,
        minOrder: form.minOrder,
        remoteWork: form.remoteWork,
        appointmentStatus: form.appointmentStatus,
        deliveryAvailable: form.deliveryAvailable,
        services: form.services.filter((s: string) => s.trim() !== ''),
        achievements: form.achievements.filter((a: string) => a.trim() !== ''),
        schedule
      }
      await PartnersService.updateMyProfile(payload)
      if (form.categorySlug) {
        // If we want to support updating the category, we can call it here. 
        // For now, let's just make sure it doesn't break.
        try {
          await api.put('/partners/me/categories', { categorySlugs: [form.categorySlug] });
        } catch (e) {
          console.error("Failed to update category", e)
        }
      }
      toast.success(t(d.saveSuccess))
    } catch (error) {
      console.error(error)
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoUploading(true)
    try {
      const res = await PartnersService.updateLogo(file)
      setForm(prev => ({ ...prev, logoUrl: res.logoUrl }))
      toast.success('Logo mis à jour')
    } catch (err) {
      toast.error('Erreur lors du téléchargement')
    } finally {
      setLogoUploading(false)
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverUploading(true)
    try {
      const res = await PartnersService.updateCover(file)
      setForm(prev => ({ ...prev, coverUrl: res.coverUrl }))
      toast.success('Couverture mise à jour')
    } catch (err) {
      toast.error('Erreur lors du téléchargement')
    } finally {
      setCoverUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-pink-100 border-t-[#C2517A] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-title">{t(d.title)}</h1>
        <p className="page-subtitle">{t(d.subtitle)}</p>
      </div>

      {/* Logo/Cover */}
      <div className="card p-5">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Camera size={16} className="text-[#C2517A]" />{t(d.mediaTitle)}
        </h2>
        <div className="flex flex-col sm:flex-row gap-6">
          
          <div className="shrink-0">
            <p className="text-sm font-medium text-gray-700 mb-2">{t(d.logo)}</p>
            <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={handleLogoUpload} />
            <button type="button" onClick={() => logoInputRef.current?.click()} disabled={logoUploading}
              className="relative w-32 h-32 bg-pink-50 border-2 border-dashed border-pink-200 rounded-2xl
                                flex items-center justify-center text-center p-3 hover:border-[#C2517A]
                                hover:bg-pink-100 transition-colors group overflow-hidden">
              {form.logoUrl ? (
                <img src={getImageUrl(form.logoUrl)} alt="Logo" className="absolute inset-0 w-full h-full object-cover" />
              ) : null}
              <div className={`relative z-10 ${form.logoUrl ? 'bg-black/50 p-2 rounded-lg opacity-0 group-hover:opacity-100' : ''}`}>
                {logoUploading ? <div className="w-6 h-6 border-2 border-[#C2517A]/30 border-t-[#C2517A] rounded-full animate-spin mx-auto" /> : (
                  <>
                    <Camera size={24} className={`${form.logoUrl ? 'text-white' : 'text-pink-300'} group-hover:text-[#C2517A] mx-auto mb-1.5 transition-colors`} />
                    <span className={`text-xs font-medium ${form.logoUrl ? 'text-white' : 'text-gray-500'} group-hover:text-[#C2517A] transition-colors`}>{t(d.change)}</span>
                  </>
                )}
              </div>
            </button>
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-2">{t(d.cover)}</p>
            <input type="file" accept="image/*" className="hidden" ref={coverInputRef} onChange={handleCoverUpload} />
            <button type="button" onClick={() => coverInputRef.current?.click()} disabled={coverUploading}
              className="relative w-full h-32 bg-pink-50 border-2 border-dashed border-pink-200 rounded-2xl
                                flex items-center justify-center text-center p-3 hover:border-[#C2517A]
                                hover:bg-pink-100 transition-colors group overflow-hidden">
              {form.coverUrl ? (
                <img src={getImageUrl(form.coverUrl)} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
              ) : null}
              <div className={`relative z-10 ${form.coverUrl ? 'bg-black/50 p-2 rounded-lg opacity-0 group-hover:opacity-100' : ''}`}>
                {coverUploading ? <div className="w-6 h-6 border-2 border-[#C2517A]/30 border-t-[#C2517A] rounded-full animate-spin mx-auto" /> : (
                  <>
                    <Camera size={24} className={`${form.coverUrl ? 'text-white' : 'text-pink-300'} group-hover:text-[#C2517A] mx-auto mb-1.5 transition-colors`} />
                    <span className={`text-xs font-medium ${form.coverUrl ? 'text-white' : 'text-gray-500'} group-hover:text-[#C2517A] transition-colors`}>{t(d.changeCover)}</span>
                  </>
                )}
              </div>
            </button>
          </div>

        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Business Info */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4">{t(d.generalInfo)}</h2>
          <div className="space-y-4">
            <div className="form-group">
              <label className="label">{t(d.bizName)}</label>
              <input type="text" required className="input-field text-sm" value={form.businessName}
                onChange={e => u('businessName', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">{t(d.phone)}</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" required className="input-field pl-9 text-sm" value={form.phone}
                    onChange={e => u('phone', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">{t(d.whatsapp)}</label>
                <div className="relative">
                  <MessageCircle size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" required className="input-field pl-9 text-sm" value={form.whatsapp}
                    onChange={e => u('whatsapp', e.target.value)} />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="label">{t(d.category)}</label>
              <div className="relative">
                <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <select required className="input-field pl-9 text-sm" value={form.categorySlug}
                  onChange={e => u('categorySlug', e.target.value)}>
                  {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="label">{t(d.description)}</label>
              <textarea required rows={4} className="input-field resize-none text-sm" value={form.description}
                onChange={e => u('description', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-[#C2517A]" />{t(d.locationTitle)}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">{t(d.wilaya)}</label>
                  <select required className="input-field text-sm" value={form.wilaya}
                    onChange={e => u('wilaya', e.target.value)}>
                    <option value="">Sélectionnez une wilaya</option>
                    {WILAYAS.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
              </div>
              <div className="form-group">
                <label className="label">{t(d.rc)}</label>
                <input type="text" className="input-field text-sm" value={form.registreCommerce}
                  onChange={e => u('registreCommerce', e.target.value)} placeholder="RC-16-B-..." />
              </div>
            </div>
            <div className="form-group">
              <label className="label">{t(d.address)}</label>
              <input type="text" required className="input-field text-sm" value={form.address}
                onChange={e => u('address', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="label">{t(d.mapsLink)}</label>
              <input type="url" className="input-field text-sm" value={form.mapLink}
                onChange={e => u('mapLink', e.target.value)} placeholder="https://maps.google.com/..." />
            </div>
            <div className="form-group">
              <label className="label">{t(d.delivery)} <span className="text-gray-400 font-normal">{t(d.optional)}</span></label>
              <div className="relative">
                <Truck size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" className="input-field pl-9 text-sm" value={form.deliveryType}
                  onChange={e => u('deliveryType', e.target.value)} placeholder="Ex: Yalidine, Zirim, Interne..." />
              </div>
            </div>
          </div>
        </div>

        {/* Conditions & Infos Pratiques */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-[#C2517A]" />Conditions & Infos Pratiques
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">Commande minimum</label>
                <input type="text" className="input-field text-sm" value={form.minOrder}
                  onChange={e => u('minOrder', e.target.value)} placeholder="Ex: Aucune, 5000 DA..." />
              </div>
              <div className="form-group">
                <label className="label">Rendez-vous obligatoire</label>
                <select className="input-field text-sm" value={form.appointmentStatus}
                  onChange={e => u('appointmentStatus', e.target.value)}>
                  <option value="Non">Non</option>
                  <option value="Oui">Oui</option>
                  <option value="Recommandé">Recommandé</option>
                </select>
              </div>
              <div className="form-group flex items-center gap-3">
                <input type="checkbox" id="remoteWork" className="w-4 h-4 text-[#C2517A] rounded border-gray-300 focus:ring-[#C2517A]" 
                  checked={form.remoteWork} onChange={e => u('remoteWork', e.target.checked)} />
                <label htmlFor="remoteWork" className="label !mb-0 cursor-pointer">Travail à distance accepté</label>
              </div>
              <div className="form-group flex items-center gap-3">
                <input type="checkbox" id="deliveryAvailable" className="w-4 h-4 text-[#C2517A] rounded border-gray-300 focus:ring-[#C2517A]" 
                  checked={form.deliveryAvailable} onChange={e => u('deliveryAvailable', e.target.checked)} />
                <label htmlFor="deliveryAvailable" className="label !mb-0 cursor-pointer">Livraison disponible</label>
              </div>
            </div>
          </div>
        </div>

        {/* Services & Réalisations */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase size={16} className="text-[#C2517A]" />Services & Réalisations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Services */}
            <div>
              <label className="label mb-2 flex items-center justify-between">
                Services proposés
                <button type="button" onClick={() => addArrayItem('services')} className="text-[#C2517A] text-xs font-semibold hover:underline">
                  + Ajouter
                </button>
              </label>
              <div className="space-y-2">
                {form.services.map((service, i) => (
                  <div key={`service-${i}`} className="flex items-center gap-2">
                    <input type="text" className="input-field text-sm flex-1" value={service}
                      onChange={e => handleArrayChange('services', i, e.target.value)} placeholder="Ex: Couture sur mesure" />
                    <button type="button" onClick={() => removeArrayItem('services', i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      &times;
                    </button>
                  </div>
                ))}
                {form.services.length === 0 && <p className="text-xs text-gray-400 italic">Aucun service défini. Les services par défaut seront affichés.</p>}
              </div>
            </div>

            {/* Réalisations */}
            <div>
              <label className="label mb-2 flex items-center justify-between">
                Nos réalisations
                <button type="button" onClick={() => addArrayItem('achievements')} className="text-[#C2517A] text-xs font-semibold hover:underline">
                  + Ajouter
                </button>
              </label>
              <div className="space-y-2">
                {form.achievements.map((achievement, i) => (
                  <div key={`achievement-${i}`} className="flex items-center gap-2">
                    <input type="text" className="input-field text-sm flex-1" value={achievement}
                      onChange={e => handleArrayChange('achievements', i, e.target.value)} placeholder="Ex: Robes de mariée" />
                    <button type="button" onClick={() => removeArrayItem('achievements', i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      &times;
                    </button>
                  </div>
                ))}
                {form.achievements.length === 0 && <p className="text-xs text-gray-400 italic">Aucune réalisation définie. Les réalisations par défaut seront affichées.</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-[#C2517A]" />{t(d.scheduleTitle)}
          </h2>
          <div className="space-y-2">
            {daysMap.map(dayItem => {
              const s = schedule[dayItem.key]
              return (
                <div key={dayItem.key} className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer w-28 shrink-0">
                    <div className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${!s.isClosed ? 'bg-[#C2517A]' : 'bg-gray-200'}`}
                      onClick={() => setSchedule(prev => ({ ...prev, [dayItem.key]: { ...prev[dayItem.key], isClosed: !prev[dayItem.key].isClosed } }))}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${!s.isClosed ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{dayItem.label}</span>
                  </label>
                  {s.isClosed ? (
                    <span className="text-sm text-gray-400 italic">{t(d.closed)}</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input type="time" value={s.open} className="input-field text-xs py-1.5 px-2 w-24"
                        onChange={e => setSchedule(prev => ({ ...prev, [dayItem.key]: { ...prev[dayItem.key], open: e.target.value } }))} />
                      <span className="text-gray-400 text-sm">–</span>
                      <input type="time" value={s.close} className="input-field text-xs py-1.5 px-2 w-24"
                        onChange={e => setSchedule(prev => ({ ...prev, [dayItem.key]: { ...prev[dayItem.key], close: e.target.value } }))} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary py-3 w-full sm:w-auto">
          {saving
            ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t(d.saving)}</span>
            : <span className="flex items-center gap-2"><Save size={16} />{t(d.save)}</span>
          }
        </button>
      </form>
    </div>
  )
}

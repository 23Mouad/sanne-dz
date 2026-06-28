'use client'

import { useState, useEffect } from 'react'
import { Save, Globe, MapPin, Phone, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import { invalidateSettingsCache } from '@/hooks/useSettings'

export default function AdminSettingsPage() {
  const t = useT()
  const d = translations.adminSettings

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    facebook: 'https://facebook.com/sannedz',
    instagram: 'https://instagram.com/sannedz',
    tiktok: 'https://tiktok.com/@sannedz',
    contactEmail: 'contact@sannedz.com',
    contactPhone: '+213 555 000 000',
    whatsapp: '+213 555 000 000',
    address: 'Alger, Algérie',
  })

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.get('/admin/settings')
        if (res.data && Object.keys(res.data).length > 0) {
          setForm(prev => ({ ...prev, ...res.data }))
        }
      } catch (err) {
        console.error('Failed to load settings', err)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const u = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/admin/settings', form)
      invalidateSettingsCache() // force other components to reload settings
      toast.success(t(d.successMsg))
    } catch (err) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-title">{t(d.title)}</h1>
        <p className="page-subtitle">{t(d.sub)}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Contact Info */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-[#C2517A]" />{t(d.contactInfo)}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">{t(d.address)}</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm" value={form.address}
                    onChange={e => u('address', e.target.value)} placeholder="Ex: Alger, Algérie" />
                </div>
              </div>
              <div className="form-group">
                <label className="label">{t(d.phone)}</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm" value={form.contactPhone}
                    onChange={e => u('contactPhone', e.target.value)} placeholder="+213 ..." dir="ltr" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">{t(d.whatsapp)}</label>
                <div className="relative">
                  <MessageCircle size={14} className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm" value={form.whatsapp}
                    onChange={e => u('whatsapp', e.target.value)} placeholder="+213 ..." dir="ltr" />
                </div>
              </div>
              <div className="form-group">
                <label className="label">{t(d.email)}</label>
                <div className="relative">
                  <Globe size={14} className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm" value={form.contactEmail}
                    onChange={e => u('contactEmail', e.target.value)} dir="ltr" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Globe size={16} className="text-[#C2517A]" />{t(d.socials)}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">{t(d.facebook)}</label>
                <div className="relative">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 320 512" className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
                  <input type="url" className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm" value={form.facebook}
                    onChange={e => u('facebook', e.target.value)} placeholder="https://facebook.com/..." dir="ltr" />
                </div>
              </div>
              <div className="form-group">
                <label className="label">{t(d.instagram)}</label>
                <div className="relative">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  <input type="url" className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm" value={form.instagram}
                    onChange={e => u('instagram', e.target.value)} placeholder="https://instagram.com/..." dir="ltr" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="label">{t(d.tiktok)}</label>
                <div className="relative">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 448 512" className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-gray-400"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
                  <input type="url" className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm" value={form.tiktok}
                    onChange={e => u('tiktok', e.target.value)} placeholder="https://tiktok.com/@..." dir="ltr" />
                </div>
              </div>
            </div>
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

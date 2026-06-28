'use client'

import { useState, useEffect, useRef } from 'react'
import { User, Mail, Phone, MapPin, Save, Camera } from 'lucide-react'
import Image from 'next/image'
import { WILAYAS } from '@/lib/constants'
import { useAuthStore } from '@/store/useAuthStore'
import { AuthService } from '@/services/auth.service'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/Modal'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'
import { getImageUrl } from '@/lib/utils'

export default function ClientProfilePage() {
  const t = useT()
  const d = translations.clientDashboard

  const { user, updateUser } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    wilaya: typeof user?.wilaya === 'object' ? (user?.wilaya as any)?.id : (user?.wilaya || ''),
  })

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        wilaya: typeof user.wilaya === 'object' ? (user.wilaya as any)?.id : (user.wilaya || ''),
      })
    }
  }, [user])
  const [saving, setSaving] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await AuthService.updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        wilayaId: form.wilaya
      })
      updateUser({ firstName: form.firstName, lastName: form.lastName, phone: form.phone, wilaya: form.wilaya })
      toast.success(t(d.saveSuccess))
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await AuthService.deleteAccount();
      toast.success(t(d.accountDeleted));
      setIsDeleteModalOpen(false);
      useAuthStore.getState().logout();
      window.location.href = '/auth/login';
    } catch (error) {
      toast.error('Failed to delete account');
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      toast.loading('Uploading...', { id: 'avatar-upload' })
      const res = await AuthService.uploadAvatar(file)
      updateUser({ avatar: res.avatar })
      toast.success('Avatar updated!', { id: 'avatar-upload' })
    } catch (error) {
      toast.error('Failed to upload avatar', { id: 'avatar-upload' })
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <User size={28} className="text-[#C2517A]" />
          {t(d.profileTitle)}
        </h1>
        <p className="page-subtitle">{t(d.profileSub)}</p>
      </div>

      {/* Avatar */}
      <div className="card p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C2517A] to-[#7F77DD]
                            flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
              {user?.avatar ? (
                <Image src={getImageUrl(user.avatar)} alt="Avatar" width={80} height={80} className="object-cover w-full h-full" unoptimized={true} />
              ) : (
                <>{form.firstName[0] || ''}{form.lastName[0] || ''}</>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 rtl:right-auto rtl:-left-1 w-7 h-7 rounded-full bg-[#C2517A] flex items-center justify-center
                               text-white shadow-md hover:bg-[#a8365f] transition-colors">
              <Camera size={13} />
            </button>
          </div>
          <div>
            <p className="font-bold text-gray-900">{form.firstName} {form.lastName}</p>
            <p className="text-sm text-[#C2517A]">{t(d.role)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t(d.memberSince)}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 mb-5">{t(d.personalInfo)}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="label">{t(d.firstName)}</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" className="input-field pl-9 text-sm" value={form.firstName}
                  onChange={e => update('firstName', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="label">{t(d.lastName)}</label>
              <input type="text" className="input-field text-sm" value={form.lastName}
                onChange={e => update('lastName', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">{t(d.email)}</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" className="input-field pl-9 text-sm bg-gray-50" value={form.email}
                readOnly disabled />
            </div>
            <p className="text-xs text-gray-400 mt-1">{t(d.emailNotice)}</p>
          </div>
          <div className="form-group">
            <label className="label">{t(d.phone)}</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" className="input-field pl-9 text-sm" value={form.phone}
                onChange={e => update('phone', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="label">{t(d.wilaya)}</label>
            <div className="relative">
              <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select className="input-field pl-9 text-sm" value={form.wilaya}
                onChange={e => update('wilaya', e.target.value)}>
                <option value="">{t(d.choose)}</option>
                {WILAYAS.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary py-2.5">
            {saving
              ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t(d.saving)}</span>
              : <span className="flex items-center gap-2"><Save size={16} />{t(d.save)}</span>
            }
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-red-100">
        <h2 className="font-bold text-red-600 mb-3">{t(d.dangerZone)}</h2>
        <p className="text-sm text-gray-500 mb-4">{t(d.dangerNotice)}</p>
        <button type="button" onClick={() => setIsDeleteModalOpen(true)}
          className="border-2 border-red-200 text-red-500 px-4 py-2 rounded-xl text-sm font-medium
                           hover:bg-red-50 hover:border-red-300 transition-colors">
          {t(d.deleteAccountBtn)}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title={t(d.deleteModalTitle)} size="sm">
        <p className="text-gray-600 mb-6 text-sm">
          {t(d.deleteModalDesc)}
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setIsDeleteModalOpen(false)} className="btn-ghost py-2">{t(d.cancel)}</button>
          <button onClick={handleDelete} 
            className="btn-primary !bg-red-500 hover:!bg-red-600 !shadow-red-500/30 border-red-500 py-2">
            {t(d.confirmDelete)}
          </button>
        </div>
      </Modal>
    </div>
  )
}

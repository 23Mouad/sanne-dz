'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, Shield, Key } from 'lucide-react'
import { AuthService } from '@/services/auth.service'
import { PartnersService } from '@/services/partners.service'
import toast from 'react-hot-toast'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function PartnerSettingsPage() {
  const t = useT()
  const d = translations.partnerSettings

  const [saving, setSaving] = useState(false)
  const [partner, setPartner] = useState<any>(null)
  const [requestingDeletion, setRequestingDeletion] = useState(false)

  useEffect(() => {
    PartnersService.getMyProfile().then(setPartner).catch(console.error)
  }, [])

  const handleRequestDeletion = async () => {
    if (!confirm('Êtes-vous sûr de vouloir demander la suppression de votre compte ? Cette action est irréversible après approbation.')) return;
    setRequestingDeletion(true);
    try {
      await PartnersService.requestDeletion();
      toast.success('Demande de suppression envoyée.');
      setPartner((prev: any) => ({ ...prev, deletionRequestedAt: new Date().toISOString() }));
    } catch (error: any) {
      toast.error('Erreur lors de la demande');
    } finally {
      setRequestingDeletion(false);
    }
  }
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true)
    try {
      await AuthService.changePassword(form);
      toast.success(t(d.successMsg))
      setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Settings size={28} className="text-[#C2517A]" />
          {t(d.title)}
        </h1>
        <p className="page-subtitle">{t(d.sub)}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Security */}
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield size={18} className="text-[#C2517A]" /> {t(d.security)}
          </h2>
          <div className="space-y-4">
            <div className="form-group">
              <label className="label">Current Password</label>
              <div className="relative">
                <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" placeholder="••••••••" 
                  className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm" 
                  value={form.currentPassword} onChange={e => update('currentPassword', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="label">{t(d.newPwd)}</label>
              <div className="relative">
                <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" placeholder="••••••••" 
                  className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm" 
                  value={form.newPassword} onChange={e => update('newPassword', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="label">{t(d.confirmPwd)}</label>
              <div className="relative">
                <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" placeholder="••••••••" 
                  className="input-field pl-9 rtl:pr-9 rtl:pl-4 text-sm" 
                  value={form.confirmNewPassword} onChange={e => update('confirmNewPassword', e.target.value)} required />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary py-3 w-full sm:w-auto flex items-center gap-2">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
          {saving ? t(d.saving) : t(d.save)}
        </button>

      </form>

      {/* Danger Zone */}
      <div className="card p-5 border-red-100 bg-red-50/30 mt-8">
        <h2 className="font-bold text-red-600 mb-2 flex items-center gap-2">
          Zone de danger
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          La suppression de votre compte est définitive. Une fois approuvée par un administrateur, toutes vos données (profil, avis, médias) seront effacées.
        </p>
        
        {partner?.deletionRequestedAt ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 font-semibold rounded-xl text-sm">
            Demande de suppression en attente d'approbation
          </div>
        ) : (
          <button 
            type="button"
            onClick={handleRequestDeletion}
            disabled={requestingDeletion}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl text-sm transition-colors flex items-center gap-2"
          >
            {requestingDeletion ? <div className="w-4 h-4 border-2 border-red-700/30 border-t-red-700 rounded-full animate-spin" /> : null}
            Demander la suppression du compte
          </button>
        )}
      </div>

    </div>
  )
}

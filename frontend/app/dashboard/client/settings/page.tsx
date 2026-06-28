'use client'

import { useState } from 'react'
import { Settings, Save, Shield, Key, Eye, EyeOff } from 'lucide-react'
import { AuthService } from '@/services/auth.service'
import toast from 'react-hot-toast'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

export default function ClientSettingsPage() {
  const t = useT()
  const d = translations.clientSettings

  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
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
              <label className="label">{t(d.oldPwd)}</label>
              <div className="relative">
                <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" 
                  className="input-field pl-9 pr-10 rtl:pr-9 rtl:pl-10 text-sm" 
                  value={form.currentPassword} onChange={e => update('currentPassword', e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 rtl:left-3.5 rtl:right-auto top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="label">{t(d.newPwd)}</label>
              <div className="relative">
                <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" 
                  className="input-field pl-9 pr-10 rtl:pr-9 rtl:pl-10 text-sm" 
                  value={form.newPassword} onChange={e => update('newPassword', e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 rtl:left-3.5 rtl:right-auto top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="label">{t(d.confirmNewPwd)}</label>
              <div className="relative">
                <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" 
                  className="input-field pl-9 pr-10 rtl:pr-9 rtl:pl-10 text-sm" 
                  value={form.confirmNewPassword} onChange={e => update('confirmNewPassword', e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 rtl:left-3.5 rtl:right-auto top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary py-3 w-full sm:w-auto flex items-center gap-2">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
          {saving ? t(d.saving) : t(d.save)}
        </button>

      </form>
    </div>
  )
}

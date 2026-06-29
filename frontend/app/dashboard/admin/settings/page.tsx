'use client'

import { useState } from 'react'
import { Lock, Shield, Eye, EyeOff, CheckCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

export default function AdminSettingsPage() {
  const [step, setStep] = useState<'password' | 'otp'>('password')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)
    try {
      await api.post('/admin/password/request-otp', { newPassword })
      toast.success('Code OTP envoyé à votre adresse email !')
      setStep('otp')
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erreur lors de l\'envoi du code'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      toast.error('Veuillez entrer le code à 6 chiffres')
      return
    }

    setLoading(true)
    try {
      await api.put('/admin/password/confirm', { otp, newPassword })
      toast.success('Mot de passe modifié avec succès !')
      setDone(true)
      // Reset form
      setNewPassword('')
      setConfirmPassword('')
      setOtp('')
      setStep('password')
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Code OTP invalide ou expiré'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Shield size={28} className="text-[#C2517A]" />
          Paramètres — Sécurité
        </h1>
        <p className="page-subtitle">Modifiez votre mot de passe administrateur de manière sécurisée via une vérification OTP</p>
      </div>

      {done && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
          <CheckCircle size={20} className="text-green-500 shrink-0" />
          <p className="text-sm font-semibold text-green-800">Mot de passe modifié avec succès !</p>
        </div>
      )}

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step === 'password' ? 'bg-[#C2517A] text-white' : 'bg-green-500 text-white'
            }`}>
              {step === 'otp' ? <CheckCircle size={14} /> : '1'}
            </div>
            <span className={`text-sm font-medium ${step === 'password' ? 'text-gray-900' : 'text-gray-400'}`}>
              Nouveau mot de passe
            </span>
          </div>
          <div className="flex-1 h-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step === 'otp' ? 'bg-[#C2517A] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className={`text-sm font-medium ${step === 'otp' ? 'text-gray-900' : 'text-gray-400'}`}>
              Vérification OTP
            </span>
          </div>
        </div>

        {step === 'password' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="form-group">
              <label className="label">Nouveau mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  className="input-field pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Minimum 8 caractères, incluant majuscules, minuscules et chiffres</p>
            </div>

            <div className="form-group">
              <label className="label">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Répétez le mot de passe"
                  className="input-field pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-xs text-blue-700">
                🔐 Un code de vérification à 6 chiffres sera envoyé à votre adresse email d&apos;administrateur pour confirmer ce changement.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Envoi en cours...</>
                : <><Send size={16} /> Envoyer le code OTP</>
              }
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmOtp} className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-sm text-green-800 font-semibold mb-1">Code envoyé à votre email</p>
              <p className="text-xs text-green-600">Vérifiez votre boîte de réception et entrez le code à 6 chiffres ci-dessous. Valide 10 minutes.</p>
            </div>

            <div className="form-group">
              <label className="label text-center block">Code de vérification OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                pattern="[0-9]{6}"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="input-field text-center text-2xl font-bold tracking-[0.5em] py-4"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('password')}
                className="flex-1 btn-ghost py-3"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
              >
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Vérification...</>
                  : <><CheckCircle size={16} /> Confirmer</>
                }
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep('password')}
              className="w-full text-xs text-gray-400 hover:text-[#C2517A] transition-colors mt-2"
            >
              Renvoyer un nouveau code
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

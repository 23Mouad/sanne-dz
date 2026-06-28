'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Copy, Phone, MessageCircle, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { SubscriptionsService } from '@/services/subscriptions.service'
import api from '@/lib/api'

import { useAuthStore } from '@/store/useAuthStore'

export default function PaymentInstructionsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [pendingRequest, setPendingRequest] = useState<any>(null)
  const [partnerProfile, setPartnerProfile] = useState<any>(null)
  
  // Is it Sunday-Thursday, 08:00 to 18:00?
  const [canCall, setCanCall] = useState(false)

  useEffect(() => {
    const checkTime = () => {
      const now = new Date()
      const day = now.getDay() // 0 = Sunday, 1 = Monday... 6 = Saturday
      const hour = now.getHours()
      if (day >= 0 && day <= 4 && hour >= 8 && hour < 18) {
        setCanCall(true)
      } else {
        setCanCall(false)
      }
    }
    checkTime()

    const loadData = async () => {
      try {
        const [req, profile] = await Promise.all([
          SubscriptionsService.getPendingRequest().catch(() => null),
          api.get('/partners/me').then(res => res.data.data).catch(() => null)
        ])
        setPendingRequest(req)
        setPartnerProfile(profile)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copié dans le presse-papiers !', { id })
  }

  const handleWhatsapp = async () => {
    try {
      const res = await SubscriptionsService.requestUpgrade('MONTHLY', true, false)
      setPendingRequest(res.payment)
      
      const paymentId = res.payment.id
      const adminLink = `${window.location.origin}/dashboard/admin/payments?highlight=${paymentId}`
      
      const msg = `Bonjour, je suis ${user?.firstName} ${user?.lastName}.\nMon entreprise est "${partnerProfile?.businessName || ''}" située à ${partnerProfile?.wilaya?.name || ''}.\nMon numéro est ${partnerProfile?.phone || user?.phone || ''}.\n\nJe souhaite activer mon abonnement PRO pour mon compte Sanne DZ.\n\nLien pour l'administrateur : ${adminLink}`
      
      const encodedMsg = encodeURIComponent(msg)
      window.open(`https://wa.me/213675057718?text=${encodedMsg}`, '_blank')
    } catch (err) {
      toast.error('Erreur lors de l\'enregistrement')
    }
  }

  const handleConfirmSent = async () => {
    try {
      toast.loading('Enregistrement...', { id: 'confirm-payment' })
      const res = await SubscriptionsService.requestUpgrade('MONTHLY', false, true)
      setPendingRequest(res.payment)
      toast.success('Demande enregistrée avec succès !', { id: 'confirm-payment' })
    } catch (err) {
      toast.error('Erreur lors de l\'enregistrement', { id: 'confirm-payment' })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-pink-100 border-t-[#C2517A] rounded-full animate-spin" />
      </div>
    )
  }

  if (pendingRequest?.metadata?.receiptSent) {
    return (
      <div className="max-w-2xl space-y-6">
        <Link href="/dashboard/partner/subscription" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={16} /> Retour à mon abonnement
        </Link>
        <div className="card p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre demande est en cours de traitement</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            Nous avons bien reçu votre confirmation. Notre équipe vérifie actuellement votre paiement.
            Votre compte passera en mode PRO dès que la vérification sera terminée.
          </p>
          <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-lg flex items-start gap-3 text-left">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p>Si vous avez des questions, n'hésitez pas à nous contacter sur WhatsApp au <br/><strong>+213 675 05 77 18</strong></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/dashboard/partner/subscription" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
        <ArrowLeft size={16} /> Retour
      </Link>

      <div>
        <h1 className="page-title flex items-center gap-2">
          <CreditCard size={28} className="text-[#C2517A]" />
          Paiement de l'abonnement PRO
        </h1>
        <p className="page-subtitle">Veuillez effectuer le paiement via l'une des méthodes ci-dessous, puis confirmez votre transfert.</p>
      </div>

      <div className="card p-6 border-2 border-pink-100 bg-pink-50/30">
        <h2 className="font-bold text-gray-900 mb-4 text-lg border-b border-pink-100 pb-2">Informations de paiement</h2>
        
        <div className="space-y-6">
          {/* BaridiMob */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C2517A]"></div>
              Option 1: BaridiMob
            </h3>
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">RIP / CCP</p>
                <p className="font-mono text-lg font-bold tracking-wider text-gray-900">0000799924453553</p>
              </div>
              <button onClick={() => copyToClipboard('0000799924453553', 'copy-ccp')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                <Copy size={20} />
              </button>
            </div>
          </div>

          {/* Algérie Poste */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#7F77DD]"></div>
              Option 2: Carnet Chèque / Poste Algérie
            </h3>
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">CCP (Clé 14)</p>
                <p className="font-mono text-lg font-bold tracking-wider text-gray-900">24242452 <span className="text-gray-400 text-sm">Clé 14</span></p>
                <p className="text-sm font-semibold mt-1">MOUAD ABDERRAHMENE KAHLA</p>
              </div>
              <button onClick={() => copyToClipboard('24242452 cle 14 MOUAD ABDERRAHMENE KAHLA', 'copy-poste')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                <Copy size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-bold text-gray-900 mb-4">Après avoir effectué le paiement</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button 
            onClick={handleWhatsapp}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-xl transition-all font-medium"
          >
            <MessageCircle size={20} /> Envoyer reçu via WhatsApp
          </button>
          
          <button 
            disabled={!canCall}
            onClick={() => window.location.href = 'tel:+213675057718'}
            className={`flex items-center justify-center gap-2 py-3 px-4 border rounded-xl transition-all font-medium ${
              canCall 
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200' 
                : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-70'
            }`}
          >
            <Phone size={20} /> Nous appeler
          </button>
        </div>
        
        {!canCall && (
          <p className="text-xs text-center text-gray-500 mb-6 bg-gray-50 p-2 rounded-lg">
            * L'assistance téléphonique est disponible uniquement du Dimanche au Jeudi, de 08:00 à 18:00.
          </p>
        )}

        <div className="border-t border-gray-100 pt-6">
          <button 
            onClick={handleConfirmSent}
            className="w-full py-4 bg-gradient-to-r from-[#C2517A] to-[#7F77DD] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            J'ai déjà envoyé le reçu
          </button>
        </div>
      </div>
    </div>
  )
}

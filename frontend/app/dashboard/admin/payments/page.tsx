'use client'

import { useState, useEffect } from 'react'
import { Check, X, MessageCircle, CreditCard, Search, AlertTriangle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { SubscriptionsService } from '@/services/subscriptions.service'
import { useSearchParams } from 'next/navigation'
import Modal from '@/components/ui/Modal'

export default function AdminPaymentsPage() {
  const searchParams = useSearchParams()
  const highlightId = searchParams.get('highlight')
  
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Confirmation Modals State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    type: 'approve' | 'reject' | null
    paymentId: string | null
    partnerName: string
  }>({
    isOpen: false,
    type: null,
    paymentId: null,
    partnerName: ''
  })

  const loadPayments = async () => {
    setLoading(true)
    try {
      const res = await SubscriptionsService.adminGetPendingPayments()
      setPayments(res.data || [])
    } catch (err) {
      toast.error('Erreur lors du chargement des demandes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
  }, [])

  useEffect(() => {
    if (highlightId && payments.length > 0 && !loading) {
      const element = document.getElementById(highlightId)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      }
    }
  }, [highlightId, payments, loading])

  const openConfirm = (type: 'approve' | 'reject', paymentId: string, partnerName: string) => {
    setConfirmModal({ isOpen: true, type, paymentId, partnerName })
  }

  const handleConfirm = async () => {
    const { type, paymentId } = confirmModal
    if (!paymentId || !type) return
    
    setConfirmModal(prev => ({ ...prev, isOpen: false }))

    if (type === 'approve') {
      try {
        toast.loading('Approbation en cours...', { id: 'approve' })
        await SubscriptionsService.adminApprovePayment(paymentId)
        toast.success('Paiement approuvé !', { id: 'approve' })
        loadPayments()
      } catch (err) {
        toast.error('Erreur lors de l\'approbation', { id: 'approve' })
      }
    } else if (type === 'reject') {
      try {
        toast.loading('Refus en cours...', { id: 'reject' })
        await SubscriptionsService.adminRejectPayment(paymentId)
        toast.success('Paiement refusé', { id: 'reject' })
        loadPayments()
      } catch (err) {
        toast.error('Erreur lors du refus', { id: 'reject' })
      }
    }
  }

  const handleWhatsapp = (phone: string) => {
    const formattedPhone = phone.replace(/^0/, '213').replace(/\s+/g, '')
    window.open(`https://wa.me/${formattedPhone}`, '_blank')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-pink-100 border-t-[#C2517A] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <CreditCard size={28} className="text-[#C2517A]" />
            Demandes de paiement (PRO)
          </h1>
          <p className="page-subtitle">Paiements manuels en attente de vérification</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="card p-12 text-center">
          <Search size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">Aucune demande de paiement en attente.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {payments.map((payment) => {
            const isHighlighted = payment.id === highlightId
            return (
              <div 
                key={payment.id} 
                id={payment.id}
                className={`card p-5 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-500 ${
                  isHighlighted ? 'ring-4 ring-[#C2517A] bg-pink-50/30 transform scale-[1.01]' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">{payment.subscription.partner.businessName}</h3>
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-medium">En attente</span>
                </div>
                <div className="text-sm text-gray-600 mb-3 space-y-1">
                  <p><strong>Partenaire :</strong> {payment.subscription.partner.user.firstName} {payment.subscription.partner.user.lastName}</p>
                  <p><strong>Téléphone :</strong> {payment.subscription.partner.phone}</p>
                  <p><strong>Montant :</strong> {payment.amount} DA ({payment.metadata?.cycle === 'ANNUAL' ? 'Annuel' : 'Mensuel'})</p>
                  <p><strong>Date demande :</strong> {new Date(payment.createdAt).toLocaleString('fr-DZ')}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 text-xs">
                  {payment.metadata?.receiptSent && (
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-md">
                      Bouton "J'ai envoyé le reçu" cliqué
                    </span>
                  )}
                  {payment.metadata?.whatsappClicked && (
                    <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-md">
                      Bouton WhatsApp cliqué
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
                <button
                  onClick={() => handleWhatsapp(payment.subscription.partner.whatsapp || payment.subscription.partner.phone)}
                  className="btn-outline border-green-600 text-green-600 hover:bg-green-50 flex items-center justify-center gap-2 py-2 px-4 whitespace-nowrap"
                >
                  <MessageCircle size={18} className="text-green-600" /> WhatsApp
                </button>
                <button
                  onClick={() => openConfirm('reject', payment.id, payment.subscription.partner.businessName)}
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap"
                >
                  <X size={18} /> Refuser
                </button>
                <button
                  onClick={() => openConfirm('approve', payment.id, payment.subscription.partner.businessName)}
                  className="btn-primary flex items-center justify-center gap-2 py-2 px-4 whitespace-nowrap"
                >
                  <Check size={18} /> Approuver
                </button>
              </div>
            </div>
            )
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        title={confirmModal.type === 'approve' ? 'Approuver le paiement' : 'Refuser le paiement'}
        size="sm"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${confirmModal.type === 'approve' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {confirmModal.type === 'approve' ? <Check size={32} /> : <AlertTriangle size={32} />}
          </div>
          
          <div>
            <p className="text-gray-900 font-medium text-lg">
              {confirmModal.type === 'approve' ? 'Confirmer l\'approbation ?' : 'Confirmer le refus ?'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {confirmModal.type === 'approve' 
                ? `Vous êtes sur le point d'activer l'abonnement PRO pour le partenaire "${confirmModal.partnerName}". Cette action est irréversible.`
                : `Vous êtes sur le point de refuser la demande de paiement de "${confirmModal.partnerName}". Le partenaire sera notifié.`}
            </p>
          </div>

          <div className="flex gap-3 w-full mt-4">
            <button
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="flex-1 py-3 px-4 rounded-xl font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-colors ${
                confirmModal.type === 'approve' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {confirmModal.type === 'approve' ? 'Oui, approuver' : 'Oui, refuser'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

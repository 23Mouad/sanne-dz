'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Edit2, Package, Sparkles, Image as ImageIcon, X } from 'lucide-react'
import { PartnersService } from '@/services/partners.service'
import { useAuthStore } from '@/store/useAuthStore'
import { getImageUrl } from '@/lib/utils'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function PartnerProductsPage() {
  const { user } = useAuthStore()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [partnerPlan, setPartnerPlan] = useState<'SIMPLE' | 'PRO'>('SIMPLE')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadData = async () => {
    try {
      const [profileData, productsData] = await Promise.all([
        PartnersService.getMyProfile(),
        PartnersService.getProducts()
      ])
      setPartnerPlan(profileData.isPro ? 'PRO' : 'SIMPLE')
      setProducts(productsData)
    } catch (error) {
      console.error(error)
      toast.error('Erreur lors du chargement des produits')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const maxProducts = partnerPlan === 'PRO' ? Infinity : 3
  const canAddMore = products.length < maxProducts

  const openModal = (product?: any) => {
    if (product) {
      setEditingId(product.id)
      setFormData({
        name: product.name || '',
        price: product.price ? String(product.price) : '',
        description: product.description || '',
      })
      setPreviewUrl(product.imageUrl ? getImageUrl(product.imageUrl) : null)
      setSelectedFile(null)
    } else {
      if (!canAddMore) {
        toast.error(`La limite est de ${maxProducts} produits pour le plan Basic. Passez en Pro pour en ajouter d'autres !`)
        return
      }
      setEditingId(null)
      setFormData({ name: '', price: '', description: '' })
      setPreviewUrl(null)
      setSelectedFile(null)
    }
    setIsModalOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La taille de l'image ne doit pas dépasser 5 Mo")
        return
      }
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // We only strictly need either a name, a price, a description, or an image.
    // If they submit completely empty, maybe warn them.
    if (!formData.name && !formData.price && !formData.description && !selectedFile && !previewUrl) {
      toast.error('Veuillez ajouter au moins une information (image, nom ou prix)')
      return
    }

    const toastId = toast.loading('Enregistrement en cours...')
    try {
      const form = new FormData()
      if (formData.name) form.append('name', formData.name)
      if (formData.price) form.append('price', formData.price)
      if (formData.description) form.append('description', formData.description)
      if (selectedFile) form.append('file', selectedFile)

      if (editingId) {
        await PartnersService.updateProduct(editingId, form)
        toast.success('Produit mis à jour', { id: toastId })
      } else {
        await PartnersService.addProduct(form)
        toast.success('Produit ajouté', { id: toastId })
      }
      
      setIsModalOpen(false)
      loadData()
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement", { id: toastId })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return
    
    const toastId = toast.loading('Suppression...')
    try {
      await PartnersService.deleteProduct(id)
      toast.success('Produit supprimé', { id: toastId })
      setProducts(products.filter(p => p.id !== id))
    } catch (error) {
      toast.error('Erreur lors de la suppression', { id: toastId })
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-[#C2517A]" />
            Mes Produits & Services
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez votre catalogue ({products.length} / {partnerPlan === 'PRO' ? 'Illimité' : maxProducts})
          </p>
        </div>
        
        <button
          onClick={() => openModal()}
          disabled={!canAddMore}
          className="btn-primary flex items-center gap-2 py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          Ajouter un produit
        </button>
      </div>

      {!canAddMore && partnerPlan === 'SIMPLE' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm flex items-center justify-between">
          <span>Vous avez atteint la limite de {maxProducts} produits.</span>
          <a href="/dashboard/partner/subscription" className="font-bold underline text-amber-900">
            Passer en Pro
          </a>
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-pink-50 text-[#C2517A] rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun produit</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Vous n'avez pas encore ajouté de produits ou de services à votre catalogue.
          </p>
          <button onClick={() => openModal()} className="btn-primary inline-flex items-center gap-2">
            <Plus size={18} /> Commencer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              {/* Image Container */}
              <div className="aspect-square bg-gray-50 relative">
                {product.imageUrl ? (
                  <Image 
                    src={getImageUrl(product.imageUrl)} 
                    alt={product.name || 'Produit'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    <ImageIcon size={48} />
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 line-clamp-1">{product.name || <span className="text-gray-400 italic">Sans nom</span>}</h3>
                  {product.price && (
                    <span className="font-bold text-[#C2517A] bg-pink-50 px-2 py-1 rounded-lg text-sm whitespace-nowrap ml-2">
                      {product.price} DA
                    </span>
                  )}
                </div>
                {product.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {product.description}
                  </p>
                )}
                
                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-50">
                  <button
                    onClick={() => openModal(product)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit2 size={16} /> Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Modifier le produit' : 'Ajouter un produit'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Photo du produit</label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                {previewUrl ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden group bg-gray-100">
                    <Image src={previewUrl} alt="Preview" fill className="object-contain" unoptimized />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold text-sm mr-2 shadow-sm"
                      >
                        Changer
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-pink-200 hover:text-[#C2517A] transition-all"
                  >
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-sm font-semibold">Ajouter une photo</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nom (Optionnel)</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="Ex: Tarte au citron"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Prix (DA) (Optionnel)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="input-field"
                    placeholder="Ex: 2500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description (Optionnelle)</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="input-field min-h-[100px] resize-none"
                  placeholder="Décrivez votre produit..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-outline px-6 py-2"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary px-6 py-2">
                  {editingId ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

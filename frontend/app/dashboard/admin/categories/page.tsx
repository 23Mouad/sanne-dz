'use client'

import { useState, useEffect } from 'react'
import { Tag, Plus, Pencil, Trash2, Check, X, Palette } from 'lucide-react'
import { CategoryIcon } from '@/components/CategoryIcon'
import type { Category } from '@/types'
import { CategoriesService } from '@/services/categories.service'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import Modal from '@/components/ui/Modal'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

interface EditState { id: string; name: string; icon?: string; color?: string }

const CATEGORY_COLORS = [
  { label: 'Rose', value: 'from-[#C2517A] to-[#a8365f]' },
  { label: 'Violet', value: 'from-[#7F77DD] to-[#6059c4]' },
  { label: 'Ambre', value: 'from-amber-400 to-orange-500' },
  { label: 'Émeraude', value: 'from-emerald-400 to-teal-500' },
  { label: 'Bleu', value: 'from-blue-400 to-indigo-500' },
  { label: 'Rose vif', value: 'from-pink-400 to-rose-500' },
  { label: 'Pourpre', value: 'from-purple-400 to-violet-500' },
  { label: 'Cyan', value: 'from-cyan-400 to-sky-500' },
  { label: 'Vert', value: 'from-green-400 to-emerald-500' },
  { label: 'Rouge', value: 'from-red-400 to-rose-600' },
  { label: 'Lime', value: 'from-lime-400 to-green-500' },
  { label: 'Fuchsia', value: 'from-fuchsia-400 to-purple-600' },
  { label: 'Orange', value: 'from-orange-400 to-red-500' },
  { label: 'Sarcelle', value: 'from-teal-400 to-cyan-600' },
  { label: 'Indigo', value: 'from-indigo-400 to-blue-600' },
  { label: 'Gris', value: 'from-gray-400 to-gray-600' },
]

const AVAILABLE_ICONS = [
  { value: 'scissors', label: 'Ciseaux' },
  { value: 'pen-tool', label: 'Plume' },
  { value: 'ruler', label: 'Règle' },
  { value: 'layers', label: 'Tissus' },
  { value: 'shopping-bag', label: 'Mercerie' },
  { value: 'sparkles', label: 'Broderie' },
  { value: 'graduation-cap', label: 'Formation' },
  { value: 'cog', label: 'Machine' },
  { value: 'shirt', label: 'Textile' },
  { value: 'camera', label: 'Studio' },
  { value: 'heart', label: 'Bien-être' },
  { value: 'star', label: 'Premium' },
  { value: 'zap', label: 'Express' },
  { value: 'package', label: 'Produits' },
  { value: 'briefcase', label: 'Business' },
  { value: 'home', label: 'Maison' },
  { value: 'music', label: 'Musique' },
  { value: 'book', label: 'Education' },
  { value: 'tool', label: 'Réparation' },
  { value: 'truck', label: 'Livraison' },
  { value: 'map-pin', label: 'Localisation' },
  { value: 'coffee', label: 'Café' },
  { value: 'paint-bucket', label: 'Design' },
  { value: 'feather', label: 'Artisanat' },
  { value: 'user', label: 'Personnel' },
  { value: 'globe', label: 'International' },
  { value: 'flower', label: 'Nature' },
  { value: 'shield', label: 'Sécurité' },
  { value: 'cpu', label: 'Tech' },
  { value: 'film', label: 'Média' },
]

const getCategoryColor = (cat: any, idx: number): string => {
  if (cat.color && cat.color !== 'from-gray-400 to-gray-600') return cat.color
  return CATEGORY_COLORS[idx % CATEGORY_COLORS.length].value
}

// --- ColorPicker Component ---
const ColorPicker = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false)
  const selected = CATEGORY_COLORS.find(c => c.value === value)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title="Choisir couleur"
        className="w-9 h-9 rounded-xl border-2 border-white shadow-sm flex items-center justify-center bg-gradient-to-br shrink-0 hover:scale-110 transition-transform"
        style={{ background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` }}
      >
        <div className={`w-full h-full rounded-xl bg-gradient-to-br ${value || CATEGORY_COLORS[0].value} flex items-center justify-center`}>
          <Palette size={14} className="text-white drop-shadow" />
        </div>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-100 shadow-xl rounded-xl z-50 w-48">
          <p className="text-[10px] font-semibold text-gray-400 uppercase mb-2 px-1">Couleur</p>
          <div className="grid grid-cols-4 gap-1.5">
            {CATEGORY_COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => { onChange(c.value); setOpen(false) }}
                title={c.label}
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.value} transition-all hover:scale-110 ${value === c.value ? 'ring-2 ring-offset-1 ring-gray-800' : ''}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// --- IconPicker Component ---
const IconPicker = ({ value, onChange, iconPlaceholderTxt, otherTxt }: {
  value: string
  onChange: (val: string) => void
  iconPlaceholderTxt: string
  otherTxt: string
}) => {
  const [open, setOpen] = useState(false)
  const [isCustom, setIsCustom] = useState(!AVAILABLE_ICONS.find(i => i.value === value) && value !== '')
  const [search, setSearch] = useState('')
  const selected = AVAILABLE_ICONS.find(i => i.value === value)
  const filtered = AVAILABLE_ICONS.filter(i => i.label.toLowerCase().includes(search.toLowerCase()) || i.value.includes(search.toLowerCase()))

  if (isCustom) {
    return (
      <div className="flex items-center gap-1">
         <input type="text" value={value} onChange={e => onChange(e.target.value)} 
           className="input-field w-24 text-sm py-1.5 px-2" placeholder="slug..." autoFocus />
         <button type="button" onClick={() => { setIsCustom(false); onChange('') }} className="p-1 text-gray-400 hover:text-gray-700 bg-gray-100 rounded">
           <X size={14} />
         </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="input-field w-36 text-sm flex items-center justify-between py-1.5 px-3 bg-white hover:bg-gray-50">
        <span className="flex items-center gap-2 truncate text-gray-700 font-medium">
          {selected ? <CategoryIcon slug={selected.value} size={14} className="text-[#C2517A]" /> : <Tag size={14} className="text-gray-400" />}
          {selected ? selected.label : iconPlaceholderTxt}
        </span>
        <span className="text-gray-400 text-[10px]">▼</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 rtl:left-auto rtl:right-0 mt-1 w-52 bg-white border border-gray-100 shadow-xl rounded-xl z-50 py-1">
          <div className="px-2 pt-2 pb-1">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher icône..."
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#C2517A]"
              autoFocus
            />
          </div>
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.map(i => (
              <button key={i.value} type="button" onClick={() => { onChange(i.value); setOpen(false); setSearch('') }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-[#C2517A] transition-colors">
                <CategoryIcon slug={i.value} size={14} />
                <span>{i.label}</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="text-xs text-gray-400 text-center py-3">Aucun résultat</p>}
          </div>
          <div className="border-t border-gray-100 mt-1">
            <button type="button" onClick={() => { setIsCustom(true); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
              <Plus size={14} />
              <span>{otherTxt}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminCategoriesPage() {
  const t = useT()
  const d = translations.adminCategories

  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', icon: '', color: CATEGORY_COLORS[0].value })
  const [editing, setEditing] = useState<EditState | null>(null)
  const [modalDelete, setModalDelete] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await CategoriesService.getAll()
      setCats(res)
    } catch (err) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleAddSubmit = async () => {
    if (!addForm.name.trim()) return
    
    try {
      await api.post('/categories', {
        name: addForm.name.trim(),
        icon: addForm.icon || 'sparkles',
        color: addForm.color,
      })
      toast.success(t(d.addedMsg))
      setAdding(false)
      setAddForm({ name: '', icon: '', color: CATEGORY_COLORS[0].value })
      load()
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to create category'
      toast.error(msg)
    }
  }

  const handleEditSubmit = async () => {
    if (!editing || !editing.name.trim()) return

    try {
      const cat = cats.find(c => c.slug === editing.id)
      if (cat) {
        await api.put(`/categories/${cat.id}`, {
          name: editing.name,
          icon: editing.icon || cat.icon,
          color: editing.color || cat.color,
        })
        toast.success(t(d.editedMsg))
        setEditing(null)
        load()
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to edit category'
      toast.error(msg)
    }
  }

  const executeDelete = async () => {
    if (!modalDelete) return
    try {
      const cat = cats.find(c => c.slug === modalDelete)
      if (cat) {
        await api.delete(`/categories/${cat.id}`)
        toast.success(t(d.deletedMsg))
        setModalDelete(null)
        load()
      }
    } catch (err) {
      toast.error('Failed to delete category')
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
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2"><Tag size={28} className="text-[#C2517A]" />{t(d.title)}</h1>
          <p className="page-subtitle">{t(d.sub)}</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
          <Plus size={16} /> {t(d.addCategory)}
        </button>
      </div>

      {adding && (
        <div className="card p-5 mb-4 border-2 border-dashed border-[#C2517A]/30">
          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><Plus size={14} className="text-[#C2517A]" /> Nouvelle catégorie</p>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Color picker */}
            <ColorPicker value={addForm.color} onChange={val => setAddForm(prev => ({ ...prev, color: val }))} />
            {/* Preview */}
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${addForm.color} flex items-center justify-center shadow-sm shrink-0`}>
              <CategoryIcon slug={addForm.icon || 'sparkles'} size={18} className="text-white" />
            </div>
            <IconPicker value={addForm.icon} onChange={val => setAddForm(prev => ({ ...prev, icon: val }))} iconPlaceholderTxt={t(d.iconPlaceholder)} otherTxt={t(d.otherText)} />
            <input type="text" placeholder={t(d.catName)}
              className="input-field flex-1 text-sm py-1.5 min-w-[160px]"
              value={addForm.name} onChange={e => setAddForm(prev => ({ ...prev, name: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAddSubmit()} autoFocus />
            <button onClick={handleAddSubmit} className="btn-primary py-1.5 px-3 text-sm flex items-center gap-1"><Check size={14}/> {t(d.create)}</button>
            <button onClick={() => { setAdding(false); setAddForm({ name: '', icon: '', color: CATEGORY_COLORS[0].value }) }} className="btn-ghost py-1.5 px-2"><X size={14}/></button>
          </div>
        </div>
      )}

      <div className="card divide-y divide-gray-100 overflow-hidden">
        {cats.length === 0 && <div className="p-8 text-center text-gray-400">{t(d.noCategories)}</div>}
        
        {cats.map((cat, idx) => {
          const isCatEditing = editing?.id === cat.slug
          const catColor = getCategoryColor(cat, idx)

          return (
            <div key={cat.slug} className="flex flex-col bg-white">
              <div className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${isCatEditing ? (editing?.color || catColor) : catColor} flex items-center justify-center shadow-sm shrink-0`}>
                  <CategoryIcon slug={isCatEditing ? (editing?.icon || cat.icon) : cat.icon} size={20} className="text-white" />
                </div>
                
                {isCatEditing ? (
                  <div className="flex items-center gap-2 flex-1 flex-wrap">
                    <ColorPicker value={editing?.color || catColor} onChange={val => setEditing(prev => prev ? ({ ...prev, color: val }) : null)} />
                    <IconPicker value={editing?.icon || ''} onChange={val => setEditing(prev => prev ? ({ ...prev, icon: val }) : null)} iconPlaceholderTxt={t(d.iconPlaceholder)} otherTxt={t(d.otherText)} />
                    <input type="text" value={editing?.name || ''} onChange={e => setEditing(prev => prev ? ({ ...prev, name: e.target.value }) : null)} 
                      className="input-field flex-1 text-sm py-1 min-w-[120px]" onKeyDown={e => e.key === 'Enter' && handleEditSubmit()} />
                    <button onClick={handleEditSubmit} className="text-green-600 hover:bg-green-50 p-1.5 rounded"><Check size={16}/></button>
                    <button onClick={() => setEditing(null)} className="text-gray-400 hover:bg-gray-100 p-1.5 rounded"><X size={16}/></button>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-400">
                      {(cat as any)._count?.partners ?? cat.partnerCount ?? 0} {t(d.partnersAssoc)}
                    </p>
                  </div>
                )}
                
                {!isCatEditing && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {(cat as any).isDefault ? (
                      <span className="text-xs text-gray-400 px-2 py-1 bg-gray-50 rounded-lg flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        Protégée
                      </span>
                    ) : (
                      <>
                        <button onClick={() => setEditing({ id: cat.slug, name: cat.name, icon: cat.icon, color: catColor })} title={t(d.editTitle)}
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg"><Pencil size={16}/></button>
                        <button onClick={() => setModalDelete(cat.slug)} title={t(d.deleteTitleBtn)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!modalDelete} onClose={() => setModalDelete(null)} title={t(d.deleteTitle)} size="sm">
        <p className="text-gray-600 mb-6 text-sm">
          {t(d.deleteConfirm)}
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setModalDelete(null)} className="btn-ghost py-2">{t(d.cancel)}</button>
          <button onClick={executeDelete} 
            className="btn-primary !bg-red-500 hover:!bg-red-600 !shadow-red-500/30 border-red-500 py-2">
            {t(d.deleteYes)}
          </button>
        </div>
      </Modal>
    </div>
  )
}

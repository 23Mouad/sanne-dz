'use client'

import { useState, useEffect } from 'react'
import { SlidersHorizontal, X, ChevronDown, ChevronRight } from 'lucide-react'
import { WILAYAS, CATEGORIES_STATIC } from '@/lib/constants'
import { CategoryIcon } from '@/components/CategoryIcon'
import { CategoriesService } from '@/services/categories.service'

interface Filters {
  q?: string
  wilaya?: string
  category?: string
  plan?: string
  sort?: string
}

interface SearchFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export default function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  const [openSection, setOpenSection] = useState<string | null>('category')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await CategoriesService.getAll()
        setCategories(res)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  const toggle = (section: string) =>
    setOpenSection(openSection === section ? null : section)

  const toggleCategory = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation()
    e.preventDefault()
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  const resetAll = () =>
    onChange({ q: filters.q, wilaya: '', category: '', plan: '', sort: '' })

  const hasActiveFilters =
    filters.wilaya || filters.category || filters.plan

  return (
    <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-pink-100">
        <div className="flex items-center gap-2 text-gray-800 font-semibold">
          <SlidersHorizontal size={16} className="text-[#C2517A]" />
          Filtres
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetAll}
            className="text-xs text-[#C2517A] hover:text-[#a8365f] flex items-center gap-1 transition-colors"
          >
            <X size={12} />
            Réinitialiser
          </button>
        )}
      </div>

      <div className="divide-y divide-pink-50">

        {/* Plan Filter */}
        <div className="px-4 py-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">
            Type de partenaire
          </p>
          <div className="flex flex-col gap-1.5">
            {[
              { value: '', label: 'Tous les partenaires' },
              { value: 'pro', label: 'Plan Pro uniquement' },
              { value: 'simple', label: 'Plan Simple' },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="plan"
                  checked={filters.plan === value}
                  onChange={() => onChange({ ...filters, plan: value })}
                  className="accent-[#C2517A] w-4 h-4"
                />
                <span className="text-sm text-gray-700 group-hover:text-[#C2517A] transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Wilaya Filter */}
        <div className="px-4 py-3">
          <button
            onClick={() => toggle('wilaya')}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide"
          >
            <span>Wilaya</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${openSection === 'wilaya' ? 'rotate-180' : ''}`}
            />
          </button>
          {openSection === 'wilaya' && (
            <div className="mt-2.5">
              <select
                value={filters.wilaya || ''}
                onChange={(e) => onChange({ ...filters, wilaya: e.target.value })}
                className="w-full input-field text-sm py-2"
              >
                <option value="">Toutes les wilayas</option>
                {WILAYAS.map((w) => (
                  <option key={w.id} value={w.name}>{w.name}</option>
                ))}
              </select>
            </div>
          )}
          {filters.wilaya && openSection !== 'wilaya' && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="tag text-xs py-1">
                {filters.wilaya}
                <button onClick={() => onChange({ ...filters, wilaya: '' })}>
                  <X size={10} />
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="px-4 py-3">
          <button
            onClick={() => toggle('category')}
            className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide"
          >
            <span>Catégorie</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${openSection === 'category' ? 'rotate-180' : ''}`}
            />
          </button>
          {openSection === 'category' && (
            <div className="mt-2.5 flex flex-col gap-0.5 max-h-64 overflow-y-auto custom-scrollbar">
              {categories.map(cat => {
                const isExpanded = expandedCategories.has(cat.slug)
                const isSelected = filters.category === cat.slug

                return (
                  <div key={cat.slug} className="flex flex-col">
                    <div className="flex items-center gap-0">
                      {cat.subCategories && cat.subCategories.length > 0 ? (
                        <button type="button" onClick={(e) => toggleCategory(e, cat.slug)} className="p-1 text-gray-400 hover:text-gray-900 shrink-0">
                          <ChevronRight size={14} className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      ) : <div className="w-6 shrink-0" />}
                      
                      <label className="flex items-center gap-2 cursor-pointer group py-1.5 flex-1 min-w-0">
                        <input type="radio" name="category" checked={isSelected}
                          onChange={() => onChange({ ...filters, category: isSelected ? '' : cat.slug })}
                          className="accent-[#C2517A] w-3.5 h-3.5 shrink-0" />
                        <span className={`text-sm flex items-center gap-1.5 truncate transition-colors ${isSelected ? 'text-[#C2517A] font-medium' : 'text-gray-700 group-hover:text-[#C2517A]'}`}>
                          <CategoryIcon slug={cat.slug} size={14} className={isSelected ? 'text-[#C2517A]' : 'text-gray-400'} />
                          {cat.name}
                        </span>
                      </label>
                    </div>

                    {isExpanded && cat.subCategories && (
                      <div className="flex flex-col pl-5 border-l border-pink-100/50 ml-3">
                        {cat.subCategories.map((sub: any) => {
                          const isSubExpanded = expandedCategories.has(sub.slug)
                          const isSubSelected = filters.category === sub.slug

                          return (
                            <div key={sub.slug} className="flex flex-col">
                              <div className="flex items-center gap-0">
                                {sub.childCategories && sub.childCategories.length > 0 ? (
                                  <button type="button" onClick={(e) => toggleCategory(e, sub.slug)} className="p-1 text-gray-400 hover:text-gray-900 shrink-0">
                                    <ChevronRight size={12} className={`transition-transform ${isSubExpanded ? 'rotate-90' : ''}`} />
                                  </button>
                                ) : <div className="w-5 shrink-0" />}

                                <label className="flex items-center gap-2 cursor-pointer group py-1 flex-1 min-w-0">
                                  <input type="radio" name="category" checked={isSubSelected}
                                    onChange={() => onChange({ ...filters, category: isSubSelected ? '' : sub.slug })}
                                    className="accent-[#C2517A] w-3 h-3 shrink-0" />
                                  <span className={`text-sm truncate transition-colors ${isSubSelected ? 'text-[#C2517A] font-medium' : 'text-gray-600 group-hover:text-[#C2517A]'}`}>
                                    {sub.name}
                                  </span>
                                </label>
                              </div>

                              {isSubExpanded && sub.childCategories && (
                                <div className="flex flex-col pl-4 border-l border-pink-100/50 ml-2 py-0.5">
                                  {sub.childCategories.map((child: any) => {
                                    const isChildSelected = filters.category === child.slug
                                    return (
                                      <label key={child.slug} className="flex items-center gap-2 cursor-pointer group py-1 pl-1">
                                        <input type="radio" name="category" checked={isChildSelected}
                                          onChange={() => onChange({ ...filters, category: isChildSelected ? '' : child.slug })}
                                          className="accent-[#C2517A] w-3 h-3 shrink-0" />
                                        <span className={`text-xs truncate transition-colors ${isChildSelected ? 'text-[#C2517A] font-medium' : 'text-gray-500 group-hover:text-[#C2517A]'}`}>
                                          {child.name}
                                        </span>
                                      </label>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
          {filters.category && openSection !== 'category' && (
            <div className="mt-1.5">
              <span className="tag text-xs py-1">
                {categories.find(c => c.slug === filters.category)?.name}
                <button onClick={() => onChange({ ...filters, category: '' })}>
                  <X size={10} />
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Sort */}
        <div className="px-4 py-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">
            Trier par
          </p>
          <select
            value={filters.sort || 'relevance'}
            onChange={(e) => onChange({ ...filters, sort: e.target.value })}
            className="w-full input-field text-sm py-2"
          >
            <option value="relevance">Pertinence</option>
            <option value="rating">Meilleure note</option>
            <option value="reviews">Nombre d&apos;avis</option>
            <option value="recent">Plus récent</option>
          </select>
        </div>

      </div>
    </div>
  )
}
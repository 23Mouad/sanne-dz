'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react'
import SearchFilters from '@/components/search/SearchFilters'
import PartnerCard from '@/components/partner/PartnerCard'
import { PartnerCardSkeleton } from '@/components/ui/Skeleton'
import { PartnersService } from '@/services/partners.service'
import { Partner } from '@/types'

interface Filters {
  q?: string
  wilaya?: string
  category?: string
  plan?: string
  sort?: string
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = use(searchParams)
  return <SearchContent initialParams={params} />
}

function SearchContent({ initialParams }: { initialParams: Record<string, string | undefined> }) {
  const router = useRouter()
  const [filters, setFilters] = useState<Filters>({
    q: initialParams.q || '',
    wilaya: initialParams.wilaya || '',
    category: initialParams.category || '',
    plan: initialParams.plan || '',
    sort: initialParams.sort || 'relevance',
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [results, setResults] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const data = await PartnersService.search({
          q: filters.q,
          wilaya: filters.wilaya,
          category: filters.category,
          plan: filters.plan as any,
          sort: filters.sort as any,
        })
        setResults(data.partners)
      } catch (error) {
        console.error("Failed to fetch search results", error)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [filters])

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters)
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => { if (v) params.set(k, v as string) })
    router.push(`/search?${params.toString()}`, { scroll: false })
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/50 to-white">
      {/* Top Bar */}
      <div className="bg-white border-b border-pink-100 sticky top-16 z-30">
        <div className="container-main py-3">
          <form
            onSubmit={(e) => { e.preventDefault(); handleFiltersChange(filters) }}
            className="flex items-center gap-3"
          >
            <div className="relative flex-1 max-w-xl">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                placeholder="Rechercher un professionnel..."
                className="w-full pl-9 pr-4 py-2.5 input-field text-sm"
              />
              {filters.q && (
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, q: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button type="submit" className="btn-primary py-2.5 px-5 text-sm">
              Rechercher
            </button>
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-600 border border-pink-200 px-3 py-2.5 rounded-xl hover:border-[#C2517A] hover:text-[#C2517A] transition-colors"
            >
              <SlidersHorizontal size={15} />
              Filtres
            </button>
          </form>
        </div>
      </div>

      <div className="container-main py-6">
        <div className="flex gap-6">

          {/* Sidebar Filters (desktop) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <SearchFilters filters={filters} onChange={handleFiltersChange} />
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-semibold text-gray-900">
                  {results.length} partenaire{results.length !== 1 ? 's' : ''} trouvé{results.length !== 1 ? 's' : ''}
                </p>
                {(filters.wilaya || filters.category || filters.q) && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {[filters.q, filters.wilaya, filters.category].filter(Boolean).join(' · ')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 bg-white border border-pink-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-pink-100 text-[#C2517A]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-pink-100 text-[#C2517A]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {/* Results Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <PartnerCardSkeleton key={i} />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'flex flex-col gap-4'
              }>
                {results.map((partner) => (
                  <PartnerCard key={partner.id} partner={partner} compact={viewMode === 'list'} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun résultat trouvé</h3>
                <p className="text-gray-500 mb-6">
                  Essayez d&apos;élargir vos critères de recherche
                </p>
                <button
                  onClick={() => handleFiltersChange({ q: '', wilaya: '', category: '', plan: '', sort: 'relevance' })}
                  className="btn-outline text-sm"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="relative w-full bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-pink-100">
              <span className="font-bold text-gray-900">Filtres</span>
              <button onClick={() => setShowMobileFilters(false)}>
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-4">
              <SearchFilters filters={filters} onChange={(f) => { handleFiltersChange(f); setShowMobileFilters(false) }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
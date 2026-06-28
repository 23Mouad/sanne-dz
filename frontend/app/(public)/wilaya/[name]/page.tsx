import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, ArrowLeft, Sparkles, Building2 } from 'lucide-react'
import { WILAYAS, API_URL } from '@/lib/constants'
import { Partner } from '@/types'

async function getPartnersInWilaya(wilayaId: string): Promise<Partner[]> {
  try {
    const res = await fetch(`${API_URL}/partners?wilayaId=${wilayaId}&status=active`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  } catch (error) {
    console.error(error)
    return []
  }
}
import PartnerCard from '@/components/partner/PartnerCard'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>
}): Promise<Metadata> {
  const { name } = await params
  const decodedName = decodeURIComponent(name).replace(/-/g, ' ')
  const wilaya = WILAYAS.find((w) => w.name.toLowerCase() === decodedName.toLowerCase())
  if (!wilaya) return { title: 'Wilaya introuvable' }
  return {
    title: `Professionnels à ${wilaya.name} | Sanne DZ`,
    description: `Trouvez les meilleurs professionnels dans la wilaya de ${wilaya.name} sur Sanne DZ.`,
  }
}

export default async function WilayaPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const decodedName = decodeURIComponent(name).replace(/-/g, ' ')
  const wilaya = WILAYAS.find((w) => w.name.toLowerCase() === decodedName.toLowerCase())

  if (!wilaya) notFound()

  const partners = await getPartnersInWilaya(wilaya.id)

  // Sort: Pro first
  const sorted = [...partners].sort((a, b) => (b.isPro ? 1 : 0) - (a.isPro ? 1 : 0))

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/40 to-white">
      {/* Hero */}
      <div className="gradient-bg py-14">
        <div className="container-main">
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-5 transition-colors"
          >
            <ArrowLeft size={15} />
            Toutes les wilayas
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MapPin size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Wilaya de {wilaya.name}</h1>
              <p className="text-white/70 mt-1">
                {sorted.length} professionnel{sorted.length !== 1 ? 's' : ''} disponible{sorted.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-main py-10">
        {sorted.length > 0 ? (
          <>
            {/* Pro first notice */}
            {sorted.some((p) => p.isPro) && (
              <p className="text-sm text-gray-500 mb-6 flex items-center gap-1.5">
                <span className="badge-pro text-xs"><Sparkles size={10} className="inline mr-1" /> Pro</span>
                Les partenaires Premium apparaissent en premier
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sorted.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Pas encore de partenaires à {wilaya.name}
            </h2>
            <p className="text-gray-500 mb-6">
              Soyez le premier professionnel à rejoindre Sanne DZ dans cette wilaya !
            </p>
            <Link href="/role" className="btn-primary inline-flex">
              Inscrire mon business
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import type { PartnerPhoto } from '@/types'
import { getImageUrl } from '@/lib/utils'

export default function PartnerGallery({ photos }: { photos: PartnerPhoto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (i: number) => setLightboxIndex(i)
  const closeLightbox = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null))
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : null))

  if (!photos.length) return null

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio photos</h2>

      {/* Grid */}
      <div className={`grid gap-2 ${photos.length === 1 ? 'grid-cols-1' : photos.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => openLightbox(i)}
            className="relative aspect-square rounded-xl overflow-hidden group"
          >
            <img
              src={getImageUrl(photo.url)}
              alt={photo.caption || `Photo ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/70 hover:text-white z-10">
            <X size={28} />
          </button>
          <button onClick={prev} className="absolute left-4 text-white/70 hover:text-white z-10 p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft size={32} />
          </button>
          <button onClick={next} className="absolute right-4 text-white/70 hover:text-white z-10 p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronRight size={32} />
          </button>
          <div className="relative w-full max-w-4xl max-h-[90vh] aspect-video px-16">
            <img
              src={getImageUrl(photos[lightboxIndex].url)}
              alt={photos[lightboxIndex].caption || ''}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === lightboxIndex ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

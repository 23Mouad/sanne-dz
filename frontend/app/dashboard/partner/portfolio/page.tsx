'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Upload, Trash2, GripVertical, Image as ImageIcon, Video, Sparkles, Lightbulb, PlayCircle } from 'lucide-react'
import { PartnersService } from '@/services/partners.service'
import { getImageUrl } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useT } from '@/hooks/useT'
import { translations } from '@/lib/i18n/translations'

const MAX_PHOTOS_SIMPLE = 3
const MAX_PHOTOS_PRO = 20

export default function PartnerPortfolioPage() {
  const t = useT()
  const d = translations.partnerPortfolio

  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const maxPhotos = isPro ? MAX_PHOTOS_PRO : MAX_PHOTOS_SIMPLE
  const maxVideos = 1 // Hardcoded limit for pro

  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos')
  const [photos, setPhotos] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const p = await PartnersService.getMyProfile()
        setIsPro(p.isPro || false)
        const fetchedPhotos = await PartnersService.getPhotos()
        setPhotos(fetchedPhotos)
        
        if (p.isPro) {
          try {
            const fetchedVideos = await PartnersService.getVideos()
            setVideos(fetchedVideos)
          } catch (err) {
            console.error('Failed to fetch videos', err)
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDeletePhoto = async (id: string) => {
    try {
      await PartnersService.deletePhoto(id)
      setPhotos(prev => prev.filter(p => p.id !== id))
      toast.success(t(d.deletedMsg))
    } catch (e) {
      toast.error('Failed to delete photo')
    }
  }

  const handleDeleteVideo = async (id: string) => {
    try {
      await PartnersService.deleteVideo(id)
      setVideos(prev => prev.filter(p => p.id !== id))
      toast.success('Vidéo supprimée avec succès')
    } catch (e) {
      toast.error('Failed to delete video')
    }
  }

  const handleUpload = async (file: File) => {
    if (file.type.startsWith('video/')) {
      if (!isPro) {
        toast.error('La vidéo est réservée aux partenaires Pro.')
        return
      }
      if (videos.length >= maxVideos) {
        toast.error(`Maximum ${maxVideos} vidéos autorisées`)
        return
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error("La vidéo ne doit pas dépasser 50MB.")
        return
      }
      try {
        const newVideo = await PartnersService.addVideo(file, '')
        setVideos(prev => [...prev, newVideo])
        toast.success('Vidéo ajoutée avec succès')
        setActiveTab('videos')
      } catch(e: any) {
        toast.error(e.response?.data?.message || 'Upload failed')
      }
      return
    }

    if (file.type.startsWith('image/')) {
      if (photos.length >= maxPhotos) {
        toast.error(t(d.maxReachedMsg))
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5MB.")
        return
      }
      try {
        const newPhoto = await PartnersService.addPhoto(file, '', photos.length)
        setPhotos(prev => [...prev, newPhoto])
        toast.success(t(d.addedMsg))
        setActiveTab('photos')
      } catch(e: any) {
        toast.error(e.response?.data?.message || 'Upload failed')
      }
      return
    }

    toast.error('Veuillez sélectionner une image ou une vidéo valide.');
  }

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
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
      <div>
        <h1 className="page-title flex items-center gap-2">
          <ImageIcon size={28} className="text-[#C2517A]" />
          {t(d.title)}
        </h1>
        <p className="page-subtitle">
          {activeTab === 'photos' ? `${photos.length} / ${maxPhotos} ${t(d.sub)}` : `${videos.length} / ${maxVideos} Vidéo`}
          {!isPro && activeTab === 'photos' && <span className="ml-2 rtl:mr-2 text-sm text-gray-400">{t(d.simpleLimit)}</span>}
        </p>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('photos')}
          className={`pb-3 px-4 font-medium text-sm transition-colors relative
            ${activeTab === 'photos' ? 'text-[#C2517A]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center gap-2">
            <ImageIcon size={18} /> Photos
          </div>
          {activeTab === 'photos' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C2517A]" />
          )}
        </button>
        {isPro && (
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-3 px-4 font-medium text-sm transition-colors relative
              ${activeTab === 'videos' ? 'text-[#C2517A]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <Video size={18} /> Vidéo
            </div>
            {activeTab === 'videos' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C2517A]" />
            )}
          </button>
        )}
      </div>

      {/* Pro limitation banner */}
      {!isPro && activeTab === 'photos' && photos.length >= MAX_PHOTOS_SIMPLE && (
        <div className="bg-gradient-to-r from-[#C2517A]/10 to-[#7F77DD]/10 border border-[#C2517A]/20 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Sparkles size={18} className="text-[#C2517A]" />
            <p className="text-sm font-semibold text-gray-800">{t(d.limitReached)}</p>
          </div>
          <a href="/dashboard/partner/subscription" className="btn-primary text-sm py-2 px-4 whitespace-nowrap">
            {t(d.upgradePro)}
          </a>
        </div>
      )}

      {/* Upload Zone */}
      <input type="file" ref={fileInputRef} onChange={onFileSelect} accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime,video/x-msvideo" className="hidden" />
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { 
          e.preventDefault(); 
          setDragOver(false); 
          const file = e.dataTransfer.files?.[0];
          if (file) handleUpload(file);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
                    ${dragOver
                      ? 'border-[#C2517A] bg-pink-50 scale-[1.01]'
                      : 'border-pink-200 bg-pink-50/50 hover:border-[#C2517A] hover:bg-pink-50'
                    }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C2517A] to-[#7F77DD]
                        flex items-center justify-center mx-auto mb-4 shadow-md">
          <Upload size={24} className="text-white" />
        </div>
        <p className="font-semibold text-gray-800 mb-1">{t(d.dragDrop)}</p>
        <p className="text-sm text-gray-400">
          {isPro ? 'PNG, JPG, WEBP (max 5MB) ou MP4, WEBM (max 50MB)' : t(d.formats)}
        </p>
      </div>

      {/* Media Grid */}
      {activeTab === 'photos' ? (
        photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, i) => (
              <div key={photo.id} className="relative group rounded-2xl overflow-hidden aspect-square bg-gray-100">
                <img
                  src={getImageUrl(photo.url)}
                  alt={photo.caption || `Photo ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600"
                  >
                    <Trash2 size={15} className="text-white" />
                  </button>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-lg cursor-grab">
                    <GripVertical size={15} className="text-gray-600" />
                  </button>
                </div>
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                    <p className="text-white text-xs truncate">{photo.caption}</p>
                  </div>
                )}
                {i === 0 && (
                  <div className="absolute top-2 left-2 rtl:left-auto rtl:right-2 bg-[#C2517A] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    {t(d.mainPhoto)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <ImageIcon size={40} className="mx-auto mb-3 opacity-30" />
            <p>{t(d.noPhotos)}</p>
          </div>
        )
      ) : (
        videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="relative group rounded-2xl overflow-hidden aspect-video bg-gray-900 border border-gray-200">
                <video
                  src={getImageUrl(video.url)}
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 z-10">
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600"
                  >
                    <Trash2 size={15} className="text-white" />
                  </button>
                </div>
                {video.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 z-10">
                    <p className="text-white text-xs truncate">{video.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">
            <Video size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucune vidéo ajoutée</p>
          </div>
        )
      )}

      <p className="flex items-center text-xs text-gray-400">
        <Lightbulb size={12} className="mr-1.5 rtl:ml-1.5 shrink-0" /> {t(d.tip)}
      </p>
    </div>
  )
}

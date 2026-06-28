'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/50 to-purple-50/50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Animated 404 Graphic */}
        <div className="relative flex justify-center items-center">
          <h1 className="text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-200 to-purple-200 select-none leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-3xl shadow-xl border border-white/50 transform -rotate-6 animate-pulse">
              <span className="text-2xl font-bold gradient-text">
                Oups ! Page introuvable
              </span>
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-4">
          <p className="text-xl text-gray-600 font-medium">
            Il semble que vous vous soyez perdu en chemin.
          </p>
          <p className="text-gray-500 max-w-md mx-auto">
            La page que vous recherchez n'existe pas, a été déplacée ou est temporairement indisponible.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-pink-100 text-gray-600 font-medium 
                     hover:bg-pink-50 hover:text-[#C2517A] hover:border-pink-200 transition-all flex items-center justify-center gap-2 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Retour
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#C2517A] to-[#a8365f] text-white font-medium 
                     hover:shadow-lg hover:shadow-pink-500/25 transition-all flex items-center justify-center gap-2 group"
          >
            <Home size={18} className="group-hover:scale-110 transition-transform" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

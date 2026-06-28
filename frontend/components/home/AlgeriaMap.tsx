'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useRouter } from 'next/navigation'
import { WilayasService } from '@/services/categories.service'

// Fix Leaflet icons missing in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

// Coordinates mapping for active wilayas
const WILAYA_COORDS: Record<string, [number, number]> = {
  'Alger': [36.7538, 3.0588],
  'Oran': [35.6987, -0.6308],
  'Constantine': [36.3650, 6.6147],
  'Sétif': [36.1898, 5.4108],
  'Béjaïa': [36.7558, 5.0843],
  'Blida': [36.4700, 2.8277],
  'Annaba': [36.9000, 7.7666],
  'Batna': [35.5559, 6.1741],
  'Tizi Ouzou': [36.7118, 4.0459],
  'Tlemcen': [34.8783, -1.3150],
  'Mostaganem': [35.9311, 0.0891],
  'Biskra': [34.8480, 5.7269],
}

export default function AlgeriaMap() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [activeWilayas, setActiveWilayas] = useState<any[]>([])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
    
    const load = async () => {
      try {
        const res = await WilayasService.getActive()
        setActiveWilayas(res)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  if (!isMounted) return <div className="h-[400px] w-full bg-gray-100 rounded-2xl animate-pulse" />

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-pink-100 relative z-0">
      <MapContainer 
        center={[34.5, 3.0]} 
        zoom={5} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {activeWilayas.map(wilaya => {
          const coords = WILAYA_COORDS[wilaya.name]
          if (!coords) return null
          
          return (
            <Marker key={wilaya.id} position={coords} icon={icon}>
              <Popup>
                <div 
                  className="text-center p-2 cursor-pointer hover:bg-gray-50 rounded transition-colors"
                  onClick={() => router.push(`/wilaya/${wilaya.name.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  <div className="font-bold text-[#C2517A] text-lg mb-1">{wilaya.name}</div>
                  <div className="text-sm text-gray-500">{wilaya.partnerCount} professionnels</div>
                  <div className="text-xs text-[#7F77DD] mt-2 font-medium">
                    Voir la wilaya &rarr;
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

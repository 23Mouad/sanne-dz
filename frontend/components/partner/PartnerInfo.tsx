import { MapPin, Phone, Clock, Tag, ExternalLink, CheckCircle } from 'lucide-react'
import type { Partner } from '@/types'

const DAY_LABELS: Record<string, string> = {
  monday: 'Lundi', tuesday: 'Mardi', wednesday: 'Mercredi',
  thursday: 'Jeudi', friday: 'Vendredi', saturday: 'Samedi', sunday: 'Dimanche',
}

export default function PartnerInfo({ partner }: { partner: Partner }) {
  const scheduleEntries = partner.schedule
    ? Object.entries(partner.schedule)
    : []

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()

  return (
    <div className="space-y-6">

      {/* About */}
      <div className="card p-5">
        <h2 className="font-bold text-gray-900 mb-3">À propos</h2>
        <p className="text-gray-600 leading-relaxed text-sm">{partner.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {partner.category && (
            <span className="tag">
              <Tag size={12} />
              {partner.category.name}
            </span>
          )}
          {partner.subCategory && (
            <span className="tag">{partner.subCategory.name}</span>
          )}
          <span className="tag">
            <MapPin size={12} />
            {partner.wilaya}
          </span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="card p-5">
        <h2 className="font-bold text-gray-900 mb-4">Informations</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-sm">
            <MapPin size={16} className="text-[#C2517A] mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-gray-800">{partner.address}</p>
              <p className="text-gray-500">{partner.wilaya}</p>
              {partner.mapLink && (
                <a href={partner.mapLink} target="_blank" rel="noopener noreferrer"
                   className="text-[#C2517A] hover:underline flex items-center gap-1 mt-1 text-xs">
                  Voir sur Google Maps <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-[#C2517A] shrink-0" />
            <a href={`tel:${partner.phone}`} className="text-gray-800 hover:text-[#C2517A] transition-colors">
              {partner.phone}
            </a>
          </div>

          {partner.registreCommerce && (
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle size={16} className="text-green-500 shrink-0" />
              <span className="text-gray-600">RC : {partner.registreCommerce}</span>
            </div>
          )}
        </div>
      </div>

      {/* Schedule */}
      {scheduleEntries.length > 0 && (
        <div className="card p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-[#C2517A]" />
            Horaires
          </h2>
          <div className="space-y-2">
            {scheduleEntries.map(([day, schedule]) => {
              const isToday = day === today
              return (
                <div key={day} className={`flex items-center justify-between text-sm py-1.5 px-2 rounded-lg ${isToday ? 'bg-pink-50 font-semibold' : ''}`}>
                  <span className={`capitalize ${isToday ? 'text-[#C2517A]' : 'text-gray-600'}`}>
                    {DAY_LABELS[day]}
                    {isToday && <span className="ml-1 text-xs">(aujourd&apos;hui)</span>}
                  </span>
                  <span className={schedule?.isClosed ? 'text-red-400' : 'text-gray-800'}>
                    {schedule?.isClosed
                      ? 'Fermé'
                      : `${schedule?.open} – ${schedule?.close}`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}

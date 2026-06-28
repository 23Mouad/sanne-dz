import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: number; label: string }
  color?: 'rose' | 'violet' | 'green' | 'amber' | 'blue'
  isBlurred?: boolean
}

const colorMap = {
  rose:   { bg: 'bg-pink-50',   icon: 'bg-gradient-to-br from-[#C2517A] to-[#a8365f]', text: 'text-[#C2517A]', trend: 'text-[#C2517A]' },
  violet: { bg: 'bg-purple-50', icon: 'bg-gradient-to-br from-[#7F77DD] to-[#6059c4]', text: 'text-[#7F77DD]', trend: 'text-[#7F77DD]' },
  green:  { bg: 'bg-green-50',  icon: 'bg-gradient-to-br from-green-500 to-emerald-600', text: 'text-green-600', trend: 'text-green-600' },
  amber:  { bg: 'bg-amber-50',  icon: 'bg-gradient-to-br from-amber-400 to-orange-500', text: 'text-amber-600', trend: 'text-amber-600' },
  blue:   { bg: 'bg-blue-50',   icon: 'bg-gradient-to-br from-blue-500 to-indigo-600',  text: 'text-blue-600',  trend: 'text-blue-600'  },
}

export default function StatsCard({ title, value, subtitle, icon: Icon, trend, color = 'rose', isBlurred = false }: StatsCardProps) {
  const c = colorMap[color]
  return (
    <div className="stats-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <div className="mt-1 relative">
            <p className={`text-3xl font-bold text-gray-900 ${isBlurred ? 'blur-[6px] select-none opacity-50' : ''}`}>
              {isBlurred ? 'XXXX' : value}
            </p>
            {isBlurred && (
              <div className="absolute inset-0 flex items-center mb-1">
                <span className="text-[10px] font-bold bg-[#C2517A] text-white px-1.5 py-0.5 rounded uppercase tracking-wider">Pro</span>
              </div>
            )}
          </div>
          {subtitle && <p className={`text-xs text-gray-400 mt-0.5 ${isBlurred ? 'blur-sm select-none' : ''}`}>{subtitle}</p>}
          {trend && (
            <p className={`text-xs font-medium mt-2 ${c.trend} ${isBlurred ? 'blur-sm select-none opacity-50' : ''}`}>
              {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 shrink-0 rounded-2xl ${c.icon} flex items-center justify-center shadow-md`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  )
}

import { DashboardStats } from '@/types'
import { Users, UserRound, UserRoundCheck, HeartPulse, Baby, Heart, Accessibility } from 'lucide-react'

const getCards = (stats: DashboardStats) => [
  { label: 'Total Penduduk', value: stats.total, Icon: Users, accent: '#0B3D2E' },
  { label: 'Laki-laki', value: stats.laki, Icon: UserRound, accent: '#2563EB' },
  { label: 'Perempuan', value: stats.perempuan, Icon: UserRoundCheck, accent: '#DB2777' },
  { label: 'Lansia ≥60th', value: stats.lansia, Icon: HeartPulse, accent: '#7C3AED' },
  { label: 'Balita <5th', value: stats.balita, Icon: Baby, accent: '#EA580C' },
  { label: 'Ibu Hamil', value: stats.ibu_hamil, Icon: Heart, accent: '#E11D48' },
  { label: 'Disabilitas', value: stats.disabilitas, Icon: Accessibility, accent: '#0D9488' },
]

export default function StatsCards({ stats }: { stats: DashboardStats }) {
  const cards = getCards(stats)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {cards.map(card => {
        const Icon = card.Icon
        return (
          <div
            key={card.label}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm
              hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3
                transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${card.accent}14` }}
            >
              <Icon size={16} style={{ color: card.accent }} />
            </div>
            <p className="text-2xl font-black text-gray-900 tabular-nums">
              {card.value.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-gray-400 mt-1 leading-tight">{card.label}</p>
            <div
              className="mt-3 h-0.5 rounded-full transition-all duration-300 group-hover:h-1"
              style={{ backgroundColor: card.accent }}
            />
          </div>
        )
      })}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { DashboardStats } from '@/types'
import {
  Users, UserRound, UserRoundCheck,
  HeartPulse, Baby, Heart, Accessibility, Home
} from 'lucide-react'

const getCards = (stats: DashboardStats) => [
  { label: 'Total Penduduk', value: stats.total, Icon: Users, accent: '#0B3D2E' },
  { label: 'Kepala Keluarga', value: stats.jumlah_kk, Icon: Home, accent: '#0369A1' },
  { label: 'Laki-laki', value: stats.laki, Icon: UserRound, accent: '#2563EB' },
  { label: 'Perempuan', value: stats.perempuan, Icon: UserRoundCheck, accent: '#DB2777' },
  { label: 'Lansia ≥60th', value: stats.lansia, Icon: HeartPulse, accent: '#7C3AED' },
  { label: 'Balita <5th', value: stats.balita, Icon: Baby, accent: '#EA580C' },
  { label: 'Ibu Hamil', value: stats.ibu_hamil, Icon: Heart, accent: '#E11D48' },
  { label: 'Disabilitas', value: stats.disabilitas, Icon: Accessibility, accent: '#0D9488' },
]

function StatCard({
  card, index,
}: {
  card: ReturnType<typeof getCards>[0]; index: number
}) {
  const [hovered, setHovered] = useState(false)
  const Icon = card.Icon

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm
        transition-all duration-400 cursor-default relative overflow-hidden"
      style={{
        transform: hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hovered
          ? `0 20px 40px ${card.accent}18, 0 8px 16px rgba(0,0,0,0.08)`
          : '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Hover background glow */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${card.accent}08 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      <div className="relative">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-3
            transition-transform duration-300"
          style={{
            backgroundColor: `${card.accent}14`,
            transform: hovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)',
          }}
        >
          <Icon size={16} style={{ color: card.accent }} />
        </div>

        <p
          className="text-2xl font-black text-gray-900 tabular-nums transition-all
            duration-300"
          style={{ color: hovered ? card.accent : '#111827' }}
        >
          {card.value.toLocaleString('id-ID')}
        </p>
        <p className="text-xs text-gray-400 mt-1 leading-tight">{card.label}</p>

        <div
          className="mt-3 rounded-full transition-all duration-500"
          style={{
            height: hovered ? '3px' : '2px',
            backgroundColor: card.accent,
            width: hovered ? '100%' : '40%',
          }}
        />
      </div>
    </div>
  )
}

export default function StatsCards({ stats }: { stats: DashboardStats }) {
  const cards = getCards(stats)
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {cards.map((card, i) => (
        <StatCard key={card.label} card={card} index={i} />
      ))}
    </div>
  )
}
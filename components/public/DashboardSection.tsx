'use client'

import { useState } from 'react'
import RTFilter from '@/components/dashboard/RTFilter'
import { useStats } from '@/hooks/useStats'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { LineChart, Loader2, AlertCircle, FileSearch, Users, Home, UserRound, UserRoundCheck } from 'lucide-react'
import { DashboardStats } from '@/types'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

// ── Pie chart gender inline ──
function GenderChart({ laki, perempuan }: { laki: number; perempuan: number }) {
  const data = [
    { name: 'Laki-laki', value: laki },
    { name: 'Perempuan', value: perempuan },
  ]
  const COLORS = ['#2563EB', '#DB2777']

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full">
      <h3 className="font-semibold text-gray-800 mb-1 text-sm">Sebaran Gender</h3>
      <p className="text-xs text-gray-400 mb-4">Komposisi jenis kelamin penduduk</p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={72}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '10px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '12px',
            }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
      {/* Summary bawah chart */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-xl font-black text-blue-600 tabular-nums">
            {laki.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-blue-400 mt-0.5">Laki-laki</p>
        </div>
        <div className="bg-pink-50 rounded-xl p-3 text-center">
          <p className="text-xl font-black text-pink-600 tabular-nums">
            {perempuan.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-pink-400 mt-0.5">Perempuan</p>
        </div>
      </div>
    </div>
  )
}

// ── Bar chart per RT inline ──
function RTChart({ perRt }: { perRt: DashboardStats['per_rt'] }) {
  const data = perRt.map(r => ({ name: `RT ${r.rt}`, Penduduk: r.total }))

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full">
      <h3 className="font-semibold text-gray-800 mb-1 text-sm">Penduduk per RT</h3>
      <p className="text-xs text-gray-400 mb-4">Jumlah penduduk di tiap rukun tetangga</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              borderRadius: '10px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="Penduduk" fill="#0B3D2E" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── 4 stat cards utama ──
function MainStatCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      label: 'Total Penduduk',
      value: stats.total,
      Icon: Users,
      accent: '#0B3D2E',
      sub: 'jiwa terdaftar',
    },
    {
      label: 'Kepala Keluarga',
      value: stats.jumlah_kk,
      Icon: Home,
      accent: '#0369A1',
      sub: 'kartu keluarga',
    },
    {
      label: 'Laki-laki',
      value: stats.laki,
      Icon: UserRound,
      accent: '#2563EB',
      sub: `${stats.total > 0 ? Math.round((stats.laki / stats.total) * 100) : 0}% dari total`,
    },
    {
      label: 'Perempuan',
      value: stats.perempuan,
      Icon: UserRoundCheck,
      accent: '#DB2777',
      sub: `${stats.total > 0 ? Math.round((stats.perempuan / stats.total) * 100) : 0}% dari total`,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.Icon
        return (
          <div
            key={card.label}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm
              hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3
                group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: `${card.accent}14` }}
            >
              <Icon size={18} style={{ color: card.accent }} />
            </div>
            <p
              className="text-3xl font-black tabular-nums transition-colors duration-300
                group-hover:text-[var(--accent)]"
              style={{ '--accent': card.accent } as React.CSSProperties}
            >
              {card.value.toLocaleString('id-ID')}
            </p>
            <p className="text-sm font-semibold text-gray-700 mt-1">{card.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
            <div
              className="mt-3 h-0.5 rounded-full transition-all duration-500
                group-hover:h-1"
              style={{ backgroundColor: card.accent, width: '40%' }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default function DashboardSection() {
  const [selectedRT, setSelectedRT] = useState<number | null>(null)
  const { stats, isLoading, error } = useStats(selectedRT)
  const reveal = useScrollReveal()

  return (
    <section id="dashboard" className="section-padding bg-[#FAFAF8]">
      <div ref={reveal.ref} className="container-inner">

        {/* Header + Filter */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between
            gap-4 mb-10 ${reveal.isVisible ? 'reveal' : 'opacity-0'}`}
        >
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
              bg-[#0B3D2E]/10 text-[#0B3D2E] text-xs font-semibold tracking-widest
              uppercase mb-3">
              <LineChart size={11} />
              Data Penduduk
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Potorono dalam Angka
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Statistik kependudukan yang diperbarui secara berkala.
            </p>
          </div>
          <div className="shrink-0">
            <RTFilter selected={selectedRT} onChange={setSelectedRT} />
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 size={28} className="text-[#0B3D2E] animate-spin" />
            <span className="text-gray-400 text-sm">Memuat data...</span>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <AlertCircle size={28} className="text-red-300" />
            <p className="text-red-400 text-sm">Gagal memuat data. Silakan coba lagi.</p>
          </div>
        )}

        {/* Data */}
        {stats && !isLoading && stats.total > 0 && (
          <div className={`space-y-6 ${reveal.isVisible ? 'reveal' : 'opacity-0'}`}>
            {/* 4 stat cards */}
            <MainStatCards stats={stats} />

            {/* 2 charts side by side */}
            <div className="grid md:grid-cols-2 gap-6">
              <GenderChart laki={stats.laki} perempuan={stats.perempuan} />
              <RTChart perRt={stats.per_rt} />
            </div>
          </div>
        )}

        {/* Empty */}
        {stats && stats.total === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center
            py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <FileSearch size={32} className="text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">
              Belum ada data penduduk
              {selectedRT ? ` untuk RT ${selectedRT}` : ''}.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
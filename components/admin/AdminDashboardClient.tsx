'use client'

import { useState, useMemo } from 'react'
import { DashboardStats } from '@/types'
import StatsCards from '@/components/dashboard/StatsCards'
import BarChartRT from '@/components/dashboard/BarChartRT'
import PieChartGender from '@/components/dashboard/PieChartGender'
import SpecialCategoriesChart from '@/components/dashboard/SpecialCategoriesChart'
import RTFilter from '@/components/dashboard/RTFilter'
import { isLansia, isBalita } from '@/lib/utils'
import {
  Users, Store, Newspaper, Grid3x3, BarChart3,
} from 'lucide-react'

// Tipe row resident yang di-pass dari server (hanya field yang dibutuhkan)
interface ResidentRow {
  jenis_kelamin: string
  tanggal_lahir: string
  is_ibu_hamil: boolean
  is_disabilitas: boolean
  rt: number
}

interface Props {
  residents: ResidentRow[]
  fullStats: DashboardStats
  totalUmkm: number
  totalNews: number
}

function computeStats(residents: ResidentRow[]): DashboardStats {
  return {
    total: residents.length,
    laki: residents.filter(r => r.jenis_kelamin === 'L').length,
    perempuan: residents.filter(r => r.jenis_kelamin === 'P').length,
    lansia: residents.filter(r => isLansia(r.tanggal_lahir)).length,
    balita: residents.filter(r => isBalita(r.tanggal_lahir)).length,
    ibu_hamil: residents.filter(r => r.is_ibu_hamil).length,
    disabilitas: residents.filter(r => r.is_disabilitas).length,
    per_rt: Array.from({ length: 9 }, (_, i) => ({
      rt: i + 1,
      total: residents.filter(r => r.rt === i + 1).length,
    })),
  }
}

export default function AdminDashboardClient({
  residents,
  fullStats,
  totalUmkm,
  totalNews,
}: Props) {
  const [selectedRT, setSelectedRT] = useState<number | null>(null)

  // ✅ Filter resident berdasarkan RT yang dipilih, compute stats baru
  const filteredStats = useMemo(() => {
    if (selectedRT === null) return fullStats
    const filtered = residents.filter(r => r.rt === selectedRT)
    return computeStats(filtered)
  }, [selectedRT, residents, fullStats])

  const summaryCards = [
    {
      label: 'Total Penduduk',
      value: fullStats.total,
      icon: Users,
      color: 'text-[#0B3D2E]',
      bg: 'bg-[#0B3D2E]/10',
      note: 'semua RT',
    },
    {
      label: 'UMKM Aktif',
      value: totalUmkm,
      icon: Store,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      note: null,
    },
    {
      label: 'Berita Tayang',
      value: totalNews,
      icon: Newspaper,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      note: null,
    },
    {
      label: 'Jumlah RT',
      value: 9,
      icon: Grid3x3,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      note: null,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-500 text-sm mt-1">Ringkasan data Dusun Potorono</p>
      </div>

      {/* Summary top cards — tidak terpengaruh filter RT */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(card => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm
                hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center
                justify-center mb-3`}>
                <Icon size={18} className={card.color} />
              </div>
              <p className="text-2xl font-bold text-gray-800 tabular-nums">
                {card.value.toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
              {card.note && (
                <p className="text-xs text-gray-300 mt-0.5">{card.note}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Divider statistik penduduk */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        {/* Header section dengan filter RT */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <BarChart3 size={15} className="text-[#0B3D2E]" />
              <h2 className="font-semibold text-gray-800 text-sm">Statistik Penduduk</h2>
            </div>
            <p className="text-xs text-gray-400 ml-5">
              {selectedRT
                ? `Menampilkan data RT ${selectedRT}`
                : 'Menampilkan semua RT'}
            </p>
          </div>
          {/* ✅ Filter RT — sama persis dengan public */}
          <RTFilter selected={selectedRT} onChange={setSelectedRT} />
        </div>

        {/* Stats cards kependudukan — ikut filter */}
        <StatsCards stats={filteredStats} />
      </div>

      {/* Charts — ikut filter RT */}
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-2">
          <PieChartGender
            laki={filteredStats.laki}
            perempuan={filteredStats.perempuan}
          />
        </div>
        <div className="md:col-span-3">
          <BarChartRT perRt={filteredStats.per_rt} />
        </div>
      </div>

      <SpecialCategoriesChart stats={filteredStats} />

      {/* Per RT grid — selalu tampil semua RT untuk overview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm">
          <Grid3x3 size={15} className="text-[#0B3D2E]" />
          Sebaran Penduduk per RT
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {fullStats.per_rt.map(r => (
            <button
              key={r.rt}
              onClick={() => setSelectedRT(selectedRT === r.rt ? null : r.rt)}
              className={`text-center rounded-xl p-3 transition-all hover:-translate-y-0.5 ${
                selectedRT === r.rt
                  ? 'bg-[#0B3D2E] shadow-sm'
                  : 'bg-[#0B3D2E]/5 hover:bg-[#0B3D2E]/10'
              }`}
            >
              <p className={`text-xs mb-1 ${
                selectedRT === r.rt ? 'text-white/70' : 'text-gray-400'
              }`}>
                RT {r.rt}
              </p>
              <p className={`text-xl font-bold tabular-nums ${
                selectedRT === r.rt ? 'text-white' : 'text-[#0B3D2E]'
              }`}>
                {r.total}
              </p>
            </button>
          ))}
        </div>
        {selectedRT && (
          <button
            onClick={() => setSelectedRT(null)}
            className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors
              flex items-center gap-1"
          >
            ✕ Reset filter, tampilkan semua RT
          </button>
        )}
      </div>
    </div>
  )
}
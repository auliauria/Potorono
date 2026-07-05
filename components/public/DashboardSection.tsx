'use client'

import { useState } from 'react'
import RTFilter from '@/components/dashboard/RTFilter'
import StatsCards from '@/components/dashboard/StatsCards'
import BarChartRT from '@/components/dashboard/BarChartRT'
import PieChartGender from '@/components/dashboard/PieChartGender'
import SpecialCategoriesChart from '@/components/dashboard/SpecialCategoriesChart'
import { useStats } from '@/hooks/useStats'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { LineChart, Loader2, AlertCircle, FileSearch } from 'lucide-react'

export default function DashboardSection() {
  const [selectedRT, setSelectedRT] = useState<number | null>(null)
  const { stats, isLoading, error } = useStats(selectedRT)
  const { ref, isVisible } = useScrollReveal()

  return (
    <section id="dashboard" className="section-padding bg-[#FAFAF8]">
      <div ref={ref} className="container-inner">

        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10
          ${isVisible ? 'reveal' : 'opacity-0'}`}>
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
              Statistik kependudukan yang diperbarui secara berkala oleh admin dusun.
            </p>
          </div>
          <div className="shrink-0">
            <RTFilter selected={selectedRT} onChange={setSelectedRT} />
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 size={28} className="text-[#0B3D2E] animate-spin" />
            <span className="text-gray-400 text-sm">Memuat data...</span>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <AlertCircle size={28} className="text-red-300" />
            <p className="text-red-400 text-sm">Gagal memuat data. Silakan coba lagi.</p>
          </div>
        )}

        {stats && !isLoading && (
          <div className="space-y-6 reveal">
            <StatsCards stats={stats} />
            <div className="grid md:grid-cols-5 gap-6">
              <div className="md:col-span-2">
                <PieChartGender laki={stats.laki} perempuan={stats.perempuan} />
              </div>
              <div className="md:col-span-3">
                <BarChartRT perRt={stats.per_rt} />
              </div>
            </div>
            <SpecialCategoriesChart stats={stats} />
          </div>
        )}

        {stats && stats.total === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center py-16
            bg-white rounded-2xl border border-dashed border-gray-200">
            <FileSearch size={32} className="text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">
              Belum ada data penduduk{selectedRT ? ` untuk RT ${selectedRT}` : ''}.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
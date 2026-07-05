'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { DashboardStats } from '@/types'

interface BarChartRTProps {
  perRt: DashboardStats['per_rt']
}

export default function BarChartRT({ perRt }: BarChartRTProps) {
  const data = perRt.map(r => ({
    name: `RT ${r.rt}`,
    Penduduk: r.total,
  }))

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4 text-sm">
        Jumlah Penduduk per RT
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="Penduduk" fill="#1B4332" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
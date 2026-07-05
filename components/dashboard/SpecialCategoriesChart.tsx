'use client'

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { DashboardStats } from '@/types'

interface SpecialCategoriesChartProps {
  stats: DashboardStats
}

export default function SpecialCategoriesChart({ stats }: SpecialCategoriesChartProps) {
  const data = [
    { name: 'Lansia', value: stats.lansia, fill: '#7C3AED' },
    { name: 'Balita', value: stats.balita, fill: '#F97316' },
    { name: 'Ibu Hamil', value: stats.ibu_hamil, fill: '#F43F5E' },
    { name: 'Disabilitas', value: stats.disabilitas, fill: '#0D9488' },
  ]

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4 text-sm">
        Kategori Khusus
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
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
'use client'

import useSWR from 'swr'
import { DashboardStats } from '@/types'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useStats(rt: number | null) {
  const url = rt
    ? `/api/stats?rt=${rt}`
    : '/api/stats'

  const { data, error, isLoading } = useSWR<DashboardStats>(url, fetcher, {
    refreshInterval: 60000, // refresh tiap 60 detik
    revalidateOnFocus: true,
  })

  return { stats: data, error, isLoading }
}
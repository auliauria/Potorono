import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isLansia, isBalita } from '@/lib/utils'
import { DashboardStats } from '@/types'

export const revalidate = 60 // ISR: revalidate setiap 60 detik

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const rtParam = searchParams.get('rt')
  const rt = rtParam ? parseInt(rtParam) : null

  const supabase = await createClient()

  let query = supabase
    .from('residents')
    .select('jenis_kelamin, tanggal_lahir, is_ibu_hamil, is_disabilitas, rt, no_kk')

  if (rt && rt >= 1 && rt <= 9) {
    query = query.eq('rt', rt)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const residents = data || []
  const kkSet = new Set(
    residents
      .map(r => r.no_kk)
      .filter((kk): kk is string => !!kk && kk.trim() !== '')
  )
  const jumlah_kk = kkSet.size

  const stats: DashboardStats = {
    total: residents.length,
    laki: residents.filter(r => r.jenis_kelamin === 'L').length,
    perempuan: residents.filter(r => r.jenis_kelamin === 'P').length,
    lansia: residents.filter(r => isLansia(r.tanggal_lahir)).length,
    balita: residents.filter(r => isBalita(r.tanggal_lahir)).length,
    ibu_hamil: residents.filter(r => r.is_ibu_hamil).length,
    disabilitas: residents.filter(r => r.is_disabilitas).length,
    jumlah_kk,
    per_rt: Array.from({ length: 9 }, (_, i) => ({
      rt: i + 1,
      total: residents.filter(r => r.rt === i + 1).length,
    })),
  }

  return NextResponse.json(stats)
}
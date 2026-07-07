import { createClient } from '@/lib/supabase/server'
import { isLansia, isBalita } from '@/lib/utils'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { data: residents },
    { count: totalUmkm },
    { count: totalNews },
  ] = await Promise.all([
    supabase
      .from('residents')
      .select('jenis_kelamin, tanggal_lahir, is_ibu_hamil, is_disabilitas, rt, no_kk'),
    supabase
      .from('umkms')
      .select('*', { count: 'exact', head: true })
      .eq('status_aktif', true),
    supabase
      .from('news')
      .select('*', { count: 'exact', head: true })
      .eq('status_publish', true),
  ])

  const all = residents || []
  const kkSet = new Set(
    all
      .map(r => r.no_kk)
      .filter((kk): kk is string => !!kk && kk.trim() !== '')
  )
  const fullStats = {
    total: all.length,
    laki: all.filter(r => r.jenis_kelamin === 'L').length,
    perempuan: all.filter(r => r.jenis_kelamin === 'P').length,
    lansia: all.filter(r => isLansia(r.tanggal_lahir)).length,
    balita: all.filter(r => isBalita(r.tanggal_lahir)).length,
    ibu_hamil: all.filter(r => r.is_ibu_hamil).length,
    disabilitas: all.filter(r => r.is_disabilitas).length,
    jumlah_kk: kkSet.size,
    per_rt: Array.from({ length: 9 }, (_, i) => ({
      rt: i + 1,
      total: all.filter(r => r.rt === i + 1).length,
    })),
  }

  return (
    <AdminDashboardClient
      // ✅ Pass raw residents agar filter RT bisa dilakukan client-side
      residents={all}
      fullStats={fullStats}
      totalUmkm={totalUmkm || 0}
      totalNews={totalNews || 0}
    />
  )
}
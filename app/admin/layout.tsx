import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Profile } from '@/types'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Halaman login & register tidak pakai layout sidebar
  // (mereka punya layout sendiri — full page)
  // Layout ini hanya untuk route yang butuh sidebar

  // Jika tidak ada user, biarkan proxy yang handle redirect
  if (!user) {
    return <>{children}</>
  }

  // Ambil profile via admin client
  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from('profiles')
    .select('id, email, nama, role, is_active, created_at')
    .eq('id', user.id)
    .single()

  // Jika tidak aktif, biarkan proxy yang handle
  if (!profile?.is_active) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ✅ Sidebar hanya muncul saat user sudah login dan aktif */}
      <AdminSidebar profile={profile as Profile} />
      <main className="flex-1 min-w-0">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
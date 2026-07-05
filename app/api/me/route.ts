import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  // Ambil user dari session cookie (pakai regular client)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Ambil profile pakai admin client — bypass RLS 100%
  const adminClient = createAdminClient()
  const { data: profile, error } = await adminClient
    .from('profiles')
    .select('id, email, nama, role, is_active, created_at')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    console.error('GET /api/me error:', error)
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  return NextResponse.json(profile)
}
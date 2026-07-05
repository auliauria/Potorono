// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function getSuperadminClient(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized', status: 401, user: null, adminClient: null }

  const adminClient = createAdminClient()
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'superadmin') {
    return { error: 'Forbidden', status: 403, user: null, adminClient: null }
  }

  return { error: null, status: 200, user, adminClient }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminClient = createAdminClient()

  const { data: currentProfile, error: currentError } = await adminClient
    .from('profiles')
    .select('id, email, nama, role, is_active, created_at')
    .eq('id', user.id)
    .single()

  console.log('GET /api/users - currentProfile:', currentProfile, 'error:', currentError)

  if (!currentProfile || currentProfile.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: profiles, error } = await adminClient
    .from('profiles')
    .select('id, email, nama, role, is_active, created_at')
    .order('created_at', { ascending: false })

  console.log('GET /api/users - all profiles count:', profiles?.length, 'error:', error)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ profiles: profiles || [], current: currentProfile })
}

// ✅ Handle PATCH via query param ?id=xxx
// karena dynamic route [id] tidak terbaca
export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const targetId = searchParams.get('id')

  if (!targetId) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminClient = createAdminClient()

  const { data: currentProfile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentProfile || currentProfile.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (targetId === user.id) {
    return NextResponse.json({ error: 'Tidak bisa mengubah akun sendiri' }, { status: 400 })
  }

  const body = await request.json()
  const allowed: Record<string, unknown> = {}

  if (typeof body.is_active === 'boolean') allowed.is_active = body.is_active
  if (body.role === 'admin' || body.role === 'superadmin') allowed.role = body.role

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ error: 'Tidak ada field yang valid' }, { status: 400 })
  }

  const { error } = await adminClient
    .from('profiles')
    .update(allowed)
    .eq('id', targetId)

  if (error) {
    console.error('PATCH /api/users error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log(`PATCH /api/users?id=${targetId} success:`, allowed)
  return NextResponse.json({ success: true })
}
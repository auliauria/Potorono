import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  if (params.id === user.id) {
    return NextResponse.json({ error: 'Cannot modify own account' }, { status: 400 })
  }

  const body = await request.json()
  const allowed: Record<string, unknown> = {}
  if (typeof body.is_active === 'boolean') allowed.is_active = body.is_active
  if (body.role === 'admin' || body.role === 'superadmin') allowed.role = body.role

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ error: 'No valid fields' }, { status: 400 })
  }

  const { error } = await adminClient
    .from('profiles')
    .update(allowed)
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
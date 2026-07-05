import { createClient } from '@/lib/supabase/server'
import { Profile } from '@/types'

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}

export async function requireSuperadmin() {
  const profile = await getCurrentProfile()
  if (!profile || profile.role !== 'superadmin') {
    throw new Error('Forbidden')
  }
  return profile
}
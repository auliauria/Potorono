import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, nama } = body

    if (!email || !password || !nama) {
      return NextResponse.json(
        { error: 'Email, password, dan nama wajib diisi.' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password minimal 8 karakter.' },
        { status: 400 }
      )
    }

    const adminClient = createAdminClient()

    // Cek apakah email sudah ada
    const { data: existingUsers } = await adminClient.auth.admin.listUsers()
    const emailExists = existingUsers?.users?.some(
      u => u.email?.toLowerCase() === email.toLowerCase()
    )

    if (emailExists) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar.' },
        { status: 400 }
      )
    }

    // Buat user via admin — email langsung confirmed, trigger pasti fire
    const { data: authData, error: authError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nama, role: 'admin' },
      })

    if (authError || !authData.user) {
      console.error('Register auth error:', authError)
      return NextResponse.json(
        { error: authError?.message ?? 'Gagal membuat akun.' },
        { status: 400 }
      )
    }

    // Insert profile langsung — tidak bergantung trigger
    const { error: profileError } = await adminClient
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email,
        nama,
        role: 'admin',
        is_active: false,
      })

    if (profileError) {
      console.error('Register profile error:', profileError)
      // Tidak return error — user sudah terbuat, profile bisa difix manual
    }

    console.log('Register success:', email, authData.user.id)
    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Register unexpected error:', err)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server.' },
      { status: 500 }
    )
  }
}
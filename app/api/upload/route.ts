import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  // Cek auth dulu
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  // Validasi ukuran (max 2MB)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File terlalu besar. Maksimal 10MB.' }, { status: 400 })
  }

  // Validasi tipe
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Format file tidak didukung.' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  // Konversi File ke ArrayBuffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  // ✅ Pakai admin client agar bypass RLS storage
  const adminClient = createAdminClient()

  const { data, error } = await adminClient.storage
    .from('media')
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: { publicUrl } } = adminClient.storage
    .from('media')
    .getPublicUrl(data.path)

  console.log('Upload success:', publicUrl)

  return NextResponse.json({ url: publicUrl })
}
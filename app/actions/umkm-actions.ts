'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const umkmSchema = z.object({
  nama_umkm: z.string().min(3, "Nama UMKM minimal 3 karakter"),
  deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter"),
  kategori: z.string().min(1),
  nama_pemilik: z.string().min(3),
  no_whatsapp: z.string().min(10),
  alamat: z.string().optional(),
  foto: z.string().optional(), // URL dari Supabase Storage
  status_aktif: z.boolean().default(true),
})

type UmkmFormData = z.infer<typeof umkmSchema>

export async function createUmkm(formData: FormData | UmkmFormData) {
  const supabase = await createClient()
  
  const validated = umkmSchema.parse(formData)

  const { error } = await supabase.from('umkms').insert(validated)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/umkm')
  return { success: true, message: 'UMKM berhasil ditambahkan' }
}

export async function updateUmkm(id: string, formData: FormData | UmkmFormData) {
  const supabase = await createClient()
  const validated = umkmSchema.parse(formData)

  const { error } = await supabase.from('umkms').update(validated).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/umkm')
  return { success: true, message: 'UMKM berhasil diperbarui' }
}

export async function deleteUmkm(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('umkms').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/umkm')
  return { success: true, message: 'UMKM berhasil dihapus' }
}
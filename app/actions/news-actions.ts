'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const newsSchema = z.object({
  judul: z.string().min(5, "Judul minimal 5 karakter"),
  slug: z.string().min(5),
  ringkasan: z.string().min(10),
  isi: z.string().min(20),
  thumbnail: z.string().optional(),
  tanggal: z.string().optional(),
  status_publish: z.boolean().default(true),
})

type NewsFormData = z.infer<typeof newsSchema>

export async function createNews(formData: FormData | NewsFormData) {
  const supabase = await createClient()
  const validated = newsSchema.parse(formData)

  const { error } = await supabase.from('news').insert(validated)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/news')
  return { success: true, message: 'Berita berhasil ditambahkan' }
}

export async function updateNews(id: string, formData: FormData | NewsFormData) {
  const supabase = await createClient()
  const validated = newsSchema.parse(formData)

  const { error } = await supabase.from('news').update(validated).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/news')
  return { success: true, message: 'Berita berhasil diperbarui' }
}

export async function deleteNews(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('news').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/news')
  return { success: true, message: 'Berita berhasil dihapus' }
}
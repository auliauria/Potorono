'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const residentSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama minimal 3 karakter"),
  nik: z.string().optional(),
  no_kk: z.string().optional(),
  jenis_kelamin: z.enum(['L', 'P']),
  tanggal_lahir: z.string(),
  rt: z.number().min(1).max(9),
  alamat: z.string().optional(),
  status_keluarga: z.string().optional(),
  pekerjaan: z.string().optional(),
  pendidikan: z.string().optional(),
  agama: z.string().optional(),
  is_ibu_hamil: z.boolean().default(false),
  is_disabilitas: z.boolean().default(false),
  keterangan: z.string().optional(),
})

export async function createResident(formData: FormData) {
  const supabase = await createClient()
  const rawData = Object.fromEntries(formData)
  const validated = residentSchema.parse({
    ...rawData,
    rt: Number(rawData.rt),
    is_ibu_hamil: rawData.is_ibu_hamil === 'true',
    is_disabilitas: rawData.is_disabilitas === 'true',
  })

  const { error } = await supabase.from('residents').insert(validated)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/residents')
  return { success: true, message: 'Penduduk berhasil ditambahkan' }
}

export async function updateResident(id: string, formData: FormData) {
  const supabase = await createClient()
  const rawData = Object.fromEntries(formData)
  const validated = residentSchema.parse({
    ...rawData,
    rt: Number(rawData.rt),
    is_ibu_hamil: rawData.is_ibu_hamil === 'true',
    is_disabilitas: rawData.is_disabilitas === 'true',
  })

  const { error } = await supabase.from('residents').update(validated).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/residents')
  return { success: true, message: 'Data berhasil diperbarui' }
}

export async function deleteResident(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('residents').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/residents')
  return { success: true, message: 'Data berhasil dihapus' }
}
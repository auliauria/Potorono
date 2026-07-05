import { z } from 'zod'

// Helper: konversi string 'true'/'false' atau boolean → boolean
const booleanField = z
  .union([z.boolean(), z.string()])
  .transform(val => val === true || val === 'true')

export const residentSchema = z.object({
  nama_lengkap: z.string().min(2, 'Nama minimal 2 karakter'),
  nik: z.string().nullable().optional(),
  no_kk: z.string().nullable().optional(),
  jenis_kelamin: z.enum(['L', 'P']),
  tanggal_lahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  rt: z.number().int().min(1).max(9),
  alamat: z.string().min(3, 'Alamat wajib diisi'),
  status_keluarga: z.string().nullable().optional(),
  pekerjaan: z.string().nullable().optional(),
  pendidikan: z.string().nullable().optional(),
  agama: z.string().nullable().optional(),
  is_ibu_hamil: z.boolean().default(false),
  is_disabilitas: z.boolean().default(false),
  keterangan: z.string().nullable().optional(),
})

export const umkmSchema = z.object({
  nama_umkm: z.string().min(2, 'Nama UMKM minimal 2 karakter'),
  foto_url: z.string().nullable().optional(),
  deskripsi: z.string().nullable().optional(),
  kategori: z.string().nullable().optional(),
  nama_pemilik: z.string().nullable().optional(),
  no_whatsapp: z.string().min(9, 'Nomor WA tidak valid'),
  alamat: z.string().nullable().optional(),
  // ✅ transform eksplisit → output selalu boolean
  status_aktif: booleanField.default(true),
})

export const newsSchema = z.object({
  judul: z.string().min(3, 'Judul minimal 3 karakter'),
  slug: z.string().min(3).regex(
    /^[a-z0-9-]+$/,
    'Slug hanya huruf kecil, angka, dan tanda hubung'
  ),
  thumbnail_url: z.string().nullable().optional(),
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  ringkasan: z.string().nullable().optional(),
  isi: z.string().nullable().optional(),
  // ✅ transform eksplisit → output selalu boolean
  status_publish: booleanField.default(false),
})

// Pakai z.infer untuk tipe OUTPUT (setelah transform)
export type ResidentInput = z.infer<typeof residentSchema>
export type UmkmInput = z.infer<typeof umkmSchema>
export type NewsInput = z.infer<typeof newsSchema>
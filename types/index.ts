export interface Resident {
  id: string
  nama_lengkap: string
  nik: string | null
  no_kk: string | null
  jenis_kelamin: 'L' | 'P'
  tanggal_lahir: string // ISO date string
  rt: number
  alamat: string
  status_keluarga: string | null
  pekerjaan: string | null
  pendidikan: string | null
  agama: string | null
  is_ibu_hamil: boolean
  is_disabilitas: boolean
  keterangan: string | null
  created_at: string
  updated_at: string
}

export interface Umkm {
  id: string
  nama_umkm: string
  foto_url: string | null
  deskripsi: string | null
  kategori: string | null
  nama_pemilik: string | null
  no_whatsapp: string
  alamat: string | null
  status_aktif: boolean
  created_at: string
  updated_at: string
}

export interface News {
  id: string
  judul: string
  slug: string
  thumbnail_url: string | null
  tanggal: string
  ringkasan: string | null
  isi: string | null
  status_publish: boolean
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  total: number
  laki: number
  perempuan: number
  lansia: number
  balita: number
  ibu_hamil: number
  disabilitas: number
  jumlah_kk: number
  per_rt: { rt: number; total: number }[]
}

export interface StatsCardData {
  label: string
  value: number
  icon: string
  color: string
}

export interface Profile {
  id: string
  email: string
  nama: string | null
  role: 'superadmin' | 'admin'
  is_active: boolean
  created_at: string
}
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { residentSchema } from '@/lib/validations'
import type { ResidentInput } from '@/lib/validations'
import { Resident } from '@/types'

interface ResidentFormProps {
  initial?: Resident | null
  onSubmit: (data: ResidentInput) => Promise<void>
  onCancel: () => void
  loading: boolean
}

const agamaOptions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']
const pendidikanOptions = ['Tidak Sekolah', 'SD', 'SMP', 'SMA/SMK', 'D3', 'S1', 'S2', 'S3']
const statusKeluargaOptions = ['Kepala Keluarga', 'Istri', 'Anak', 'Orang Tua', 'Lainnya']
const pekerjaanOptions = [
  'Tidak Bekerja', 'Petani', 'Pedagang', 'PNS', 'TNI/Polri',
  'Karyawan Swasta', 'Wiraswasta', 'Pelajar/Mahasiswa', 'Ibu Rumah Tangga', 'Lainnya',
]

function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}{' '}
        {required
          ? <span className="text-red-400">*</span>
          : <span className="text-gray-300">(opsional)</span>
        }
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-all'

export default function ResidentForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: ResidentFormProps) {
  // ✅ Eksplisit generic <ResidentInput> pada useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResidentInput>({
    resolver: zodResolver(residentSchema),
    // ✅ defaultValues lengkap dengan semua boolean eksplisit
    defaultValues: {
      nama_lengkap: '',
      nik: '',
      no_kk: '',
      jenis_kelamin: 'L',
      tanggal_lahir: '',
      rt: 1,
      alamat: '',
      status_keluarga: '',
      pekerjaan: '',
      pendidikan: '',
      agama: '',
      is_ibu_hamil: false,
      is_disabilitas: false,
      keterangan: '',
    },
  })

  useEffect(() => {
    if (initial) {
      reset({
        nama_lengkap: initial.nama_lengkap,
        nik: initial.nik ?? '',
        no_kk: initial.no_kk ?? '',
        jenis_kelamin: initial.jenis_kelamin,
        tanggal_lahir: initial.tanggal_lahir,
        rt: initial.rt,
        alamat: initial.alamat,
        status_keluarga: initial.status_keluarga ?? '',
        pekerjaan: initial.pekerjaan ?? '',
        pendidikan: initial.pendidikan ?? '',
        agama: initial.agama ?? '',
        is_ibu_hamil: initial.is_ibu_hamil,
        is_disabilitas: initial.is_disabilitas,
        keterangan: initial.keterangan ?? '',
      })
    }
  }, [initial, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Data Utama */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Data Utama
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <FormField label="Nama Lengkap" error={errors.nama_lengkap?.message} required>
              <input
                {...register('nama_lengkap')}
                className={inputClass}
                placeholder="Masukkan nama lengkap"
              />
            </FormField>
          </div>

          <FormField label="NIK" error={errors.nik?.message}>
            <input
              {...register('nik')}
              className={inputClass}
              placeholder="16 digit NIK"
              maxLength={16}
            />
          </FormField>

          <FormField label="No. KK" error={errors.no_kk?.message}>
            <input
              {...register('no_kk')}
              className={inputClass}
              placeholder="16 digit No. KK"
              maxLength={16}
            />
          </FormField>

          <FormField label="Jenis Kelamin" error={errors.jenis_kelamin?.message} required>
            <select {...register('jenis_kelamin')} className={inputClass}>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </FormField>

          <FormField label="Tanggal Lahir" error={errors.tanggal_lahir?.message} required>
            <input {...register('tanggal_lahir')} type="date" className={inputClass} />
          </FormField>

          <FormField label="RT" error={errors.rt?.message} required>
            <select {...register('rt', { valueAsNumber: true })} className={inputClass}>
              {Array.from({ length: 9 }, (_, i) => i + 1).map(rt => (
                <option key={rt} value={rt}>RT {rt}</option>
              ))}
            </select>
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Alamat" error={errors.alamat?.message} required>
              <textarea
                {...register('alamat')}
                rows={2}
                className={inputClass}
                placeholder="Alamat lengkap"
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Data Tambahan */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Data Tambahan
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Status Keluarga" error={errors.status_keluarga?.message}>
            <select {...register('status_keluarga')} className={inputClass}>
              <option value="">Pilih status</option>
              {statusKeluargaOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </FormField>

          <FormField label="Pekerjaan" error={errors.pekerjaan?.message}>
            <select {...register('pekerjaan')} className={inputClass}>
              <option value="">Pilih pekerjaan</option>
              {pekerjaanOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </FormField>

          <FormField label="Pendidikan Terakhir" error={errors.pendidikan?.message}>
            <select {...register('pendidikan')} className={inputClass}>
              <option value="">Pilih pendidikan</option>
              {pendidikanOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </FormField>

          <FormField label="Agama" error={errors.agama?.message}>
            <select {...register('agama')} className={inputClass}>
              <option value="">Pilih agama</option>
              {agamaOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Keterangan" error={errors.keterangan?.message}>
              <textarea
                {...register('keterangan')}
                rows={2}
                className={inputClass}
                placeholder="Keterangan tambahan (opsional)"
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Status Khusus */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Status Khusus
        </p>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              {...register('is_ibu_hamil')}
              className="w-4 h-4 rounded accent-[#1B4332]"
            />
            <span className="text-sm text-gray-700">Ibu Hamil</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              {...register('is_disabilitas')}
              className="w-4 h-4 rounded accent-[#1B4332]"
            />
            <span className="text-sm text-gray-700">Penyandang Disabilitas</span>
          </label>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          * Status lansia dan balita dihitung otomatis dari tanggal lahir.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm text-gray-600 border border-gray-200
            hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#1B4332] text-white
            hover:bg-[#2D6A4F] transition-colors disabled:opacity-60"
        >
          {loading ? 'Menyimpan...' : initial ? 'Simpan Perubahan' : 'Tambah Penduduk'}
        </button>
      </div>
    </form>
  )
}
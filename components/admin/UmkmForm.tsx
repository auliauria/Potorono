'use client'

import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { umkmSchema } from '@/lib/validations'
import type { UmkmInput } from '@/lib/validations'
import type { Umkm } from '@/types'
import { Upload, Store, MapPin } from 'lucide-react'
import Image from 'next/image'

const kategoriOptions = [
  'Kuliner', 'Kerajinan', 'Fashion', 'Pertanian',
  'Jasa', 'Perdagangan', 'Lainnya',
]

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20 ' +
  'focus:border-[#0B3D2E] transition-all bg-white'

interface UmkmFormProps {
  initial?: Umkm | null
  onSubmit: (data: UmkmInput) => Promise<void>
  onCancel: () => void
  loading: boolean
}

export default function UmkmForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: UmkmFormProps) {
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initial?.foto_url ?? null
  )
  const initializedRef = useRef(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UmkmInput>({
    resolver: zodResolver(umkmSchema),
    defaultValues: {
      nama_umkm: initial?.nama_umkm ?? '',
      foto_url: initial?.foto_url ?? '',
      deskripsi: initial?.deskripsi ?? '',
      kategori: initial?.kategori ?? '',
      nama_pemilik: initial?.nama_pemilik ?? '',
      no_whatsapp: initial?.no_whatsapp ?? '',
      alamat: initial?.alamat ?? '',
      maps_url: initial?.maps_url ?? '',
      status_aktif: initial?.status_aktif ?? true,
    },
  })

  useEffect(() => {
    if (initial && !initializedRef.current) {
      initializedRef.current = true
      reset({
        nama_umkm: initial.nama_umkm,
        foto_url: initial.foto_url ?? '',
        deskripsi: initial.deskripsi ?? '',
        kategori: initial.kategori ?? '',
        nama_pemilik: initial.nama_pemilik ?? '',
        no_whatsapp: initial.no_whatsapp,
        alamat: initial.alamat ?? '',
        maps_url: initial.maps_url ?? '',
        status_aktif: initial.status_aktif,
      })
    }
  }, [initial, reset])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Ukuran file terlalu besar. Maksimal 2MB.')
      e.target.value = ''
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Format tidak didukung. Gunakan JPG, PNG, atau WEBP.')
      e.target.value = ''
      return
    }

    setUploadLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok || json.error) {
        setUploadError(`Upload gagal: ${json.error ?? 'Terjadi kesalahan.'}`)
        e.target.value = ''
        return
      }
      if (json.url) {
        setValue('foto_url', json.url)
        setPreviewUrl(json.url)
      }
    } catch {
      setUploadError('Upload gagal. Periksa koneksi internet.')
    } finally {
      setUploadLoading(false)
      e.target.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Upload Foto */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Foto UMKM{' '}
          <span className="text-gray-300 font-normal">(opsional)</span>
        </label>
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-xl border-2 border-dashed
            border-gray-200 overflow-hidden flex items-center justify-center
            bg-gray-50 shrink-0">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="preview"
                width={96}
                height={96}
                unoptimized
                className="object-cover w-full h-full"
              />
            ) : (
              <Store size={28} className="text-gray-300" />
            )}
          </div>
          <div>
            <label className="inline-flex items-center gap-2 px-4 py-2
              rounded-xl border border-gray-200 text-sm text-gray-600
              cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload size={14} />
              {uploadLoading ? 'Mengunggah...' : 'Pilih Foto'}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploadLoading}
              />
            </label>
            <p className="text-xs text-gray-400 mt-1.5">
              JPG, PNG, WEBP. Maks 2MB.
            </p>
            {uploadError && (
              <p className="text-xs text-red-500 mt-1">{uploadError}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Nama UMKM */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Nama UMKM <span className="text-red-400">*</span>
          </label>
          <input
            {...register('nama_umkm')}
            className={inputClass}
            placeholder="Nama usaha"
          />
          {errors.nama_umkm && (
            <p className="text-red-500 text-xs mt-1">
              {errors.nama_umkm.message}
            </p>
          )}
        </div>

        {/* Nama Pemilik */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Nama Pemilik
          </label>
          <input
            {...register('nama_pemilik')}
            className={inputClass}
            placeholder="Nama pemilik"
          />
        </div>

        {/* No WA */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            No. WhatsApp <span className="text-red-400">*</span>
          </label>
          <input
            {...register('no_whatsapp')}
            className={inputClass}
            placeholder="08xxxxxxxxxx"
          />
          {errors.no_whatsapp && (
            <p className="text-red-500 text-xs mt-1">
              {errors.no_whatsapp.message}
            </p>
          )}
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Kategori
          </label>
          <select {...register('kategori')} className={inputClass}>
            <option value="">Pilih kategori</option>
            {kategoriOptions.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Status
          </label>
          <select {...register('status_aktif')} className={inputClass}>
            <option value="true">Aktif</option>
            <option value="false">Tidak Aktif</option>
          </select>
        </div>

        {/* Alamat */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Alamat
          </label>
          <input
            {...register('alamat')}
            className={inputClass}
            placeholder="Alamat usaha"
          />
        </div>

        {/* ✅ Link Google Maps */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={12} className="text-red-400" />
              Link Google Maps
              <span className="text-gray-300 font-normal">(opsional)</span>
            </span>
          </label>
          <input
            {...register('maps_url')}
            className={inputClass}
            placeholder="https://maps.app.goo.gl/..."
            type="url"
          />
          <p className="text-xs text-gray-400 mt-1">
            Buka Google Maps → bagikan lokasi → salin link
          </p>
          {errors.maps_url && (
            <p className="text-red-500 text-xs mt-1">
              {errors.maps_url.message}
            </p>
          )}
        </div>

        {/* Deskripsi */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Deskripsi
          </label>
          <textarea
            {...register('deskripsi')}
            rows={3}
            className={inputClass}
            placeholder="Deskripsi singkat usaha..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm text-gray-600 border
            border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading || uploadLoading}
          className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[#0B3D2E]
            text-white hover:bg-[#1B5E42] transition-colors disabled:opacity-60"
        >
          {loading
            ? 'Menyimpan...'
            : initial
              ? 'Simpan Perubahan'
              : 'Tambah UMKM'}
        </button>
      </div>
    </form>
  )
}
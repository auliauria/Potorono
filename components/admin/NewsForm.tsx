'use client'

import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newsSchema } from '@/lib/validations'
import type { NewsInput } from '@/lib/validations'
import type { News } from '@/types'
import { Upload, Newspaper } from 'lucide-react'
import Image from 'next/image'

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20 focus:border-[#0B3D2E] transition-all'

interface NewsFormProps {
  initial?: News | null
  onSubmit: (data: NewsInput) => Promise<void>
  onCancel: () => void
  loading: boolean
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default function NewsForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: NewsFormProps) {
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // ✅ Inisialisasi langsung dari initial — tidak set di useEffect
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initial?.thumbnail_url ?? null
  )

  const initializedRef = useRef(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NewsInput>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      judul: initial?.judul ?? '',
      slug: initial?.slug ?? '',
      thumbnail_url: initial?.thumbnail_url ?? '',
      tanggal: initial?.tanggal ?? new Date().toISOString().split('T')[0],
      ringkasan: initial?.ringkasan ?? '',
      isi: initial?.isi ?? '',
      status_publish: initial?.status_publish ?? false,
    },
  })

  // ✅ Reset form saat initial berubah — tanpa setState di dalam body effect
  useEffect(() => {
    if (initial && !initializedRef.current) {
      initializedRef.current = true
      reset({
        judul: initial.judul,
        slug: initial.slug,
        thumbnail_url: initial.thumbnail_url ?? '',
        tanggal: initial.tanggal,
        ringkasan: initial.ringkasan ?? '',
        isi: initial.isi ?? '',
        status_publish: initial.status_publish,
      })
      // ✅ setPreviewUrl dipanggil dalam setTimeout agar keluar dari synchronous effect body
      setTimeout(() => {
        setPreviewUrl(initial.thumbnail_url ?? null)
      }, 0)
    }
  }, [initial, reset])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Ukuran file terlalu besar. Maksimal 10MB.')
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
        setValue('thumbnail_url', json.url)
        setPreviewUrl(json.url)
      }
    } catch {
      setUploadError('Upload gagal. Periksa koneksi internet.')
    } finally {
      setUploadLoading(false)
      e.target.value = ''
    }
  }

  function handleJudulChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!initial) {
      setValue('slug', slugify(e.target.value))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Thumbnail */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Thumbnail{' '}
          <span className="text-gray-300 font-normal">(opsional)</span>
        </label>
        <div className="flex items-start gap-4">
          <div className="w-24 h-16 rounded-xl border-2 border-dashed border-gray-200
            overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="preview"
                width={96}
                height={64}
                unoptimized
                className="object-cover w-full h-full"
              />
            ) : (
              <Newspaper size={24} className="text-gray-300" />
            )}
          </div>
          <div>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl
              border border-gray-200 text-sm text-gray-600 cursor-pointer
              hover:bg-gray-50 transition-colors">
              <Upload size={14} />
              {uploadLoading ? 'Mengunggah...' : 'Pilih Gambar'}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploadLoading}
              />
            </label>
            {uploadError && (
              <p className="text-xs text-red-500 mt-1">{uploadError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Judul */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Judul <span className="text-red-400">*</span>
        </label>
        <input
          {...register('judul')}
          onChange={e => {
            register('judul').onChange(e)
            handleJudulChange(e)
          }}
          className={inputClass}
          placeholder="Judul berita atau kegiatan"
        />
        {errors.judul && (
          <p className="text-red-500 text-xs mt-1">{errors.judul.message}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Slug <span className="text-red-400">*</span>
        </label>
        <input
          {...register('slug')}
          className={inputClass}
          placeholder="url-berita-ini"
        />
        {errors.slug && (
          <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Tanggal <span className="text-red-400">*</span>
          </label>
          <input type="date" {...register('tanggal')} className={inputClass} />
          {errors.tanggal && (
            <p className="text-red-500 text-xs mt-1">{errors.tanggal.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
          <select {...register('status_publish')} className={inputClass}>
            <option value="false">Draft</option>
            <option value="true">Tayang</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Ringkasan</label>
        <textarea
          {...register('ringkasan')}
          rows={2}
          className={inputClass}
          placeholder="Ringkasan singkat berita..."
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Isi Berita</label>
        <textarea
          {...register('isi')}
          rows={5}
          className={inputClass}
          placeholder="Isi lengkap berita atau laporan kegiatan..."
        />
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
          {loading ? 'Menyimpan...' : initial ? 'Simpan Perubahan' : 'Tambah Berita'}
        </button>
      </div>
    </form>
  )
}
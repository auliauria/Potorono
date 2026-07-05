'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, X } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import UmkmForm from '@/components/admin/UmkmForm'
import { Umkm } from '@/types'
import { UmkmInput } from '@/lib/validations'
import Image from 'next/image'

export default function UmkmPage() {
  const [umkmList, setUmkmList] = useState<Umkm[]>([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Umkm | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchUmkm = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/umkm')
    const json = await res.json()
    setUmkmList(json.data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    // call async fetch on next tick to avoid setting state synchronously inside effect
    const t = setTimeout(() => { void fetchUmkm() }, 0)
    return () => clearTimeout(t)
  }, [fetchUmkm])

  // Di app/admin/umkm/page.tsx — update fungsi handleSubmit
async function handleSubmit(data: UmkmInput) {
  setFormLoading(true)
  const url = editing ? `/api/umkm/${editing.id}` : '/api/umkm'
  const method = editing ? 'PUT' : 'POST'

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const json = await res.json()

    if (!res.ok) {
      console.error('Submit error:', json)
      alert(`Gagal menyimpan: ${json.error ?? 'Terjadi kesalahan'}`)
      return
    }

    setShowForm(false)
    setEditing(null)
    fetchUmkm()
  } catch (err) {
    console.error('Network error:', err)
    alert('Gagal menyimpan. Periksa koneksi internet.')
  } finally {
    setFormLoading(false)
  }
}

  async function handleDelete(umkm: Umkm) {
    if (!confirm(`Hapus UMKM "${umkm.nama_umkm}"?`)) return
    setDeleting(umkm.id)
    await fetch(`/api/umkm/${umkm.id}`, { method: 'DELETE' })
    fetchUmkm()
    setDeleting(null)
  }

  const columns = [
    {
      key: 'foto',
      label: 'Foto',
      render: (r: Umkm) => (
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {r.foto_url
            ? <Image src={r.foto_url} alt={r.nama_umkm} width={40} height={40} className="object-cover" />
            : <span className="text-lg">🏪</span>}
        </div>
      ),
    },
    { key: 'nama_umkm', label: 'Nama UMKM' },
    { key: 'kategori', label: 'Kategori' },
    { key: 'nama_pemilik', label: 'Pemilik' },
    { key: 'no_whatsapp', label: 'WhatsApp' },
    {
      key: 'status_aktif',
      label: 'Status',
      render: (r: Umkm) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          r.status_aktif ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
        }`}>
          {r.status_aktif ? 'Aktif' : 'Tidak Aktif'}
        </span>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data UMKM</h1>
          <p className="text-gray-500 text-sm mt-0.5">{umkmList.length} UMKM terdaftar</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1B4332] text-white
            rounded-xl text-sm font-medium hover:bg-[#2D6A4F] transition-colors"
        >
          <Plus size={16} /> Tambah
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/40 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-800">
                {editing ? 'Edit UMKM' : 'Tambah UMKM Baru'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null) }}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <UmkmForm
              initial={editing}
              onSubmit={handleSubmit}
              onCancel={() => { setShowForm(false); setEditing(null) }}
              loading={formLoading}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={umkmList}
          keyField="id"
          onEdit={r => { setEditing(r); setShowForm(true) }}
          onDelete={handleDelete}
          isDeleting={deleting}
        />
      )}
    </div>
  )
}
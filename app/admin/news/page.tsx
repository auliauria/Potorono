'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, X } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import NewsForm from '@/components/admin/NewsForm'
import { News } from '@/types'
import { NewsInput } from '@/lib/validations'

export default function NewsPage() {
  const [newsList, setNewsList] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<News | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchNews = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/news')
    const json = await res.json()
    setNewsList(json.data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    ;(async () => { await fetchNews() })()
  }, [fetchNews])

  // Di app/admin/news/page.tsx — update fungsi handleSubmit yang sama
async function handleSubmit(data: NewsInput) {
  setFormLoading(true)
  const url = editing ? `/api/news/${editing.id}` : '/api/news'
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
    fetchNews()
  } catch (err) {
    console.error('Network error:', err)
    alert('Gagal menyimpan. Periksa koneksi internet.')
  } finally {
    setFormLoading(false)
  }
}

  async function handleDelete(item: News) {
    if (!confirm(`Hapus berita "${item.judul}"?`)) return
    setDeleting(item.id)
    await fetch(`/api/news/${item.id}`, { method: 'DELETE' })
    fetchNews()
    setDeleting(null)
  }

  const columns = [
    { key: 'judul', label: 'Judul' },
    {
      key: 'tanggal',
      label: 'Tanggal',
      render: (r: News) =>
        new Date(r.tanggal).toLocaleDateString('id-ID', {
          day: 'numeric', month: 'short', year: 'numeric',
        }),
    },
    {
      key: 'status_publish',
      label: 'Status',
      render: (r: News) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          r.status_publish ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
        }`}>
          {r.status_publish ? 'Tayang' : 'Draft'}
        </span>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Berita & Kegiatan</h1>
          <p className="text-gray-500 text-sm mt-0.5">{newsList.length} berita</p>
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-800">
                {editing ? 'Edit Berita' : 'Tambah Berita Baru'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null) }}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <NewsForm
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
          data={newsList}
          keyField="id"
          onEdit={r => { setEditing(r); setShowForm(true) }}
          onDelete={handleDelete}
          isDeleting={deleting}
        />
      )}
    </div>
  )
}
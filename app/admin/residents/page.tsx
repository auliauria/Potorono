'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, X } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import ResidentForm from '@/components/admin/ResidentForm'
import { Resident } from '@/types'
import { ResidentInput } from '@/lib/validations'
import { calculateAge } from '@/lib/utils'

const PAGE_SIZE = 20

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Resident | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [filterRT, setFilterRT] = useState<string>('')
  const [search, setSearch] = useState('')

  const fetchResidents = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
    })
    if (filterRT) params.set('rt', filterRT)

    const res = await fetch(`/api/residents?${params}`)
    const json = await res.json()
    setResidents(json.data || [])
    setTotal(json.total || 0)
    setLoading(false)
  }, [page, filterRT])

  useEffect(() => {
    const loadResidents = async () => {
      await fetchResidents()
    }
    void loadResidents()
  }, [fetchResidents])

  async function handleSubmit(data: ResidentInput) {
    setFormLoading(true)
    const url = editing ? `/api/residents/${editing.id}` : '/api/residents'
    const method = editing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      setShowForm(false)
      setEditing(null)
      fetchResidents()
    }
    setFormLoading(false)
  }

  async function handleDelete(resident: Resident) {
    if (!confirm(`Hapus data ${resident.nama_lengkap}?`)) return
    setDeleting(resident.id)
    await fetch(`/api/residents/${resident.id}`, { method: 'DELETE' })
    fetchResidents()
    setDeleting(null)
  }

  const filtered = search
    ? residents.filter(r =>
        r.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
        (r.nik && r.nik.includes(search))
      )
    : residents

  const columns = [
    { key: 'nama_lengkap', label: 'Nama' },
    {
      key: 'jenis_kelamin',
      label: 'JK',
      render: (r: Resident) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          r.jenis_kelamin === 'L'
            ? 'bg-blue-50 text-blue-600'
            : 'bg-pink-50 text-pink-600'
        }`}>
          {r.jenis_kelamin === 'L' ? 'L' : 'P'}
        </span>
      ),
    },
    {
      key: 'tanggal_lahir',
      label: 'Umur',
      render: (r: Resident) => `${calculateAge(r.tanggal_lahir)} th`,
    },
    { key: 'rt', label: 'RT', render: (r: Resident) => `RT ${r.rt}` },
    {
      key: 'status',
      label: 'Status',
      render: (r: Resident) => (
        <div className="flex gap-1">
          {r.is_ibu_hamil && (
            <span className="px-1.5 py-0.5 bg-rose-50 text-rose-500 rounded text-xs">Hamil</span>
          )}
          {r.is_disabilitas && (
            <span className="px-1.5 py-0.5 bg-teal-50 text-teal-500 rounded text-xs">Disab.</span>
          )}
          {calculateAge(r.tanggal_lahir) >= 60 && (
            <span className="px-1.5 py-0.5 bg-purple-50 text-purple-500 rounded text-xs">Lansia</span>
          )}
          {calculateAge(r.tanggal_lahir) < 5 && (
            <span className="px-1.5 py-0.5 bg-orange-50 text-orange-500 rounded text-xs">Balita</span>
          )}
        </div>
      ),
    },
  ]

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Penduduk</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} penduduk terdaftar</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1B4332] text-white
            rounded-xl text-sm font-medium hover:bg-[#2D6A4F] transition-colors"
        >
          <Plus size={16} />
          Tambah
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/40 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-800">
                {editing ? 'Edit Data Penduduk' : 'Tambah Penduduk Baru'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditing(null) }}>
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <ResidentForm
              initial={editing}
              onSubmit={handleSubmit}
              onCancel={() => { setShowForm(false); setEditing(null) }}
              loading={formLoading}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama atau NIK..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
          />
        </div>
        <select
          value={filterRT}
          onChange={e => { setFilterRT(e.target.value); setPage(1) }}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm
            focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
        >
          <option value="">Semua RT</option>
          {Array.from({ length: 9 }, (_, i) => i + 1).map(rt => (
            <option key={rt} value={rt}>RT {rt}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-[#1B4332] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyField="id"
          onEdit={r => { setEditing(r); setShowForm(true) }}
          onDelete={handleDelete}
          isDeleting={deleting}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-gray-500">
            Halaman {page} dari {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-xl text-sm border border-gray-200 disabled:opacity-40
                hover:bg-gray-50 transition-colors"
            >
              Sebelumnya
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-xl text-sm border border-gray-200 disabled:opacity-40
                hover:bg-gray-50 transition-colors"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
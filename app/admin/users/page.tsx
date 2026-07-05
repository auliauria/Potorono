'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Shield, ShieldOff, UserCheck, UserX,
  Users, Loader2, AlertTriangle,
} from 'lucide-react'

interface Profile {
  id: string
  email: string
  nama: string | null
  role: 'superadmin' | 'admin'
  is_active: boolean
  created_at: string
}

interface ApiResponse {
  profiles: Profile[]
  current: Profile
}

export default function UsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      if (res.status === 403) {
        setForbidden(true)
        setLoading(false)
        return
      }
      const json: ApiResponse = await res.json()
      setProfiles(json.profiles || [])
      setCurrentProfile(json.current || null)
    } catch (e) {
      console.error('fetch users error:', e)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    async function loadData() {
      await fetchData()
    }
    void loadData()
  }, [fetchData])

  async function toggleActive(profile: Profile) {
  if (profile.id === currentProfile?.id) return
  setActionLoading(profile.id)

  const res = await fetch(`/api/users?id=${profile.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active: !profile.is_active }),
  })

  const json = await res.json()
  console.log('toggleActive result:', json)

  await fetchData()
  setActionLoading(null)
}

async function toggleRole(profile: Profile) {
  if (profile.id === currentProfile?.id) return
  setActionLoading(`${profile.id}_role`)

  const res = await fetch(`/api/users?id=${profile.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      role: profile.role === 'superadmin' ? 'admin' : 'superadmin',
    }),
  })

  const json = await res.json()
  console.log('toggleRole result:', json)

  await fetchData()
  setActionLoading(`${profile.id}_role`)
  setActionLoading(null)
}

  if (forbidden) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Shield size={40} className="text-gray-200" />
        <p className="text-gray-500 text-sm">Halaman ini hanya untuk superadmin.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={24} className="text-[#0B3D2E] animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Kelola akses dan role admin Dusun Potorono.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-[#0B3D2E]/5 border
        border-[#0B3D2E]/10 rounded-2xl mb-6">
        <AlertTriangle size={14} className="text-[#0B3D2E] shrink-0 mt-0.5" />
        <div className="text-xs text-[#0B3D2E]/80 leading-relaxed space-y-0.5">
          <p className="font-semibold">Panduan manajemen akun:</p>
          <p>• <b>Aktifkan</b> akun admin baru agar bisa login.</p>
          <p>• <b>Nonaktifkan</b> untuk mencabut akses sementara.</p>
          <p>• <b>Ubah role</b> untuk naik/turun antara Admin dan Superadmin.</p>
          <p>• Akun yang sedang aktif login tidak dapat diubah sendiri.</p>
        </div>
      </div>

      {profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white
          rounded-2xl border border-gray-100">
          <Users size={32} className="text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">Belum ada pengguna terdaftar.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100
            shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Pengguna', 'Role', 'Status', 'Terdaftar', 'Aksi'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-xs font-semibold text-gray-500
                        uppercase tracking-wider ${i === 4 ? 'text-right' : 'text-left'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {profiles.map(profile => {
                  const isSelf = profile.id === currentProfile?.id
                  const isActioning = actionLoading === profile.id
                  const isRoleActioning = actionLoading === `${profile.id}_role`

                  return (
                    <tr key={profile.id} className="hover:bg-gray-50/40 transition-colors">
                      {/* Pengguna */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0B3D2E]/10
                            flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-[#0B3D2E]">
                              {(profile.nama || profile.email)
                                .charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 flex items-center gap-1.5">
                              {profile.nama || '-'}
                              {isSelf && (
                                <span className="px-1.5 py-0.5 bg-gray-100
                                  text-gray-400 rounded text-xs font-normal">
                                  Anda
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {profile.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1
                          rounded-full text-xs font-semibold ${
                            profile.role === 'superadmin'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-blue-50 text-blue-600'
                          }`}>
                          <Shield size={10} />
                          {profile.role === 'superadmin' ? 'Superadmin' : 'Admin'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1
                          rounded-full text-xs font-semibold ${
                            profile.is_active
                              ? 'bg-green-50 text-green-600'
                              : 'bg-amber-50 text-amber-600'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            profile.is_active ? 'bg-green-500' : 'bg-amber-400'
                          }`} />
                          {profile.is_active ? 'Aktif' : 'Menunggu Aktivasi'}
                        </span>
                      </td>

                      {/* Terdaftar */}
                      <td className="px-5 py-4 text-xs text-gray-400">
                        {new Date(profile.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>

                      {/* Aksi */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleActive(profile)}
                            disabled={isSelf || isActioning}
                            title={profile.is_active
                              ? 'Nonaktifkan akun'
                              : 'Aktifkan akun'}
                            className={`flex items-center gap-1.5 px-3 py-1.5
                              rounded-lg text-xs font-medium transition-all
                              disabled:opacity-30 disabled:cursor-not-allowed ${
                                profile.is_active
                                  ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                  : 'text-green-600 bg-green-50 hover:bg-green-100'
                              }`}
                          >
                            {isActioning
                              ? <Loader2 size={12} className="animate-spin" />
                              : profile.is_active
                                ? <><UserX size={12} /> Nonaktifkan</>
                                : <><UserCheck size={12} /> Aktifkan</>
                            }
                          </button>

                          <button
                            onClick={() => toggleRole(profile)}
                            disabled={isSelf || isRoleActioning}
                            title={profile.role === 'superadmin'
                              ? 'Jadikan Admin'
                              : 'Jadikan Superadmin'}
                            className="flex items-center gap-1.5 px-3 py-1.5
                              rounded-lg text-xs font-medium text-purple-600
                              bg-purple-50 hover:bg-purple-100 transition-all
                              disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            {isRoleActioning
                              ? <Loader2 size={12} className="animate-spin" />
                              : profile.role === 'superadmin'
                                ? <><ShieldOff size={12} /> Jadikan Admin</>
                                : <><Shield size={12} /> Jadikan Superadmin</>
                            }
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {profiles.map(profile => {
              const isSelf = profile.id === currentProfile?.id
              return (
                <div key={profile.id} className="bg-white rounded-2xl border
                  border-gray-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#0B3D2E]/10
                        flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-[#0B3D2E]">
                          {(profile.nama || profile.email)
                            .charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {profile.nama || '-'}
                          {isSelf && (
                            <span className="ml-1 text-xs text-gray-400">(Anda)</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400">{profile.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5
                      rounded-full text-xs font-semibold ${
                        profile.role === 'superadmin'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-blue-50 text-blue-600'
                      }`}>
                      <Shield size={9} />
                      {profile.role === 'superadmin' ? 'Superadmin' : 'Admin'}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5
                      rounded-full text-xs font-semibold ${
                        profile.is_active
                          ? 'bg-green-50 text-green-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        profile.is_active ? 'bg-green-500' : 'bg-amber-400'
                      }`} />
                      {profile.is_active ? 'Aktif' : 'Menunggu'}
                    </span>
                  </div>

                  {!isSelf && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(profile)}
                        disabled={actionLoading === profile.id}
                        className={`flex-1 flex items-center justify-center gap-1.5
                          py-2 rounded-xl text-xs font-medium transition-all ${
                            profile.is_active
                              ? 'text-red-500 bg-red-50 hover:bg-red-100'
                              : 'text-green-600 bg-green-50 hover:bg-green-100'
                          }`}
                      >
                        {actionLoading === profile.id
                          ? <Loader2 size={12} className="animate-spin" />
                          : profile.is_active
                            ? <><UserX size={12} /> Nonaktifkan</>
                            : <><UserCheck size={12} /> Aktifkan</>
                        }
                      </button>
                      <button
                        onClick={() => toggleRole(profile)}
                        disabled={actionLoading === `${profile.id}_role`}
                        className="flex-1 flex items-center justify-center gap-1.5
                          py-2 rounded-xl text-xs font-medium text-purple-600
                          bg-purple-50 hover:bg-purple-100 transition-all"
                      >
                        {actionLoading === `${profile.id}_role`
                          ? <Loader2 size={12} className="animate-spin" />
                          : profile.role === 'superadmin'
                            ? <><ShieldOff size={12} /> Jadikan Admin</>
                            : <><Shield size={12} /> Jadikan Superadmin</>
                        }
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
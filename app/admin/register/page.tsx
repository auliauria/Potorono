'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Eye, EyeOff, AlertTriangle,
  CheckCircle2, Loader2,
} from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({
    nama: '', email: '', password: '', confirm: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.nama.trim()) {
      setError('Nama lengkap wajib diisi.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Konfirmasi password tidak cocok.')
      return
    }
    if (form.password.length < 8) {
      setError('Password minimal 8 karakter.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
          nama: form.nama.trim(),
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? 'Pendaftaran gagal. Coba lagi.')
        return
      }

      setSuccess(true)
    } catch {
      setError('Gagal terhubung ke server. Periksa koneksi internet.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20 ' +
    'focus:border-[#0B3D2E] transition-all bg-white'

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F5EE] flex items-center
        justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl p-8 shadow-sm border
            border-gray-100 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center
              justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg mb-2">
              Pendaftaran Berhasil!
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Akun <span className="font-medium text-gray-700">{form.email}</span> telah
              dibuat. Silakan tunggu aktivasi dari superadmin sebelum bisa login.
            </p>
            <Link
              href="/admin/login"
              className="block w-full py-2.5 rounded-xl bg-[#0B3D2E] text-white
                text-sm font-medium hover:bg-[#1B5E42] transition-colors text-center"
            >
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex items-center
      justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#0B3D2E] flex items-center
            justify-center mx-auto mb-3">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <h1 className="text-xl font-bold text-[#0B3D2E]">Dusun Potorono</h1>
          <p className="text-gray-500 text-sm mt-1">Daftar Akun Admin</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Warning */}
          <div className="flex items-start gap-2.5 p-3 bg-amber-50 border
            border-amber-100 rounded-xl mb-5">
            <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-amber-700 text-xs leading-relaxed">
              Akun baru perlu diaktifkan oleh superadmin sebelum bisa digunakan
              untuk login.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Nama */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Nama Lengkap <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.nama}
                onChange={e => setForm({ ...form, nama: e.target.value })}
                required
                placeholder="Nama lengkap"
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                placeholder="email@example.com"
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  placeholder="Min. 8 karakter"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi password */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Konfirmasi Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  required
                  placeholder="Ulangi password"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Match indicator */}
              {form.confirm.length > 0 && (
                <p className={`text-xs mt-1.5 flex items-center gap-1 ${
                  form.password === form.confirm
                    ? 'text-green-600'
                    : 'text-red-400'
                }`}>
                  {form.password === form.confirm
                    ? <><CheckCircle2 size={11} /> Password cocok</>
                    : <><AlertTriangle size={11} /> Password tidak cocok</>
                  }
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 px-3.5 py-2.5 bg-red-50
                border border-red-100 rounded-xl">
                <AlertTriangle size={13} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-600 text-xs leading-relaxed">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5
                rounded-xl bg-[#0B3D2E] text-white text-sm font-medium
                hover:bg-[#1B5E42] transition-colors disabled:opacity-60
                disabled:cursor-not-allowed"
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Mendaftar...</>
                : 'Daftar Sekarang'
              }
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Sudah punya akun?{' '}
          <Link
            href="/admin/login"
            className="text-[#0B3D2E] hover:underline font-medium"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
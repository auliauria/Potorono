'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, AlertTriangle, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inactiveError = searchParams.get('error') === 'inactive'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email atau password salah.')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#0B3D2E] flex items-center
            justify-center mx-auto mb-3">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <h1 className="text-xl font-bold text-[#0B3D2E]">Dusun Potorono</h1>
          <p className="text-gray-500 text-sm mt-1">Panel Admin</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Masuk ke Akun Admin</h2>

          {/* Pesan inactive */}
          {inactiveError && (
            <div className="flex items-start gap-2.5 p-3 bg-amber-50 border
              border-amber-100 rounded-xl mb-4">
              <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-amber-700 text-xs leading-relaxed">
                Akun kamu belum diaktifkan oleh superadmin.
                Silakan hubungi admin dusun.
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@potorono.id"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm
                  focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20
                  focus:border-[#0B3D2E] transition-all"
              />
            </div>

            {/* Password + toggle */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200
                    text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]/20
                    focus:border-[#0B3D2E] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                    hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-50
                border border-red-100 rounded-xl">
                <AlertTriangle size={13} className="text-red-400 shrink-0" />
                <p className="text-red-600 text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                bg-[#0B3D2E] text-white text-sm font-medium hover:bg-[#1B5E42]
                transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white
                    rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <ShieldCheck size={15} />
                  Masuk
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-xs text-gray-400">atau</span>
              </div>
            </div>

            <Link
              href="/admin/register"
              className="block w-full py-2.5 rounded-xl text-sm font-medium text-center
                border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Daftar Akun Admin Baru
            </Link>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          <Link href="/" className="hover:text-[#0B3D2E] transition-colors">
            ← Kembali ke Website
          </Link>
        </p>
      </div>
    </div>
  )
}
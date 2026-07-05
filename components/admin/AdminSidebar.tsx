'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Users, Store, Newspaper,
  LogOut, Menu, X, ChevronRight, Shield, Globe,
} from 'lucide-react'
import { Profile } from '@/types'

function getNavItems(role: string) {
  const base = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/residents', label: 'Penduduk', icon: Users },
    { href: '/admin/umkm', label: 'UMKM', icon: Store },
    { href: '/admin/news', label: 'Berita', icon: Newspaper },
  ]
  if (role === 'superadmin') {
    base.push({ href: '/admin/users', label: 'Pengguna', icon: Shield })
  }
  return base
}

interface SidebarContentProps {
  pathname: string
  profile: Profile
  onNavClick: () => void
  onLogout: () => void
}

function SidebarContent({ pathname, profile, onNavClick, onLogout }: SidebarContentProps) {
  const navItems = getNavItems(profile.role)

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0B3D2E] flex items-center
            justify-center shrink-0">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm leading-tight">Potorono</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#0B3D2E]/10 flex items-center
            justify-center shrink-0">
            <span className="text-xs font-bold text-[#0B3D2E]">
              {(profile.nama || profile.email).charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-700 truncate">
              {profile.nama || profile.email}
            </p>
            <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${
              profile.role === 'superadmin' ? 'text-purple-600' : 'text-blue-500'
            }`}>
              <Shield size={9} />
              {profile.role === 'superadmin' ? 'Superadmin' : 'Admin'}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(item => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                font-medium transition-all group ${
                  active
                    ? 'bg-[#0B3D2E] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              <Icon size={16} className={
                active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
              } />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-xs text-gray-500 hover:bg-gray-100 transition-all mb-1"
        >
          <Globe size={14} />
          Lihat Website
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-sm text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={16} />
          Keluar
        </button>
      </div>
    </div>
  )
}

// ✅ Terima profile sebagai prop dari layout — tidak perlu fetch lagi
export default function AdminSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const contentProps = {
    pathname,
    profile,
    onLogout: handleLogout,
  }

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-56 bg-white border-r border-gray-100
        flex-col h-screen sticky top-0 shrink-0">
        <SidebarContent {...contentProps} onNavClick={() => {}} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white
        border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#0B3D2E] flex items-center
            justify-center">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <span className="font-semibold text-gray-800 text-sm">Admin Potorono</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-40 w-56 bg-white h-full shadow-xl mt-14">
            <SidebarContent
              {...contentProps}
              onNavClick={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Mobile spacer */}
      <div className="md:hidden h-14 shrink-0" />
    </>
  )
}
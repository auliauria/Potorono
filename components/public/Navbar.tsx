'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ShieldCheck, Home, Info, BarChart3, Store, Newspaper } from 'lucide-react'

const navLinks = [
  { label: 'Beranda', href: '#beranda', icon: Home },
  { label: 'Profil Dusun', href: '#profil', icon: Info },
  { label: 'Dashboard', href: '#dashboard', icon: BarChart3 },
  { label: 'UMKM', href: '#umkm', icon: Store },
  { label: 'Berita', href: '#berita', icon: Newspaper },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#beranda" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#0B3D2E] flex items-center
              justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <span className={`font-semibold text-sm tracking-wide transition-colors ${
              scrolled ? 'text-[#0B3D2E]' : 'text-white'
            }`}>
              Dusun Potorono
            </span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`link-underline text-sm font-medium transition-colors
                  hover:text-accent ${scrolled ? 'text-gray-700' : 'text-white/90'}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="ml-2 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm
                font-medium border transition-all border-[#D4A017] text-[#D4A017]
                hover:bg-[#D4A017] hover:text-white"
            >
              <ShieldCheck size={14} />
              Login Admin
            </Link>
          </div>

          <button
            className={`md:hidden transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-2 space-y-1
            animate-[fadeUp_0.3s_ease]">
            {navLinks.map(link => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700
                    rounded-lg hover:bg-gray-50 hover:text-[#0B3D2E] transition-colors"
                >
                  <Icon size={16} className="text-gray-400" />
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-2 px-4">
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-full
                  text-sm font-medium border border-[#D4A017] text-[#D4A017]
                  hover:bg-[#D4A017] hover:text-white transition-colors"
              >
                <ShieldCheck size={14} />
                Login Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
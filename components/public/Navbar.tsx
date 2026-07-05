'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Menu, X, ShieldCheck,
  Home, Info, BarChart3, Store, Newspaper,
} from 'lucide-react'

const navLinks = [
  { label: 'Beranda', href: '#beranda', icon: Home },
  { label: 'Profil', href: '#profil', icon: Info },
  { label: 'Dashboard', href: '#dashboard', icon: BarChart3 },
  { label: 'UMKM', href: '#umkm', icon: Store },
  { label: 'Berita', href: '#berita', icon: Newspaper },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('beranda')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)

      // Track active section
      const sections = navLinks.map(l => l.href.replace('#', ''))
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(section)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(255,255,255,0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.04)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#beranda" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center
                transition-all duration-300 group-hover:scale-110"
              style={{ background: scrolled ? '#0B3D2E' : 'rgba(255,255,255,0.15)' }}
            >
              <span className="text-white font-black text-xs">P</span>
            </div>
            <span
              className="font-bold text-sm tracking-wide transition-colors duration-300"
              style={{ color: scrolled ? '#0B3D2E' : 'rgba(255,255,255,0.9)' }}
            >
              Potorono
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = activeSection === link.href.replace('#', '')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 rounded-full text-sm font-medium
                    transition-all duration-300"
                  style={{
                    color: isActive
                      ? '#0B3D2E'
                      : scrolled
                        ? '#4B5563'
                        : 'rgba(255,255,255,0.75)',
                    background: isActive && scrolled
                      ? 'rgba(11,61,46,0.08)'
                      : 'transparent',
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2
                        w-1 h-1 rounded-full bg-[#D4A017]"
                    />
                  )}
                </Link>
              )
            })}
            <Link
              href="/admin/login"
              className="ml-2 flex items-center gap-1.5 px-4 py-1.5 rounded-full
                text-sm font-semibold border transition-all duration-300
                hover:scale-105 hover:-translate-y-0.5"
              style={{
                borderColor: '#D4A017',
                color: '#D4A017',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.background = '#D4A017'
                el.style.color = '#fff'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background = 'transparent'
                el.style.color = '#D4A017'
              }}
            >
              <ShieldCheck size={13} />
              Admin
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl transition-colors"
            style={{ color: scrolled ? '#374151' : 'white' }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{
            maxHeight: open ? '400px' : '0',
            opacity: open ? 1 : 0,
          }}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl mx-0
            mt-2 mb-4 p-3 border border-gray-100 shadow-lg">
            {navLinks.map(link => {
              const Icon = link.icon
              const isActive = activeSection === link.href.replace('#', '')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm rounded-xl
                    transition-all duration-200 font-medium"
                  style={{
                    background: isActive ? 'rgba(11,61,46,0.08)' : 'transparent',
                    color: isActive ? '#0B3D2E' : '#4B5563',
                  }}
                >
                  <Icon size={16}
                    style={{ color: isActive ? '#0B3D2E' : '#9CA3AF' }} />
                  {link.label}
                </Link>
              )
            })}
            <div className="px-3 pt-2 border-t border-gray-100 mt-2">
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl
                  text-sm font-semibold bg-[#0B3D2E] text-white
                  hover:bg-[#1B5E42] transition-colors"
              >
                <ShieldCheck size={14} />
                Login Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
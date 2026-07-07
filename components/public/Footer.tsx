'use client'

import { villageProfile } from '@/data/village-profile'
import { MapPin, Globe } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const navLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Profil Dusun', href: '#profil' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'UMKM', href: '#umkm' },
  { label: 'Berita', href: '#berita' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const { ref, isVisible } = useScrollReveal()

  return (
    <footer className="bg-[#0B3D2E] text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full
        bg-[#1B5E42]/20 blur-[80px] animate-blob pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full
        bg-[#D4A017]/10 blur-[60px] animate-blob2 pointer-events-none" />

      <div ref={ref} className="section-padding !py-12 relative">
        <div className="container-inner">
          <div
            className="grid md:grid-cols-3 gap-8 mb-10"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4 group cursor-default">
                <div className="w-9 h-9 rounded-full bg-[#D4A017] flex items-center
                  justify-center transition-transform duration-300 group-hover:scale-110">
                  <span className="text-white font-black text-xs">P</span>
                </div>
                <span className="font-bold text-base">Dusun Potorono</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Website profil Dusun Potorono — mengelola data penduduk dan
                menampilkan potensi lokal untuk masyarakat yang lebih terhubung.
              </p>
            </div>

            {/* Kontak */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-[#D4A017]">Kontak</h4>
              <div className="flex items-start gap-2.5 text-sm text-white/60
                hover:text-white/80 transition-colors duration-200 cursor-default">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#D4A017]" />
                <span>
                  Dusun Potorono, Banguntapan,<br />
                  Bantul, D.I. Yogyakarta
                </span>
              </div>
            </div>

            {/* Navigasi */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-[#D4A017]">Navigasi</h4>
              <div className="space-y-2">
                {navLinks.map((link, i) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-white/50
                      hover:text-white transition-all duration-200"
                    style={{ transitionDelay: `${i * 30}ms` }}
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-[#D4A017]
                      transition-all duration-300 rounded-full" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div
            className="pt-6 border-t border-white/10 flex flex-col sm:flex-row
              items-center justify-between gap-3"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.8s ease 0.3s',
            }}
          >
            <p className="text-white/30 text-xs flex items-center gap-1.5">
              <Globe size={11} />
              © {year} Dusun Potorono · Banguntapan, Bantul
            </p>
            <p className="text-white/20 text-xs">
              Dibangun dalam rangka program KKN-PPM UGM 2026
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
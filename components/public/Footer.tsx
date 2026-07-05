import { villageProfile } from '@/data/village-profile'
import { MapPin, Phone, Globe } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  const navLinks = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Profil Dusun', href: '#profil' },
    { label: 'Dashboard', href: '#dashboard' },
    { label: 'UMKM', href: '#umkm' },
    { label: 'Berita', href: '#berita' },
  ]

  return (
    <footer className="bg-[#0B3D2E] text-white">
      <div className="section-padding !py-12">
        <div className="container-inner">
          <div className="grid md:grid-cols-3 gap-10">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-full bg-[#D4A017] flex items-center
                  justify-center shrink-0">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="font-semibold text-lg">Dusun Potorono</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Website profil potensi wisata dan umkm dusun Potorono
              </p>
            </div>

            {/* Kontak */}
            <div>
              <h4 className="font-semibold text-sm mb-5 text-[#D4A017] uppercase
                tracking-wider">
                Kontak
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-sm text-white/70">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-[#D4A017]" />
                  <span>
                    Dusun Potorono, Banguntapan,<br />
                    Bantul, D.I. Yogyakarta
                  </span>
                </div>
                {villageProfile.contact.phone !== '-' && (
                  <div className="flex items-center gap-2.5 text-sm text-white/70">
                    <Phone size={14} className="text-[#D4A017] shrink-0" />
                    <span>{villageProfile.contact.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigasi — disusun ke bawah */}
            <div>
              <h4 className="font-semibold text-sm mb-5 text-[#D4A017] uppercase
                tracking-wider">
                Navigasi
              </h4>
              {/* ✅ flex-col agar link tersusun ke bawah */}
              <div className="flex flex-col gap-2.5">
                {navLinks.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white
                      transition-colors hover:translate-x-1 inline-block
                      duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col
            sm:flex-row items-center justify-between gap-3">
            <p className="text-white/40 text-xs flex items-center gap-1.5">
              <Globe size={12} />
              © {year} Dusun Potorono · Banguntapan, Bantul
            </p>
            <p className="text-white/30 text-xs">
              Dibangun dalam rangka program KKN-PPM UGM 2026
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
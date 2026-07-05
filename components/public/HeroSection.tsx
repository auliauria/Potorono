'use client'

import { ChevronDown, BarChart3, Users2, Store } from 'lucide-react'

export default function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B3D2E] via-[#0E4636] to-[#062417]" />

      {/* Animated floating blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full
        bg-[#1B5E42]/40 blur-[100px] animate-float-slow" />
      <div className="absolute bottom-1/4 -right-20 w-[28rem] h-[28rem] rounded-full
        bg-[#D4A017]/15 blur-[120px] animate-float" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        {/* Chip */}
        <div className="reveal inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full
          bg-white/5 border border-white/10 backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full
              bg-[#D4A017] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D4A017]" />
          </span>
          <span className="text-white/60 text-xs tracking-[0.2em] uppercase font-medium">
            Banguntapan · Bantul · D.I. Yogyakarta
          </span>
        </div>

        {/* Judul */}
        <h1 className="reveal reveal-delay-1 text-5xl md:text-7xl lg:text-8xl font-black
          text-white mb-4 tracking-tight leading-none">
          Potorono
        </h1>

        <p className="reveal reveal-delay-2 text-[#D4A017] text-sm md:text-base font-medium
          tracking-[0.15em] uppercase mb-6">
          Asri · Guyub · Berdaya
        </p>

        <p className="reveal reveal-delay-2 text-white/50 text-sm md:text-base max-w-lg
          mx-auto mb-10 leading-relaxed">
          Temukan harmoni kehidupan dusun yang hangat, data warga yang transparan,
          dan potensi lokal yang terus tumbuh.
        </p>

        {/* CTA dengan icon */}
        <div className="reveal reveal-delay-3 flex flex-col sm:flex-row items-center
          justify-center gap-3">
          <a
            href="#dashboard"
            className="group w-full sm:w-auto flex items-center justify-center gap-2
              px-7 py-3.5 rounded-full bg-[#D4A017] text-white font-semibold text-sm
              hover:bg-[#b8880f] transition-all hover:-translate-y-0.5
              shadow-lg shadow-[#D4A017]/25"
          >
            <BarChart3 size={16} className="transition-transform group-hover:scale-110" />
            Lihat Dashboard
          </a>

          <a
            href="#profil"
            className="group w-full sm:w-auto flex items-center justify-center gap-2
              px-7 py-3.5 rounded-full bg-white/8 text-white font-medium text-sm
              border border-white/15 hover:bg-white/15 transition-all hover:-translate-y-0.5"
          >
            <Users2 size={16} className="transition-transform group-hover:scale-110" />
            Profil Dusun
          </a>

          <a
            href="#umkm"
            className="group w-full sm:w-auto flex items-center justify-center gap-2
              px-7 py-3.5 rounded-full bg-white/8 text-white font-medium text-sm
              border border-white/15 hover:bg-white/15 transition-all hover:-translate-y-0.5"
          >
            <Store size={16} className="transition-transform group-hover:scale-110" />
            Potensi UMKM
          </a>
        </div>

        {/* Scroll indicator animasi */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2
          flex flex-col items-center gap-2 animate-bounce">
          <ChevronDown size={18} className="text-white/30" />
        </div>
      </div>
    </section>
  )
}
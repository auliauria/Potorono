'use client'

import { useEffect, useRef } from 'react'
import { ChevronDown, BarChart3, Users2, Store } from 'lucide-react'

// Canvas particle system
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = canvas.offsetWidth
    let h = canvas.offsetHeight
    canvas.width = w
    canvas.height = h

    type Particle = {
      x: number; y: number
      vx: number; vy: number
      r: number; alpha: number
      color: string
    }

    const COLORS = ['#D4A017', '#1B5E42', '#2D9F5C', '#ffffff', '#f5d97f']
    const COUNT = Math.floor((w * h) / 14000)

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(212,160,23,${0.06 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1

        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    const observer = new ResizeObserver(() => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w
      canvas.height = h
    })
    observer.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  )
}

export default function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center justify-center
        overflow-hidden bg-[#061C13]"
    >
      {/* Deep layered background */}
      <div className="absolute inset-0">
        {/* Base radial */}
        <div className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 40%, #0B3D2E 0%, #061C13 70%)',
          }}
        />
      </div>

      {/* Morphing blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px]
        bg-[#1B5E42]/20 blur-[80px] animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px]
        bg-[#D4A017]/10 blur-[100px] animate-blob2" />
      <div className="absolute top-3/4 left-1/2 w-[300px] h-[300px]
        bg-[#0B3D2E]/30 blur-[60px] animate-blob"
        style={{ animationDelay: '-4s' }}
      />

      {/* Particle canvas */}
      <ParticleCanvas />

      {/* Rotating ring decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[600px] h-[600px] pointer-events-none opacity-10">
        <div className="absolute inset-0 rounded-full border border-[#D4A017]/40
          animate-rotate-slow" />
        <div className="absolute inset-8 rounded-full border border-[#1B5E42]/30
          animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '20s' }} />
        <div className="absolute inset-20 rounded-full border border-white/10
          animate-rotate-slow" style={{ animationDuration: '40s' }} />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-24 left-12 opacity-20 animate-floatY-slow pointer-events-none">
        <div className="w-1.5 h-12 bg-gradient-to-b from-[#D4A017] to-transparent rounded-full" />
      </div>
      <div className="absolute top-36 right-16 opacity-15 animate-floatY pointer-events-none"
        style={{ animationDelay: '-3s' }}>
        <div className="w-8 h-8 rounded-full border border-[#D4A017]/50" />
      </div>
      <div className="absolute bottom-32 left-20 opacity-10 animate-floatY-slow pointer-events-none"
        style={{ animationDelay: '-6s' }}>
        <div className="w-4 h-4 bg-[#D4A017] rounded-sm rotate-45" />
      </div>
      <div className="absolute bottom-24 right-24 opacity-20 animate-floatY pointer-events-none"
        style={{ animationDelay: '-2s' }}>
        <div className="w-1.5 h-8 bg-gradient-to-b from-[#1B5E42] to-transparent rounded-full" />
      </div>

      {/* Grid overlay subtle */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Animated chip */}
        <div className="reveal inline-flex items-center gap-2.5 mb-8 px-5 py-2
          rounded-full bg-white/5 border border-white/10 backdrop-blur-md
          animate-border-glow">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full
              rounded-full bg-[#D4A017] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4A017]" />
          </span>
          <span className="text-white/60 text-xs tracking-[0.25em] uppercase font-medium">
            Banguntapan · Bantul · D.I. Yogyakarta
          </span>
        </div>

        {/* Main title — shimmer effect */}
        <div className="reveal reveal-delay-1 mb-4">
          <h1 className="text-[clamp(4rem,15vw,9rem)] font-black leading-none
            tracking-tighter text-white">
            <span className="block">Dusun</span>
            <span className="block shimmer-text">Potorono</span>
          </h1>
        </div>

        {/* Tagline with animated dots */}
        <div className="reveal reveal-delay-2 flex items-center justify-center
          gap-3 mb-6">
          <div className="h-px flex-1 max-w-16 bg-gradient-to-r
            from-transparent to-[#D4A017]/40" />
          <p className="text-[#D4A017]/80 text-xs font-semibold tracking-[0.3em] uppercase">
            Asri · Guyub · Berdaya
          </p>
          <div className="h-px flex-1 max-w-16 bg-gradient-to-l
            from-transparent to-[#D4A017]/40" />
        </div>

        {/* Description */}
        <p className="reveal reveal-delay-2 text-white/40 text-sm md:text-base
          max-w-md mx-auto mb-10 leading-relaxed">
          Temukan harmoni kehidupan dusun yang hangat, data warga yang transparan,
          dan potensi lokal yang terus tumbuh.
        </p>

        {/* CTA Buttons */}
        <div className="reveal reveal-delay-3 flex flex-col sm:flex-row items-center
          justify-center gap-3">
          <a
            href="#dashboard"
            className="group w-full sm:w-auto flex items-center justify-center
              gap-2 px-8 py-3.5 rounded-full font-semibold text-sm
              bg-[#D4A017] text-white hover:bg-[#b8880f] transition-all
              hover:-translate-y-0.5 shadow-lg shadow-[#D4A017]/30
              hover:shadow-[#D4A017]/50 hover:shadow-xl"
          >
            <BarChart3 size={16}
              className="transition-transform group-hover:scale-110 group-hover:rotate-6" />
            Lihat Dashboard
          </a>
          <a
            href="#profil"
            className="group w-full sm:w-auto flex items-center justify-center
              gap-2 px-8 py-3.5 rounded-full font-medium text-sm
              bg-white/8 text-white border border-white/15
              hover:bg-white/15 hover:border-white/30 transition-all
              hover:-translate-y-0.5 backdrop-blur-sm"
          >
            <Users2 size={16}
              className="transition-transform group-hover:scale-110" />
            Profil Dusun
          </a>
          <a
            href="#umkm"
            className="group w-full sm:w-auto flex items-center justify-center
              gap-2 px-8 py-3.5 rounded-full font-medium text-sm
              bg-white/8 text-white border border-white/15
              hover:bg-white/15 hover:border-white/30 transition-all
              hover:-translate-y-0.5 backdrop-blur-sm"
          >
            <Store size={16}
              className="transition-transform group-hover:scale-110" />
            Potensi UMKM
          </a>
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2
          flex flex-col items-center gap-2">
          <span className="text-white/20 text-xs tracking-[0.2em] uppercase">
            Scroll
          </span>
          <div className="relative">
            <ChevronDown size={16} className="text-white/20 animate-bounce" />
            <ChevronDown size={16}
              className="text-white/10 animate-bounce absolute top-2 left-0"
              style={{ animationDelay: '0.15s' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
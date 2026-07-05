'use client'

import { useEffect, useRef, useState } from 'react'
import { villageProfile } from '@/data/village-profile'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { Home, MapPin, Landmark, Map, Sparkles, Clock } from 'lucide-react'

const iconMap = [Home, MapPin, Landmark, Map]

// Animated number counter
function AnimatedStat({
  value, label, icon: Icon, isVisible, delay
}: {
  value: string; label: string
  icon: React.ElementType; isVisible: boolean; delay: number
}) {
  return (
    <div
      className="bg-white rounded-2xl p-5 border border-gray-100
        shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-500
        group cursor-default"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      <div className="w-10 h-10 rounded-xl bg-[#0B3D2E]/8 flex items-center
        justify-center mb-3 group-hover:bg-[#0B3D2E]/15 transition-colors duration-300">
        <Icon size={18} className="text-[#0B3D2E]
          group-hover:scale-110 transition-transform duration-300" />
      </div>
      <p className="text-xl font-black text-[#0B3D2E] leading-tight">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
      <div className="mt-3 h-0.5 w-0 group-hover:w-full bg-[#D4A017]
        rounded-full transition-all duration-500" />
    </div>
  )
}

export default function ProfileSection() {
  const { about, stats_static, sejarah } = villageProfile
  const { ref: sekilasRef, isVisible: sekilasVisible } = useScrollReveal()
  const { ref: timelineRef, isVisible: timelineVisible } = useScrollReveal(0.05)

  return (
    <section id="profil" className="bg-white">

      {/* ── SEKILAS ── */}
      <div ref={sekilasRef} className="section-padding bg-[#FAFAF8]">
        <div className="container-inner">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div
              style={{
                opacity: sekilasVisible ? 1 : 0,
                transform: sekilasVisible ? 'translateX(0)' : 'translateX(-32px)',
                transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                bg-[#0B3D2E]/10 text-[#0B3D2E] text-xs font-semibold tracking-widest
                uppercase mb-4">
                <Sparkles size={11} />
                Mengenal Kami
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5
                leading-tight">
                Tentang Dusun<br />
                <span className="text-[#0B3D2E]">Potorono</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">
                {about.sekilas}
              </p>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {about.karakter}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats_static.map((s, i) => {
                const Icon = iconMap[i] || Home
                return (
                  <AnimatedStat
                    key={s.label}
                    value={s.value}
                    label={s.label}
                    icon={Icon}
                    isVisible={sekilasVisible}
                    delay={200 + i * 100}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── SEJARAH TIMELINE ── */}
      <div
        ref={timelineRef}
        className="section-padding bg-[#0B3D2E] relative overflow-hidden"
      >
        {/* Animated background blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full
          bg-[#1B5E42]/30 blur-[80px] animate-blob pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full
          bg-[#D4A017]/10 blur-[60px] animate-blob2 pointer-events-none" />

        <div className="container-inner relative">
          <div
            className="text-center mb-14"
            style={{
              opacity: timelineVisible ? 1 : 0,
              transform: timelineVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
              bg-white/10 text-[#D4A017] text-xs font-semibold tracking-widest
              uppercase mb-4">
              <Clock size={11} />
              Jejak Langkah
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Sejarah Dusun Potorono
            </h2>
            <p className="text-white/40 text-sm mt-3 max-w-md mx-auto">
              Setiap sudut dusun menyimpan cerita. Mari telusuri perjalanan
              yang membentuk Potorono hingga hari ini.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px
              bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            <div className="space-y-12">
              {sejarah.map((item, i) => (
                <div
                  key={i}
                  className={`relative md:grid md:grid-cols-2 md:gap-12 items-center
                    ${i % 2 === 0 ? '' : 'md:[&>*:first-child]:order-last'}`}
                  style={{
                    opacity: timelineVisible ? 1 : 0,
                    transform: timelineVisible
                      ? 'translateY(0)'
                      : 'translateY(32px)',
                    transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 150}ms`,
                  }}
                >
                  <div className={`mb-4 md:mb-0 ${
                    i % 2 === 0 ? 'md:text-right' : 'md:text-left'
                  }`}>
                    <span className="inline-block px-3 py-1 rounded-full
                      bg-[#D4A017]/20 text-[#D4A017] text-xs font-semibold mb-3">
                      {item.era}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-snug">
                      {item.judul}
                    </h3>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-1/2 top-1/2
                    -translate-x-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 rounded-full bg-[#D4A017]
                      ring-4 ring-[#D4A017]/20 relative">
                      <div className="absolute inset-0 rounded-full bg-[#D4A017]
                        animate-pulse-ring" />
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5
                    hover:bg-white/8 hover:border-white/20 transition-all duration-300
                    group cursor-default">
                    <p className="text-white/60 text-sm leading-relaxed
                      group-hover:text-white/80 transition-colors duration-300">
                      {item.isi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
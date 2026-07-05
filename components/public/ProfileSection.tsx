'use client'

import { villageProfile } from '@/data/village-profile'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { Home, MapPin, Landmark, Map, Sparkles, Clock } from 'lucide-react'

const iconMap = [Home, MapPin, Landmark, Map]

export default function ProfileSection() {
  const { about, stats_static, sejarah } = villageProfile
  const sekilas = useScrollReveal()
  const timeline = useScrollReveal(0.05)

  return (
    <section id="profil" className="bg-white">

      {/* ── SEKILAS ── */}
      <div ref={sekilas.ref} className="section-padding bg-[#FAFAF8]">
        <div className="container-inner">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={sekilas.isVisible ? 'reveal' : 'opacity-0'}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                bg-[#0B3D2E]/10 text-[#0B3D2E] text-xs font-semibold tracking-widest
                uppercase mb-4">
                <Sparkles size={11} />
                Mengenal Kami
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                Tentang Dusun<br />
                <span className="text-[#0B3D2E]">Potorono</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">{about.sekilas}</p>
              <p className="text-gray-600 leading-relaxed">{about.karakter}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats_static.map((s, i) => {
                const Icon = iconMap[i] || Home
                return (
                  <div
                    key={s.label}
                    className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm
                      hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                      ${sekilas.isVisible ? `reveal reveal-delay-${i + 1}` : 'opacity-0'}`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#0B3D2E]/8 flex items-center
                      justify-center mb-3">
                      <Icon size={16} className="text-[#0B3D2E]" />
                    </div>
                    <p className="text-xl font-bold text-[#0B3D2E]">{s.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── SEJARAH TIMELINE ── */}
      <div ref={timeline.ref} className="section-padding bg-[#0B3D2E] relative overflow-hidden">
        {/* Decorative blob */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full
          bg-[#1B5E42]/30 blur-[100px]" />

        <div className="container-inner relative">
          <div className={`text-center mb-14 ${timeline.isVisible ? 'reveal' : 'opacity-0'}`}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
              bg-white/10 text-[#D4A017] text-xs font-semibold tracking-widest uppercase mb-4">
              <Clock size={11} />
              Jejak Langkah
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Sejarah Dusun Potorono
            </h2>
            <p className="text-white/50 text-sm mt-3 max-w-md mx-auto">
              Setiap sudut dusun menyimpan cerita. Mari telusuri perjalanan
              yang membentuk Potorono hingga hari ini.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px
              bg-gradient-to-b from-transparent via-white/15 to-transparent" />

            <div className="space-y-10">
              {sejarah.map((item, i) => (
                <div
                  key={i}
                  className={`relative md:grid md:grid-cols-2 md:gap-12 items-center
                    ${i % 2 === 0 ? '' : 'md:[&>*:first-child]:order-last'}
                    ${timeline.isVisible ? `reveal reveal-delay-${(i % 4) + 1}` : 'opacity-0'}`}
                >
                  <div className={`mb-4 md:mb-0 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#D4A017]/20
                      text-[#D4A017] text-xs font-semibold mb-3">
                      {item.era}
                    </span>
                    <h3 className="text-lg font-bold text-white">{item.judul}</h3>
                  </div>

                  <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2
                    -translate-y-1/2 w-3 h-3 rounded-full bg-[#D4A017]
                    ring-4 ring-[#D4A017]/20" />

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5
                    hover:bg-white/8 transition-colors duration-300">
                    <p className="text-white/70 text-sm leading-relaxed">{item.isi}</p>
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
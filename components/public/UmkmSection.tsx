'use client'

import { useRef } from 'react'
import { Umkm } from '@/types'
import { formatWA } from '@/lib/utils'
import { MessageCircle, Store, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function UmkmSection({ umkmList }: { umkmList: Umkm[] }) {
  const { ref, isVisible } = useScrollReveal()
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return
    const amount = scrollRef.current.offsetWidth * 0.8
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <section id="umkm" className="section-padding bg-white overflow-hidden">
      <div ref={ref} className="container-inner">
        {/* Header */}
        <div className={`flex items-end justify-between mb-8 ${
          isVisible ? 'reveal' : 'opacity-0'
        }`}>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
              bg-[#D4A017]/10 text-[#D4A017] text-xs font-semibold tracking-widest
              uppercase mb-4">
              <Sparkles size={11} />
              Ekonomi Lokal
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              UMKM Dusun Potorono
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md">
              Kenali dan dukung usaha mikro kecil menengah warga Dusun Potorono.
            </p>
          </div>

          {/* Nav buttons */}
          {umkmList.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                onClick={() => scroll('left')}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center
                  justify-center text-gray-500 hover:bg-[#0B3D2E] hover:text-white
                  hover:border-[#0B3D2E] transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center
                  justify-center text-gray-500 hover:bg-[#0B3D2E] hover:text-white
                  hover:border-[#0B3D2E] transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {umkmList.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center
            py-16 bg-gray-50 rounded-2xl">
            <Store size={32} className="text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">Belum ada data UMKM.</p>
          </div>
        ) : (
          <>
            {/* Slider container */}
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory
                scrollbar-hide -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-16 lg:px-16"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {umkmList.map((umkm, i) => (
                <div
                  key={umkm.id}
                  className={`flex-none w-[280px] sm:w-[300px] snap-start bg-white
                    rounded-2xl border border-gray-100 shadow-sm
                    hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300
                    overflow-hidden group
                    ${isVisible ? `reveal reveal-delay-${(i % 4) + 1}` : 'opacity-0'}`}
                >
                  {/* Image */}
                  <div className="relative h-44 bg-gray-100 overflow-hidden">
                    {umkm.foto_url ? (
                      <Image
                        src={umkm.foto_url}
                        alt={umkm.nama_umkm}
                        fill
                        sizes="300px"
                        className="object-cover transition-transform duration-500
                          group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store size={36} className="text-gray-300" />
                      </div>
                    )}
                    {umkm.kategori && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90
                        backdrop-blur-sm rounded-full text-xs font-medium text-[#0B3D2E]">
                        {umkm.kategori}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                      {umkm.nama_umkm}
                    </h3>
                    {umkm.nama_pemilik && (
                      <p className="text-xs text-gray-400 mb-2">oleh {umkm.nama_pemilik}</p>
                    )}
                    {umkm.deskripsi && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                        {umkm.deskripsi}
                      </p>
                    )}
                    <a
                      href={`https://wa.me/${formatWA(umkm.no_whatsapp)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                        bg-[#0B3D2E] text-white text-xs font-medium
                        hover:bg-[#1da851] transition-all hover:-translate-y-0.5"
                    >
                      <MessageCircle size={14} />
                      Hubungi via WA
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile scroll hint */}
            <p className="text-center text-xs text-gray-300 mt-2 sm:hidden">
              Geser untuk melihat lebih banyak →
            </p>
          </>
        )}
      </div>
    </section>
  )
}
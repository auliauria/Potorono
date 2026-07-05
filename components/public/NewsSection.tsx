'use client'

import { useState, useRef, useEffect } from 'react'
import { News } from '@/types'
import Image from 'next/image'
import {
  Calendar, Newspaper, Megaphone,
  ChevronLeft, ChevronRight, X, Clock,
} from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

interface NewsModalProps {
  news: News
  onClose: () => void
}

function NewsModal({ news, onClose }: NewsModalProps) {
  // ✅ Prevent body scroll saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // ✅ Tutup modal saat tekan Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center
        bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Modal container — full height di mobile, max-h di desktop */}
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-2xl shadow-2xl
          rounded-t-2xl flex flex-col
          max-h-[92dvh] sm:max-h-[85vh]
          animate-[fadeUp_0.3s_ease]"
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle di mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Thumbnail — fixed di atas, tidak ikut scroll */}
        {news.thumbnail_url && (
          <div className="relative h-48 sm:h-56 shrink-0 overflow-hidden
            sm:rounded-t-2xl">
            <Image
              src={news.thumbnail_url}
              alt={news.judul}
              fill
              sizes="672px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t
              from-black/50 to-transparent" />
          </div>
        )}

        {/* Header — fixed, tidak scroll */}
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-3 shrink-0
          border-b border-gray-100">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
              <Calendar size={12} />
              {formatDate(news.tanggal)}
            </div>
            <h2 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">
              {news.judul}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center
              justify-center text-gray-500 hover:bg-gray-200 transition-colors
              shrink-0 mt-0.5"
          >
            <X size={16} />
          </button>
        </div>

        {/* ✅ Konten — ini yang bisa di-scroll */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-6 py-5 space-y-4">
            {/* Ringkasan */}
            {news.ringkasan && (
              <div className="p-4 bg-[#0B3D2E]/5 rounded-xl border-l-2
                border-[#0B3D2E]">
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  {news.ringkasan}
                </p>
              </div>
            )}

            {/* Isi berita */}
            {news.isi ? (
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {news.isi}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic text-center py-8">
                Tidak ada isi berita.
              </p>
            )}

            {/* Spacer bawah */}
            <div className="h-4" />
          </div>
        </div>

        {/* Footer — fixed di bawah, tidak scroll */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex items-center
          justify-between bg-white sm:rounded-b-2xl">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock size={12} />
            {formatDate(news.tanggal)}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0B3D2E] text-white text-xs
              font-medium hover:bg-[#1B5E42] transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

export default function NewsSection({ newsList }: { newsList: News[] }) {
  const { ref, isVisible } = useScrollReveal()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedNews, setSelectedNews] = useState<News | null>(null)

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return
    const amount = scrollRef.current.offsetWidth * 0.8
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <>
      <section id="berita" className="section-padding bg-[#FAFAF8] overflow-hidden">
        <div ref={ref} className="container-inner">
          {/* Header */}
          <div className={`flex items-end justify-between mb-8 ${
            isVisible ? 'reveal' : 'opacity-0'
          }`}>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                bg-[#0B3D2E]/10 text-[#0B3D2E] text-xs font-semibold tracking-widest
                uppercase mb-4">
                <Megaphone size={11} />
                Informasi Terkini
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Berita & Kegiatan
              </h2>
              <p className="text-gray-500 text-sm mt-2 max-w-md">
                Ikuti perkembangan kegiatan dan informasi terbaru Dusun Potorono.
              </p>
            </div>

            {/* Nav buttons */}
            {newsList.length > 0 && (
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

          {newsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center
              py-16 bg-white rounded-2xl border border-gray-100">
              <Newspaper size={32} className="text-gray-300 mb-3" />
              <p className="text-gray-400 text-sm">Belum ada berita yang dipublikasikan.</p>
            </div>
          ) : (
            <>
              {/* Slider */}
              <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory
                  -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-16 lg:px-16"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {newsList.map((item, i) => (
                  <article
                    key={item.id}
                    onClick={() => setSelectedNews(item)}
                    className={`flex-none w-[280px] sm:w-[300px] snap-start bg-white
                      rounded-2xl border border-gray-100 shadow-sm cursor-pointer
                      hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300
                      overflow-hidden group
                      ${isVisible
                        ? `reveal reveal-delay-${(i % 4) + 1}`
                        : 'opacity-0'}`}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-44 bg-gray-100 overflow-hidden">
                      {item.thumbnail_url ? (
                        <Image
                          src={item.thumbnail_url}
                          alt={item.judul}
                          fill
                          sizes="300px"
                          className="object-cover transition-transform duration-500
                            group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center
                          bg-gradient-to-br from-[#0B3D2E]/5 to-[#0B3D2E]/10">
                          <Newspaper size={36} className="text-[#0B3D2E]/20" />
                        </div>
                      )}
                      {/* Overlay hint */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10
                        transition-all duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-all
                          duration-300 bg-white/90 backdrop-blur-sm text-xs font-semibold
                          text-[#0B3D2E] px-3 py-1.5 rounded-full">
                          Baca Selengkapnya
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                        <Calendar size={12} />
                        {formatDate(item.tanggal)}
                      </div>
                      <h3 className="font-semibold text-gray-800 leading-snug mb-2
                        line-clamp-2 group-hover:text-[#0B3D2E] transition-colors">
                        {item.judul}
                      </h3>
                      {item.ringkasan && (
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                          {item.ringkasan}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {/* Mobile hint */}
              <p className="text-center text-xs text-gray-300 mt-2 sm:hidden">
                Geser untuk melihat lebih banyak · Ketuk untuk membaca
              </p>
            </>
          )}
        </div>
      </section>

      {/* Modal detail berita */}
      {selectedNews && (
        <NewsModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}
    </>
  )
}
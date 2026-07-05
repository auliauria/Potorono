import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // ✅ Bypass Next.js image optimization sepenuhnya
    // Gambar Supabase langsung di-load browser, bukan via Next.js server
    unoptimized: true,
  },
}

export default nextConfig
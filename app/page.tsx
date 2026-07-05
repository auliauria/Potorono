import Navbar from '@/components/public/Navbar'
import HeroSection from '@/components/public/HeroSection'
import ProfileSection from '@/components/public/ProfileSection'
import DashboardSection from '@/components/public/DashboardSection'
import UmkmSection from '@/components/public/UmkmSection'
import NewsSection from '@/components/public/NewsSection'
import Footer from '@/components/public/Footer'
import { createClient } from '@/lib/supabase/server'
import { Umkm, News } from '@/types'

export const revalidate = 60

async function getUmkm(): Promise<Umkm[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('umkms')
    .select('*')
    .eq('status_aktif', true)
    .order('created_at', { ascending: false })
  return data || []
}

async function getNews(): Promise<News[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('news')
    .select('*')
    .eq('status_publish', true)
    .order('tanggal', { ascending: false })
    .limit(6)
  return data || []
}

export default async function HomePage() {
  const [umkmList, newsList] = await Promise.all([getUmkm(), getNews()])

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProfileSection />
      <DashboardSection />
      <UmkmSection umkmList={umkmList} />
      <NewsSection newsList={newsList} />
      <Footer />
    </main>
  )
}
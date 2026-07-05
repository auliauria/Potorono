import { createServerClient } from '@supabase/ssr'
import { createClient as createAdminSupabase } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Regular client untuk baca session/cookie
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAdminRoute = path.startsWith('/admin')
  const isLoginPage = path === '/admin/login'
  const isRegisterPage = path === '/admin/register'

  if (isLoginPage || isRegisterPage) {
    if (user) return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    return supabaseResponse
  }

  if (isAdminRoute && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isAdminRoute && user) {
    // Admin client — bypass semua RLS
    const adminClient = createAdminSupabase(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: profile } = await adminClient
      .from('profiles')
      .select('is_active, role')
      .eq('id', user.id)
      .single()

    if (!profile?.is_active) {
      await supabase.auth.signOut()
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('error', 'inactive')
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
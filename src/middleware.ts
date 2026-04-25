import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = updateSession(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Route protection logic
  const isLoginPage = request.nextUrl.pathname === '/login'

  if (!user && !isLoginPage) {
    // Redirect unauthenticated users to login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return Response.redirect(url)
  }

  if (user && isLoginPage) {
    // Redirect authenticated users to home page
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return Response.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

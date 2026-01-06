import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // allow next internals + static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  // allow API routes (they already enforce auth)
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // public routes
  const isPublic =
    pathname === '/login' ||
    pathname.startsWith('/about')

  // Supabase auth cookie presence check
  // NOTE: this is not "full verification" — it’s a cheap gate.
  const hasSession = req.cookies.getAll().some((c) =>
    c.name.includes('sb-') && c.name.endsWith('-auth-token')
  )


  // If not logged in and trying to access private pages -> redirect to /login
  if (!hasSession && !isPublic) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If logged in and trying to access /login -> redirect home
  if (hasSession && pathname === '/login') {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!.*\\.).*)'],
}

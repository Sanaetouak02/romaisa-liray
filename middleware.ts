import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminToken, getAdminCookieName } from './lib/adminAuth'

const PUBLIC_ADMIN_PATHS = ['/admin/login', '/api/admin/login', '/api/admin/logout']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return NextResponse.next()
  }

  if (PUBLIC_ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'))) {
    return NextResponse.next()
  }

  const token = request.cookies.get(getAdminCookieName())?.value
  const userId = await verifyAdminToken(token)

  if (pathname.startsWith('/api/admin')) {
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Non autorisé.' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    return NextResponse.next()
  }

  if (!userId) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

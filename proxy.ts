import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from './lib/session-crypto'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check session cookie
  const session = request.cookies.get('nd-session')?.value
  const payload = await decrypt(session)

  // Protect Admin Routes
  if (pathname.startsWith('/admin')) {
    if (!payload || payload.role !== 'ADMIN') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

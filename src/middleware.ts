import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PASSWORD = process.env.APP_PASSWORD

export function middleware(request: NextRequest) {
  // Si aucun mot de passe configuré → pas de restriction (dev)
  if (!PASSWORD) return NextResponse.next()

  const { pathname } = request.nextUrl

  // Pages et ressources autorisées sans auth
  if (
    pathname === '/login' ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/login') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Vérifier le cookie d'authentification
  const auth = request.cookies.get('auth')?.value
  if (auth === 'ok') return NextResponse.next()

  // Rediriger vers la page de login
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'],
}

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({}))

  if (!password || password !== process.env.APP_PASSWORD) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('auth', 'ok', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    path: '/',
  })
  return response
}
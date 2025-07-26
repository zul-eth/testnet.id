import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean)

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin') || ''
  const res = NextResponse.next()
  if (allowed.includes(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin)
    res.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  if (req.method === 'OPTIONS') {
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
    res.headers.set('Access-Control-Allow-Headers', req.headers.get('Access-Control-Request-Headers') || '')
  }
  return res
}

export const config = {
  matcher: '/api/:path*',
}

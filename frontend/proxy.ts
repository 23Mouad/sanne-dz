import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js Edge Proxy (formerly Middleware) — Server-side route protection.
 *
 * Protects dashboard routes by checking for authentication token.
 * This runs on the edge before page rendering, ensuring unauthenticated
 * users cannot access protected routes even with client-side bypass.
 */

// Role-based route restrictions
const ROLE_ROUTES: Record<string, string[]> = {
  admin: ['/dashboard/admin'],
  partner: ['/dashboard/partner'],
  client: ['/dashboard/client'],
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for auth token in cookies (set during login)
  const token = request.cookies.get('access_token')?.value

  if (!token) {
    // Redirect to login with return URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Try to decode the JWT payload to check role (without verification —
  // actual verification happens on the backend). This is just for routing.
  try {
    const payloadBase64 = token.split('.')[1]
    if (payloadBase64) {
      const payload = JSON.parse(atob(payloadBase64))
      const userRole = payload.role?.toLowerCase()

      // Check role-based access — redirect to correct dashboard if wrong role
      for (const [role, prefixes] of Object.entries(ROLE_ROUTES)) {
        const isRoleRoute = prefixes.some(p => pathname.startsWith(p))
        if (isRoleRoute && userRole !== role) {
          const correctDashboard = `/dashboard/${userRole}`
          return NextResponse.redirect(new URL(correctDashboard, request.url))
        }
      }
    }
  } catch {
    // If JWT decode fails, let the page handle it (will redirect via client-side)
  }

  // Add security headers to all dashboard responses
  const response = NextResponse.next()
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export const config = {
  matcher: ['/dashboard/:path*'],
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

export const runtime = 'nodejs';

// List of paths that are publicly accessible (no auth required)
const publicPaths = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/oauth/google',
  '/api/auth/oauth/callback',
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Check if the path is public
  if (publicPaths.includes(path) || path.startsWith('/_next/') || path.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // 2. Check for authentication cookie
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    // Redirect unauthenticated users to the login page
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Verify the token
  const payload = verifyAuthToken(token);

  if (!payload) {
    // Token is invalid or expired, clear the cookie and redirect to login
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.set('auth_token', '', { maxAge: 0, path: '/' });
    return response;
  }

  // 4. Authentication successful, proceed to the requested page
  // Note: Role-based access control (RBAC) can be implemented here if needed.
  return NextResponse.next();
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - /api/auth/logout (logout needs to be protected to clear the cookie, but we handle it inside the middleware)
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth/logout).*)',
  ],
};

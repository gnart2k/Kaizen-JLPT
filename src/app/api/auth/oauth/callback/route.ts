import { NextResponse } from 'next/server';
import { handleGoogleCallback } from '@/lib/oauth';

/**
 * Handles the Google OAuth callback.
 * Exchanges the code for a token, fetches user info, and logs the user in.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('OAuth Error:', error);
    // Redirect to login page with an error message
    return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url));
  }

  if (!code) {
    // Should not happen if no error, but handle defensively
    return NextResponse.redirect(new URL('/auth/login?error=no_code', request.url));
  }

  try {
    const { cookie } = await handleGoogleCallback(code);

    // Redirect to dashboard and set the authentication cookie
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.headers.set('Set-Cookie', cookie);
    return response;

  } catch (e) {
    console.error('OAuth Callback Processing Error:', e);
    // Redirect to login page with a generic error
    return NextResponse.redirect(new URL('/auth/login?error=server_error', request.url));
  }
}

import { NextResponse } from 'next/server';
import queryString from 'query-string';

// Ensure environment variables are set
if (!process.env.GOOGLE_CLIENT_ID || !process.env.NEXT_PUBLIC_BASE_URL) {
  throw new Error('GOOGLE_CLIENT_ID and NEXT_PUBLIC_BASE_URL must be set');
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const REDIRECT_URI = `${BASE_URL}/api/auth/oauth/callback`;

// Scopes requested from Google
const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
].join(' ');

/**
 * Handles the initiation of the Google OAuth flow.
 * Redirects the user to the Google authorization page.
 */
export async function GET() {
  const params = queryString.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES,
    access_type: 'offline',
    prompt: 'consent',
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

  return NextResponse.redirect(googleAuthUrl);
}

import { NextResponse } from 'next/server';
import { serializeClearCookie } from '@/lib/auth';

// Handles user logout by clearing the authentication cookie
export async function POST() {
  const cookie = serializeClearCookie();
  
  return NextResponse.json({ message: 'Logout successful' }, {
    status: 200,
    headers: { 'Set-Cookie': cookie },
  });
}

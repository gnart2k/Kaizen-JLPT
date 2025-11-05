import { NextResponse } from 'next/server';
import { getAuthPayloadFromRequest } from '@/lib/auth';

// Handles fetching current user details based on the authentication cookie
export async function GET(request: Request) {
  const payload = getAuthPayloadFromRequest(request);

  if (!payload) {
    return NextResponse.json({ user: null, message: 'Unauthorized' }, { status: 401 });
  }

  // Note: We only return the payload data, which is sufficient for most client-side needs.
  // If fresh data from the DB is needed, a DB lookup would be required here.
  return NextResponse.json({ 
    user: {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      plan: payload.plan,
    },
    message: 'User details fetched successfully' 
  }, { status: 200 });
}

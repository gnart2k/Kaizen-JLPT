import { NextResponse } from 'next/server';
import { getAuthPayloadFromRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { users } from '@/lib/db/schema';

// Handles fetching current user details based on the authentication cookie
export async function GET(request: Request) {
  const payload = getAuthPayloadFromRequest(request);

  if (!payload) {
    return NextResponse.json({ user: null, message: 'Unauthorized' }, { status: 401 });
  }

  // const users = await db.query.users.findMany({
  //   where: {
  //     id: payload.userId
  //   }
  // });

  const user = await db.query.users.findFirst({
    where: eq(users.id, payload.userId),
  });

  // Note: We only return the payload data, which is sufficient for most client-side needs.
  // If fresh data from the DB is needed, a DB lookup would be required here.
  return NextResponse.json({
    user: {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      plan: payload.plan,
      targetLevelId: user?.targetLevelId,
    },
    message: 'User details fetched successfully'
  }, { status: 200 });
}

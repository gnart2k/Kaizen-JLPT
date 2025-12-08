import { db } from '@/lib/db';
import { users, difficultyLevels } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayloadFromRequest } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    // 1. Authenticate user
    const authPayload = getAuthPayloadFromRequest(request);
    if (!authPayload?.userId) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const { targetLevelId } = body;

    if (!targetLevelId) {
      return NextResponse.json(
        { message: 'Target level ID is required' },
        { status: 400 }
      );
    }

    // 3. Validate target level exists
    const targetLevel = await db.query.difficultyLevels.findFirst({
      where: eq(difficultyLevels.id, targetLevelId),
    });

    if (!targetLevel) {
      return NextResponse.json(
        { message: 'Invalid target level' },
        { status: 400 }
      );
    }

    // 4. Update user's target_level_id in database
    const updatedUserResult = await db
      .update(users)
      .set({ targetLevelId })
      .where(eq(users.id, authPayload.userId))
      .returning({
        id: users.id,
        email: users.email,
        targetLevelId: users.targetLevelId,
      })
      .execute();

    if (!updatedUserResult) {
      return NextResponse.json(
        { message: 'Failed to update user' },
        { status: 500 }
      );
    }

    // 5. Return updated user data
    return NextResponse.json({
      message: 'Target level updated successfully',
      user: updatedUserResult,
    });

  } catch (error) {
    console.error('PUT user/target-level error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
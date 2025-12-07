import { db } from '@/lib/db';
import { difficultyLevels } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const difficultyLevels = await db.query.difficultyLevels.findMany({
      with: {
        language: true,
      },
    });
    return NextResponse.json(difficultyLevels);
  } catch (error) {
    console.error('GET difficulty levels error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

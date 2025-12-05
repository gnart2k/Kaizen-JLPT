import { db } from '@/lib/db';
import { difficultyLevels } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');

    const difficultyLevelsQuery = db.query.difficultyLevels.findMany({
      where: language ? eq(difficultyLevels.language, language) : undefined,
    });

    const levels = await difficultyLevelsQuery;
    return NextResponse.json(levels);
  } catch (error) {
    console.error('GET difficulty levels error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

import { db } from '@/lib/db';
import { difficultyLevels, languages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const languageCode = process.env.NEXT_PUBLIC_LANGUAGE;

    if (!languageCode) {
      return NextResponse.json({ message: 'Language not configured' }, { status: 500 });
    }

    const language = await db.query.languages.findFirst({
      where: eq(languages.code, languageCode),
    });

    if (!language) {
      return NextResponse.json({ message: 'Language not found' }, { status: 404 });
    }

    const filteredDifficultyLevels = await db.query.difficultyLevels.findMany({
      where: eq(difficultyLevels.languageId, language.id),
      with: {
        language: true,
      },
    });
    
    return NextResponse.json(filteredDifficultyLevels);
  } catch (error) {
    console.error('GET difficulty levels error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

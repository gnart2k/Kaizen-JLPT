import { db } from '@/lib/db';
import { categories, languages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const languageCode = process.env.NEXT_PUBLIC_LANGUAGE;

    if (!languageCode) {
      return NextResponse.json({ message: 'Language not configured' }, { status: 500 });
    }

    // Find the language by code
    const language = await db.query.languages.findFirst({
      where: eq(languages.code, languageCode),
    });

    if (!language) {
      return NextResponse.json({ message: 'Language not found' }, { status: 404 });
    }

    // Get categories for the specified language
    const allCategories = await db.query.categories.findMany({
      where: eq(categories.languageId, language.id),
      with: {
        language: true,
      },
      orderBy: (categories, { asc }) => [asc(categories.sortOrder), asc(categories.name)],
    });

    return NextResponse.json(allCategories);
  } catch (error) {
    console.error('GET categories error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

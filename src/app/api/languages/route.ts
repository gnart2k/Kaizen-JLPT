import { db } from '@/lib/db';
import { languages } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allLanguages = await db.query.languages.findMany({
      orderBy: (languages, { asc }) => [asc(languages.name)],
    });

    return NextResponse.json(allLanguages);
  } catch (error) {
    console.error('GET languages error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
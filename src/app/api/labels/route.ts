import { db } from '@/lib/db';
import { labels } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allLabels = await db.query.labels.findMany({
      orderBy: (labels, { asc }) => [asc(labels.name)],
    });
    
    return NextResponse.json(allLabels);
  } catch (error) {
    console.error('GET labels error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
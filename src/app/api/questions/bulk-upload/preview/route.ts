import { NextRequest, NextResponse } from 'next/server';
import { parseQuestionsFromFile } from '@/lib/question-parser';

// Set config for Next.js to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ message: 'No file uploaded or file is invalid' }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const fileData = Buffer.from(fileBuffer);

    const { questions, errors } = parseQuestionsFromFile(fileData, file.type);

    return NextResponse.json({ questions, errors });
  } catch (error) {
    console.error('BULK UPLOAD PREVIEW error:', error);
    return NextResponse.json({ message: 'Internal Server Error during parsing' }, { status: 500 });
  }
}

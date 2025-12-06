import { db } from '@/lib/db';
import { answers, questions } from '@/lib/db/schema';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import z from 'zod';
import { questionSchema } from '@/validation-schema/question-schema';

// Define the expected input type for the validated questions
const saveSchema = z.object({
  questions: z.array(questionSchema),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = saveSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid request body', errors: validation.error.errors }, { status: 400 });
    }

    const validatedQuestions = validation.data.questions;

    if (validatedQuestions.length === 0) {
      return NextResponse.json({ message: 'No valid questions to upload' }, { status: 400 });
    }

    await db.transaction(async (tx) => {
      const questionInserts: (typeof questions.$inferInsert)[] = [];
      const answerInserts: (typeof answers.$inferInsert)[] = [];

      for (const q of validatedQuestions) {
        const questionId = uuidv4();

        questionInserts.push({
          id: questionId,
          question: q.question,
          explanation: q.explanation,
          language: q.language,
          difficultyLevelId: q.difficultyLevelId,
          category: q.category,
        } as typeof questions.$inferInsert);

        for (const a of q.answers) {
          answerInserts.push({
            id: uuidv4(),
            questionId: questionId,
            answerText: a.answerText,
            isCorrect: a.isCorrect,
          });
        }
      }

      // Batch insert questions
      if (questionInserts.length > 0) {
        await tx.insert(questions).values(questionInserts);
      }

      // Batch insert answers
      if (answerInserts.length > 0) {
        await tx.insert(answers).values(answerInserts);
      }
    });

    return NextResponse.json({ message: `Successfully uploaded ${validatedQuestions.length} questions` });
  } catch (error) {
    console.error('BULK UPLOAD SAVE error:', error);
    return NextResponse.json({ message: 'Internal Server Error during database save' }, { status: 500 });
  }
}

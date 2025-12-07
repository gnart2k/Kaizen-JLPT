import { db } from '@/lib/db';
import { questions, answers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { questionSchema } from '@/validation-schema/question-schema';

const questionUpdateSchema = z.object({
  question: z.string().min(1).optional(),
  explanation: z.string().optional(),
  languageId: z.string().uuid('Invalid language ID').optional(),
  difficultyLevelId: z.string().uuid('Invalid difficulty level ID').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  answers: z.array(z.object({
    answerText: z.string().min(1),
    isCorrect: z.boolean(),
  })).min(2, 'At least two answers are required').optional(),
}).refine(
  (data) => {
    if (!data.answers) return true; // Skip validation if answers not provided
    return data.answers.filter((a) => a.isCorrect).length === 1;
  },
  {
    message: 'Exactly one answer must be marked as correct.',
    path: ['answers'],
  }
);

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const question = await db.query.questions.findFirst({
      where: eq(questions.id, params.id),
      with: {
        answers: true,
        difficultyLevel: true,
        language: true,
        category: true,
      },
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    return NextResponse.json(question);
  } catch (error) {
    console.error('GET question by ID error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const validatedData = questionUpdateSchema.parse(body);
    const { answers: answerData, ...questionData } = validatedData;

    const updatedQuestion = await db.transaction(async (tx) => {
      // 1. Update questions table
      const [question] = await tx.update(questions)
        .set({
          ...questionData,
          updatedAt: new Date(),
        })
        .where(eq(questions.id, params.id))
        .returning({ id: questions.id });

      if (!question) {
        throw new Error('Question not found');
      }

      let newAnswers = [];
      if (answerData && answerData.length > 0) {
        // 2. Delete old answers
        await tx.delete(answers).where(eq(answers.questionId, question.id));

        // 3. Insert new answers
        const answersToInsert = answerData.map(answer => ({
          questionId: question.id,
          answerText: answer.answerText,
          isCorrect: answer.isCorrect,
        }));

        newAnswers = await tx.insert(answers).values(answersToInsert).returning();
      }

      // Fetch the full updated question object
      const fullQuestion = await tx.query.questions.findFirst({
        where: eq(questions.id, question.id),
        with: { answers: true },
      });

      return fullQuestion;
    });

    if (!updatedQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(updatedQuestion);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request body', details: error.errors }, { status: 400 });
    }
    console.error('PUT question error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const deletedQuestion = await db.delete(questions).where(eq(questions.id, params.id)).returning();

    if (deletedQuestion.length === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Due to onDelete: "cascade", associated answers are also deleted.
    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('DELETE question error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

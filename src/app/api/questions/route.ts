import { db } from '@/lib/db';
import { questions, answers, languages, categories, questionLabels } from '@/lib/db/schema';
import { questionSchema } from '@/validation-schema/question-schema';
import { eq, inArray } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';


export async function GET(req: Request) {
  try {
    const allQuestions = await db.query.questions.findMany({
      with: {
        answers: true,
        difficultyLevel: true,
        language: true,
        category: true,
      },
    });
    return NextResponse.json(allQuestions);
  } catch (error) {
    console.error('GET questions error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = questionSchema.parse(body);
    const { answers: answerData, labelIds, ...questionDataForDb } = validatedData;

    const newQuestion = await db.transaction(async (tx) => {
      // 1. Insert into questions table
      const [question] = await tx.insert(questions).values(questionDataForDb).returning({ id: questions.id });

      if (!question) {
        throw new Error('Failed to create question');
      }

      // 2. Prepare and insert into answers table
      const answersToInsert = answerData.map(answer => ({
        questionId: question.id,
        answerText: answer.answerText,
        isCorrect: answer.isCorrect,
      }));

      const newAnswers = await tx.insert(answers).values(answersToInsert).returning();

      // 3. Insert question-labels relationships if labelIds are provided
      if (labelIds && labelIds.length > 0) {
        const questionLabelsToInsert = labelIds.map(labelId => ({
          questionId: question.id,
          labelId: labelId,
        }));
        await tx.insert(questionLabels).values(questionLabelsToInsert);
      }

      return {
        ...questionDataForDb,
        id: question.id,
        answers: newAnswers,
      };
    });

    return NextResponse.json(newQuestion, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request body', details: error.errors }, { status: 400 });
    }
    console.error('POST question error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

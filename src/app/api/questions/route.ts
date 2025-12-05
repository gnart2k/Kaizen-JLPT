import { db } from '@/lib/db';
import { questions, answers } from '@/lib/db/schema';
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

    // Assuming the client sends the data in the new structured format
    const validatedData = questionSchema.parse(body);
    const { answers: answerData, explanation, ...restQuestionData } = validatedData;

    const questionDataForDb = {
      ...restQuestionData,
      explanation: explanation || '', // Ensure explanation is a string for Drizzle schema
    };

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

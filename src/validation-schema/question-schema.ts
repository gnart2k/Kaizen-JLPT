import z from "zod";

export const questionSchema = z
  .object({
    question: z.string().min(1, 'Question is required'),
    explanation: z.string().optional(),
    language: z.string().min(1, 'Language is required'),
    difficultyLevelId: z.string().uuid('Invalid difficulty level ID').optional(),
    category: z.string().optional(),
    answers: z.array(
      z.object({
        answerText: z.string().min(1, 'Answer text is required'),
        isCorrect: z.boolean(),
      })
    ).min(2, 'At least two answers are required.'),
  })
  .refine(
    (data) => data.answers.filter((a) => a.isCorrect).length === 1,
    {
      message: 'Exactly one answer must be marked as correct.',
      path: ['answers'],
    }
  );


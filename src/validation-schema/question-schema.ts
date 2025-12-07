import z from "zod";

export const questionSchema = z
  .object({
    question: z.string().min(1, 'Question is required'),
    explanation: z.string(),
    languageId: z.string().uuid('Invalid language ID'),
    difficultyLevelId: z.string().uuid('Invalid difficulty level ID').optional(),
    categoryId: z.string().uuid('Invalid category ID').optional(),
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


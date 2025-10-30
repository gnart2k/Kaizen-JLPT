'use server';

/**
 * @fileOverview An AI-powered feedback system for practice questions.
 *
 * - getAiPracticeQuestionFeedback - A function that generates AI feedback for practice questions.
 * - AiPracticeQuestionFeedbackInput - The input type for the getAiPracticeQuestionFeedback function.
 * - AiPracticeQuestionFeedbackOutput - The return type for the getAiPracticeQuestionFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPracticeQuestionFeedbackInputSchema = z.object({
  question: z.string().describe('The practice question that was asked.'),
  answer: z.string().describe('The answer provided by the user.'),
  correctOption: z.string().describe('The correct answer to the question.'),
});
export type AiPracticeQuestionFeedbackInput = z.infer<typeof AiPracticeQuestionFeedbackInputSchema>;

const AiPracticeQuestionFeedbackOutputSchema = z.object({
  explanation: z.string().describe('An explanation of why the answer was correct or incorrect.'),
  relatedContent: z.string().describe('Similar grammar or vocabulary points.'),
  confidenceScore: z.number().optional().describe('An optional confidence score for the feedback.'),
});
export type AiPracticeQuestionFeedbackOutput = z.infer<typeof AiPracticeQuestionFeedbackOutputSchema>;

export async function getAiPracticeQuestionFeedback(
  input: AiPracticeQuestionFeedbackInput
): Promise<AiPracticeQuestionFeedbackOutput> {
  return aiPracticeQuestionFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPracticeQuestionFeedbackPrompt',
  input: {schema: AiPracticeQuestionFeedbackInputSchema},
  output: {schema: AiPracticeQuestionFeedbackOutputSchema},
  prompt: `You are an AI assistant providing feedback on Japanese language practice questions for the JLPT exam.

  Provide a detailed explanation of why the user's answer was correct or incorrect.
  Highlight related grammar rules or vocabulary points to aid understanding.
  Optionally, include a confidence score indicating the certainty of the feedback.

  Question: {{{question}}}
  User's Answer: {{{answer}}}
  Correct Answer: {{{correctOption}}}`,
});

const aiPracticeQuestionFeedbackFlow = ai.defineFlow(
  {
    name: 'aiPracticeQuestionFeedbackFlow',
    inputSchema: AiPracticeQuestionFeedbackInputSchema,
    outputSchema: AiPracticeQuestionFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

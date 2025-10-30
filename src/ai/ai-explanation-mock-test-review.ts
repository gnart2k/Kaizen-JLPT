'use server';

/**
 * @fileOverview Provides AI-powered explanations for mock test review.
 *
 * - getExplanationForAnswer - A function that provides an explanation for a given answer in a mock test.
 * - ExplanationForAnswerInput - The input type for the getExplanationForAnswer function.
 * - ExplanationForAnswerOutput - The return type for the getExplanationForAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplanationForAnswerInputSchema = z.object({
  question: z.string().describe('The question text.'),
  answer: z.string().describe('The user provided answer.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
  explanation: z.string().optional().describe('The original explanation for the question.'),
  level: z.string().describe('The JLPT level of the question (e.g., N5, N4, N3, N2, N1).'),
  type: z.string().describe('The type of question (vocabulary, grammar, or listening).'),
});
export type ExplanationForAnswerInput = z.infer<typeof ExplanationForAnswerInputSchema>;

const ExplanationForAnswerOutputSchema = z.object({
  explanation: z.string().describe('The AI-generated explanation for the answer.'),
});
export type ExplanationForAnswerOutput = z.infer<typeof ExplanationForAnswerOutputSchema>;

export async function getExplanationForAnswer(
  input: ExplanationForAnswerInput
): Promise<ExplanationForAnswerOutput> {
  return explanationForAnswerFlow(input);
}

const explanationPrompt = ai.definePrompt({
  name: 'explanationPrompt',
  input: {schema: ExplanationForAnswerInputSchema},
  output: {schema: ExplanationForAnswerOutputSchema},
  prompt: `You are an expert JLPT tutor. You are helping a student review their mock test.

  The student answered the following question with the following answer:
  Question: {{{question}}}
  Student's Answer: {{{answer}}}
  Correct Answer: {{{correctAnswer}}}

  The question is from the JLPT level: {{{level}}}, and is a {{{type}}} question.

  Provide a detailed explanation of why the student's answer is right or wrong, and provide some related grammar or vocabulary points to help them understand the concept better.

  Original Explanation: {{{explanation}}}
  If the original explanation exists, incorporate it into your AI explanation. 
  `,
});

const explanationForAnswerFlow = ai.defineFlow(
  {
    name: 'explanationForAnswerFlow',
    inputSchema: ExplanationForAnswerInputSchema,
    outputSchema: ExplanationForAnswerOutputSchema,
  },
  async input => {
    const {output} = await explanationPrompt(input);
    return output!;
  }
);

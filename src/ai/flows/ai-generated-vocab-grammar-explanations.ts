'use server';
/**
 * @fileOverview Provides AI-generated explanations for vocabulary and grammar points.
 *
 * - getExplanation - A function that generates explanations for vocabulary and grammar.
 * - ExplanationInput - The input type for the getExplanation function.
 * - ExplanationOutput - The return type for the getExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplanationInputSchema = z.object({
  query: z
    .string()
    .describe('The vocabulary or grammar point to get an explanation for.'),
});
export type ExplanationInput = z.infer<typeof ExplanationInputSchema>;

const ExplanationOutputSchema = z.object({
  explanation: z.string().describe('The AI-generated explanation.'),
});
export type ExplanationOutput = z.infer<typeof ExplanationOutputSchema>;

export async function getExplanation(input: ExplanationInput): Promise<ExplanationOutput> {
  return explanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explanationPrompt',
  input: {schema: ExplanationInputSchema},
  output: {schema: ExplanationOutputSchema},
  prompt: `You are an expert Japanese language teacher. Provide a clear and concise explanation for the following vocabulary or grammar point:

{{{query}}}

Focus on meaning, usage context, and common examples.`,
});

const explanationFlow = ai.defineFlow(
  {
    name: 'explanationFlow',
    inputSchema: ExplanationInputSchema,
    outputSchema: ExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';

import { getExplanation as getExplanationFlow } from '@/ai/flows/ai-generated-vocab-grammar-explanations';
import type { ExplanationInput } from '@/ai/flows/ai-generated-vocab-grammar-explanations';

export async function getExplanation(input: ExplanationInput) {
    try {
        const result = await getExplanationFlow(input);
        return { success: true, explanation: result.explanation };
    } catch (error) {
        console.error("Error getting explanation:", error);
        return { success: false, error: 'Failed to get explanation from AI.' };
    }
}

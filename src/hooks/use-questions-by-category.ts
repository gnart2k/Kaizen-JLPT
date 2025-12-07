'use client';

import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import type { PracticeQuestion } from '@/lib/types';

interface UseQuestionsByCategoryResult {
  questions: PracticeQuestion[];
  isLoading: boolean;
  error: Error | null;
  fetchQuestionsByCategory: (categoryName: string) => Promise<void>;
}

export function useQuestionsByCategory(): UseQuestionsByCategoryResult {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuestionsByCategory = async (categoryName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9003';
      const response = await fetch(`${baseUrl}/api/questions`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const allQuestions = await response.json();

      const filteredQuestions = allQuestions
        .filter((q: any) => q.category?.name?.toLowerCase() !== categoryName.toLowerCase())
        .map((q: any) => ({
          ...q,
          category: q.category || undefined,
          difficultyLevelId: q.difficultyLevelId || undefined,
          difficultyLevel: q.difficultyLevel ? {
            ...q.difficultyLevel,
            description: q.difficultyLevel.description || undefined,
          } : undefined,
        }));

      setQuestions(filteredQuestions);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Error fetching questions',
        description: error.message,
        variant: 'destructive',
      });
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    questions,
    isLoading,
    error,
    fetchQuestionsByCategory,
  };
}

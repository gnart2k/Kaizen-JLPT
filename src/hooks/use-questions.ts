'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import type { PracticeQuestion } from '@/lib/types';

interface UseQuestionsResult {
  questions: PracticeQuestion[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
}

export function useQuestions(): UseQuestionsResult {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/questions');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Error fetching questions',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      setQuestions(questions.filter((q) => q.id !== id));
      toast({
        title: 'Question deleted successfully',
      });
    } catch (err) {
      const error = err as Error;
      toast({
        title: 'Error deleting question',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return {
    questions,
    isLoading,
    error,
    refetch: fetchQuestions,
    deleteQuestion,
  };
}
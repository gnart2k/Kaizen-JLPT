import { useState, useEffect } from 'react';
import { DifficultyLevel } from '@/lib/types';

type UseDifficultyLevelsResult = {
  levels: DifficultyLevel[];
  isLoading: boolean;
  error: Error | null;
};

export const useDifficultyLevels = (language?: string): UseDifficultyLevelsResult => {
  const [levels, setLevels] = useState<DifficultyLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const url = language
          ? `/api/difficulty-levels?language=${language}`
          : '/api/difficulty-levels';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch difficulty levels');
        }
        const data: DifficultyLevel[] = await response.json();
        setLevels(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLevels();
  }, [language]);

  return { levels, isLoading, error };
};

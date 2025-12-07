'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import type { Language } from '@/lib/types';

interface UseLanguagesResult {
  languages: Language[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useLanguages(): UseLanguagesResult {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLanguages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9003';
      const response = await fetch(`${baseUrl}/api/languages`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch languages');
      }

      const data = await response.json();
      setLanguages(data);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Error fetching languages',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return {
    languages,
    isLoading,
    error,
    refetch: fetchLanguages,
  };
}
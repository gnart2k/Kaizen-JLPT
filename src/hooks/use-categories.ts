'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { getCategories } from '@/lib/api';
import type { Category } from '@/lib/types';

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Error fetching categories',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
}
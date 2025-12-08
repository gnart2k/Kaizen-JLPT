import { useState, useEffect } from 'react';
import { Label } from '@/lib/types';

type UseLabelsResult = {
  labels: Label[];
  isLoading: boolean;
  error: Error | null;
};

export const useLabels = (): UseLabelsResult => {
  const [labels, setLabels] = useState<Label[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await fetch('/api/labels');
        if (!response.ok) {
          throw new Error('Failed to fetch labels');
        }
        const data: Label[] = await response.json();
        setLabels(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabels();
  }, []);

  return { labels, isLoading, error };
};
'use client';

import { useState, useEffect, useCallback } from 'react';
import { DifficultyLevel } from '@/lib/types';
import { useDifficultyLevels } from './use-difficulty-levels';
import { useAuth } from './use-auth';
import { toast } from './use-toast';

interface UseTargetLevelResult {
  targetLevelId: string | null;
  targetLevel: DifficultyLevel | null;
  isLoading: boolean;
  error: Error | null;
  updateTargetLevel: (levelId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useTargetLevel(): UseTargetLevelResult {
  const { user } = useAuth();
  const { levels, isLoading: levelsLoading } = useDifficultyLevels();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const targetLevelId = user?.targetLevelId || null;
  const targetLevel = levels?.find(level => level.id === targetLevelId) || null;

  const updateTargetLevel = useCallback(async (levelId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to update your target level',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/target-level', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetLevelId: levelId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update target level');
      }

      const updatedUser = await response.json();

      // Update user state - this would typically be handled by a user store
      // For now, we'll trigger a page reload to refresh user data
      window.location.reload();

      toast({
        title: 'Target Level Updated',
        description: `Your target level has been updated successfully`,
      });
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const refetch = useCallback(async () => {
    // This would typically refresh user data from server
    window.location.reload();
  }, []);

  return {
    targetLevelId,
    targetLevel,
    isLoading: isLoading || levelsLoading,
    error,
    updateTargetLevel,
    refetch,
  };
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DifficultyLevel } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface TargetLevelSelectorProps {
  currentLevel?: string | null;
  onLevelChange: (levelId: string) => void;
  disabled?: boolean;
  levels: DifficultyLevel[];
  isLoading?: boolean;
}

export function TargetLevelSelector({ 
  currentLevel, 
  onLevelChange, 
  disabled = false,
  levels,
  isLoading = false
}: TargetLevelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLevelChange = (levelId: string) => {
    onLevelChange(levelId);
    setIsOpen(false);
  };

  const currentLevelData = levels.find(level => level.id === currentLevel);

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-muted-foreground">Target Level:</span>
      <Select 
        open={isOpen} 
        onOpenChange={setIsOpen}
        value={currentLevel || undefined} 
        onValueChange={handleLevelChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className="w-32">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </div>
          ) : currentLevelData ? (
            <span>{currentLevelData.levelName}</span>
          ) : (
            <span>Select Level</span>
          )}
        </SelectTrigger>
        <SelectContent>
          {levels.map((level) => (
            <SelectItem key={level.id} value={level.id}>
              {level.levelName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
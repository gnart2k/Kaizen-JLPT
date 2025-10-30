'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { JlptLevel } from "@/lib/types";

export function LevelSelector({ levels }: { levels: JlptLevel[] }) {
  return (
    <div className="flex items-center space-x-2">
      <Select defaultValue={levels[2]}>
        <SelectTrigger className="w-[120px] rounded-lg shadow-sm">
          <SelectValue placeholder="Select Level" />
        </SelectTrigger>
        <SelectContent>
          {levels.map((level) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

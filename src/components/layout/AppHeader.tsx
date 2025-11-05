'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function AppHeader() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h1 className="text-xl font-semibold">Kaizen JLPT</h1>
      <div className="flex items-center space-x-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/questions/create">
            <Plus className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
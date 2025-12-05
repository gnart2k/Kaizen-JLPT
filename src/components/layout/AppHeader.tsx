'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function AppHeader() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <h1 className="text-xl font-semibold">Kaizen JLPT</h1>
      <div className="flex items-center space-x-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/questions/create">
            <Plus className="h-5 w-5" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  );
}
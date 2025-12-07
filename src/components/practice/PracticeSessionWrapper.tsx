'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { PracticeSession } from '@/components/practice/PracticeSession';
import { useQuestionsByCategory } from '@/hooks/use-questions-by-category';

interface PracticeSessionWrapperProps {
  practiceTypes: { title: string; description: string }[];
}

export function PracticeSessionWrapper({ practiceTypes }: PracticeSessionWrapperProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { questions, isLoading, error, fetchQuestionsByCategory } = useQuestionsByCategory();
  console.log(questions)

  const startPractice = async (category: string) => {
    setSelectedCategory(category);

    if (category === 'Listening') {
      // No listening questions available yet.
      return;
    } else {
      // Fetch questions based on category
      await fetchQuestionsByCategory(category);
    }
  };

  if (selectedCategory) {
    return (
      <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
        <Button variant="outline" onClick={() => setSelectedCategory(null)} className="mb-4 rounded-lg">
          &larr; Back to Practice Modes
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">{selectedCategory} Practice</h2>
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading questions...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive">Error: {error.message}</p>
              </div>
            ) : questions.length > 0 ? (
              <PracticeSession questions={questions} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No questions available for this category yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Practice Mode</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {practiceTypes.map(type => (
          <Card key={type.title} className="rounded-2xl shadow-md flex flex-col">
            <CardHeader>
              <CardTitle>{type.title}</CardTitle>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button
                className="w-full rounded-lg"
                onClick={() => startPractice(type.title)}
              >
                Start Practicing <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

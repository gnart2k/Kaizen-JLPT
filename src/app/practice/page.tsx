'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { PracticeSession } from '@/components/practice/PracticeSession';
import type { PracticeQuestion } from '@/lib/types';
import { practiceQuestions as allPracticeQuestions } from '@/lib/data';

type PracticeType = 'Vocabulary' | 'Grammar' | 'Listening';

const practiceTypes: { title: PracticeType, description: string }[] = [
    { title: 'Vocabulary', description: 'Test your knowledge of words and kanji.' },
    { title: 'Grammar', description: 'Practice sentence structure and particles.' },
    { title: 'Listening', description: 'Sharpen your comprehension of spoken Japanese.' },
];

export default function PracticePage() {
    const [selectedCategory, setSelectedCategory] = useState<PracticeType | null>(null);
    const [questions, setQuestions] = useState<PracticeQuestion[]>([]);

    const startPractice = (category: PracticeType) => {
        // In a real app, you'd filter questions based on the category.
        // For now, we'll just use all questions for any category.
        if (category === 'Listening') {
            // No listening questions available yet.
            setQuestions([]);
        } else {
            setQuestions(allPracticeQuestions);
        }
        setSelectedCategory(category);
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
                        {questions.length > 0 ? (
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
                            <Button className="w-full rounded-lg" onClick={() => startPractice(type.title)}>
                                Start Practicing <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

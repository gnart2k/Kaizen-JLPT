'use client';

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { practiceQuestions } from '@/lib/data';
import { getExplanation } from '@/app/actions';
import { Skeleton } from '../ui/skeleton';
import { CheckCircle, XCircle } from 'lucide-react';

export function PracticeSession() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [aiExplanation, setAiExplanation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const question = practiceQuestions[currentQuestionIndex];

    const handleSubmit = async () => {
        if (!selectedAnswer) return;

        const isCorrect = selectedAnswer === question.correctAnswer;
        setFeedback(isCorrect ? 'correct' : 'incorrect');

        if (!isCorrect) {
            setIsLoading(true);
            setAiExplanation(null);
            const result = await getExplanation({ query: `In the sentence "${question.question}", why is the answer "${selectedAnswer}" incorrect and "${question.correctAnswer}" correct?` });
            if (result.success) {
                setAiExplanation(result.explanation);
            } else {
                setAiExplanation(result.error || 'Failed to load explanation.');
            }
            setIsLoading(false);
        } else {
             setAiExplanation(question.explanation || 'Great job!');
        }
    };
    
    const handleNext = () => {
        setSelectedAnswer(null);
        setFeedback(null);
        setAiExplanation(null);
        setCurrentQuestionIndex((prev) => (prev + 1) % practiceQuestions.length);
    }
    
    return (
        <div>
            <h3 className="text-xl font-semibold mb-4 font-headline">{question.question}</h3>
            <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer || ''} disabled={!!feedback} className="gap-3">
                {question.options.map(option => (
                    <Label key={option} htmlFor={option} className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors cursor-pointer ${selectedAnswer === option ? 'border-primary bg-primary/5' : 'hover:bg-accent/50'}`}>
                        <RadioGroupItem value={option} id={option} />
                        <span className="text-base">{option}</span>
                    </Label>
                ))}
            </RadioGroup>

            <div className="mt-6">
                {!feedback ? (
                     <Button onClick={handleSubmit} disabled={!selectedAnswer} className="rounded-lg">Check Answer</Button>
                ) : (
                    <Button onClick={handleNext} className="rounded-lg">Next Question</Button>
                )}
            </div>

            {feedback && (
                <Card className={`mt-6 rounded-2xl border-2 ${feedback === 'correct' ? 'border-success' : 'border-destructive'}`}>
                    <CardHeader>
                        <CardTitle className={`flex items-center gap-2 ${feedback === 'correct' ? 'text-success' : 'text-destructive'}`}>
                            {feedback === 'correct' ? <CheckCircle /> : <XCircle />}
                            {feedback === 'correct' ? 'Correct!' : 'Incorrect'}
                        </CardTitle>
                        {feedback === 'incorrect' && <CardDescription>Correct answer: {question.correctAnswer}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                        {isLoading && (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        )}
                        {aiExplanation && !isLoading && (
                            <p className="text-sm text-muted-foreground leading-relaxed">{aiExplanation}</p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

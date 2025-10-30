'use client';

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getExplanation } from '@/app/actions';
import { Skeleton } from '../ui/skeleton';
import { CheckCircle, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';
import type { PracticeQuestion } from '@/lib/types';

interface PracticeSessionProps {
    questions: PracticeQuestion[];
}

export function PracticeSession({ questions }: PracticeSessionProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [aiExplanation, setAiExplanation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const question = questions[currentQuestionIndex];

    const handleSubmit = async () => {
        if (!selectedAnswer) return;

        const isCorrect = selectedAnswer === question.correctAnswer;
        setFeedback(isCorrect ? 'correct' : 'incorrect');

        setIsLoading(true);
        setAiExplanation(null);

        let query = '';
        if (isCorrect) {
            query = question.explanation || `The answer for "${question.question}" is "${question.correctAnswer}". Explain why this is correct.`
        } else {
            query = `In the sentence "${question.question}", why is the answer "${selectedAnswer}" incorrect and "${question.correctAnswer}" correct?`;
        }
        
        const result = await getExplanation({ query });
        
        if (result.success) {
            setAiExplanation(result.explanation);
        } else {
            setAiExplanation(result.error || 'Failed to load explanation.');
        }
        setIsLoading(false);
    };
    
    const handleNext = () => {
        setSelectedAnswer(null);
        setFeedback(null);
        setAiExplanation(null);
        setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
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
                     <Button onClick={handleSubmit} disabled={!selectedAnswer || isLoading} className="rounded-lg">
                        {isLoading ? 'Getting Feedback...' : 'Check Answer'}
                     </Button>
                ) : (
                    <Button onClick={handleNext} className="rounded-lg">Next Question</Button>
                )}
            </div>

            {(feedback || isLoading) && (
                <Card className={`mt-6 rounded-2xl ${!feedback ? 'border-dashed' : (feedback === 'correct' ? 'border-success border-2' : 'border-destructive border-2')}`}>
                    <CardHeader>
                        {feedback && (
                            <>
                                <CardTitle className={`flex items-center gap-2 ${feedback === 'correct' ? 'text-success' : 'text-destructive'}`}>
                                    {feedback === 'correct' ? <CheckCircle /> : <XCircle />}
                                    {feedback === 'correct' ? 'Correct!' : 'Incorrect'}
                                </CardTitle>
                                {feedback === 'incorrect' && <CardDescription>Correct answer: {question.correctAnswer}</CardDescription>}
                            </>
                        )}
                    </CardHeader>
                    <CardContent>
                        {isLoading && (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        )}
                        {aiExplanation && !isLoading && (
                             <div className={cn('prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed')}>
                                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{aiExplanation}</ReactMarkdown>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

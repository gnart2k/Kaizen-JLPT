'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getExplanation } from '@/app/actions';
import type { LibraryItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';

interface ExplanationDialogProps {
    item: LibraryItem;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ExplanationDialog({ item, open, onOpenChange }: ExplanationDialogProps) {
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && item) {
            let isMounted = true;
            const fetchExplanation = async () => {
                if (isMounted) {
                    setIsLoading(true);
                    setError('');
                    setExplanation('');
                }
                const result = await getExplanation({ query: item.item });
                if (isMounted) {
                    if (result.success) {
                        setExplanation(result.explanation || '');
                    } else {
                        setError(result.error || 'An unknown error occurred.');
                    }
                    setIsLoading(false);
                }
            };
            fetchExplanation();
            return () => {
                isMounted = false;
            };
        }
    }, [open, item]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">{item.item}</DialogTitle>
                    <DialogDescription>{item.meaning}</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <h3 className="font-semibold text-foreground">AI Explanation</h3>
                    {isLoading && (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    )}
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    {!isLoading && explanation && (
                        <div className={cn('prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed')}>
                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{explanation}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

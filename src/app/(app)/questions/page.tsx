'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

interface Question {
  id: string;
  question: string;
  language: string;
  difficulty?: string;
  category?: string;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch('/api/questions');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        toast({
          title: 'Error fetching questions',
          description: (error as Error).message,
          variant: 'destructive',
        });
      }
    }

    fetchQuestions();
  }, []);

  async function deleteQuestion(id: string) {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete question');
      }

      setQuestions(questions.filter((q) => q.id !== id));
      toast({
        title: 'Question deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error deleting question',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Questions</h1>
        <div className="flex space-x-2">
          <Button asChild variant="outline">
            <Link href="/questions/bulk-upload">Bulk Upload</Link>
          </Button>
          <Button asChild>
            <Link href="/questions/create">Create Question</Link>
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id}>
              <TableCell>{question.question}</TableCell>
              <TableCell>{question.language}</TableCell>
              <TableCell>{question.difficulty}</TableCell>
              <TableCell>{question.category}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/questions/${question.id}/edit`}>Edit</Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteQuestion(question.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

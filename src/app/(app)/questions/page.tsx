'use client';

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
import { useQuestions } from '@/hooks/use-questions';

export default function QuestionsPage() {
  const { questions, isLoading, error, deleteQuestion } = useQuestions();

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
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
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
                <TableCell>{question.language?.name || 'Unknown'}</TableCell>
                <TableCell>{question.difficultyLevel?.levelName || 'Not set'}</TableCell>
                <TableCell>{question.category?.name || 'Not set'}</TableCell>
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
      )}
    </div>
  );
}

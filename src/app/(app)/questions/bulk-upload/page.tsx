'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { questionSchema } from '@/validation-schema/question-schema';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Upload } from 'lucide-react';

// Define the form schema for the file input
const fileSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size > 0, 'File is required'),
});

type FileFormValues = z.infer<typeof fileSchema>;
type QuestionPreview = z.infer<typeof questionSchema>;
type ValidationError = { row: number; message: string };

export default function BulkUploadPage() {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<QuestionPreview[] | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FileFormValues>({
    resolver: zodResolver(fileSchema),
  });

  const fileRef = form.register('file');

  const handlePreview = async (values: FileFormValues) => {
    setIsUploading(true);
    setPreviewData(null);
    setValidationErrors([]);

    try {
      const formData = new FormData();
      formData.append('file', values.file);

      const response = await fetch('/api/questions/bulk-upload/preview', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process file for preview.');
      }

      setPreviewData(data.questions);
      setValidationErrors(data.errors);

      toast({
        title: 'Preview Ready',
        description: `${data.questions.length} questions parsed. ${data.errors.length} rows have errors.`,
      });
    } catch (error) {
      toast({
        title: 'Upload Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!previewData || previewData.length === 0) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/questions/bulk-upload/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: previewData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save questions to database.');
      }

      toast({
        title: 'Upload Complete',
        description: data.message,
      });

      router.push('/questions');
    } catch (error) {
      toast({
        title: 'Save Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const totalValid = previewData?.length || 0;
  const totalErrors = validationErrors.length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bulk Question Upload</h1>
      <p className="text-muted-foreground">Upload a CSV or Excel file to create multiple questions at once. The file must follow the required column structure.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePreview)} className="space-y-4">
          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormLabel>Question File (.csv, .xlsx, .xls)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    {...fileRef}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isUploading || isSaving}>
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Processing...' : 'Preview Questions'}
          </Button>
        </form>
      </Form>

      {(totalValid > 0 || totalErrors > 0) && (
        <div className="space-y-4 pt-4">
          <h2 className="text-2xl font-semibold">Upload Summary</h2>

          {totalErrors > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Validation Errors ({totalErrors} rows)</AlertTitle>
              <AlertDescription>
                The following rows contain errors and will NOT be uploaded. Please fix the file and re-upload.
                <ul className="mt-2 list-disc pl-5">
                  {validationErrors.map((err, index) => (
                    <li key={index}>Row {err.row}: {err.message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {totalValid > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Valid Questions ({totalValid})</AlertTitle>
              <AlertDescription>
                {totalValid} questions are ready for upload. Review the preview below and click "Confirm Upload" to save them to the database.
              </AlertDescription>
            </Alert>
          )}

          {totalValid > 0 && (
            <>
              <Button onClick={handleSave} disabled={isSaving || isUploading} className="w-full">
                {isSaving ? 'Saving to Database...' : `Confirm Upload (${totalValid} Questions)`}
              </Button>

              <h3 className="text-xl font-medium pt-2">Preview ({totalValid} Questions)</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead>Level ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Answers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData?.map((q, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="max-w-xs truncate">{q.question}</TableCell>
                        <TableCell>{q.difficultyLevelId || 'N/A'}</TableCell>
                        <TableCell>{q.category || 'N/A'}</TableCell>
                        <TableCell>
                          <ul className="list-disc pl-4">
                            {q.answers.map((a, aIndex) => (
                              <li key={aIndex} className={a.isCorrect ? 'font-semibold text-green-600' : 'text-muted-foreground'}>
                                {a.answerText}
                              </li>
                            ))}
                          </ul>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

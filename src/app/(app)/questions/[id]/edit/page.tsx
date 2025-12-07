
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { questionSchema } from '@/validation-schema/question-schema';

const formSchema = questionSchema;

type FormValues = z.infer<typeof formSchema>;

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      explanation: '',
      answers: [
        { answerText: '', isCorrect: true },
        { answerText: '', isCorrect: false },
      ],
      languageId: '',
      difficultyLevelId: '',
      categoryId: '',
    },
  });

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const response = await fetch(`/api/questions/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch question');
        }
        const data = await response.json();
        // The fetched data has extra fields (id, createdAt, etc.) and the answers array
        // matches the form structure (answerText, isCorrect)
        form.reset(data);
      } catch (error) {
        toast({
          title: 'Error fetching question',
          description: (error as Error).message,
          variant: 'destructive',
        });
      }
    }

    if (id) {
      fetchQuestion();
    }
  }, [id, form]);

  const {
    fields: answersFields,
    append: appendAnswer,
    remove: removeAnswer,
  } = useFieldArray({
    control: form.control,
    name: 'answers',
  });

  async function onSubmit(values: FormValues) {
    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update question');
      }

      toast({
        title: 'Question updated successfully',
      });
      router.push('/questions');
    } catch (error) {
      toast({
        title: 'Error updating question',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea placeholder="What is the capital of Japan?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Answers</FormLabel>
          {answersFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mb-2">
              <FormField
                control={form.control}
                name={`answers.${index}.answerText`}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`answers.${index}.isCorrect`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Correct</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeAnswer(index)}
                disabled={answersFields.length <= 2}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => appendAnswer({ answerText: '', isCorrect: false })}
          >
            Add Answer
          </Button>
          <FormMessage>
            {form.formState.errors.answers?.message}
          </FormMessage>
        </div>

        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Explanation</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed explanation for the correct answer."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="languageId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* TODO: Fetch languages from API and map to SelectItem with ID as value */}
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="difficultyLevelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* TODO: Fetch difficulty levels from API and map to SelectItem with ID as value */}
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* TODO: Fetch categories from API and map to SelectItem with ID as value */}
                  <SelectItem value="">No category</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update Question</Button>
      </form>
    </Form>
  );
}

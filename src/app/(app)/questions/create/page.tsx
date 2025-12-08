'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { questionSchema } from '@/validation-schema/question-schema';
import { useDifficultyLevels } from '@/hooks/use-difficulty-levels';
import { useCategories } from '@/hooks/use-categories';
import { useLabels } from '@/hooks/use-labels';
import { useLanguage } from '@/hooks/use-language';

const formSchema = questionSchema;
type FormValues = z.infer<typeof formSchema>;

export default function CreateQuestionPage() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
  });

  const { levels, isLoading: levelsLoading, error: levelsError } = useDifficultyLevels();
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { labels } = useLabels();
  const { currentLanguageId, isLoading: languageLoading, error: languageError } = useLanguage();

  useEffect(() => {
    if (currentLanguageId) {
      form.reset({
        question: '',
        explanation: '',
        answers: [
          { answerText: '', isCorrect: true },
          { answerText: '', isCorrect: false },
        ],
        languageId: currentLanguageId,
        difficultyLevelId: '',
        categoryId: '',
        labelIds: [],
      });
    }
  }, [currentLanguageId, form]);

  const {
    fields: answersFields,
    append: appendAnswer,
    remove: removeAnswer,
  } = useFieldArray({
    control: form.control,
    name: 'answers',
  });

  async function onSubmit(values: FormValues) {
    console.log('=== FORM SUBMIT TRIGGERED ===');
    console.log('Form submitted with values:', values);
    console.log('Form errors:', form.formState.errors);
    console.log('Current language ID from context:', currentLanguageId);
    
    if (!currentLanguageId) {
      toast({
        title: 'Configuration Error',
        description: 'Language not loaded',
        variant: 'destructive',
      });
      return;
    }

    const submissionData = {
      ...values,
      languageId: currentLanguageId,
    };
    console.log('Submission data:', submissionData);

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to create question');
      }

      toast({
        title: 'Question created successfully',
      });
      router.push('/questions');
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: 'Error creating question',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  }

  if (languageLoading) {
    return <div className="flex items-center justify-center h-screen">Loading language configuration...</div>;
  }

  if (languageError) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error: {languageError}</div>;
  }

  return (
    <div className="max-h-screen overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6 pb-20" noValidate>
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What is the capital of Japan?"
                  {...field}
                />
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
          name="difficultyLevelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={levelsLoading || !!levelsError}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={levelsLoading ? 'Loading levels...' : levelsError ? 'Error loading levels' : 'Select a difficulty'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.levelName} ({level.language?.name || level.languageId})
                    </SelectItem>
                  ))}
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
              <Select onValueChange={field.onChange} value={field.value} disabled={categoriesLoading || !!categoriesError}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={categoriesLoading ? 'Loading categories...' : categoriesError ? 'Error loading categories' : 'Select a category'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="labelIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Labels</FormLabel>
              <div className="space-y-2">
                {labels.map((label) => (
                  <div key={label.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={label.id}
                      checked={field.value?.includes(label.id) || false}
                      onChange={(e) => {
                        const currentValues = field.value || [];
                        if (e.target.checked) {
                          field.onChange([...currentValues, label.id]);
                        } else {
                          field.onChange(currentValues.filter((id: string) => id !== label.id));
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={label.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2">
                      <span>{label.name}</span>
                      <span 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: label.color }}
                      />
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Question</Button>
        </form>
      </Form>
    </div>
  );
}


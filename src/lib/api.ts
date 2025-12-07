import type { PracticeQuestion, Category } from '@/lib/types';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9003';

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${baseUrl}${url}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response?.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API Error for ${url}:`, error);
    throw error;
  }
}

export async function getPracticeQuestions(): Promise<PracticeQuestion[]> {
  try {
    const allQuestions = await apiRequest<any[]>('/api/questions');

    console.log("allQuestion", allQuestions)

    return allQuestions.map((q: any) => ({
      ...q,
      category: q.category || undefined,
      difficultyLevelId: q.difficultyLevelId || undefined,
      difficultyLevel: q.difficultyLevel ? {
        ...q.difficultyLevel,
        description: q.difficultyLevel.description || undefined,
      } : undefined,
    }));
  } catch (error) {
    console.error('Error fetching practice questions:', error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const allCategories = await apiRequest<Category[]>('/api/categories');
    return allCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getQuestionsByCategory(categoryName: string): Promise<PracticeQuestion[]> {
  try {
    const allQuestions = await apiRequest<any[]>('/api/questions');

    console.log(allQuestions)

    return allQuestions
      .filter((q: any) => q.category?.name?.toLowerCase() === categoryName.toLowerCase())
      .map((q: any) => ({
        ...q,
        // category: q.category || undefined,
        difficultyLevelId: q.difficultyLevelId || undefined,
        difficultyLevel: q.difficultyLevel ? {
          ...q.difficultyLevel,
          description: q.difficultyLevel.description || undefined,
        } : undefined,
      }));

  } catch (error) {
    console.error('Error fetching questions by category:', error);
    return [];
  }
}

export const api = {
  get: <T>(url: string) => apiRequest<T>(url),
  post: <T>(url: string, data: any) => apiRequest<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: <T>(url: string, data: any) => apiRequest<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: <T>(url: string) => apiRequest<T>(url, {
    method: 'DELETE',
  }),
};

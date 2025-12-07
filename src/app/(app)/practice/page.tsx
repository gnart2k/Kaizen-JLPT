import { PracticeSessionWrapper } from '@/components/practice/PracticeSessionWrapper';
import { getCategories } from '@/lib/api';
import type { Category } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function PracticePage() {
  const categories = await getCategories();

  const practiceTypes = categories.map((category: Category) => ({
    title: category.name,
    description: category.description || `Practice ${category.name.toLowerCase()}`,
  }));

  return (
    <PracticeSessionWrapper practiceTypes={practiceTypes} />
  );
}

## Plan Name
Implement Practice with API instead of Dummy Data

## Files to be Created
No new files will be created. This feature involves modifying existing files.

## File Location
N/A (Modifying existing files)

## Description
Replace the dummy data in the practice functionality with real API calls to fetch questions from the database. This will involve:
1. Updating the practice page to fetch questions from the `/api/questions` endpoint
2. Modifying the `PracticeQuestion` type to match the database schema
3. Updating the `PracticeSession` component to handle the new data structure
4. Adding filtering logic for different practice categories (Vocabulary, Grammar, Listening)
5. Adding error handling and loading states

## Current State Analysis
- Practice page currently uses `practiceQuestions` from `@/lib/data` (dummy data)
- API endpoint `/api/questions` already exists and returns questions with answers
- Database schema has `questions` and `answers` tables with proper relations
- `PracticeQuestion` type needs to be updated to match the API response structure

## File Structure

### `src/lib/types.ts`
Update the `PracticeQuestion` type to match the database schema:
```typescript
export type PracticeQuestion = {
  id: string;
  question: string;
  explanation?: string;
  language: string;
  category?: string;
  difficultyLevelId?: string;
  answers: {
    id: string;
    answerText: string;
    isCorrect: boolean;
  }[];
  difficultyLevel?: {
    id: string;
    language: string;
    levelName: string;
    description?: string;
  };
};
```

### `src/app/(app)/practice/page.tsx`
Replace dummy data with API calls:
```typescript
// Remove import of practiceQuestions from @/lib/data
// Add useState for loading and error states
// Add useEffect to fetch questions from API
// Add filtering logic based on category
// Add error handling and loading UI
```

### `src/components/practice/PracticeSession.tsx`
Update to handle new data structure:
```typescript
// Update to use answers array instead of options/correctAnswer
// Map answerText to options
// Find correct answer using isCorrect flag
```

## Implementation Steps

1. **Update Type Definitions**
   - Modify `PracticeQuestion` type in `src/lib/types.ts`
   - Ensure compatibility with API response structure

2. **Update Practice Page**
   - Remove dummy data import
   - Add API fetching logic with `useEffect`
   - Implement loading and error states
   - Add category filtering logic
   - Handle empty states properly

3. **Update Practice Session Component**
   - Adapt to new data structure
   - Map answers array to component expectations
   - Ensure correct answer identification works

4. **Add Error Handling**
   - Network error handling
   - Empty data handling
   - User-friendly error messages

5. **Add Loading States**
   - Loading spinner while fetching questions
   - Smooth transitions between states

## API Integration Details

The practice page will:
- Make GET request to `/api/questions` on component mount
- Filter questions based on selected category (Vocabulary/Grammar)
- Transform the API response to match component expectations
- Handle loading and error states gracefully

## Data Transformation
API response structure:
```typescript
{
  id: string;
  question: string;
  explanation: string;
  language: string;
  category: string;
  answers: Array<{
    id: string;
    answerText: string;
    isCorrect: boolean;
  }>;
}
```

Will be transformed to component expectations:
```typescript
{
  id: string;
  question: string;
  options: string[]; // from answers.answerText
  correctAnswer: string; // from answers.find(a => a.isCorrect).answerText
  explanation?: string;
}
```

## Testing Considerations
- Test API integration with real data
- Verify category filtering works correctly
- Test error states and loading states
- Ensure practice session functionality remains intact
- Test with different question categories and languages
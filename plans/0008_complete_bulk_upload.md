# Plan: Complete Upload Multiple Questions

## Plan Name
Complete upload multiple questions functionality

## Files to be Created
- `/src/app/api/questions/bulk-upload/save/route.ts` - API endpoint to save bulk questions
- `/src/lib/question-parser.ts` - Utility to parse and validate bulk question data
- `/src/components/questions/BulkUploadProgress.tsx` - Progress indicator component
- `/src/hooks/use-bulk-upload.ts` - Hook to manage bulk upload state

## File Location
All files will be located within the existing project structure under the `src/` directory.

## Description
Implement a comprehensive bulk question upload system that allows users to upload multiple questions at once through various formats (CSV, JSON, Excel). The system should include validation, progress tracking, and error handling for failed uploads.

## File Structure

### 1. Question Parser (`/src/lib/question-parser.ts`)
```typescript
// Types for different upload formats
interface ParsedQuestion {
  question: string;
  explanation?: string;
  answers: Array<{ text: string; isCorrect: boolean }>;
  difficultyLevelId?: string;
  categoryId?: string;
  labelIds?: string[];
}

// Parser functions for different formats
export function parseCSV(csvContent: string): ParsedQuestion[]
export function parseJSON(jsonContent: string): ParsedQuestion[]
export function parseExcel(excelFile: File): Promise<ParsedQuestion[]>
export function validateQuestions(questions: ParsedQuestion[]): ValidationResult
```

### 2. Bulk Upload API (`/src/app/api/questions/bulk-upload/save/route.ts`)
```typescript
export async function POST(request: Request) {
  // 1. Parse uploaded file
  // 2. Validate all questions
  // 3. Use database transaction for batch insert
  // 4. Return detailed results with success/failure counts
  // 5. Handle partial failures gracefully
}
```

### 3. Bulk Upload Hook (`/src/hooks/use-bulk-upload.ts`)
```typescript
interface BulkUploadState {
  isUploading: boolean;
  progress: number;
  totalQuestions: number;
  processedQuestions: number;
  errors: UploadError[];
  results: UploadResult;
}

export function useBulkUpload() {
  // State management for upload process
  // Progress tracking
  // Error handling
  // Success/failure reporting
}
```

### 4. Progress Component (`/src/components/questions/BulkUploadProgress.tsx`)
```typescript
interface BulkUploadProgressProps {
  progress: number;
  total: number;
  errors: UploadError[];
  results: UploadResult;
}

// Visual progress indicator with:
// - Progress bar
// - Success/failure counts
// - Error details
// - Retry options for failed items
```

### 5. Update Existing Bulk Upload Page (`/src/app/(app)/questions/bulk-upload/page.tsx`)
```typescript
// Enhanced file upload with:
// - Drag & drop interface
// - Multiple file format support
// - Real-time preview
// - Progress integration
// - Error display and retry
```

## Implementation Steps

### Phase 1: Core Infrastructure
1. Create question parser utility with support for CSV, JSON, Excel
2. Implement validation logic for question data
3. Create bulk upload API endpoint with transaction support

### Phase 2: Frontend Components
1. Build bulk upload hook for state management
2. Create progress indicator component
3. Enhance existing bulk upload page

### Phase 3: Integration & Testing
1. Integrate all components
2. Add error handling and retry logic
3. Implement progress tracking
4. Add comprehensive testing

## Key Features

### File Format Support
- **CSV**: Comma-separated values with headers
- **JSON**: Structured JSON array
- **Excel**: .xlsx files with multiple sheets

### Validation Rules
- Required fields validation (question, answers)
- Answer count validation (minimum 2, exactly 1 correct)
- Format validation for each file type
- Duplicate detection within batch

### Progress Tracking
- Real-time progress updates
- Success/failure counts
- Detailed error messages
- Partial failure handling

### Error Handling
- Invalid format errors
- Missing required fields
- Database constraint violations
- Network error recovery
- Retry mechanisms for failed items

### Database Considerations
- Use transactions for atomic operations
- Batch insert for performance
- Rollback on critical failures
- Detailed logging for debugging

## Success Criteria
1. Users can upload questions in CSV, JSON, or Excel format
2. System validates all questions before insertion
3. Progress is shown in real-time during upload
4. Failed uploads show specific error messages
5. Partial failures don't prevent successful questions from being saved
6. Performance handles large batches (1000+ questions)
7. All existing functionality remains intact
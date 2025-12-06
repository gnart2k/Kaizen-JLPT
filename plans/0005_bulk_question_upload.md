# Plan Name: Bulk Question Upload (CSV/Excel)

## Files to be Created
*   \`src/app/(app)/questions/bulk-upload/page.tsx\`: New page for the upload form.
*   \`src/app/api/questions/bulk-upload/preview/route.ts\`: New API route to handle file upload, parsing, and validation for preview.
*   \`src/app/api/questions/bulk-upload/save/route.ts\`: New API route to handle saving the validated questions to the database.
*   \`src/lib/question-parser.ts\`: Utility functions for parsing CSV and Excel files.

## File Location
*   \`src/app/(app)/questions/bulk-upload/page.tsx\`
*   \`src/app/api/questions/bulk-upload/preview/route.ts\`
*   \`src/app/api/questions/bulk-upload/save/route.ts\`
*   \`src/lib/question-parser.ts\`

## Description
This feature will allow administrators to upload multiple questions at once via a file. We will focus on CSV and Excel (XLSX/XLS) file formats for structured data. The API route will receive the file, perform initial file type validation, parse its contents, validate the question data against the existing schema, and insert the valid questions and their answers into the database.

## File Structure

### \`src/app/(app)/questions/bulk-upload/page.tsx\` (High-Level Outline)
\`\`\`tsx
'use client';
// Imports: react, next, components, etc.
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// ... Form components

export default function BulkUploadPage() {
  // 1. Form setup for file input
  const form = useForm({ /* ... */ });
  
  // 2. onSubmit handler (for file upload and preview)
  const [previewData, setPreviewData] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  const onSubmit = async (data) => {
    // a. Create FormData object
    // b. Send POST request to /api/questions/bulk-upload/preview
    // c. Set previewData and validationErrors based on response
    // d. Handle success/error with toast
  };

  const onConfirmUpload = async () => {
    // a. Send POST request to /api/questions/bulk-upload/save with previewData
    // b. Handle success/error with toast and redirect
  };

  // 3. Render: Title, Form, File Input, Submit Button, and conditionally the Preview Table and Confirm Button
  return (
    <Form>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Input type="file" accept=".csv, .xlsx, .xls" />
        <Button type="submit">Preview Questions</Button>
      </form>
      {previewData && (
        <div>
          {/* Display validation errors */}
          {/* Display preview table of questions */}
          <Button onClick={onConfirmUpload}>Confirm Upload</Button>
        </div>
      )}
    </Form>
  );
}
\`\`\`

### \`src/app/api/questions/bulk-upload/preview/route.ts\` (High-Level Outline)
\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server';
import { parseQuestionsFromFile } from '@/lib/question-parser';

export async function POST(request: NextRequest) {
  // 1. Get FormData from request
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
  }

  // 2. Read file content (as Buffer for multi-format support)
  const fileBuffer = await file.arrayBuffer();
  const fileData = Buffer.from(fileBuffer);

  // 3. Parse and validate questions
  const { questions, errors } = parseQuestionsFromFile(fileData, file.type);

  // 4. Return parsed questions and errors for client-side preview
  return NextResponse.json({ questions, errors });
}
\`\`\`

### \`src/app/api/questions/bulk-upload/save/route.ts\` (High-Level Outline)
\`\`\`typescript
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
// Assuming a type for the validated questions

export async function POST(request: NextRequest) {
  // 1. Get validated questions from request body
  const { questions } = await request.json();

  // 2. Perform final validation/sanitization (optional, but good practice)

  // 3. Insert into database (using a transaction for atomicity)
  await db.transaction(async (tx) => {
    // Logic to insert questions and answers
  });

  // 4. Return success response
  return NextResponse.json({ message: 'Questions uploaded successfully' });
}
\`\`\`

### \`src/lib/question-parser.ts\` (High-Level Outline)
\`\`\`typescript
import { QuestionSchema } from '@/validation-schema/question-schema'; // Assuming a type for validation

// Function to parse file content (Buffer) into structured question objects
export function parseQuestionsFromFile(fileData: Buffer, fileType: string) {
  if (fileType === 'text/csv') {
    return parseCsv(fileData.toString('utf8'));
  }
  if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileType === 'application/vnd.ms-excel') {
    return parseExcel(fileData);
  }
  return { questions: [], errors: ['Unsupported file type'] };
}

function parseCsv(csvContent: string) {
  const lines = csvContent.split('\\n');
  const questions = [];
  const errors = [];

  // Logic to iterate over lines, split by comma, and map to QuestionSchema
  // Use Zod to validate each question object
  
  return { questions, errors };
}

function parseExcel(fileData: Buffer) {
  // Placeholder for Excel parsing logic (requires a library like 'xlsx')
  // 1. Read workbook from buffer
  // 2. Convert first sheet to JSON/array of objects
  // 3. Validate and map to QuestionSchema
  return { questions: [], errors: [] };
}
\`\`\`
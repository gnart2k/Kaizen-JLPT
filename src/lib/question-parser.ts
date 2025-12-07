import * as XLSX from 'xlsx';
import z from 'zod';
import { questionSchema } from '@/validation-schema/question-schema';

// Define a type for the raw data parsed from the file, before Zod validation
type RawQuestionData = {
  question: string;
  explanation?: string;
  difficultyLevelId?: string;
  category?: string;
  language: string;
  answers: { answerText: string; isCorrect: boolean }[];
};

type ParseResult = {
  questions: z.infer<typeof questionSchema>[];
  errors: { row: number; message: string }[];
};

// Helper to convert raw row data into the structured format required by questionSchema
const mapRawToSchema = (raw: any[]): RawQuestionData | null => {
  // Assuming a fixed column structure for simplicity:
  // Col 0: question, Col 1: explanation, Col 2: difficultyLevelId, Col 3: category
  // Col 4: answer1_text, Col 5: answer1_isCorrect (1/0)
  // Col 6: answer2_text, Col 7: answer2_isCorrect (1/0)
  // ... up to 4 answers (12 columns total)

  if (!raw[0]) return null; // Skip empty rows

  const answers = [];
  for (let i = 0; i < 4; i++) {
    const text = raw[4 + i * 2];
    const isCorrect = raw[5 + i * 2];

    if (text) {
      answers.push({
        answerText: String(text).trim(),
        isCorrect: isCorrect === 1 || isCorrect === '1' || isCorrect === true,
      });
    }
  }

  return {
    question: String(raw[0]).trim(),
    explanation: raw[1] ? String(raw[1]).trim() : undefined,
    difficultyLevelId: raw[2] ? String(raw[2]).trim() : undefined,
    category: raw[3] ? String(raw[3]).trim() : undefined,
    language: 'ja', // Hardcoded as per current application scope
    answers,
  };
};

// Validates and maps an array of raw data objects
const validateAndMap = (rawData: any[]): ParseResult => {
  const results: z.infer<typeof questionSchema>[] = [];
  const errors: { row: number; message: string }[] = [];

  // Skip header row (row 0)
  for (let i = 1; i < rawData.length; i++) {
    const rawRow = rawData[i];
    const rowNumber = i + 1; // 1-based row number

    const rawQuestion = mapRawToSchema(rawRow);
    if (!rawQuestion) continue;

    const validation = questionSchema.safeParse(rawQuestion);

    if (validation.success) {
      results.push(validation.data);
    } else {
      const errorMessages = validation.error.errors.map(
        (err) => `[${err.path.join('.')}] ${err.message}`
      );
      errors.push({
        row: rowNumber,
        message: errorMessages.join('; '),
      });
    }
  }

  return { questions: results, errors };
};

function parseCsv(csvContent: string): ParseResult {
  const workbook = XLSX.read(csvContent, { type: 'string' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert sheet to array of arrays (raw data)
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

  return validateAndMap(rawData);
}

function parseExcel(fileData: Buffer): ParseResult {
  const workbook = XLSX.read(fileData, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert sheet to array of arrays (raw data)
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

  return validateAndMap(rawData);
}

export function parseQuestionsFromFile(fileData: Buffer, fileType: string): ParseResult {
  const mimeType = fileType.toLowerCase();

  if (mimeType === 'text/csv') {
    const csvContent = fileData.toString('utf8');
    return parseCsv(csvContent);
  }
  
  // Excel MIME types
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // .xlsx
    mimeType === 'application/vnd.ms-excel' // .xls
  ) {
    return parseExcel(fileData);
  }

  return { questions: [], errors: [{ row: 0, message: 'Unsupported file type' }] };
}

export type JlptLevel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5';

export type PracticeStat = {
  label: string;
  value: string | number;
  change?: string;
};

export type ProgressData = {
  date: string;
  vocabulary: number;
  grammar: number;
};

export type StrengthData = {
  subject: string;
  A: number;
  fullMark: number;
};

export type LibraryItem = {
  id: string;
  item: string;
  meaning: string;
  level: JlptLevel;
  status: 'New' | 'To Review' | 'Mastered';
};

export type Language = {
    id: string;
    code: string;
    name: string;
    nativeName?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type Category = {
    id: string;
    languageId: string;
    name: string;
    description?: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    language?: Language;
};

export type Label = {
    id: string;
    name: string;
    color: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
};

export type PracticeQuestion = {
    id: string;
    question: string;
    explanation?: string;
    languageId: string;
    categoryId?: string;
    difficultyLevelId?: string;
    answers: {
        id: string;
        answerText: string;
        isCorrect: boolean;
    }[];
    language?: Language;
    category?: Category;
    difficultyLevel?: DifficultyLevel;
    labels?: Label[];
};

export type DifficultyLevel = {
  id: string;
  languageId: string;
  levelName: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  language?: Language;
};

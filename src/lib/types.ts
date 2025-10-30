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

export type PracticeQuestion = {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
};

import type { PracticeStat, ProgressData, StrengthData, LibraryItem, JlptLevel, PracticeQuestion } from './types';

export const practiceStats: PracticeStat[] = [
  { label: 'Words Mastered', value: 1250, change: '+20 this week' },
  { label: 'Grammar Points', value: 350, change: '+5 this week' },
  { label: 'Avg. Accuracy', value: '88%', change: '+2%' },
  { label: 'Study Streak', value: '42 days', change: 'Top 10%' },
];

export const progressData: ProgressData[] = [
  { date: 'Mon', vocabulary: 60, grammar: 75 },
  { date: 'Tue', vocabulary: 70, grammar: 65 },
  { date: 'Wed', vocabulary: 80, grammar: 85 },
  { date: 'Thu', vocabulary: 75, grammar: 80 },
  { date: 'Fri', vocabulary: 90, grammar: 95 },
  { date: 'Sat', vocabulary: 85, grammar: 90 },
  { date: 'Sun', vocabulary: 95, grammar: 100 },
];

export const strengthData: StrengthData[] = [
  { subject: 'Vocabulary', A: 85, fullMark: 100 },
  { subject: 'Kanji', A: 90, fullMark: 100 },
  { subject: 'Grammar', A: 75, fullMark: 100 },
  { subject: 'Reading', A: 60, fullMark: 100 },
  { subject: 'Listening', A: 80, fullMark: 100 },
];

export const libraryItems: LibraryItem[] = [
  { id: '1', item: '食べる', meaning: 'to eat', level: 'N5', status: 'Mastered' },
  { id: '2', item: '飲む', meaning: 'to drink', level: 'N5', status: 'Mastered' },
  { id: '3', item: '速い', meaning: 'fast, quick', level: 'N4', status: 'To Review' },
  { id: '4', item: '～なければならない', meaning: 'must do ~', level: 'N4', status: 'To Review' },
  { id: '5', item: '無論', meaning: 'of course, naturally', level: 'N2', status: 'New' },
  { id: '6', item: '挨拶', meaning: 'greeting', level: 'N5', status: 'New' },
];

export const practiceQuestions: PracticeQuestion[] = [
    {
        id: 'q1',
        question: '公園（　）散歩します。',
        explanation: 'The particle「を」is used here to indicate the place through which movement occurs. While「で」can indicate a location of an action,「を」is more natural for actions like walking through a park (散歩する).',
        languageId: 'ja-lang-id',
        categoryId: 'grammar-cat-id',
        answers: [
            { id: 'a1', answerText: 'を', isCorrect: true },
            { id: 'a2', answerText: 'に', isCorrect: false },
            { id: 'a3', answerText: 'で', isCorrect: false },
            { id: 'a4', answerText: 'へ', isCorrect: false },
        ],
    },
    {
        id: 'q2',
        question: 'これは（　）の辞書ですか。',
        explanation: 'The question is asking "Whose dictionary is this?". 「だれ」means "who". When combined with the possessive particle「の」, it becomes「だれの」, meaning "whose".',
        languageId: 'ja-lang-id',
        categoryId: 'grammar-cat-id',
        answers: [
            { id: 'a5', answerText: 'だれ', isCorrect: true },
            { id: 'a6', answerText: 'どこ', isCorrect: false },
            { id: 'a7', answerText: 'なん', isCorrect: false },
            { id: 'a8', answerText: 'どれ', isCorrect: false },
        ],
    },
];

export const jlptLevels: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

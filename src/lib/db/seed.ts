import { db } from '@/lib/db';
import { difficultyLevels, languages } from '@/lib/db/schema';
import { InferInsertModel } from 'drizzle-orm';

type NewDifficultyLevel = InferInsertModel<typeof difficultyLevels>;
type NewLanguage = InferInsertModel<typeof languages>;

const languageSeedData: NewLanguage[] = [
  { code: 'ja', name: 'Japanese', nativeName: '日本語', isActive: true },
  { code: 'ko', name: 'Korean', nativeName: '한국어', isActive: true },
  { code: 'zh', name: 'Chinese', nativeName: '中文', isActive: true },
  { code: 'en', name: 'English', nativeName: 'English', isActive: true },
];

// This will be populated after languages are created
const difficultyLevelSeedData: Omit<NewDifficultyLevel, 'languageId'>[] = [
  // Japanese (JLPT)
  { levelName: 'N5', description: 'Beginner level Japanese (JLPT N5).' },
  { levelName: 'N4', description: 'Lower intermediate level Japanese (JLPT N4).' },
  { levelName: 'N3', description: 'Intermediate level Japanese (JLPT N3).' },
  { levelName: 'N2', description: 'Upper intermediate level Japanese (JLPT N2).' },
  { levelName: 'N1', description: 'Advanced level Japanese (JLPT N1).' },

  // Korean (TOPIK)
  { levelName: 'TOPIK 1', description: 'Beginner level Korean (TOPIK 1).' },
  { levelName: 'TOPIK 2', description: 'Lower intermediate level Korean (TOPIK 2).' },
  { levelName: 'TOPIK 3', description: 'Intermediate level Korean (TOPIK 3).' },
  { levelName: 'TOPIK 4', description: 'Upper intermediate level Korean (TOPIK 4).' },
  { levelName: 'TOPIK 5', description: 'Advanced level Korean (TOPIK 5).' },
  { levelName: 'TOPIK 6', description: 'Highest level Korean (TOPIK 6).' },

  // Chinese (HSK)
  { levelName: 'HSK 1', description: 'Beginner level Chinese (HSK 1).' },
  { levelName: 'HSK 2', description: 'Lower intermediate level Chinese (HSK 2).' },
  { levelName: 'HSK 3', description: 'Intermediate level Chinese (HSK 3).' },
  { levelName: 'HSK 4', description: 'Upper intermediate level Chinese (HSK 4).' },
  { levelName: 'HSK 5', description: 'Advanced level Chinese (HSK 5).' },
  { levelName: 'HSK 6', description: 'Highest level Chinese (HSK 6).' },

  // English (CEFR)
  { levelName: 'A1', description: 'CEFR A1 (Beginner) level English.' },
  { levelName: 'A2', description: 'CEFR A2 (Elementary) level English.' },
  { levelName: 'B1', description: 'CEFR B1 (Intermediate) level English.' },
  { levelName: 'B2', description: 'CEFR B2 (Upper Intermediate) level English.' },
  { levelName: 'C1', description: 'CEFR C1 (Advanced) level English.' },
];

async function seedLanguages() {
  console.log('Seeding languages...');
  try {
    const result = await db
      .insert(languages)
      .values(languageSeedData)
      .onConflictDoNothing({
        target: [languages.code],
      })
      .returning({ id: languages.id, code: languages.code });

    console.log(`Successfully seeded ${result.length} languages.`);
    return result;
  } catch (error) {
    console.error('Error seeding languages:', error);
    process.exit(1);
  }
}

async function seedDifficultyLevels() {
  console.log('Seeding difficulty levels...');
  try {
    // First get the languages
    const languageMap = await db.query.languages.findMany({
      columns: { id: true, code: true }
    }).then(languages => 
      languages.reduce((acc, lang) => {
        acc[lang.code] = lang.id;
        return acc;
      }, {} as Record<string, string>)
    );

    // Map the difficulty levels with proper languageId
    const seedData: NewDifficultyLevel[] = [
      // Japanese (JLPT)
      { languageId: languageMap['ja'], levelName: 'N5', description: 'Beginner level Japanese (JLPT N5).' },
      { languageId: languageMap['ja'], levelName: 'N4', description: 'Lower intermediate level Japanese (JLPT N4).' },
      { languageId: languageMap['ja'], levelName: 'N3', description: 'Intermediate level Japanese (JLPT N3).' },
      { languageId: languageMap['ja'], levelName: 'N2', description: 'Upper intermediate level Japanese (JLPT N2).' },
      { languageId: languageMap['ja'], levelName: 'N1', description: 'Advanced level Japanese (JLPT N1).' },

      // Korean (TOPIK)
      { languageId: languageMap['ko'], levelName: 'TOPIK 1', description: 'Beginner level Korean (TOPIK 1).' },
      { languageId: languageMap['ko'], levelName: 'TOPIK 2', description: 'Lower intermediate level Korean (TOPIK 2).' },
      { languageId: languageMap['ko'], levelName: 'TOPIK 3', description: 'Intermediate level Korean (TOPIK 3).' },
      { languageId: languageMap['ko'], levelName: 'TOPIK 4', description: 'Upper intermediate level Korean (TOPIK 4).' },
      { languageId: languageMap['ko'], levelName: 'TOPIK 5', description: 'Advanced level Korean (TOPIK 5).' },
      { languageId: languageMap['ko'], levelName: 'TOPIK 6', description: 'Highest level Korean (TOPIK 6).' },

      // Chinese (HSK)
      { languageId: languageMap['zh'], levelName: 'HSK 1', description: 'Beginner level Chinese (HSK 1).' },
      { languageId: languageMap['zh'], levelName: 'HSK 2', description: 'Lower intermediate level Chinese (HSK 2).' },
      { languageId: languageMap['zh'], levelName: 'HSK 3', description: 'Intermediate level Chinese (HSK 3).' },
      { languageId: languageMap['zh'], levelName: 'HSK 4', description: 'Upper intermediate level Chinese (HSK 4).' },
      { languageId: languageMap['zh'], levelName: 'HSK 5', description: 'Advanced level Chinese (HSK 5).' },
      { languageId: languageMap['zh'], levelName: 'HSK 6', description: 'Highest level Chinese (HSK 6).' },

      // English (CEFR)
      { languageId: languageMap['en'], levelName: 'A1', description: 'CEFR A1 (Beginner) level English.' },
      { languageId: languageMap['en'], levelName: 'A2', description: 'CEFR A2 (Elementary) level English.' },
      { languageId: languageMap['en'], levelName: 'B1', description: 'CEFR B1 (Intermediate) level English.' },
      { languageId: languageMap['en'], levelName: 'B2', description: 'CEFR B2 (Upper Intermediate) level English.' },
      { languageId: languageMap['en'], levelName: 'C1', description: 'CEFR C1 (Advanced) level English.' },
    ];

    const result = await db
      .insert(difficultyLevels)
      .values(seedData)
      .onConflictDoNothing({
        target: [difficultyLevels.languageId, difficultyLevels.levelName],
      })
      .returning({ id: difficultyLevels.id });

    console.log(`Successfully seeded ${result.length} new difficulty levels.`);
  } catch (error) {
    console.error('Error seeding difficulty levels:', error);
    process.exit(1);
  }
}

async function main() {
  await seedLanguages();
  await seedDifficultyLevels();
  // Exit the process gracefully after seeding
  process.exit(0);
}

main();

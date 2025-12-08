import { db } from '@/lib/db';
import { difficultyLevels, languages, categories } from '@/lib/db/schema';
import { InferInsertModel } from 'drizzle-orm';

type NewDifficultyLevel = InferInsertModel<typeof difficultyLevels>;
type NewLanguage = InferInsertModel<typeof languages>;
type NewCategory = InferInsertModel<typeof categories>;

const languageSeedData: NewLanguage[] = [
  { code: 'ja', name: 'Japanese', nativeName: '日本語', isActive: true },
  { code: 'ko', name: 'Korean', nativeName: '한국어', isActive: true },
  { code: 'zh', name: 'Chinese', nativeName: '中文', isActive: true },
  { code: 'en', name: 'English', nativeName: 'English', isActive: true },
];

// This will be populated after languages are created
async function seedLanguages() {
  console.log('Seeding languages...');
  try {
    const language = await db.query.languages.findMany({});
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
    // Load languages
    const languageMap = await db.query.languages.findMany({
      columns: { id: true, code: true }
    }).then(languages =>
      languages.reduce((acc, lang) => {
        acc[lang.code] = lang.id;
        return acc;
      }, {} as Record<string, string>)
    );

    // Prepare seed data
    const seedData: NewDifficultyLevel[] = [
      { languageId: languageMap['ja'], levelName: 'N5', description: 'Beginner level Japanese (JLPT N5).' },
      { languageId: languageMap['ja'], levelName: 'N4', description: 'Lower intermediate level Japanese (JLPT N4).' },
      { languageId: languageMap['ja'], levelName: 'N3', description: 'Intermediate level Japanese (JLPT N3).' },
      { languageId: languageMap['ja'], levelName: 'N2', description: 'Upper intermediate level Japanese (JLPT N2).' },
      { languageId: languageMap['ja'], levelName: 'N1', description: 'Advanced level Japanese (JLPT N1).' },
      // ...
      { languageId: languageMap['en'], levelName: 'C1', description: 'CEFR C1 (Advanced) level English.' },
    ];

    // Load current DB rows
    const existing = await db.query.difficultyLevels.findMany({
      columns: { languageId: true, levelName: true }
    });

    // Convert to a Set for fast lookup
    const existsSet = new Set(
      existing.map(d => `${d.languageId}:${d.levelName}`)
    );

    // Filter out duplicates
    const newRows = seedData.filter(
      d => !existsSet.has(`${d.languageId}:${d.levelName}`)
    );

    console.log("Rows to insert:", newRows.length);

    if (newRows.length > 0) {
      const result = await db
        .insert(difficultyLevels)
        .values(newRows)
        .returning({ id: difficultyLevels.id });

      console.log(`Inserted ${result.length} new difficulty levels.`);
    } else {
      console.log("No new difficulty levels to insert.");
    }

  } catch (error) {
    console.error('Error seeding difficulty levels:', error);
    process.exit(1);
  }
}

async function seedCategories() {
  console.log('Seeding categories...');
  try {
    // Load languages
    const languageMap = await db.query.languages.findMany({
      columns: { id: true, code: true }
    }).then(languages =>
      languages.reduce((acc, lang) => {
        acc[lang.code] = lang.id;
        return acc;
      }, {} as Record<string, string>)
    );

    // Prepare seed data
    const seedData: NewCategory[] = [
      // Japanese categories
      { languageId: languageMap['ja'], name: 'Vocabulary', description: 'Japanese vocabulary questions', sortOrder: 1, isActive: true },
      { languageId: languageMap['ja'], name: 'Grammar', description: 'Japanese grammar questions', sortOrder: 2, isActive: true },
      { languageId: languageMap['ja'], name: 'Reading', description: 'Japanese reading comprehension questions', sortOrder: 3, isActive: true },
      { languageId: languageMap['ja'], name: 'Listening', description: 'Japanese listening comprehension questions', sortOrder: 4, isActive: true },
      { languageId: languageMap['ja'], name: 'Kanji', description: 'Japanese kanji questions', sortOrder: 5, isActive: true },
      
      // Korean categories
      { languageId: languageMap['ko'], name: 'Vocabulary', description: 'Korean vocabulary questions', sortOrder: 1, isActive: true },
      { languageId: languageMap['ko'], name: 'Grammar', description: 'Korean grammar questions', sortOrder: 2, isActive: true },
      { languageId: languageMap['ko'], name: 'Reading', description: 'Korean reading comprehension questions', sortOrder: 3, isActive: true },
      { languageId: languageMap['ko'], name: 'Listening', description: 'Korean listening comprehension questions', sortOrder: 4, isActive: true },
      
      // Chinese categories
      { languageId: languageMap['zh'], name: 'Vocabulary', description: 'Chinese vocabulary questions', sortOrder: 1, isActive: true },
      { languageId: languageMap['zh'], name: 'Grammar', description: 'Chinese grammar questions', sortOrder: 2, isActive: true },
      { languageId: languageMap['zh'], name: 'Reading', description: 'Chinese reading comprehension questions', sortOrder: 3, isActive: true },
      { languageId: languageMap['zh'], name: 'Characters', description: 'Chinese character questions', sortOrder: 4, isActive: true },
      
      // English categories
      { languageId: languageMap['en'], name: 'Vocabulary', description: 'English vocabulary questions', sortOrder: 1, isActive: true },
      { languageId: languageMap['en'], name: 'Grammar', description: 'English grammar questions', sortOrder: 2, isActive: true },
      { languageId: languageMap['en'], name: 'Reading', description: 'English reading comprehension questions', sortOrder: 3, isActive: true },
      { languageId: languageMap['en'], name: 'Listening', description: 'English listening comprehension questions', sortOrder: 4, isActive: true },
    ];

    // Load current DB rows
    const existing = await db.query.categories.findMany({
      columns: { languageId: true, name: true }
    });

    // Convert to a Set for fast lookup
    const existsSet = new Set(
      existing.map(c => `${c.languageId}:${c.name}`)
    );

    // Filter out duplicates
    const newRows = seedData.filter(
      c => !existsSet.has(`${c.languageId}:${c.name}`)
    );

    console.log("Categories to insert:", newRows.length);

    if (newRows.length > 0) {
      const result = await db
        .insert(categories)
        .values(newRows)
        .returning({ id: categories.id });

      console.log(`Inserted ${result.length} new categories.`);
    } else {
      console.log("No new categories to insert.");
    }

  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

async function main() {
  await seedLanguages();
  await seedDifficultyLevels();
  await seedCategories();
  // Exit the process gracefully after seeding
  process.exit(0);
}

main();

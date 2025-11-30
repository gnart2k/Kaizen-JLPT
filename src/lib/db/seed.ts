import { db } from '@/lib/db';
import { difficultyLevels } from '@/lib/db/schema';
import { InferInsertModel } from 'drizzle-orm';

type NewDifficultyLevel = InferInsertModel<typeof difficultyLevels>;

const seedData: NewDifficultyLevel[] = [
  // Japanese (JLPT)
  { language: 'ja', levelName: 'N5', description: 'Beginner level Japanese (JLPT N5).' },
  { language: 'ja', levelName: 'N4', description: 'Lower intermediate level Japanese (JLPT N4).' },
  { language: 'ja', levelName: 'N3', description: 'Intermediate level Japanese (JLPT N3).' },
  { language: 'ja', levelName: 'N2', description: 'Upper intermediate level Japanese (JLPT N2).' },
  { language: 'ja', levelName: 'N1', description: 'Advanced level Japanese (JLPT N1).' },

  // Korean (Generic Levels)
  { language: 'ko', levelName: 'Level 1', description: 'Beginner level Korean.' },
  { language: 'ko', levelName: 'Level 2', description: 'Lower intermediate level Korean.' },
  { language: 'ko', levelName: 'Level 3', description: 'Intermediate level Korean.' },
  { language: 'ko', levelName: 'Level 4', description: 'Upper intermediate level Korean.' },
  { language: 'ko', levelName: 'Level 5', description: 'Advanced level Korean.' },

  // Chinese (Generic Levels)
  { language: 'zh', levelName: 'Level 1', description: 'Beginner level Chinese.' },
  { language: 'zh', levelName: 'Level 2', description: 'Lower intermediate level Chinese.' },
  { language: 'zh', levelName: 'Level 3', description: 'Intermediate level Chinese.' },
  { language: 'zh', levelName: 'Level 4', description: 'Upper intermediate level Chinese.' },
  { language: 'zh', levelName: 'Level 5', description: 'Advanced level Chinese.' },

  // English (CEFR)
  { language: 'en', levelName: 'A1', description: 'CEFR A1 (Beginner) level English.' },
  { language: 'en', levelName: 'A2', description: 'CEFR A2 (Elementary) level English.' },
  { language: 'en', levelName: 'B1', description: 'CEFR B1 (Intermediate) level English.' },
  { language: 'en', levelName: 'B2', description: 'CEFR B2 (Upper Intermediate) level English.' },
  { language: 'en', levelName: 'C1', description: 'CEFR C1 (Advanced) level English.' },
];

async function seedDifficultyLevels() {
  console.log('Seeding difficulty levels...');
  try {
    const result = await db
      .insert(difficultyLevels)
      .values(seedData)
      .onConflictDoNothing({
        target: [difficultyLevels.language, difficultyLevels.levelName],
      })
      .returning({ id: difficultyLevels.id });

    console.log(\`Successfully seeded \${result.length} new difficulty levels.\`);
  } catch (error) {
    console.error('Error seeding difficulty levels:', error);
    process.exit(1);
  }
}

async function main() {
  await seedDifficultyLevels();
  // Exit the process gracefully after seeding
  process.exit(0);
}

main();

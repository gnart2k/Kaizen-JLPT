-- Add language_id column to questions table
ALTER TABLE "questions" ADD COLUMN "language_id" uuid;

-- Add category_id column to questions table  
ALTER TABLE "questions" ADD COLUMN "category_id" uuid;

-- Add language_id column to difficulty_levels table
ALTER TABLE "difficulty_levels" ADD COLUMN "language_id" uuid;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS "questions_language_id_idx" ON "questions" ("language_id");
CREATE INDEX IF NOT EXISTS "questions_category_id_idx" ON "questions" ("category_id");
CREATE INDEX IF NOT EXISTS "difficulty_levels_language_id_idx" ON "difficulty_levels" ("language_id");

-- Migrate data from language varchar to language_id foreign key
UPDATE "questions" 
SET "language_id" = l.id
FROM "languages" l
WHERE "questions"."language" = l.code;

-- Migrate data from category varchar to category_id foreign key
UPDATE "questions" q
SET "category_id" = c.id
FROM "categories" c
WHERE q."category" = c.name 
AND c."language_id" = (SELECT l.id FROM "languages" l WHERE l.code = q."language");

-- Migrate difficulty levels language data
UPDATE "difficulty_levels" 
SET "language_id" = l.id
FROM "languages" l
WHERE "difficulty_levels"."language" = l.code;

-- Make new columns NOT NULL after data migration
ALTER TABLE "questions" ALTER COLUMN "language_id" SET NOT NULL;
ALTER TABLE "difficulty_levels" ALTER COLUMN "language_id" SET NOT NULL;

-- Add foreign key constraints
ALTER TABLE "questions" ADD CONSTRAINT "questions_language_id_fkey" 
FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "questions" ADD CONSTRAINT "questions_category_id_fkey" 
FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "difficulty_levels" ADD CONSTRAINT "difficulty_levels_language_id_fkey" 
FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE cascade ON UPDATE no action;

-- Drop old columns
ALTER TABLE "questions" DROP COLUMN "language";
ALTER TABLE "questions" DROP COLUMN "category";
ALTER TABLE "difficulty_levels" DROP COLUMN "language";

-- Drop old indexes
DROP INDEX IF EXISTS "questions_language_idx";
DROP INDEX IF EXISTS "questions_category_idx";
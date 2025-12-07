-- Create languages table
CREATE TABLE IF NOT EXISTS "languages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(10) NOT NULL,
	"name" varchar(50) NOT NULL,
	"native_name" varchar(50),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "languages_code_unique" UNIQUE("code")
);

-- Create categories table
CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"language_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_language_id_name_unique" UNIQUE("language_id", "name")
);

-- Create labels table
CREATE TABLE IF NOT EXISTS "labels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"color" varchar(7) DEFAULT '#6B7280' NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "labels_name_unique" UNIQUE("name")
);

-- Create question_labels junction table
CREATE TABLE IF NOT EXISTS "question_labels" (
	"question_id" uuid NOT NULL,
	"label_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "question_labels_question_id_label_id_pk" UNIQUE("question_id", "label_id")
);

-- Add indexes for new tables
CREATE INDEX IF NOT EXISTS "languages_code_idx" ON "languages" ("code");
CREATE INDEX IF NOT EXISTS "categories_language_id_idx" ON "categories" ("language_id");
CREATE INDEX IF NOT EXISTS "question_labels_question_id_idx" ON "question_labels" ("question_id");
CREATE INDEX IF NOT EXISTS "question_labels_label_id_idx" ON "question_labels" ("label_id");

-- Add foreign key constraints for new tables
DO $$ 
BEGIN
    -- Add foreign key for categories.language_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'categories_language_id_fkey' 
        AND table_name = 'categories'
    ) THEN
        ALTER TABLE "categories" ADD CONSTRAINT "categories_language_id_fkey" 
        FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE cascade ON UPDATE no action;
    END IF;

    -- Add foreign key for question_labels.question_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'question_labels_question_id_fkey' 
        AND table_name = 'question_labels'
    ) THEN
        ALTER TABLE "question_labels" ADD CONSTRAINT "question_labels_question_id_fkey" 
        FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE cascade ON UPDATE no action;
    END IF;

    -- Add foreign key for question_labels.label_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'question_labels_label_id_fkey' 
        AND table_name = 'question_labels'
    ) THEN
        ALTER TABLE "question_labels" ADD CONSTRAINT "question_labels_label_id_fkey" 
        FOREIGN KEY ("label_id") REFERENCES "labels"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;

-- Insert initial languages data
INSERT INTO "languages" ("code", "name", "native_name", "is_active") 
VALUES 
    ('ja', 'Japanese', '日本語', true),
    ('en', 'English', 'English', true),
    ('ko', 'Korean', '한국어', true)
ON CONFLICT ("code") DO NOTHING;

-- Insert initial categories data for Japanese
INSERT INTO "categories" ("language_id", "name", "description", "sort_order", "is_active")
SELECT 
    l.id,
    c.name,
    c.description,
    c.sort_order,
    c.is_active
FROM (VALUES 
    ('Vocabulary', 'Japanese vocabulary and kanji practice', 1, true),
    ('Grammar', 'Japanese grammar and sentence structure', 2, true),
    ('Reading', 'Japanese reading comprehension', 3, true),
    ('Listening', 'Japanese listening comprehension', 4, true)
) AS c(name, description, sort_order, is_active)
CROSS JOIN "languages" l
WHERE l.code = 'ja'
ON CONFLICT ("language_id", "name") DO NOTHING;

-- Insert initial labels data
INSERT INTO "labels" ("name", "color", "description")
VALUES 
    ('Beginner', '#10B981', 'Suitable for beginners'),
    ('Intermediate', '#F59E0B', 'Suitable for intermediate learners'),
    ('Advanced', '#EF4444', 'Suitable for advanced learners'),
    ('N5', '#3B82F6', 'JLPT N5 level'),
    ('N4', '#8B5CF6', 'JLPT N4 level'),
    ('N3', '#EC4899', 'JLPT N3 level'),
    ('N2', '#F97316', 'JLPT N2 level'),
    ('N1', '#DC2626', 'JLPT N1 level'),
    ('Particles', '#06B6D4', 'Grammar particles'),
    ('Verbs', '#84CC16', 'Verb conjugation and usage'),
    ('Adjectives', '#EAB308', 'Adjective forms and usage')
ON CONFLICT ("name") DO NOTHING;
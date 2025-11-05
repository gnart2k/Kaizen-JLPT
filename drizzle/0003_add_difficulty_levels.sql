-- Migration script for 0003_add_difficulty_levels.sql

-- Create difficulty_levels table
CREATE TABLE "difficulty_levels" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "language" varchar(10) NOT NULL,
  "level_name" varchar(20) NOT NULL,
  "description" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "unique_level" UNIQUE("language", "level_name")
);

-- Add target_level_id to users table
ALTER TABLE "users" ADD COLUMN "target_level_id" uuid REFERENCES "difficulty_levels"("id");

-- Drop old difficulty column and add new difficulty_level_id to questions table
ALTER TABLE "questions" DROP COLUMN "difficulty";
ALTER TABLE "questions" ADD COLUMN "difficulty_level_id" uuid REFERENCES "difficulty_levels"("id");

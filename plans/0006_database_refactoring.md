## Plan Name
Database Refactoring - Separate Language, Category, and Label Tables

## Files to be Created
No new files will be created. This feature involves modifying existing database schema and related files.

## File Location
N/A (Modifying existing files)

## Description
Refactor the database schema to normalize data by creating separate tables for languages, categories, and labels. This will improve data organization, enable better querying, and support multiple languages with their own categories.

## Current State Analysis
- `questions` table has `language` as a varchar field
- `questions` table has `category` as a varchar field  
- `difficulty_levels` table has `language` as a varchar field
- No dedicated tables for languages or categories
- No label system for tagging questions

## New Database Schema

### 1. Languages Table
```sql
CREATE TABLE languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) NOT NULL UNIQUE, -- e.g., 'ja', 'en', 'ko'
    name VARCHAR(50) NOT NULL, -- e.g., 'Japanese', 'English', 'Korean'
    native_name VARCHAR(50), -- e.g., '日本語', 'English', '한국어'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Categories Table
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g., 'Vocabulary', 'Grammar', 'Reading'
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(language_id, name)
);
```

### 3. Labels Table
```sql
CREATE TABLE labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(7) DEFAULT '#6B7280', -- Hex color code
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Question Labels Junction Table
```sql
CREATE TABLE question_labels (
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY(question_id, label_id)
);
```

### 5. Updated Questions Table
```sql
-- Remove existing fields and add foreign keys
ALTER TABLE questions 
DROP COLUMN language,
DROP COLUMN category,
ADD COLUMN language_id UUID NOT NULL REFERENCES languages(id),
ADD COLUMN category_id UUID REFERENCES categories(id);
```

### 6. Updated Difficulty Levels Table
```sql
-- Remove existing language field and add foreign key
ALTER TABLE difficulty_levels 
DROP COLUMN language,
ADD COLUMN language_id UUID NOT NULL REFERENCES languages(id);
```

## Implementation Steps

### 1. Update Database Schema (`src/lib/db/schema.ts`)
- Add new table definitions for `languages`, `categories`, `labels`, `question_labels`
- Update `questions` table structure
- Update `difficulty_levels` table structure
- Add proper relations between tables
- Update indexes for better performance

### 2. Create Migration Files
- Create new migration for schema changes
- Handle data migration from existing questions
- Handle data migration from existing difficulty levels
- Populate languages table with initial data (Japanese, English, etc.)
- Migrate existing categories based on language
- Update difficulty levels to reference new language table

### 3. Update API Endpoints
- Update `/api/questions` to handle new schema
- Update `/api/difficulty-levels` to handle new schema
- Create new endpoints:
  - `GET /api/languages` - List all languages
  - `GET /api/categories?language_id=x` - List categories by language
  - `GET /api/labels` - List all labels
  - `POST /api/questions/[id]/labels` - Add labels to question
  - `DELETE /api/questions/[id]/labels/[label_id]` - Remove label from question

### 4. Update Type Definitions (`src/lib/types.ts`)
- Add new types: `Language`, `Category`, `Label`
- Update `PracticeQuestion` type to use new relations
- Update `DifficultyLevel` type to use new relations
- Add types for API responses

### 5. Update UI Components
- Update practice page to filter by language and category
- Add language selector component
- Update question creation/editing forms
- Add label management interface

### 6. Update Data Seeding
- Update seed script to populate new tables
- Add sample languages and categories
- Add sample labels for different question types

## File Structure Updates

### `src/lib/db/schema.ts`
```typescript
// New tables
export const languages = pgTable(/* ... */);
export const categories = pgTable(/* ... */);
export const labels = pgTable(/* ... */);
export const questionLabels = pgTable(/* ... */);

// Updated relations
export const questionsRelations = relations(questions, ({ one, many }) => ({
    language: one(languages, { /* ... */ }),
    category: one(categories, { /* ... */ }),
    labels: many(questionLabels),
    // ... existing relations
}));

export const difficultyLevelsRelations = relations(difficultyLevels, ({ one, many }) => ({
    language: one(languages, {
        fields: [difficultyLevels.languageId],
        references: [languages.id],
    }),
    questions: many(questions),
    users: many(users),
}));
```

### `src/lib/types.ts`
```typescript
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

// Updated DifficultyLevel
export type DifficultyLevel = {
    id: string;
    languageId: string;
    levelName: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    language?: Language;
};

// Updated PracticeQuestion
export type PracticeQuestion = {
    id: string;
    question: string;
    explanation?: string;
    languageId: string;
    categoryId?: string;
    difficultyLevelId?: string;
    answers: Answer[];
    language?: Language;
    category?: Category;
    difficultyLevel?: DifficultyLevel;
    labels?: Label[];
};
```

## Data Migration Strategy

### Phase 1: Create New Tables
- Add new tables without affecting existing data
- Populate languages table with initial data

### Phase 2: Migrate Existing Data
- Extract unique languages from existing questions
- Extract unique languages from existing difficulty levels
- Create categories based on existing question categories
- Update questions to reference new language and category IDs
- Update difficulty levels to reference new language table

### Phase 3: Clean Up
- Remove old `language` and `category` columns from questions table
- Remove old `language` column from difficulty_levels table
- Add constraints and indexes
- Test data integrity

## Benefits of This Refactoring

1. **Better Data Organization** - Normalized structure reduces redundancy
2. **Multi-language Support** - Each language can have its own categories and difficulty levels
3. **Flexible Labeling** - Questions can have multiple tags/labels
4. **Improved Performance** - Better indexing and query optimization
5. **Scalability** - Easy to add new languages and categories
6. **Data Integrity** - Foreign key constraints ensure consistency
7. **Centralized Language Management** - Single source of truth for all language-related data

## Testing Considerations

- Test data migration scripts thoroughly
- Verify all API endpoints work with new schema
- Test UI components with new data structure
- Ensure backward compatibility where needed
- Performance testing with larger datasets
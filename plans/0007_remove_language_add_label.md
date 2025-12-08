# Plan: Remove Language Field and Add Label Field

## Plan Name
Remove language field from question creation form and add label field

## Files to be Created
- None (modifying existing files)

## File Location
- `/src/app/(app)/questions/create/page.tsx` - Main form modification
- `/src/validation-schema/question-schema.ts` - Schema updates
- `/src/app/api/difficulty-levels/route.ts` - API modification for language filtering
- `/src/hooks/use-difficulty-levels.ts` - Hook modification for language parameter

## Description
1. Remove the language selection field from the question creation form
2. Use the NEXT_PUBLIC_LANGUAGE environment variable to determine the language
3. Modify the difficulty levels API to filter by the configured language
4. Add a label field to the form for question labeling
5. Update the validation schema to reflect these changes

## File Structure

### 1. Update question-schema.ts
- Remove languageId requirement (make it optional or auto-populate)
- Add label field to schema

### 2. Update difficulty-levels API
- Accept language parameter or use environment variable
- Filter difficulty levels by language

### 3. Update use-difficulty-levels hook
- Pass language parameter to API call

### 4. Update question creation form
- Remove language selection field
- Auto-populate languageId from environment
- Add label selection field
- Update form initialization and submission logic
# Plan: Implement Create Question Feature

This plan outlines the steps to implement a "create question" feature with support for multiple languages.

## 1. Database Schema

Define a new table named `questions` in `src/lib/db/schema.ts`.

### `questions` table:

-   `id`: `serial` (Primary Key)
-   `question`: `text` (Not Null)
-   `correct_answers`: `jsonb` (Array of strings, Not Null)
-   `answers`: `jsonb` (Array of strings, Not Null)
-   `explanations`: `jsonb` (Array of strings, Not Null)
-   `language`: `varchar(10)` (e.g., "en", "ja", Not Null)
-   `created_at`: `timestamp` (Default: `now()`)
-   `updated_at`: `timestamp` (Default: `now()`)

## 2. API Endpoints

Create API endpoints under `src/app/api/questions/` to handle CRUD operations for questions.

-   **`POST /api/questions`**: Create a new question.
    -   Request body should contain the question data.
    -   Returns the created question object.
-   **`GET /api/questions`**: Get a list of all questions.
    -   Supports pagination and filtering by language.
    -   Returns an array of question objects.
-   **`GET /api/questions/[id]`**: Get a single question by its ID.
    -   Returns the question object.
-   **`PUT /api/questions/[id]`**: Update an existing question.
    -   Request body should contain the updated question data.
    -   Returns the updated question object.
-   **`DELETE /api/questions/[id]`**: Delete a question by its ID.
    -   Returns a success message.

## 3. User Interface (UI)

### Create Question Page

-   Create a new page at `src/app/(app)/questions/create/page.tsx`.
-   This page will contain a form with the following fields:
    -   **Question:** A text area for the question itself.
    -   **Correct Answers:** A dynamic list of input fields for the correct answers.
    -   **All Answers:** A dynamic list of input fields for all possible answers.
    -   **Explanations:** A dynamic list of text areas for the explanation of each answer.
    -   **Language:** A dropdown/select to choose the language of the question (e.g., English, Japanese).
-   The form should have validation to ensure all required fields are filled correctly.
-   On submission, the form will make a `POST` request to the `/api/questions` endpoint.

### Question List Page

-   Create a new page at `src/app/(app)/questions/page.tsx`.
-   This page will display a table of all existing questions.
-   The table should be searchable and filterable by language.
-   Each row in the table will have buttons for:
    -   **Edit:** Navigates to a pre-filled edit page for the question.
    -   **Delete:** Opens a confirmation dialog and then deletes the question.

### Edit Question Page

-   Create a new page at `src/app/(app)/questions/[id]/edit/page.tsx`.
-   This page will be similar to the "Create Question" page but will be pre-filled with the data of the question being edited.
-   On submission, the form will make a `PUT` request to the `/api/questions/[id]` endpoint.

## 4. Navigation

-   Add a new item to the main sidebar in `src/components/layout/AppSidebar.tsx` to link to the "Questions" list page.

## 5. State Management

-   Use React's `useState` and `useEffect` hooks for managing form state and fetching data on the client-side.
-   Consider using a state management library like Zustand or React Query if the application's complexity grows.

This plan provides a comprehensive overview of the tasks required to implement the "create question" feature. Each step can be broken down into smaller sub-tasks for easier implementation.

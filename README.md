# Kaizen JLPT

**Your guide to mastering Japanese for the JLPT.**

## Application Objective

Kaizen JLPT is a comprehensive platform designed to help users practice and prepare for the Japanese Language Proficiency Test (JLPT) from N5 to N1 levels. The application provides features for:
*   **Practice Sessions:** Focused drills on vocabulary, grammar, and reading comprehension.
*   **Mock Tests:** Simulated full-length exams to track progress and build stamina.
*   **Library:** A centralized resource for reviewing learned material and AI-generated explanations.
*   **Analytics:** Detailed insights into strengths and weaknesses across different test sections.

## Code Structure

The project is built with Next.js (App Router) and TypeScript.

| Directory | Description |
| :--- | :--- |
| `src/app/` | Next.js App Router pages (e.g., `/dashboard`, `/practice`, `/mock-test`). |
| `src/components/` | Reusable React components, organized by feature and a shared `ui` library (shadcn/ui). |
| `src/lib/` | Core utilities, data structures, and TypeScript types. |
| `src/ai/` | Genkit flows and AI-related logic for generating explanations and feedback. |
| `.husky/` | Git hooks for enforcing code quality (linting and type-checking) on commit. |

## JLPT Exam Structure

The JLPT is divided into five levels (N5 to N1), with N1 being the most difficult. The test is generally composed of three main sections, though the grouping varies by level:

| Level | Section 1 | Section 2 | Total Time |
| :--- | :--- | :--- | :--- |
| **N5** | Language Knowledge (Vocabulary/Grammar) & Reading (40 min) | Listening (30 min) | 70 min |
| **N4** | Language Knowledge (Vocabulary/Grammar) & Reading (55 min) | Listening (35 min) | 90 min |
| **N3** | Language Knowledge (Vocabulary) (30 min) | Language Knowledge (Grammar) & Reading (70 min) | Listening (40 min) | 140 min |
| **N2** | Language Knowledge (Vocabulary/Grammar) & Reading (105 min) | Listening (50 min) | 155 min |
| **N1** | Language Knowledge (Vocabulary/Grammar) & Reading (110 min) | Listening (55 min) | 165 min |

*Note: The N3, N2, and N1 levels combine Vocabulary, Grammar, and Reading into a single "Language Knowledge and Reading" section, but the N3 level splits the Language Knowledge section into two separate timed parts.*

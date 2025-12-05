# AGENT CODING GUIDELINES

This document outlines the conventions and commands for automated agents operating in the Kaizen-JLPT repository.

## 1. Quality Commands

| Command | Description |
| :--- | :--- |
| `npm run build` | Production build command. |
| `npm run lint` | Runs Next.js linter for code style and quality. |
| `npm run typecheck` | Runs `tsc --noEmit` for strict TypeScript checking. |
| **Single Test** | No dedicated test script found. Agents must rely on `lint` and `typecheck` for verification. |

## 2. Code Style & Conventions

### Language & Typing
*   **Language:** TypeScript/TSX.
*   **Strictness:** All new code must adhere to `strict: true` typing.
*   **Naming:** PascalCase for components/types, camelCase for variables/functions.

### Formatting & Imports
*   **Quotes:** Use single quotes (`'`) for strings and imports.
*   **Semicolons:** Use semicolons (`;`) to terminate statements.
*   **Imports:** Use absolute imports with the `@/` alias for internal modules (e.g., `@/lib/utils`). Group imports: types, external libraries, internal modules, local files.

### Architecture
*   **Framework:** Next.js App Router. Follow Next.js conventions (e.g., `page.tsx`, `layout.tsx`).
*   **Styling:** Use Tailwind CSS with `clsx` and `tailwind-merge` for utility classes.

### Error Handling
*   Use standard TypeScript/JavaScript `try...catch` blocks for runtime errors.
*   Ensure all asynchronous operations are properly handled.

## 3. Feature Development Workflow

Before starting a new feature, agents must define a plan and document it in the `@plans/` directory. The plan file must be prefixed with a sequential number (e.g., `0004_new_feature_name.md`).

The plan document must include:
*   **Plan Name:** A concise title for the feature.
*   **Files to be Created:** List of new files and their purpose.
*   **File Location:** The absolute or relative path where each new file will be located.
*   **Description:** A detailed explanation of the feature and its motivation.
*   **File Structure:** A high-level outline or pseudo-code for the structure of the main files.

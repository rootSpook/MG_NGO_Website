---
description: "Use when creating or modifying any code for the graduation project. Enforces grading criteria, strictly typed TypeScript, Tailwind CSS styles, and component organization."
applyTo: "**/*.{ts,tsx}"
---
# Graduation Project Standards

## 1. Code Comments & Documentation (For Grading)
- Always add JSDoc comments to exported functions and components.
- Explain the *why* behind complex logic or algorithms to make it easier for graders to understand the design decisions.
- Add inline comments for any non-obvious workarounds.

## 2. Strict TypeScript
- Avoid using `any`. Use proper types or explicit generics.
- Define interfaces or types for all component props and state.
- Ensure proper typing for API responses and database models.

## 3. Styling & UI
- Use Tailwind CSS consistently for all styling instead of custom CSS (unless absolutely necessary).
- Keep component classes readable and grouped logically.
- Rely on the existing UI components in `components/ui` (e.g., shadcn/ui) instead of building generic components from scratch.

## 4. Component Organization
- Use Server Components by default in the Next.js `app/` directory.
- Add `'use client'` only at the top of components that require user interaction, hooks (`useState`, `useEffect`), or browser APIs.
- Keep components small and focused. Extract sub-components if a file exceeds 200 lines.

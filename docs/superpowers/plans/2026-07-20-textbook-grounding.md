# Textbook Grounding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all fictional demo courses with verified 《你好！法语 1》 structure, two grounded lessons, controlled textbook pages, and limited verified search.

**Architecture:** A verified TypeScript content snapshot drives the local UI while matching Supabase migrations provide the durable target model. Page rendering stays behind a server route that reads the configured local PDF; search indexes only verified source blocks and preserves URL-addressable location state.

**Tech Stack:** Next.js App Router, TypeScript, Supabase/PostgreSQL, Zustand, Node test runner, Poppler page rendering.

## Global Constraints

- No full-book OCR, public PDF, invented content, destructive migration, or unverified search result.
- Preserve original French accents, apostrophes, hyphens and bilingual separation.
- `pdf_page_index` is zero-based and authoritative for navigation; show printed page first and PDF page second.
- Every content block must resolve to a textbook page and source block.

---

### Task 1: Verified page map and directory snapshot

**Files:** Create `content/textbooks/bonjour-francais-1/page-map.ts`, `directory.ts`, and tests in `tests/textbook-content.test.mjs`.

- [ ] Write tests for zero-based page indices, duplicate preservation, unique source order, real Unité titles, and absence of fictional Lesson titles.
- [ ] Run tests and confirm failure because content modules do not exist.
- [ ] Render only required pages and create verified mapping and directory modules.
- [ ] Run tests and confirm they pass.
- [ ] Update `docs/implementation-log.md` with evidence and counts.

### Task 2: Search normalization and grounded blocks

**Files:** Create `lib/text-search.ts`, `content/textbooks/bonjour-francais-1/trial-lessons.ts`, and extend `tests/textbook-content.test.mjs`.

- [ ] Write failing tests that `etre` matches `être`, punctuation/spacing normalize predictably, and only verified blocks enter default search.
- [ ] Implement minimal normalizer and verified trial content blocks from visually checked pages.
- [ ] Verify tests pass and record pending-review items without guessing.

### Task 3: Compatible Supabase migration

**Files:** Create `supabase/migrations/202607200001_textbook_grounding.sql` and `tests/migration-contract.test.mjs`.

- [ ] Write failing contract tests for required tables, columns, constraints, indexes, policies and non-destructive `alter table` statements.
- [ ] Add `textbook_pages`, hierarchy columns, `source_blocks`, `content_source_links`, and `textbook_search_index`.
- [ ] Verify migration contract and document compatibility impact.

### Task 4: Real directory and dynamic Lesson UI

**Files:** Modify `app/courses/page.tsx`, `app/courses/[lessonId]/page.tsx`, `app/globals.css`; create `components/lesson-view.tsx`.

- [ ] Add rendered HTML tests that reject known demo titles and require real Unité/Leçon titles, source labels and mode controls.
- [ ] Replace mock data with verified content snapshot, render only present sections, and add previous/next links.
- [ ] Verify desktop and mobile output through build tests.

### Task 5: Controlled textbook rendering

**Files:** Create `app/api/textbooks/[textbookId]/pages/[pdfPageIndex]/route.ts`, `lib/textbook-files.ts`, `components/textbook-reader.tsx` and route tests.

- [ ] Write failing tests for range validation, no filesystem path leakage, page image response, and unsupported textbook rejection.
- [ ] Implement allowlisted local PDF lookup and on-demand cached page rendering outside `public`.
- [ ] Add reader page navigation, zoom, printed/PDF labels and URL-persisted state.
- [ ] Verify route tests and build.

### Task 6: Limited global search and bidirectional links

**Files:** Create `app/search/page.tsx`, `components/textbook-search.tsx`; modify `components/app-shell.tsx` and Lesson reader components.

- [ ] Write failing tests for verified-only results, coverage copy, empty-result warning, learning/textbook URLs and source highlight anchors.
- [ ] Implement search over the verified snapshot with exact, prefix and accentless substring scoring.
- [ ] Add learning/textbook jump buttons and highlight behavior derived from URL parameters.
- [ ] Verify all tests, lint, build, routes and implementation log.

### Task 7: Supabase seed handoff and final verification

**Files:** Create `supabase/seed/bonjour-francais-1-trial.sql`; update `docs/implementation-log.md`.

- [ ] Generate idempotent SQL only from verified snapshot data.
- [ ] Validate references, row counts and coverage counts without bulk-importing the rest of the book.
- [ ] Run full test, lint and build commands and report remaining pending-review content.

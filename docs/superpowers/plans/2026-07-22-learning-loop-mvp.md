# Learning Loop MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete browser-persisted learning loop that turns Lesson completion, vocabulary review, mistakes, sessions and daily tasks into an automatically updated Dashboard.

**Architecture:** Versioned learning types and catalog data feed a storage-independent Repository. A LocalLearningRepository handles localStorage and migrations; domain services orchestrate review and task rules; a hydrated Zustand store exposes actions and selectors to client UI.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, Zustand 5, localStorage, Node test runner.

## Global Constraints

- Pages and business services never access localStorage directly.
- Storage key is `french-learning-os:learning-state:v1`; root schemaVersion is `1`.
- No Supabase test user and no bypass of auth.users foreign keys.
- Persist only user behavior, never textbook text, PDF pages or search index.
- All intervals and mastery thresholds live in configuration.
- UI shows a hydration state and a browser-only persistence notice.

---

### Task 1: Versioned learning domain and catalog

**Files:**
- Create: `lib/learning/types.ts`
- Create: `lib/learning/config.ts`
- Create: `lib/learning/catalog.ts`
- Test: `tests/learning-domain.test.mjs`

**Interfaces:** Produces `UserLearningState`, progress record types, `createEmptyLearningState()`, `learningCatalog`, and review constants.

- [ ] Write failing tests asserting the empty state schema, stable vocabulary IDs, Lesson-to-vocabulary mapping and configured review intervals.
- [ ] Run `node --test tests/learning-domain.test.mjs` and verify expected missing-module failure.
- [ ] Implement strict domain types, empty-state factory, configuration and a catalog derived from verified Lesson 1–2 source blocks.
- [ ] Run the test and verify PASS.

### Task 2: Repository, migrations and backup

**Files:**
- Create: `lib/learning/repository.ts`
- Create: `lib/learning/local-learning-repository.ts`
- Create: `lib/learning/supabase-learning-repository.ts`
- Test: `tests/local-learning-repository.test.mjs`

**Interfaces:** Produces `LearningRepository`, `RepositoryResult<T>`, `ImportPreview`, `LocalLearningRepository`, and Supabase placeholder.

- [ ] Write failing tests with an in-memory Storage adapter for initialization, persistence, malformed JSON recovery, unsupported schema rejection, export/import replace, import merge and clear.
- [ ] Run the repository test and observe failure because implementation is missing.
- [ ] Implement storage-independent result/error contracts, migration registry and debounced writes with explicit `flush()` for critical operations.
- [ ] Run repository and domain tests and verify PASS.

### Task 3: Review, mistakes, sessions and daily task services

**Files:**
- Create: `lib/learning/review-scheduler.ts`
- Create: `lib/learning/daily-task-generator.ts`
- Create: `lib/learning/study-session-tracker.ts`
- Create: `lib/learning/learning-service.ts`
- Test: `tests/learning-service.test.mjs`

**Interfaces:** Produces `LearningService` methods matching the approved Repository-facing operations and pure scheduling functions.

- [ ] Write failing tests for start/update/complete Lesson, vocabulary scheduling, wrong-answer creation, two-correct mastery, repeated-wrong reset, task idempotency, daily statistics and next action.
- [ ] Run the service test and verify the expected failure.
- [ ] Implement pure schedulers and a LearningService that commits each atomic workflow through the Repository.
- [ ] Run all learning tests and verify PASS.

### Task 4: Hydrated Zustand application store

**Files:**
- Create: `lib/learning/store.ts`
- Create: `components/learning-provider.tsx`
- Modify: `app/layout.tsx`
- Test: `tests/learning-store-contract.test.mjs`

**Interfaces:** Produces `useLearningStore`, `LearningProvider`, `hydrated`, state selectors and UI-safe async actions.

- [ ] Write a contract test asserting explicit hydration, Repository-only persistence and all required action names.
- [ ] Run the contract test and verify failure.
- [ ] Implement singleton local repository/service initialization on the client, explicit hydration and actions with unified error state.
- [ ] Run TypeScript and learning tests.

### Task 5: Dashboard and Lesson learning controls

**Files:**
- Create: `components/dashboard-client.tsx`
- Create: `components/lesson-learning-controls.tsx`
- Modify: `app/page.tsx`
- Modify: `app/courses/[lessonId]/page.tsx`
- Modify: `components/lesson-view.tsx`
- Modify: `components/app-shell.tsx`
- Modify: `app/globals.css`
- Test: `tests/learning-ui-contract.test.mjs`

**Interfaces:** Consumes store actions/selectors; produces hydration-safe dashboard, start/continue/complete controls, position tracking and browser-only notice.

- [ ] Write UI contract tests for required labels, confirmation, last-position links and absence of direct localStorage calls.
- [ ] Run tests and verify failure.
- [ ] Implement Dashboard statistics/tasks and Lesson controls; update position from section interactions and complete the Lesson through one service action.
- [ ] Run tests, TypeScript and ESLint.

### Task 6: Vocabulary, mistake practice, progress and backup UI

**Files:**
- Create: `components/vocabulary-client.tsx`
- Create: `components/mistakes-client.tsx`
- Create: `components/progress-client.tsx`
- Create: `components/data-backup-panel.tsx`
- Modify: `app/vocabulary/page.tsx`
- Modify: `app/mistakes/page.tsx`
- Modify: `app/progress/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/review-ui-contract.test.mjs`

**Interfaces:** Consumes store review/backup actions; produces favorite/mastery controls, deterministic exercise practice, mistake remediation, progress statistics, import preview, merge/replace and confirmed clear.

- [ ] Write UI contract tests for favorite/mastery, wrong/correct attempt controls, two-success remediation, JSON import/export and browser-only warning.
- [ ] Run test and verify failure.
- [ ] Implement the client pages without direct storage access.
- [ ] Run all tests, TypeScript and ESLint.

### Task 7: End-to-end verification and documentation

**Files:**
- Modify: `README.md`
- Modify: `docs/implementation-log.md`

- [ ] Run `npm test`, `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
- [ ] Start the local app and verify refresh persistence, Lesson completion → Dashboard update, vocabulary review task creation, mistake remediation, task idempotency, last-position return, export/import equality and malformed storage recovery.
- [ ] Verify 390×844 layout has no horizontal overflow.
- [ ] Document the local Repository architecture and future Supabase merge paths.
- [ ] Commit and push the verified implementation, then deploy to Vercel while noting that persistence is per-browser and per-origin.

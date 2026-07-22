import assert from "node:assert/strict";
import test from "node:test";

import { LEARNING_STORAGE_KEY } from "../lib/learning/config.ts";
import { LocalLearningRepository } from "../lib/learning/local-learning-repository.ts";

class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, value); }
  removeItem(key) { this.values.delete(key); }
}

test("repository initializes and persists a versioned state", async () => {
  const storage = new MemoryStorage();
  const repository = new LocalLearningRepository(storage, { now: () => "2026-07-22T08:00:00.000Z" });

  const initial = await repository.getLearningState();
  assert.equal(initial.ok, true);
  assert.equal(initial.data.schemaVersion, 1);

  const started = await repository.startLesson("lesson-1");
  assert.equal(started.ok, true);
  await repository.flush();

  const persisted = JSON.parse(storage.getItem(LEARNING_STORAGE_KEY));
  assert.equal(persisted.lessonProgress["lesson-1"].status, "in_progress");
});

test("malformed data recovers without crashing and reports a warning", async () => {
  const storage = new MemoryStorage();
  storage.setItem(LEARNING_STORAGE_KEY, "{broken-json");
  const repository = new LocalLearningRepository(storage);

  const result = await repository.getLearningState();
  assert.equal(result.ok, true);
  assert.equal(result.warning?.code, "CORRUPTED_STORAGE");
  assert.deepEqual(result.data.lessonProgress, {});
});

test("unsupported future schema is rejected without overwriting it", async () => {
  const storage = new MemoryStorage();
  storage.setItem(LEARNING_STORAGE_KEY, JSON.stringify({ schemaVersion: 99 }));
  const repository = new LocalLearningRepository(storage);

  const result = await repository.getLearningState();
  assert.equal(result.ok, false);
  assert.equal(result.error.code, "UNSUPPORTED_SCHEMA");
  assert.equal(JSON.parse(storage.getItem(LEARNING_STORAGE_KEY)).schemaVersion, 99);
});

test("export and replace import preserve learning state", async () => {
  const source = new LocalLearningRepository(new MemoryStorage());
  await source.startLesson("lesson-1");
  await source.updateLessonPosition("lesson-1", "l1-grammar", "l1-grammar-question");
  const exported = await source.exportLearningData();
  assert.equal(exported.ok, true);

  const target = new LocalLearningRepository(new MemoryStorage());
  const preview = await target.previewImport(exported.data);
  assert.equal(preview.ok, true);
  assert.equal(preview.data.lessonsWithProgress, 1);
  const imported = await target.importLearningData(exported.data, "replace");
  assert.equal(imported.ok, true);
  assert.equal(imported.data.lessonProgress["lesson-1"].lastSectionId, "l1-grammar");
});

test("merge import keeps the newest progress and unions append-only history", async () => {
  const storage = new MemoryStorage();
  const repository = new LocalLearningRepository(storage);
  await repository.startLesson("lesson-1");
  const current = await repository.getLearningState();
  const incoming = structuredClone(current.data);
  incoming.updatedAt = "2030-01-01T00:00:00.000Z";
  incoming.lessonProgress["lesson-1"].status = "completed";
  incoming.lessonProgress["lesson-1"].completedAt = "2030-01-01T00:00:00.000Z";
  incoming.exerciseAttempts.push({
    id: "attempt-imported", exerciseId: "l1-exercises", lessonId: "lesson-1",
    answer: "self-correct", isCorrect: true, attemptedAt: "2030-01-01T00:00:00.000Z",
    durationSeconds: 2, attemptNumber: 1,
  });

  const merged = await repository.importLearningData(JSON.stringify(incoming), "merge");
  assert.equal(merged.ok, true);
  assert.equal(merged.data.lessonProgress["lesson-1"].status, "completed");
  assert.equal(merged.data.exerciseAttempts.length, 1);
});

test("clear removes storage and recreates an empty state", async () => {
  const storage = new MemoryStorage();
  const repository = new LocalLearningRepository(storage);
  await repository.startLesson("lesson-1");
  await repository.clearLearningData();

  assert.equal(storage.getItem(LEARNING_STORAGE_KEY), null);
  const state = await repository.getLearningState();
  assert.deepEqual(state.data.lessonProgress, {});
});

import assert from "node:assert/strict";
import test from "node:test";

import { LocalLearningRepository } from "../lib/learning/local-learning-repository.ts";
import { LearningService } from "../lib/learning/learning-service.ts";

class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, value); }
  removeItem(key) { this.values.delete(key); }
}

test("lesson task order advances dynamically from 2 to 3 to 4", async () => {
  const storage = new MemoryStorage();
  let timestamp = "2026-07-22T08:00:00.000Z";
  const repository = new LocalLearningRepository(storage, { now: () => timestamp, debounceMs: 0 });
  const service = new LearningService(repository, { now: () => timestamp, id: () => crypto.randomUUID() });
  await service.completeLesson("lesson-1");
  await service.completeLesson("lesson-2");
  let dashboard = await service.getDashboard("2026-07-22");
  assert.equal(dashboard.data.continueAction.entityId, "lesson-3");
  await service.completeLesson("lesson-3");
  dashboard = await service.getDashboard("2026-07-22");
  assert.equal(dashboard.data.continueAction.entityId, "lesson-4");
});

test("Leçon 3 vocabulary is queued only after its lesson is completed", async () => {
  const repository = new LocalLearningRepository(new MemoryStorage(), { now: () => "2026-07-22T08:00:00.000Z", debounceMs: 0 });
  const service = new LearningService(repository);
  await service.startLesson("lesson-3");
  let state = (await repository.getLearningState()).data;
  assert.equal(Object.values(state.vocabularyProgress).filter((item) => item.lessonId === "lesson-3").length, 0);
  await service.completeLesson("lesson-3");
  state = (await repository.getLearningState()).data;
  assert.ok(Object.values(state.vocabularyProgress).filter((item) => item.lessonId === "lesson-3").length >= 30);
});

test("wrong automatic Leçon 3 answer enters the mistake review loop", async () => {
  const repository = new LocalLearningRepository(new MemoryStorage(), { now: () => "2026-07-22T08:00:00.000Z", debounceMs: 0 });
  const service = new LearningService(repository);
  await service.recordExerciseResult("l3-exercise-presentations", "lesson-3", "a,b,c,d", false);
  const state = (await repository.getLearningState()).data;
  assert.equal(state.mistakes["l3-exercise-presentations"].status, "unresolved");
  assert.equal(state.exerciseAttempts.at(-1).answer, "a,b,c,d");
});

test("Leçon 3–4 progress survives a repository restart", async () => {
  const storage = new MemoryStorage();
  const first = new LocalLearningRepository(storage, { now: () => "2026-07-22T08:00:00.000Z", debounceMs: 0 });
  await first.completeLesson("lesson-3");
  await first.updateLessonPosition("lesson-4", "l4-writing", "l4-writing-email");
  await first.flush();
  const reopened = new LocalLearningRepository(storage);
  const state = (await reopened.getLearningState()).data;
  assert.equal(state.lessonProgress["lesson-3"].status, "completed");
  assert.equal(state.lessonProgress["lesson-4"].lastSourceBlockId, "l4-writing-email");
});

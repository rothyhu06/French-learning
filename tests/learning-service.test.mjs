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

const timestamp = "2026-07-22T08:00:00.000Z";
const setup = () => {
  const repository = new LocalLearningRepository(new MemoryStorage(), { now: () => timestamp, debounceMs: 0 });
  return { repository, service: new LearningService(repository, { now: () => timestamp, id: () => "test-id" }) };
};

test("lesson completion runs one learning-loop transaction", async () => {
  const { repository, service } = setup();
  await service.startLesson("lesson-1");
  await service.updateLessonPosition("lesson-1", "l1-grammar", "l1-grammar-question", 60);
  const completed = await service.completeLesson("lesson-1", 120);
  assert.equal(completed.ok, true);

  const state = (await repository.getLearningState()).data;
  assert.equal(state.lessonProgress["lesson-1"].status, "completed");
  assert.equal(state.lessonProgress["lesson-1"].totalStudySeconds, 180);
  assert.ok(Object.keys(state.vocabularyProgress).length > 20);
  assert.ok(Object.values(state.dailyTasks).some((task) => task.taskType === "vocabulary_review"));
  assert.equal(state.dailyStats["2026-07-22"].lessonsCompleted, 1);
});

test("daily task generation is idempotent and points at the next lesson", async () => {
  const { repository, service } = setup();
  await service.generateDailyTasks("2026-07-22");
  await service.generateDailyTasks("2026-07-22");
  let tasks = (await repository.listDailyTasks("2026-07-22")).data;
  assert.equal(tasks.filter((task) => task.taskType === "lesson").length, 1);
  assert.equal(tasks.find((task) => task.taskType === "lesson")?.entityId, "lesson-1");

  await service.completeLesson("lesson-1", 60);
  tasks = (await repository.listDailyTasks("2026-07-22")).data;
  assert.equal(tasks.find((task) => task.taskType === "lesson" && task.entityId === "lesson-1")?.status, "completed");
  assert.ok(tasks.some((task) => task.taskType === "lesson" && task.entityId === "lesson-2"));
});

test("vocabulary review uses configured mastery intervals", async () => {
  const { repository, service } = setup();
  const result = await service.reviewVocabulary("lesson-1:vocabulary:etre", "lesson-1", 4, true);
  assert.equal(result.ok, true);
  assert.equal(result.data.intervalDays, 7);
  assert.equal(result.data.nextReviewAt, "2026-07-29T08:00:00.000Z");
  assert.equal((await repository.getLearningState()).data.dailyStats["2026-07-22"].vocabularyReviewed, 1);
});

test("mistake enters review, masters after two correct attempts, and resets on wrong", async () => {
  const { repository, service } = setup();
  await service.recordExerciseResult("l1-exercises", "lesson-1", "wrong", false, 5);
  let mistake = (await repository.getLearningState()).data.mistakes["l1-exercises"];
  assert.equal(mistake.status, "unresolved");
  assert.equal(mistake.wrongCount, 1);

  await service.recordExerciseResult("l1-exercises", "lesson-1", "correct", true, 4);
  await service.recordExerciseResult("l1-exercises", "lesson-1", "correct", true, 3);
  mistake = (await repository.getLearningState()).data.mistakes["l1-exercises"];
  assert.equal(mistake.status, "mastered");
  assert.ok(mistake.resolvedAt);

  await service.recordExerciseResult("l1-exercises", "lesson-1", "wrong again", false, 2);
  mistake = (await repository.getLearningState()).data.mistakes["l1-exercises"];
  assert.equal(mistake.status, "unresolved");
  assert.equal(mistake.consecutiveCorrectCount, 0);
  assert.equal(mistake.wrongCount, 2);
});

test("dashboard derives streak and a resumable next action", async () => {
  const { service } = setup();
  await service.startLesson("lesson-1");
  await service.updateLessonPosition("lesson-1", "l1-dialogue", "l1-dialogue-a", 30);
  const dashboard = await service.getDashboard("2026-07-22");
  assert.equal(dashboard.ok, true);
  assert.equal(dashboard.data.streakDays, 1);
  assert.deepEqual(dashboard.data.continueAction, { type: "lesson", entityId: "lesson-1", sectionId: "l1-dialogue", sourceBlockId: "l1-dialogue-a" });
});

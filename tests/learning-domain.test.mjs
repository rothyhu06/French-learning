import assert from "node:assert/strict";
import test from "node:test";

import {
  createEmptyLearningState,
  LEARNING_SCHEMA_VERSION,
} from "../lib/learning/types.ts";
import {
  MASTERY_REVIEW_INTERVAL_DAYS,
  MISTAKE_MASTERY_CORRECT_STREAK,
} from "../lib/learning/config.ts";
import {
  getLessonVocabulary,
  learningCatalog,
} from "../lib/learning/catalog.ts";

test("empty learning state uses the versioned browser-local schema", () => {
  const state = createEmptyLearningState("local-test-user", "2026-07-22T08:00:00.000Z");

  assert.equal(LEARNING_SCHEMA_VERSION, 1);
  assert.equal(state.schemaVersion, 1);
  assert.equal(state.localUserId, "local-test-user");
  assert.equal(state.createdAt, "2026-07-22T08:00:00.000Z");
  assert.deepEqual(state.lessonProgress, {});
  assert.deepEqual(state.vocabularyProgress, {});
  assert.deepEqual(state.exerciseAttempts, []);
  assert.deepEqual(state.mistakes, {});
  assert.deepEqual(state.studySessions, []);
  assert.deepEqual(state.dailyTasks, {});
  assert.deepEqual(state.dailyStats, {});
});

test("catalog derives stable vocabulary records from verified lesson blocks", () => {
  const lessonOne = getLessonVocabulary("lesson-1");
  const etre = lessonOne.find((item) => item.term === "être");

  assert.ok(lessonOne.length > 20);
  assert.equal(etre?.id, "lesson-1:vocabulary:etre");
  assert.equal(etre?.meaningZh, "是");
  assert.equal(etre?.sourceBlockId, "l1-vocab");
  assert.equal(learningCatalog.lessons[0]?.id, "lesson-1");
  assert.equal(learningCatalog.lessons.length, 4);
  assert.ok(learningCatalog.lessons.every((lesson) => lesson.vocabularyIds.length > 0));
});

test("review policy is centralized and explainable", () => {
  assert.deepEqual(MASTERY_REVIEW_INTERVAL_DAYS, {
    0: 0,
    1: 1,
    2: 1,
    3: 3,
    4: 7,
    5: 21,
  });
  assert.equal(MISTAKE_MASTERY_CORRECT_STREAK, 2);
});

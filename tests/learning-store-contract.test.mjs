import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("learning store exposes explicit hydration and repository-backed actions", async () => {
  const source = await readFile(new URL("../lib/learning/store.ts", import.meta.url), "utf8");
  for (const name of ["hydrate", "startLesson", "completeLesson", "reviewVocabulary", "recordExerciseResult", "generateDailyTasks", "exportData", "importData", "clearData"]) assert.match(source, new RegExp(name));
  assert.match(source, /hydrated:\s*false/);
  assert.doesNotMatch(source, /localStorage/);
});

test("only the repository factory touches browser localStorage", async () => {
  const provider = await readFile(new URL("../components/learning-provider.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(provider, /localStorage/);
  assert.match(provider, /createBrowserLearningRepository/);
});

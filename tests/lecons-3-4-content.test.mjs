import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Leçon 3–4 use visually verified titles and page ranges", async () => {
  const { trialLessons } = await import("../content/textbooks/bonjour-francais-1/trial-lessons.ts");
  const l3 = trialLessons.find((lesson) => lesson.id === "lesson-3");
  const l4 = trialLessons.find((lesson) => lesson.id === "lesson-4");
  assert.deepEqual([l3?.titleFr, l3?.titleZh, l3?.startPdfPageIndex, l3?.endPdfPageIndex], ["Ça va bien ?", "你好吗？", 35, 38]);
  assert.deepEqual([l4?.titleFr, l4?.titleZh, l4?.startPdfPageIndex, l4?.endPdfPageIndex], ["Correspondants", "寻找笔友", 39, 42]);
  assert.ok(l3.sections.length >= 8);
  assert.ok(l4.sections.length >= 6);
});

test("page map links printed pages 28–35 to Leçon 3–4 without duplicates", async () => {
  const { textbookPages } = await import("../content/textbooks/bonjour-francais-1/page-map.ts");
  const pages = textbookPages.filter((page) => page.printedPageNumber >= 28 && page.printedPageNumber <= 35);
  assert.deepEqual(pages.map((page) => page.pdfPageIndex), [35, 36, 37, 38, 39, 40, 41, 42]);
  assert.deepEqual([...new Set(pages.slice(0, 4).map((page) => page.lessonId))], ["lesson-3"]);
  assert.deepEqual([...new Set(pages.slice(4).map((page) => page.lessonId))], ["lesson-4"]);
  assert.ok(pages.every((page) => !page.isDuplicate && page.verificationStatus === "verified"));
});

test("new vocabulary preserves textbook morphology and source location", async () => {
  const { learningCatalog } = await import("../lib/learning/catalog.ts");
  const address = learningCatalog.vocabulary.find((item) => item.id === "lesson-3:vocabulary:adresse");
  const correspondent = learningCatalog.vocabulary.find((item) => item.id === "lesson-4:vocabulary:correspondant-e");
  assert.deepEqual({ partOfSpeech: address?.partOfSpeech, gender: address?.gender, meaningZh: address?.meaningZh, sourceBlockId: address?.sourceBlockId }, { partOfSpeech: "nom", gender: "feminine", meaningZh: "地址，住址", sourceBlockId: "l3-vocab" });
  assert.equal(correspondent?.meaningZh, "通信者，有信件来往者");
  assert.equal(correspondent?.printedPageNumber, 33);
});

test("structured exercises distinguish automatic and manual evaluation", async () => {
  const { learningCatalog } = await import("../lib/learning/catalog.ts");
  const automatic = learningCatalog.exercises.find((item) => item.id === "l3-exercise-presentations");
  const audio = learningCatalog.exercises.find((item) => item.id === "l3-audio-hotel");
  const writing = learningCatalog.exercises.find((item) => item.id === "l4-writing-email");
  assert.deepEqual(automatic?.acceptedAnswers, ["c,d,a,b"]);
  assert.equal(automatic?.evaluationMode, "automatic");
  assert.equal(audio?.evaluationMode, "manual");
  assert.equal(audio?.exerciseType, "audio");
  assert.equal(writing?.exerciseType, "open");
});

test("verified search now covers Leçon 1–4", async () => {
  const { searchTextbook } = await import("../lib/text-search.ts");
  assert.ok(searchTextbook("accent tonique").some((result) => result.lessonId === "lesson-3"));
  assert.ok(searchTextbook("La Francophonie").some((result) => result.lessonId === "lesson-4"));
  assert.ok(searchTextbook("correspondant").some((result) => result.lessonId === "lesson-4"));
});

test("private page preparation includes Leçon 3–4 pages", async () => {
  const script = await readFile(new URL("../scripts/prepare-textbook-page-cache.mjs", import.meta.url), "utf8");
  assert.match(script, /pdfPageIndex <= 42/);
  assert.match(script, /Prepared 16 private textbook pages/);
});

test("ingestion manifest records page-level visual evidence and review limits", async () => {
  const { lecons34IngestionManifest } = await import("../content/textbooks/bonjour-francais-1/lecons-3-4-ingestion.ts");
  assert.equal(lecons34IngestionManifest.pages.length, 8);
  assert.deepEqual(lecons34IngestionManifest.pages.map((page) => page.pdfPageIndex), [35,36,37,38,39,40,41,42]);
  assert.ok(lecons34IngestionManifest.pages.every((page) => page.isDuplicate === false));
  assert.ok(lecons34IngestionManifest.lessons.find((lesson) => lesson.lessonId === "lesson-4")?.crossPageContent.includes("La Francophonie"));
  assert.ok(lecons34IngestionManifest.pendingReview.some((item) => item.sourceBlockId === "l4-culture-b"));
});

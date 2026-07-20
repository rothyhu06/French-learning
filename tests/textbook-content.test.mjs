import test from "node:test";
import assert from "node:assert/strict";

test("verified page map preserves zero-based indices and duplicate front matter", async () => {
  const { textbookPages } = await import("../content/textbooks/bonjour-francais-1/page-map.ts");
  assert.equal(textbookPages[0].pdfPageIndex, 0);
  assert.equal(textbookPages[0].pdfPageNumber, 1);
  assert.equal(textbookPages.find((page) => page.printedPageNumber === 20)?.pdfPageIndex, 27);
  assert.ok(textbookPages.filter((page) => page.isDuplicate).length >= 8);
  assert.ok(textbookPages.filter((page) => page.isDuplicate).every((page) => page.duplicateOfPageId));
});

test("directory uses real textbook hierarchy and titles", async () => {
  const { directoryNodes, lessons } = await import("../content/textbooks/bonjour-francais-1/directory.ts");
  assert.equal(directoryNodes.find((node) => node.originalNumber === "Unité 1")?.titleFr, "Rencontres");
  assert.equal(directoryNodes.find((node) => node.originalNumber === "Unité 1")?.titleZh, "相遇");
  assert.equal(lessons.find((lesson) => lesson.originalNumber === "Leçon 1")?.titleFr, "Bienvenue !");
  assert.equal(lessons.find((lesson) => lesson.originalNumber === "Leçon 2")?.titleFr, "Qui est-ce ?");
  assert.equal(lessons.some((lesson) => lesson.titleFr === "Je m’appelle…"), false);
  assert.equal(new Set([...directoryNodes, ...lessons].map((item) => item.sourceOrder)).size, directoryNodes.length + lessons.length);
});

test("French search normalization is accent and punctuation compatible", async () => {
  const { normalizeText, toAccentlessText } = await import("../lib/text-search.ts");
  assert.equal(normalizeText("  Je M’APPELLE !  "), "je m'appelle !");
  assert.equal(toAccentlessText("Être française"), "etre francaise");
});

test("default search includes only verified source blocks", async () => {
  const { searchTextbook, searchableSourceBlocks } = await import("../lib/text-search.ts");
  assert.ok(searchableSourceBlocks.length > 0);
  assert.ok(searchableSourceBlocks.every((block) => block.verificationStatus === "verified"));
  assert.ok(searchTextbook("etre").some((result) => result.originalText.includes("être")));
  assert.ok(searchTextbook("Bienvenue").some((result) => result.lessonId === "lesson-1"));
  assert.ok(searchTextbook("自我介绍").some((result) => result.id === "u1-objectives"));
  assert.ok(searchTextbook("教材第 24 页").some((result) => result.printedPageNumber === 24));
});

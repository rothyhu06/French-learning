import test from "node:test";
import assert from "node:assert/strict";

test("page request accepts only allowlisted textbook and verified page range",async()=>{
  const { resolveTextbookPageRequest }=await import("../lib/textbook-page-request.ts");
  assert.deepEqual(resolveTextbookPageRequest("bonjour-francais-1",27),{textbookId:"bonjour-francais-1",pdfPageIndex:27,pdfPageNumber:28,printedPageNumber:20});
  assert.throws(()=>resolveTextbookPageRequest("other-book",27),/Unsupported textbook/);
  assert.throws(()=>resolveTextbookPageRequest("bonjour-francais-1",239),/outside/);
});

test("reader and search URLs preserve source location",async()=>{
  const { learningUrl, textbookUrl }=await import("../lib/textbook-links.ts");
  assert.equal(learningUrl({lessonId:"lesson-1",sectionId:"l1-grammar",sourceBlockId:"l1-grammar-question"}),"/courses/lesson-1?mode=learn&sectionId=l1-grammar&sourceBlockId=l1-grammar-question");
  assert.equal(textbookUrl({lessonId:"lesson-1",pdfPageIndex:29,sourceBlockId:"l1-grammar-question"}),"/courses/lesson-1?mode=textbook&pdfPageIndex=29&sourceBlockId=l1-grammar-question");
});

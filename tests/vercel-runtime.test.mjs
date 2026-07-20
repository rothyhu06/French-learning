import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("production build targets the standard Next.js runtime used by Vercel", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  const textbookFiles = await readFile(new URL("../lib/textbook-files.ts", import.meta.url), "utf8");
  const textbookRoute = await readFile(new URL("../app/api/textbooks/[textbookId]/pages/[pdfPageIndex]/route.ts", import.meta.url), "utf8");
  assert.equal(packageJson.scripts.build, "next build");
  assert.equal(packageJson.scripts.dev, "next dev");
  assert.equal(textbookFiles.includes("import.meta.glob"), false);
  assert.match(textbookRoute, /runtime\s*=\s*["']nodejs["']/);
});

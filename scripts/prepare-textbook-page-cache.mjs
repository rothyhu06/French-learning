import { execFile } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const pdfPath = process.env.TEXTBOOK_BONJOUR_FRANCAIS_1_PATH;
const pdftoppm = process.env.PDFTOPPM_BIN || "pdftoppm";
if (!pdfPath) throw new Error("TEXTBOOK_BONJOUR_FRANCAIS_1_PATH is required");

const outputDir = join(process.cwd(), ".private", "textbook-pages", "bonjour-francais-1");
await mkdir(outputDir, { recursive: true });
for (let pdfPageIndex = 27; pdfPageIndex <= 42; pdfPageIndex += 1) {
  const pdfPageNumber = pdfPageIndex + 1;
  await run(pdftoppm, [
    "-f", String(pdfPageNumber), "-l", String(pdfPageNumber),
    "-jpeg", "-r", "110", "-singlefile", pdfPath,
    join(outputDir, `page-${pdfPageIndex}`),
  ]);
}
console.log(`Prepared 16 private textbook pages in ${outputDir}`);

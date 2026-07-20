import { resolveTextbookPageRequest } from "./textbook-page-request.ts";

export async function renderTextbookPage(textbookId:string,pdfPageIndex:number){
  resolveTextbookPageRequest(textbookId,pdfPageIndex);
  const [{ readFile }, { join }] = await Promise.all([import("node:fs/promises"), import("node:path")]);
  const cacheRoot = process.env.TEXTBOOK_PAGE_CACHE_PATH || join(process.cwd(), ".private", "textbook-pages");
  try {
    return await readFile(join(cacheRoot, textbookId, `page-${pdfPageIndex}.jpg`));
  } catch {
    throw new Error("Verified textbook page is not present in the private cache");
  }
}

import { resolveTextbookPageRequest } from "./textbook-page-request.ts";

const privatePageAssets = import.meta.glob("../.private/textbook-pages/**/*.jpg", {
  eager: true,
  query: "?inline",
  import: "default",
}) as Record<string, string>;

export async function renderTextbookPage(textbookId:string,pdfPageIndex:number){
  resolveTextbookPageRequest(textbookId,pdfPageIndex);
  const suffix = `/textbook-pages/${textbookId}/page-${pdfPageIndex}.jpg`;
  const dataUrl = Object.entries(privatePageAssets).find(([path]) => path.endsWith(suffix))?.[1];
  if (!dataUrl) throw new Error("Verified textbook page is not present in the private cache");
  return new Uint8Array(await (await fetch(dataUrl)).arrayBuffer());
}

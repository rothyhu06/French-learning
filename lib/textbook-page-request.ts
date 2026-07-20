import { getTextbookPage } from "../content/textbooks/bonjour-francais-1/page-map.ts";

export function resolveTextbookPageRequest(textbookId:string,pdfPageIndex:number){
  if(textbookId!=="bonjour-francais-1") throw new Error("Unsupported textbook");
  const page=getTextbookPage(pdfPageIndex);
  if(!page) throw new Error("Page is outside the verified range");
  return {textbookId,pdfPageIndex,pdfPageNumber:page.pdfPageNumber,printedPageNumber:page.printedPageNumber};
}

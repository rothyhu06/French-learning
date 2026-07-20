import { sourceBlocks } from "../content/textbooks/bonjour-francais-1/trial-lessons.ts";

export function normalizeText(value:string){ return value.normalize("NFC").replace(/[’‘]/g,"'").replace(/[‐‑–—]/g,"-").replace(/\s+/g," ").trim().toLocaleLowerCase("fr"); }
export function toAccentlessText(value:string){ return normalizeText(value).normalize("NFD").replace(/[\u0300-\u036f]/g,""); }

export const searchableSourceBlocks=sourceBlocks.filter(block=>block.verificationStatus==="verified");

export function searchTextbook(query:string){
  const normalized=normalizeText(query); const accentless=toAccentlessText(query);
  if(!normalized) return [];
  const pageMatch = normalized.match(/^(?:教材)?\s*第?\s*(\d+)\s*页?$/);
  if (pageMatch) {
    const printedPageNumber = Number(pageMatch[1]);
    return searchableSourceBlocks
      .filter((block) => block.printedPageNumber === printedPageNumber)
      .map((block) => ({ ...block, score: 100, normalizedText: normalizeText(block.originalText), accentlessText: toAccentlessText(block.originalText) }))
      .sort((a, b) => a.sourceOrder - b.sourceOrder);
  }
  return searchableSourceBlocks.map(block=>{ const original=normalizeText(block.originalText); const loose=toAccentlessText(block.originalText); let score=0; if(original===normalized||loose===accentless)score=100; else if(original.startsWith(normalized)||loose.startsWith(accentless))score=70; else if(original.includes(normalized)||loose.includes(accentless))score=50; return { ...block, score, normalizedText:original, accentlessText:loose }; }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score||a.sourceOrder-b.sourceOrder);
}

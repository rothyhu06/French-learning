import type { TextbookPage } from "./types.ts";

export const TEXTBOOK_ID = "bonjour-francais-1";

const front: Array<[number,number|null,string,boolean,string|null,string|null]> = [
  [0,3,"目录（第一组）",false,null,"扫描文件前部存在三组重复编排页；保留首次出现为主记录。"],
  [1,4,"目录续页（第一组）",false,null,null],
  [2,1,"出版说明（第一组）",false,null,null],
  [3,2,"序言（第一组）",false,null,null],
  [4,3,"目录（第二组重复）",true,"bf1-page-0",null],
  [5,4,"目录续页（第二组重复）",true,"bf1-page-1",null],
  [6,1,"出版说明（第二组重复）",true,"bf1-page-2",null],
  [7,2,"序言（第二组重复）",true,"bf1-page-3",null],
  [8,3,"目录（第三组重复）",true,"bf1-page-0",null],
  [9,4,"目录续页（第三组重复）",true,"bf1-page-1",null],
  [10,1,"出版说明（第三组重复）",true,"bf1-page-2",null],
  [11,2,"序言（第三组重复）",true,"bf1-page-3",null],
];

const unitForPrinted = (printed:number) => printed <= 18 ? "unit-0" : printed <= 36 ? "unit-1" : null;
const lessonForPrinted = (printed:number) => printed >=20 && printed<=23 ? "lesson-1" : printed>=24&&printed<=27 ? "lesson-2" : null;

export const textbookPages: TextbookPage[] = [
  ...front.map(([pdfPageIndex,printedPageNumber,pageLabel,isDuplicate,duplicateOfPageId,notes])=>({id:`bf1-page-${pdfPageIndex}`,textbookId:TEXTBOOK_ID,pdfPageIndex,pdfPageNumber:pdfPageIndex+1,printedPageNumber,pageType:"front_matter" as const,unitId:null,lessonId:null,pageLabel,isDuplicate,duplicateOfPageId,verificationStatus:"verified" as const,notes})),
  ...Array.from({length:23},(_,offset)=>{ const pdfPageIndex=offset+12; const printedPageNumber=offset+5; const unitId=unitForPrinted(printedPageNumber); const lessonId=lessonForPrinted(printedPageNumber); return {id:`bf1-page-${pdfPageIndex}`,textbookId:TEXTBOOK_ID,pdfPageIndex,pdfPageNumber:pdfPageIndex+1,printedPageNumber,pageType:(printedPageNumber===5||printedPageNumber===19?"unit_cover":lessonId?"lesson":"lesson") as TextbookPage["pageType"],unitId,lessonId,pageLabel:`教材第 ${printedPageNumber} 页`,isDuplicate:false,duplicateOfPageId:null,verificationStatus:"verified" as const,notes:null};}),
];

export function getTextbookPage(pdfPageIndex:number){ return textbookPages.find(page=>page.pdfPageIndex===pdfPageIndex); }

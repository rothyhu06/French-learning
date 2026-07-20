export type VerificationStatus = "pending" | "pending_review" | "reviewed" | "verified" | "rejected";
export type ExtractionMethod = "manual" | "pdf_text" | "vision" | "imported" | "ai_assisted";
export type DirectoryNodeType = "front_matter" | "unite" | "evaluation" | "annexes" | "subsection";
export type LessonKind = "lesson" | "savoir_faire";

export interface TextbookPage {
  id: string; textbookId: string; pdfPageIndex: number; pdfPageNumber: number;
  printedPageNumber: number | null; pageType: "front_matter" | "unit_cover" | "lesson" | "annex";
  unitId: string | null; lessonId: string | null; pageLabel: string;
  isDuplicate: boolean; duplicateOfPageId: string | null; verificationStatus: VerificationStatus; notes: string | null;
}

export interface DirectoryNode {
  id: string; textbookId: string; parentId: string | null; nodeType: DirectoryNodeType;
  originalNumber: string; titleFr: string; titleZh: string | null; sourceOrder: number;
  startPrintedPageNumber: number | null; endPrintedPageNumber: number | null;
  startPdfPageIndex: number | null; endPdfPageIndex: number | null; dataSource: string; contentParsed: boolean;
}

export interface TextbookLesson {
  id: string; textbookId: string; chapterId: string; kind: LessonKind; originalNumber: string;
  titleFr: string; titleZh: string | null; sourceOrder: number; startPrintedPageNumber: number;
  endPrintedPageNumber: number; startPdfPageIndex: number; endPdfPageIndex: number; contentParsed: boolean;
}

export type SourceBlockType = "learning_objectives"|"dialogue"|"notes"|"vocabulary"|"discovery"|"grammar"|"expressions"|"exercises"|"speaking"|"pronunciation"|"culture"|"page_heading";
export interface SourceBlock { id:string; textbookId:string; textbookPageId:string; lessonId:string|null; sectionId:string|null; pdfPageIndex:number; printedPageNumber:number|null; sourceBbox:{x:number;y:number;width:number;height:number}|null; blockType:SourceBlockType; originalText:string; language:"fr"|"zh"|"mixed"; sourceOrder:number; extractionMethod:ExtractionMethod; verificationStatus:VerificationStatus; verifiedAt:string|null; notes:string|null; }

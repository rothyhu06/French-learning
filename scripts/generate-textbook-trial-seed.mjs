import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { textbookPages } from "../content/textbooks/bonjour-francais-1/page-map.ts";
import { directoryNodes, lessons } from "../content/textbooks/bonjour-francais-1/directory.ts";
import { sourceBlocks, trialLessons } from "../content/textbooks/bonjour-francais-1/trial-lessons.ts";
import { normalizeText, toAccentlessText } from "../lib/text-search.ts";
import { learningCatalog } from "../lib/learning/catalog.ts";

const out = new URL("../supabase/seed/bonjour-francais-1-trial.sql", import.meta.url);
const uuid = (value) => {
  const hex = createHash("sha256").update(`bonjour-francais-1:${value}`).digest("hex").slice(0, 32).split("");
  hex[12] = "4";
  hex[16] = ((Number.parseInt(hex[16], 16) & 3) | 8).toString(16);
  return `${hex.slice(0,8).join("")}-${hex.slice(8,12).join("")}-${hex.slice(12,16).join("")}-${hex.slice(16,20).join("")}-${hex.slice(20).join("")}`;
};
const q = (value) => value == null ? "null" : `'${String(value).replaceAll("'", "''")}'`;
const j = (value) => value == null ? "null" : `${q(JSON.stringify(value))}::jsonb`;
const textbookId = uuid("textbook");
const rows = [];
rows.push("begin;");
rows.push(`insert into public.textbooks (id,title,level,edition,source_type,source_file_name,page_count,import_status,is_primary,metadata) values (${q(textbookId)},'你好！法语 1','A1',null,'scanned_pdf','你好！法语  1  学生用书.pdf',239,'published',true,'{"content_scope":"verified_trial"}'::jsonb) on conflict (id) do update set title=excluded.title,page_count=excluded.page_count,import_status=excluded.import_status,metadata=excluded.metadata;`);
for (const node of directoryNodes) rows.push(`insert into public.chapters (id,textbook_id,parent_id,node_type,title,title_fr,title_zh,level,position,source_order,source_page_start,source_page_end,start_pdf_page_index,end_pdf_page_index,start_printed_page_number,end_printed_page_number) values (${q(uuid(node.id))},${q(textbookId)},${node.parentId?q(uuid(node.parentId)):"null"},${q(node.nodeType)},${q(`${node.originalNumber} ${node.titleFr}`)},${q(node.titleFr)},${q(node.titleZh)},'A1',${node.sourceOrder},${node.sourceOrder},${node.startPrintedPageNumber??"null"},${node.endPrintedPageNumber??"null"},${node.startPdfPageIndex??"null"},${node.endPdfPageIndex??"null"},${node.startPrintedPageNumber??"null"},${node.endPrintedPageNumber??"null"}) on conflict (id) do update set parent_id=excluded.parent_id,node_type=excluded.node_type,title=excluded.title,title_fr=excluded.title_fr,title_zh=excluded.title_zh,source_order=excluded.source_order;`);
for (const lesson of lessons) {
  const number = lesson.kind === "savoir_faire" ? 99 : Number(lesson.originalNumber.match(/(\d+)$/)?.[1] ?? 0);
  rows.push(`insert into public.lessons (id,chapter_id,slug,number,title,subtitle,objectives,source_page_start,source_page_end,published_at,lesson_kind,original_number,title_fr,title_zh,source_order,start_pdf_page_index,end_pdf_page_index,start_printed_page_number,end_printed_page_number) values (${q(uuid(lesson.id))},${q(uuid(lesson.chapterId))},${q(lesson.id)},${number},${q(lesson.titleFr)},${q(lesson.titleZh)},'{}',${lesson.startPrintedPageNumber},${lesson.endPrintedPageNumber},${lesson.contentParsed?"now()":"null"},${q(lesson.kind)},${q(lesson.originalNumber)},${q(lesson.titleFr)},${q(lesson.titleZh)},${lesson.sourceOrder},${lesson.startPdfPageIndex},${lesson.endPdfPageIndex},${lesson.startPrintedPageNumber},${lesson.endPrintedPageNumber}) on conflict (id) do update set chapter_id=excluded.chapter_id,title=excluded.title,title_zh=excluded.title_zh,source_order=excluded.source_order,published_at=excluded.published_at;`);
}
for (const page of textbookPages) rows.push(`insert into public.textbook_pages (id,textbook_id,pdf_page_index,pdf_page_number,printed_page_number,page_type,unit_id,lesson_id,page_label,is_duplicate,duplicate_of_page_id,verification_status,notes) values (${q(uuid(page.id))},${q(textbookId)},${page.pdfPageIndex},${page.pdfPageNumber},${page.printedPageNumber??"null"},${q(page.pageType)},${page.unitId?q(uuid(page.unitId)):"null"},${page.lessonId?q(uuid(page.lessonId)):"null"},${q(page.pageLabel)},${page.isDuplicate},${page.duplicateOfPageId?q(uuid(page.duplicateOfPageId)):"null"},${q(page.verificationStatus)},${q(page.notes)}) on conflict (id) do update set printed_page_number=excluded.printed_page_number,page_label=excluded.page_label,is_duplicate=excluded.is_duplicate,duplicate_of_page_id=excluded.duplicate_of_page_id,verification_status=excluded.verification_status;`);
for (const lesson of trialLessons) for (const section of lesson.sections) {
  const type = section.type === "expressions" ? "expression" : section.type;
  const blocks = sourceBlocks.filter((block) => section.sourceBlockIds.includes(block.id));
  rows.push(`insert into public.lesson_sections (id,lesson_id,kind,title,content,position,source_page_start,source_page_end) values (${q(uuid(section.id))},${q(uuid(lesson.id))},${q(type)},${q(`${section.titleFr} / ${section.titleZh}`)},${j({sourceBlockIds:section.sourceBlockIds})},${lesson.sections.indexOf(section)+1},${Math.min(...blocks.map(b=>b.printedPageNumber))},${Math.max(...blocks.map(b=>b.printedPageNumber))}) on conflict (id) do update set kind=excluded.kind,title=excluded.title,content=excluded.content,position=excluded.position;`);
}
for (const block of sourceBlocks) {
  rows.push(`insert into public.source_blocks (id,textbook_id,textbook_page_id,pdf_page_index,printed_page_number,source_bbox,block_type,original_text,language,source_order,extraction_method,verification_status,verified_at,notes) values (${q(uuid(block.id))},${q(textbookId)},${q(uuid(block.textbookPageId))},${block.pdfPageIndex},${block.printedPageNumber??"null"},${j(block.sourceBbox)},${q(block.blockType)},${q(block.originalText)},${q(block.language)},${block.sourceOrder},${q(block.extractionMethod)},${q(block.verificationStatus)},${q(block.verifiedAt)},${q(block.notes)}) on conflict (id) do update set original_text=excluded.original_text,verification_status=excluded.verification_status,verified_at=excluded.verified_at;`);
  if (block.lessonId) rows.push(`insert into public.content_source_links (source_block_id,entity_type,entity_id,relation_type,confidence,verification_status) values (${q(uuid(block.id))},'lesson',${q(uuid(block.lessonId))},'source',1,${q(block.verificationStatus)}) on conflict do nothing;`);
  if (block.sectionId) rows.push(`insert into public.content_source_links (source_block_id,entity_type,entity_id,relation_type,confidence,verification_status) values (${q(uuid(block.id))},'lesson_section',${q(uuid(block.sectionId))},'source',1,${q(block.verificationStatus)}) on conflict do nothing;`);
  rows.push(`insert into public.textbook_search_index (source_block_id,textbook_id,lesson_id,section_id,original_text,normalized_text,accentless_text,searchable_text,language,verification_status) values (${q(uuid(block.id))},${q(textbookId)},${block.lessonId?q(uuid(block.lessonId)):"null"},${block.sectionId?q(uuid(block.sectionId)):"null"},${q(block.originalText)},${q(normalizeText(block.originalText))},${q(toAccentlessText(block.originalText))},${q(`${block.originalText} ${normalizeText(block.originalText)} ${toAccentlessText(block.originalText)}`)},${q(block.language)},${q(block.verificationStatus)}) on conflict (source_block_id) do update set original_text=excluded.original_text,normalized_text=excluded.normalized_text,accentless_text=excluded.accentless_text,searchable_text=excluded.searchable_text,verification_status=excluded.verification_status,updated_at=now();`);
}
const genderValue = { masculine: "m.", feminine: "f.", variable: "m./f." };
for (const [position, item] of learningCatalog.vocabulary.entries()) {
  const source = sourceBlocks.find((block) => block.id === item.sourceBlockId);
  const sectionId = source?.sectionId ?? `${item.lessonId.replace("lesson-", "l")}-vocabulary`;
  rows.push(`insert into public.vocabulary (id,lesson_id,section_id,french,chinese,part_of_speech,gender,plural,source_page,position) values (${q(uuid(item.id))},${q(uuid(item.lessonId))},${q(uuid(sectionId))},${q(item.term)},${q(item.meaningZh)},${q(item.partOfSpeech)},${q(item.gender ? genderValue[item.gender] : null)},${q(item.plural)},${item.printedPageNumber??"null"},${position+1}) on conflict (id) do update set french=excluded.french,chinese=excluded.chinese,part_of_speech=excluded.part_of_speech,gender=excluded.gender,plural=excluded.plural,source_page=excluded.source_page,position=excluded.position;`);
  rows.push(`insert into public.content_source_links (source_block_id,entity_type,entity_id,relation_type,confidence,verification_status) values (${q(uuid(item.sourceBlockId))},'vocabulary',${q(uuid(item.id))},'source',1,'verified') on conflict do nothing;`);
}
for (const block of sourceBlocks.filter((item) => item.blockType === "grammar" && item.lessonId && item.sectionId)) {
  rows.push(`insert into public.grammar_points (id,lesson_id,section_id,title,explanation,examples,source_page,position) values (${q(uuid(`grammar:${block.id}`))},${q(uuid(block.lessonId))},${q(uuid(block.sectionId))},${q(block.originalText.split(/[。:：]/u)[0])},${j({originalText:block.originalText})},'[]'::jsonb,${block.printedPageNumber??"null"},${block.sourceOrder}) on conflict (id) do update set title=excluded.title,explanation=excluded.explanation,source_page=excluded.source_page,position=excluded.position;`);
  rows.push(`insert into public.content_source_links (source_block_id,entity_type,entity_id,relation_type,confidence,verification_status) values (${q(uuid(block.id))},'grammar',${q(uuid(`grammar:${block.id}`))},'source',1,${q(block.verificationStatus)}) on conflict do nothing;`);
}
for (const [position, item] of learningCatalog.exercises.entries()) {
  const source = sourceBlocks.find((block) => block.id === item.sourceBlockId);
  const kind = item.exerciseType === "audio" ? "listening" : item.exerciseType === "open" ? "writing" : item.evaluationMode === "automatic" ? "fill_blank" : "choice";
  rows.push(`insert into public.exercises (id,lesson_id,section_id,kind,prompt,answer,explanation,difficulty,source_page,position) values (${q(uuid(item.id))},${q(uuid(item.lessonId))},${source?.sectionId?q(uuid(source.sectionId)):"null"},${q(kind)},${j({text:item.title,type:item.exerciseType,evaluationMode:item.evaluationMode})},${j({acceptedAnswers:item.acceptedAnswers,manual:item.evaluationMode==="manual"})},'{}'::jsonb,1,${source?.printedPageNumber??"null"},${position+1}) on conflict (id) do update set kind=excluded.kind,prompt=excluded.prompt,answer=excluded.answer,source_page=excluded.source_page,position=excluded.position;`);
  rows.push(`insert into public.content_source_links (source_block_id,entity_type,entity_id,relation_type,confidence,verification_status) values (${q(uuid(item.sourceBlockId))},'exercise',${q(uuid(item.id))},'source',1,${q(source?.verificationStatus??"pending")}) on conflict do nothing;`);
}
rows.push("commit;");
await writeFile(out, `${rows.join("\n")}\n`, "utf8");
console.log(`Generated ${out.pathname}: ${directoryNodes.length} nodes, ${lessons.length} lessons, ${textbookPages.length} pages, ${sourceBlocks.length} source blocks.`);

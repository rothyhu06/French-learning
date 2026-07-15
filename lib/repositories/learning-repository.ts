import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase/database.types";

export type LearningClient = SupabaseClient<Database>;

export async function getTextbookOutline(client: LearningClient) {
  const { data: textbooks, error: textbookError } = await client.from("textbooks").select("*").order("is_primary", { ascending: false });
  if (textbookError) throw textbookError;
  const { data: chapters, error: chapterError } = await client.from("chapters").select("*").order("position");
  if (chapterError) throw chapterError;
  const { data: lessons, error: lessonError } = await client.from("lessons").select("*").order("number");
  if (lessonError) throw lessonError;
  const { data: sections, error: sectionError } = await client.from("lesson_sections").select("*").order("position");
  if (sectionError) throw sectionError;
  return { textbooks, chapters, lessons, sections };
}

export async function getLesson(client: LearningClient, slug: string) {
  const { data: lesson, error } = await client.from("lessons").select("*").eq("slug", slug).single();
  if (error) throw error;
  const { data: sections, error: sectionError } = await client.from("lesson_sections").select("*").eq("lesson_id", lesson.id).order("position");
  if (sectionError) throw sectionError;
  return { lesson, sections };
}

export async function getVocabulary(client: LearningClient, lessonId?: string) {
  let query = client.from("vocabulary").select("*").order("position");
  if (lessonId) query = query.eq("lesson_id", lessonId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function saveLessonProgress(client: LearningClient, input: { userId:string; lessonId:string; progressPercent:number; activeSeconds:number; lastSectionId?:string }) {
  const { error } = await client.from("lesson_progress").upsert({ user_id:input.userId, lesson_id:input.lessonId, progress_percent:input.progressPercent, active_seconds:input.activeSeconds, last_section_id:input.lastSectionId ?? null, status:input.progressPercent >= 100 ? "completed" : "in_progress", updated_at:new Date().toISOString() }, { onConflict:"user_id,lesson_id" });
  if (error) throw error;
}

export async function saveVocabularyProgress(client: LearningClient, input:{ userId:string; vocabularyId:string; mastery:number; favorite:boolean; nextReviewAt?:string }) {
  const { error } = await client.from("vocabulary_progress").upsert({ user_id:input.userId, vocabulary_id:input.vocabularyId, mastery:input.mastery, is_favorite:input.favorite, next_review_at:input.nextReviewAt ?? null, updated_at:new Date().toISOString() }, { onConflict:"user_id,vocabulary_id" });
  if (error) throw error;
}

export async function saveDailyPlan(client: LearningClient, input:{ userId:string; date:string; tasks:Json; targetMinutes:number; completedMinutes:number }) {
  const { error } = await client.from("daily_plans").upsert({ user_id:input.userId, plan_date:input.date, tasks:input.tasks, target_minutes:input.targetMinutes, completed_minutes:input.completedMinutes, updated_at:new Date().toISOString() }, { onConflict:"user_id,plan_date" });
  if (error) throw error;
}

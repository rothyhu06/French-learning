"use client";

import { create } from "zustand";
import type { ImportMode, ImportPreview, LearningRepository, RepositoryIssue } from "./repository";
import { LearningService, type LearningDashboard } from "./learning-service";
import type { MasteryLevel, UserLearningState } from "./types";

interface LearningStore {
  hydrated: boolean;
  loading: boolean;
  state: UserLearningState | null;
  dashboard: LearningDashboard | null;
  error: RepositoryIssue | null;
  warning: RepositoryIssue | null;
  configure: (repository: LearningRepository) => void;
  hydrate: () => Promise<void>;
  refresh: () => Promise<void>;
  startLesson: (lessonId: string) => Promise<void>;
  updateLessonPosition: (lessonId: string, sectionId: string | null, sourceBlockId: string | null, seconds?: number) => Promise<void>;
  completeLesson: (lessonId: string, seconds?: number) => Promise<void>;
  toggleVocabularyFavorite: (vocabularyId: string, lessonId: string) => Promise<void>;
  reviewVocabulary: (vocabularyId: string, lessonId: string, masteryLevel: MasteryLevel, correct: boolean) => Promise<void>;
  recordExerciseResult: (exerciseId: string, lessonId: string, answer: string, correct: boolean, seconds?: number) => Promise<void>;
  generateDailyTasks: (date?: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  exportData: () => Promise<string | null>;
  previewImport: (serialized: string) => Promise<ImportPreview | null>;
  importData: (serialized: string, mode: ImportMode) => Promise<void>;
  clearData: () => Promise<void>;
}

let repository: LearningRepository | null = null;
let service: LearningService | null = null;
const currentDate = () => new Date().toISOString().slice(0, 10);

export const useLearningStore = create<LearningStore>((set, get) => {
  const requireRepository = () => { if (!repository || !service) throw new Error("LearningProvider 尚未初始化。"); return { repository, service }; };
  const refresh = async () => {
    const adapters = requireRepository();
    const [stateResult, dashboardResult] = await Promise.all([adapters.repository.getLearningState(), adapters.service.getDashboard(currentDate())]);
    if (!stateResult.ok) { set({ error: stateResult.error, loading: false }); return; }
    set({ state: stateResult.data, dashboard: dashboardResult.ok ? dashboardResult.data : null, error: dashboardResult.ok ? null : dashboardResult.error, warning: stateResult.warning ?? null, loading: false });
  };
  const run = async (operation: () => Promise<unknown>) => { set({ loading: true, error: null }); try { await operation(); await refresh(); } catch (cause) { set({ loading: false, error: { code: "LEARNING_ACTION_FAILED", message: cause instanceof Error ? cause.message : "学习数据操作失败。" } }); } };
  return {
    hydrated: false, loading: true, state: null, dashboard: null, error: null, warning: null,
    configure: (next) => { repository = next; service = new LearningService(next); },
    hydrate: async () => { if (get().hydrated) return; await refresh(); set({ hydrated: true }); },
    refresh,
    startLesson: async (lessonId) => run(() => requireRepository().service.startLesson(lessonId)),
    updateLessonPosition: async (lessonId, sectionId, sourceBlockId, seconds = 0) => run(() => requireRepository().service.updateLessonPosition(lessonId, sectionId, sourceBlockId, seconds)),
    completeLesson: async (lessonId, seconds = 0) => run(() => requireRepository().service.completeLesson(lessonId, seconds)),
    toggleVocabularyFavorite: async (vocabularyId, lessonId) => run(() => requireRepository().service.toggleVocabularyFavorite(vocabularyId, lessonId)),
    reviewVocabulary: async (vocabularyId, lessonId, level, correct) => run(() => requireRepository().service.reviewVocabulary(vocabularyId, lessonId, level, correct)),
    recordExerciseResult: async (exerciseId, lessonId, answer, correct, seconds = 0) => run(() => requireRepository().service.recordExerciseResult(exerciseId, lessonId, answer, correct, seconds)),
    generateDailyTasks: async (date = currentDate()) => run(() => requireRepository().service.generateDailyTasks(date)),
    completeTask: async (taskId) => run(() => requireRepository().repository.completeDailyTask(taskId)),
    exportData: async () => { const result = await requireRepository().repository.exportLearningData(); return result.ok ? result.data : null; },
    previewImport: async (serialized) => { const result = await requireRepository().repository.previewImport(serialized); if (!result.ok) { set({ error: result.error }); return null; } return result.data; },
    importData: async (serialized, mode) => run(() => requireRepository().repository.importLearningData(serialized, mode)),
    clearData: async () => run(() => requireRepository().repository.clearLearningData()),
  };
});

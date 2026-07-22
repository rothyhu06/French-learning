import { DEFAULT_EASE_FACTOR, LEARNING_STORAGE_KEY, LOCAL_WRITE_DEBOUNCE_MS } from "./config.ts";
import type { DashboardStats, ImportMode, ImportPreview, LearningRepository, RepositoryResult, VocabularyProgressUpdate } from "./repository.ts";
import { createEmptyLearningState, LEARNING_SCHEMA_VERSION, type ExerciseAttempt, type MistakeRecord, type StudySession, type UserLearningState, type VocabularyProgress } from "./types.ts";

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface Options { now?: () => string; debounceMs?: number; }
const success = <T>(data: T): RepositoryResult<T> => ({ ok: true, data });
const failure = <T>(code: string, message: string): RepositoryResult<T> => ({ ok: false, error: { code, message } });

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeState(input: Record<string, unknown>, fallback: UserLearningState): UserLearningState {
  return {
    ...fallback,
    ...input,
    schemaVersion: LEARNING_SCHEMA_VERSION,
    lessonProgress: isObject(input.lessonProgress) ? input.lessonProgress as UserLearningState["lessonProgress"] : {},
    vocabularyProgress: isObject(input.vocabularyProgress) ? input.vocabularyProgress as UserLearningState["vocabularyProgress"] : {},
    exerciseAttempts: Array.isArray(input.exerciseAttempts) ? input.exerciseAttempts as ExerciseAttempt[] : [],
    mistakes: isObject(input.mistakes) ? input.mistakes as UserLearningState["mistakes"] : {},
    studySessions: Array.isArray(input.studySessions) ? input.studySessions as StudySession[] : [],
    dailyTasks: isObject(input.dailyTasks) ? input.dailyTasks as UserLearningState["dailyTasks"] : {},
    dailyStats: isObject(input.dailyStats) ? input.dailyStats as UserLearningState["dailyStats"] : {},
  };
}

function parseState(serialized: string, now: string): RepositoryResult<UserLearningState> {
  try {
    const raw: unknown = JSON.parse(serialized);
    if (!isObject(raw) || typeof raw.schemaVersion !== "number") return failure("INVALID_BACKUP", "学习数据格式无效。");
    if (raw.schemaVersion > LEARNING_SCHEMA_VERSION) return failure("UNSUPPORTED_SCHEMA", "学习数据来自更新版本，当前应用无法安全读取。");
    return success(normalizeState(raw, createEmptyLearningState("local-browser-user", now)));
  } catch {
    return failure("CORRUPTED_STORAGE", "本地学习数据损坏，已使用安全的空状态启动。");
  }
}

function mergeByNewest<T>(current: Record<string, T>, incoming: Record<string, T>, getTimestamp: (value: T) => string | null): Record<string, T> {
  const merged = { ...current };
  for (const [key, value] of Object.entries(incoming)) {
    const existing = merged[key];
    if (!existing || String(getTimestamp(value) ?? "") >= String(getTimestamp(existing) ?? "")) merged[key] = value;
  }
  return merged;
}

export class LocalLearningRepository implements LearningRepository {
  private readonly storage: StorageAdapter;
  private state: UserLearningState | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private readonly now: () => string;
  private readonly debounceMs: number;

  constructor(storage: StorageAdapter, options: Options = {}) {
    this.storage = storage;
    this.now = options.now ?? (() => new Date().toISOString());
    this.debounceMs = options.debounceMs ?? LOCAL_WRITE_DEBOUNCE_MS;
  }

  private load(): RepositoryResult<UserLearningState> {
    if (this.state) return success(this.state);
    const serialized = this.storage.getItem(LEARNING_STORAGE_KEY);
    if (!serialized) {
      this.state = createEmptyLearningState("local-browser-user", this.now());
      return success(this.state);
    }
    const parsed = parseState(serialized, this.now());
    if (!parsed.ok) {
      if (parsed.error.code === "UNSUPPORTED_SCHEMA") return parsed;
      this.state = createEmptyLearningState("local-browser-user", this.now());
      return { ok: true, data: this.state, warning: parsed.error };
    }
    this.state = parsed.data;
    return parsed;
  }

  private scheduleWrite(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => { void this.flush(); }, this.debounceMs);
  }

  private async mutate<T>(operation: (state: UserLearningState) => T): Promise<RepositoryResult<T>> {
    const loaded = this.load();
    if (!loaded.ok) return loaded as RepositoryResult<T>;
    const result = operation(loaded.data);
    loaded.data.updatedAt = this.now();
    loaded.data.lastActiveAt = loaded.data.updatedAt;
    this.scheduleWrite();
    return success(result);
  }

  async getLearningState() { return this.load(); }
  async saveLearningState(state: UserLearningState) { this.state = normalizeState(structuredClone(state) as unknown as Record<string, unknown>, createEmptyLearningState(state.localUserId, state.createdAt)); this.state.updatedAt = this.now(); this.scheduleWrite(); return success(this.state); }
  async getLessonProgress(lessonId: string) { const result = this.load(); return result.ok ? success(result.data.lessonProgress[lessonId] ?? null) : result; }
  async listLessonProgress() { const result = this.load(); return result.ok ? success(Object.values(result.data.lessonProgress)) : result; }
  async startLesson(lessonId: string) { return this.mutate((state) => state.lessonProgress[lessonId] ??= { lessonId, status: "in_progress", progressPercent: 0, startedAt: this.now(), completedAt: null, lastStudiedAt: this.now(), totalStudySeconds: 0, lastSectionId: null, lastSourceBlockId: null, completionCount: 0 }); }
  async updateLessonPosition(lessonId: string, sectionId: string | null, sourceBlockId: string | null) { await this.startLesson(lessonId); return this.mutate((state) => { const item = state.lessonProgress[lessonId]; item.lastSectionId = sectionId; item.lastSourceBlockId = sourceBlockId; item.lastStudiedAt = this.now(); if (item.status === "not_started") item.status = "in_progress"; return item; }); }
  async completeLesson(lessonId: string) { await this.startLesson(lessonId); return this.mutate((state) => { const item = state.lessonProgress[lessonId]; item.status = "completed"; item.progressPercent = 100; item.completedAt = this.now(); item.lastStudiedAt = this.now(); item.completionCount += 1; return item; }); }
  async updateVocabularyProgress(vocabularyId: string, update: VocabularyProgressUpdate) { return this.mutate((state) => { const existing = state.vocabularyProgress[vocabularyId]; const item: VocabularyProgress = existing ?? { vocabularyId, lessonId: update.lessonId ?? "", isFavorite: false, masteryLevel: 0, reviewCount: 0, correctCount: 0, incorrectCount: 0, lastReviewedAt: null, nextReviewAt: null, intervalDays: 0, easeFactor: DEFAULT_EASE_FACTOR, status: "new" }; Object.assign(item, update, { vocabularyId, lessonId: existing?.lessonId ?? update.lessonId ?? "" }); state.vocabularyProgress[vocabularyId] = item; return item; }); }
  async toggleVocabularyFavorite(vocabularyId: string, lessonId = "") { const loaded = this.load(); if (!loaded.ok) return loaded as RepositoryResult<VocabularyProgress>; const current = loaded.data.vocabularyProgress[vocabularyId]; return this.updateVocabularyProgress(vocabularyId, { lessonId: current?.lessonId ?? lessonId, isFavorite: !(current?.isFavorite ?? false) }); }
  async recordExerciseAttempt(attempt: ExerciseAttempt) { return this.mutate((state) => { if (!state.exerciseAttempts.some((item) => item.id === attempt.id)) state.exerciseAttempts.push(attempt); return attempt; }); }
  async listMistakes(filters?: { status?: MistakeRecord["status"]; dueBefore?: string }) { const loaded = this.load(); if (!loaded.ok) return loaded; return success(Object.values(loaded.data.mistakes).filter((item) => (!filters?.status || item.status === filters.status) && (!filters?.dueBefore || !item.nextReviewAt || item.nextReviewAt <= filters.dueBefore))); }
  async recordStudySession(session: StudySession) { return this.mutate((state) => { const index = state.studySessions.findIndex((item) => item.id === session.id); if (index >= 0) state.studySessions[index] = session; else state.studySessions.push(session); return session; }); }
  async generateDailyTasks(date: string) { return this.listDailyTasks(date); }
  async listDailyTasks(date: string) { const loaded = this.load(); return loaded.ok ? success(Object.values(loaded.data.dailyTasks).filter((task) => task.taskDate === date).sort((a, b) => b.priority - a.priority)) : loaded; }
  async completeDailyTask(taskId: string) { return this.mutate((state) => { const task = state.dailyTasks[taskId]; if (!task) throw new Error(`Unknown task: ${taskId}`); if (task.status !== "completed") { task.status = "completed"; task.completedAt = this.now(); const stats = state.dailyStats[task.taskDate] ??= { date: task.taskDate, studySeconds: 0, lessonsCompleted: 0, vocabularyReviewed: 0, exercisesCompleted: 0, correctExercises: 0, tasksCompleted: 0 }; stats.tasksCompleted += 1; } return task; }); }
  async getDashboardStats(date = this.now().slice(0, 10)) { const loaded = this.load(); if (!loaded.ok) return loaded as RepositoryResult<DashboardStats>; const state = loaded.data; const progress = Object.values(state.lessonProgress); const vocab = Object.values(state.vocabularyProgress); const mistakes = Object.values(state.mistakes); return success({ state, completedLessons: progress.filter((item) => item.status === "completed").length, favoriteVocabulary: vocab.filter((item) => item.isFavorite).length, masteredVocabulary: vocab.filter((item) => item.status === "mastered").length, dueVocabulary: vocab.filter((item) => item.nextReviewAt && item.nextReviewAt.slice(0, 10) <= date).length, dueMistakes: mistakes.filter((item) => item.status !== "mastered" && item.nextReviewAt && item.nextReviewAt.slice(0, 10) <= date).length, streakDays: 0, todayStudySeconds: state.dailyStats[date]?.studySeconds ?? 0, recentLessonId: progress.sort((a, b) => String(b.lastStudiedAt).localeCompare(String(a.lastStudiedAt)))[0]?.lessonId ?? null }); }
  async exportLearningData() { const loaded = this.load(); return loaded.ok ? success(JSON.stringify(loaded.data, null, 2)) : loaded as RepositoryResult<string>; }
  async previewImport(serialized: string): Promise<RepositoryResult<ImportPreview>> { const parsed = parseState(serialized, this.now()); if (!parsed.ok) return parsed; const state = parsed.data; return success({ schemaVersion: state.schemaVersion, lessonsWithProgress: Object.keys(state.lessonProgress).length, vocabularyItems: Object.keys(state.vocabularyProgress).length, exerciseAttempts: state.exerciseAttempts.length, mistakes: Object.keys(state.mistakes).length, studySessions: state.studySessions.length, dailyTasks: Object.keys(state.dailyTasks).length, updatedAt: state.updatedAt }); }
  async importLearningData(serialized: string, mode: ImportMode): Promise<RepositoryResult<UserLearningState>> { const parsed = parseState(serialized, this.now()); if (!parsed.ok) return parsed; let nextState: UserLearningState; if (mode === "replace") nextState = parsed.data; else { const current = this.load(); if (!current.ok) return current; const incoming = parsed.data; nextState = { ...current.data, updatedAt: this.now(), lastActiveAt: this.now(), onboardingCompleted: current.data.onboardingCompleted || incoming.onboardingCompleted, lessonProgress: mergeByNewest(current.data.lessonProgress, incoming.lessonProgress, (item) => item.lastStudiedAt), vocabularyProgress: mergeByNewest(current.data.vocabularyProgress, incoming.vocabularyProgress, (item) => item.lastReviewedAt), mistakes: mergeByNewest(current.data.mistakes, incoming.mistakes, (item) => item.lastWrongAt), exerciseAttempts: [...new Map([...current.data.exerciseAttempts, ...incoming.exerciseAttempts].map((item) => [item.id, item])).values()], studySessions: [...new Map([...current.data.studySessions, ...incoming.studySessions].map((item) => [item.id, item])).values()], dailyTasks: { ...current.data.dailyTasks, ...incoming.dailyTasks }, dailyStats: { ...current.data.dailyStats, ...incoming.dailyStats } }; } this.state = nextState; await this.flush(); return success(nextState); }
  async clearLearningData() { if (this.timer) clearTimeout(this.timer); this.timer = null; this.storage.removeItem(LEARNING_STORAGE_KEY); this.state = createEmptyLearningState("local-browser-user", this.now()); return success(this.state); }
  async flush() { if (this.timer) clearTimeout(this.timer); this.timer = null; if (this.state) this.storage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(this.state)); }
}

export function createBrowserLearningRepository(): LocalLearningRepository {
  if (typeof window === "undefined") throw new Error("Browser learning repository is only available on the client.");
  return new LocalLearningRepository(window.localStorage);
}

import { MISTAKE_MASTERY_CORRECT_STREAK } from "./config.ts";
import { generateTasks } from "./daily-task-generator.ts";
import { getLessonVocabulary, learningCatalog } from "./catalog.ts";
import { getTrialLesson } from "../../content/textbooks/bonjour-francais-1/trial-lessons.ts";
import type { DashboardStats, LearningRepository, RepositoryResult } from "./repository.ts";
import { nextMistakeReview, scheduleVocabulary } from "./review-scheduler.ts";
import { addStudyTime, calculateStreak, ensureDailyStats } from "./study-session-tracker.ts";
import type { ExerciseAttempt, MasteryLevel, UserLearningState, VocabularyProgress } from "./types.ts";

interface ServiceOptions { now?: () => string; id?: () => string; }
export interface LearningDashboard extends DashboardStats { continueAction: { type: "lesson" | "vocabulary_review" | "mistake_review"; entityId: string; sectionId?: string | null; sourceBlockId?: string | null } | null; }

export class LearningService {
  private readonly repository: LearningRepository;
  private readonly now: () => string;
  private readonly id: () => string;
  constructor(repository: LearningRepository, options: ServiceOptions = {}) {
    this.repository = repository;
    this.now = options.now ?? (() => new Date().toISOString());
    this.id = options.id ?? (() => crypto.randomUUID());
  }

  private async state(): Promise<RepositoryResult<UserLearningState>> { return this.repository.getLearningState(); }
  private async commit(state: UserLearningState) { state.updatedAt = this.now(); state.lastActiveAt = this.now(); return this.repository.saveLearningState(state); }

  async startLesson(lessonId: string) { return this.repository.startLesson(lessonId); }
  async updateLessonPosition(lessonId: string, sectionId: string | null, sourceBlockId: string | null, studySeconds = 0) {
    await this.repository.updateLessonPosition(lessonId, sectionId, sourceBlockId);
    const loaded = await this.state(); if (!loaded.ok) return loaded;
    const lesson = getTrialLesson(lessonId); const sectionIndex = lesson?.sections.findIndex((section) => section.id === sectionId) ?? -1;
    if (sectionIndex >= 0 && lesson) loaded.data.lessonProgress[lessonId].progressPercent = Math.max(loaded.data.lessonProgress[lessonId].progressPercent, Math.round(((sectionIndex + 1) / lesson.sections.length) * 90));
    addStudyTime(loaded.data, lessonId, studySeconds, this.now(), `${this.id()}:position`, sectionId);
    return this.commit(loaded.data);
  }

  async completeLesson(lessonId: string, studySeconds = 0) {
    await this.repository.completeLesson(lessonId);
    const loaded = await this.state(); if (!loaded.ok) return loaded;
    const state = loaded.data; const now = this.now(); const date = now.slice(0, 10);
    addStudyTime(state, lessonId, studySeconds, now, `${this.id()}:complete`);
    for (const word of getLessonVocabulary(lessonId)) state.vocabularyProgress[word.id] ??= { vocabularyId: word.id, lessonId, isFavorite: false, masteryLevel: 0, reviewCount: 0, correctCount: 0, incorrectCount: 0, lastReviewedAt: null, nextReviewAt: now, intervalDays: 0, easeFactor: 2.5, status: "new" };
    ensureDailyStats(state, date).lessonsCompleted += 1;
    const lessonTask = state.dailyTasks[`${date}:lesson:${lessonId}`]; if (lessonTask && lessonTask.status !== "completed") { lessonTask.status = "completed"; lessonTask.completedAt = now; ensureDailyStats(state, date).tasksCompleted += 1; }
    generateTasks(state, date, now);
    const next = learningCatalog.lessons.find((lesson) => state.lessonProgress[lesson.id]?.status !== "completed");
    if (next) { const task = { id: `${date}:lesson:${next.id}`, taskDate: date, taskType: "lesson" as const, entityId: next.id, title: `${next.titleFr} ${next.titleZh}`, status: "pending" as const, priority: 100, estimatedMinutes: 20, generatedReason: "完成上一课后安排下一课", completedAt: null }; state.dailyTasks[task.id] ??= task; }
    return this.commit(state);
  }

  async reviewVocabulary(vocabularyId: string, lessonId: string, masteryLevel: MasteryLevel, isCorrect: boolean): Promise<RepositoryResult<VocabularyProgress>> {
    const loaded = await this.state(); if (!loaded.ok) return loaded as RepositoryResult<VocabularyProgress>;
    const state = loaded.data; const existing = state.vocabularyProgress[vocabularyId]; const now = this.now(); const scheduled = scheduleVocabulary(masteryLevel, isCorrect, now);
    const progress: VocabularyProgress = { vocabularyId, lessonId, isFavorite: existing?.isFavorite ?? false, masteryLevel: scheduled.masteryLevel, reviewCount: (existing?.reviewCount ?? 0) + 1, correctCount: (existing?.correctCount ?? 0) + (isCorrect ? 1 : 0), incorrectCount: (existing?.incorrectCount ?? 0) + (isCorrect ? 0 : 1), lastReviewedAt: now, nextReviewAt: scheduled.nextReviewAt, intervalDays: scheduled.intervalDays, easeFactor: existing?.easeFactor ?? 2.5, status: scheduled.status };
    state.vocabularyProgress[vocabularyId] = progress; ensureDailyStats(state, now.slice(0, 10)).vocabularyReviewed += 1;
    const saved = await this.commit(state); return saved.ok ? { ok: true, data: progress } : saved as RepositoryResult<VocabularyProgress>;
  }

  async toggleVocabularyFavorite(vocabularyId: string, lessonId: string) { return this.repository.toggleVocabularyFavorite(vocabularyId, lessonId); }

  async recordExerciseResult(exerciseId: string, lessonId: string, answer: string, isCorrect: boolean, durationSeconds: number) {
    const loaded = await this.state(); if (!loaded.ok) return loaded;
    const state = loaded.data; const now = this.now(); const attempts = state.exerciseAttempts.filter((item) => item.exerciseId === exerciseId).length;
    const attempt: ExerciseAttempt = { id: `${this.id()}:${attempts + 1}`, exerciseId, lessonId, answer, isCorrect, attemptedAt: now, durationSeconds, attemptNumber: attempts + 1 }; state.exerciseAttempts.push(attempt);
    const existing = state.mistakes[exerciseId];
    if (!isCorrect) state.mistakes[exerciseId] = { exerciseId, lessonId, firstWrongAt: existing?.firstWrongAt ?? now, lastWrongAt: now, wrongCount: (existing?.wrongCount ?? 0) + 1, consecutiveCorrectCount: 0, status: "unresolved", nextReviewAt: nextMistakeReview(now), resolvedAt: null };
    else if (existing) { existing.consecutiveCorrectCount += 1; existing.status = existing.consecutiveCorrectCount >= MISTAKE_MASTERY_CORRECT_STREAK ? "mastered" : "reviewing"; existing.resolvedAt = existing.status === "mastered" ? now : null; existing.nextReviewAt = existing.status === "mastered" ? null : nextMistakeReview(now); }
    const stats = ensureDailyStats(state, now.slice(0, 10)); stats.exercisesCompleted += 1; if (isCorrect) stats.correctExercises += 1;
    return this.commit(state);
  }

  async generateDailyTasks(date: string) { const loaded = await this.state(); if (!loaded.ok) return loaded; const tasks = generateTasks(loaded.data, date, this.now()); const saved = await this.commit(loaded.data); return saved.ok ? { ok: true as const, data: tasks } : saved; }

  async getDashboard(date = this.now().slice(0, 10)): Promise<RepositoryResult<LearningDashboard>> {
    await this.generateDailyTasks(date); const base = await this.repository.getDashboardStats(date); if (!base.ok) return base;
    const state = base.data.state; const recent = Object.values(state.lessonProgress).sort((a, b) => String(b.lastStudiedAt).localeCompare(String(a.lastStudiedAt)))[0];
    const pending = Object.values(state.dailyTasks).filter((task) => task.taskDate === date && task.status !== "completed").sort((a, b) => b.priority - a.priority)[0];
    const continueAction = recent && recent.status === "in_progress" ? { type: "lesson" as const, entityId: recent.lessonId, sectionId: recent.lastSectionId, sourceBlockId: recent.lastSourceBlockId } : pending ? { type: pending.taskType, entityId: pending.entityId } : null;
    return { ok: true, data: { ...base.data, streakDays: calculateStreak(state, date), continueAction } };
  }
}

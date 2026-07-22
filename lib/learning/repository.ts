import type {
  DailyTask,
  ExerciseAttempt,
  LessonProgress,
  MistakeRecord,
  StudySession,
  UserLearningState,
  VocabularyProgress,
} from "./types.ts";

export interface RepositoryIssue { code: string; message: string; }
export type RepositoryResult<T> =
  | { ok: true; data: T; warning?: RepositoryIssue }
  | { ok: false; error: RepositoryIssue };

export interface ImportPreview {
  schemaVersion: number;
  lessonsWithProgress: number;
  vocabularyItems: number;
  exerciseAttempts: number;
  mistakes: number;
  studySessions: number;
  dailyTasks: number;
  updatedAt: string;
}

export type ImportMode = "replace" | "merge";
export type VocabularyProgressUpdate = Partial<Omit<VocabularyProgress, "vocabularyId" | "lessonId">> & { lessonId?: string };

export interface DashboardStats {
  state: UserLearningState;
  completedLessons: number;
  favoriteVocabulary: number;
  masteredVocabulary: number;
  dueVocabulary: number;
  dueMistakes: number;
  streakDays: number;
  todayStudySeconds: number;
  recentLessonId: string | null;
}

export interface LearningRepository {
  getLearningState(): Promise<RepositoryResult<UserLearningState>>;
  saveLearningState(state: UserLearningState): Promise<RepositoryResult<UserLearningState>>;
  getLessonProgress(lessonId: string): Promise<RepositoryResult<LessonProgress | null>>;
  listLessonProgress(): Promise<RepositoryResult<LessonProgress[]>>;
  startLesson(lessonId: string): Promise<RepositoryResult<LessonProgress>>;
  updateLessonPosition(lessonId: string, sectionId: string | null, sourceBlockId: string | null): Promise<RepositoryResult<LessonProgress>>;
  completeLesson(lessonId: string): Promise<RepositoryResult<LessonProgress>>;
  updateVocabularyProgress(vocabularyId: string, update: VocabularyProgressUpdate): Promise<RepositoryResult<VocabularyProgress>>;
  toggleVocabularyFavorite(vocabularyId: string, lessonId?: string): Promise<RepositoryResult<VocabularyProgress>>;
  recordExerciseAttempt(attempt: ExerciseAttempt): Promise<RepositoryResult<ExerciseAttempt>>;
  listMistakes(filters?: { status?: MistakeRecord["status"]; dueBefore?: string }): Promise<RepositoryResult<MistakeRecord[]>>;
  recordStudySession(session: StudySession): Promise<RepositoryResult<StudySession>>;
  generateDailyTasks(date: string): Promise<RepositoryResult<DailyTask[]>>;
  listDailyTasks(date: string): Promise<RepositoryResult<DailyTask[]>>;
  completeDailyTask(taskId: string): Promise<RepositoryResult<DailyTask>>;
  getDashboardStats(date?: string): Promise<RepositoryResult<DashboardStats>>;
  exportLearningData(): Promise<RepositoryResult<string>>;
  previewImport(serialized: string): Promise<RepositoryResult<ImportPreview>>;
  importLearningData(serialized: string, mode: ImportMode): Promise<RepositoryResult<UserLearningState>>;
  clearLearningData(): Promise<RepositoryResult<UserLearningState>>;
  flush(): Promise<void>;
}

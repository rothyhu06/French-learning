export const LEARNING_SCHEMA_VERSION = 1 as const;

export type LessonStatus = "not_started" | "in_progress" | "completed";
export type VocabularyStatus = "new" | "learning" | "reviewing" | "mastered";
export type MistakeStatus = "unresolved" | "reviewing" | "mastered";
export type DailyTaskType = "lesson" | "vocabulary_review" | "mistake_review";
export type DailyTaskStatus = "pending" | "in_progress" | "completed" | "skipped";
export type MasteryLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface LessonProgress {
  lessonId: string;
  status: LessonStatus;
  progressPercent: number;
  startedAt: string | null;
  completedAt: string | null;
  lastStudiedAt: string | null;
  totalStudySeconds: number;
  lastSectionId: string | null;
  lastSourceBlockId: string | null;
  completionCount: number;
}

export interface VocabularyProgress {
  vocabularyId: string;
  lessonId: string;
  isFavorite: boolean;
  masteryLevel: MasteryLevel;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  lastReviewedAt: string | null;
  nextReviewAt: string | null;
  intervalDays: number;
  easeFactor: number;
  status: VocabularyStatus;
}

export interface ExerciseAttempt {
  id: string;
  exerciseId: string;
  lessonId: string;
  answer: string;
  isCorrect: boolean;
  attemptedAt: string;
  durationSeconds: number;
  attemptNumber: number;
}

export interface MistakeRecord {
  exerciseId: string;
  lessonId: string;
  firstWrongAt: string;
  lastWrongAt: string;
  wrongCount: number;
  consecutiveCorrectCount: number;
  status: MistakeStatus;
  nextReviewAt: string | null;
  resolvedAt: string | null;
}

export interface StudySession {
  id: string;
  lessonId: string;
  sectionId: string | null;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number;
  activityType: string;
  completed: boolean;
}

export interface DailyTask {
  id: string;
  taskDate: string;
  taskType: DailyTaskType;
  entityId: string;
  title: string;
  status: DailyTaskStatus;
  priority: number;
  estimatedMinutes: number;
  generatedReason: string;
  completedAt: string | null;
}

export interface DailyStats {
  date: string;
  studySeconds: number;
  lessonsCompleted: number;
  vocabularyReviewed: number;
  exercisesCompleted: number;
  correctExercises: number;
  tasksCompleted: number;
}

export interface UserLearningState {
  schemaVersion: typeof LEARNING_SCHEMA_VERSION;
  localUserId: string;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
  onboardingCompleted: boolean;
  lessonProgress: Record<string, LessonProgress>;
  vocabularyProgress: Record<string, VocabularyProgress>;
  exerciseAttempts: ExerciseAttempt[];
  mistakes: Record<string, MistakeRecord>;
  studySessions: StudySession[];
  dailyTasks: Record<string, DailyTask>;
  dailyStats: Record<string, DailyStats>;
}

export function createEmptyLearningState(
  localUserId = "local-browser-user",
  timestamp = new Date().toISOString(),
): UserLearningState {
  return {
    schemaVersion: LEARNING_SCHEMA_VERSION,
    localUserId,
    createdAt: timestamp,
    updatedAt: timestamp,
    lastActiveAt: timestamp,
    onboardingCompleted: false,
    lessonProgress: {},
    vocabularyProgress: {},
    exerciseAttempts: [],
    mistakes: {},
    studySessions: [],
    dailyTasks: {},
    dailyStats: {},
  };
}

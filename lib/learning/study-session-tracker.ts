import type { DailyStats, StudySession, UserLearningState } from "./types.ts";

export function ensureDailyStats(state: UserLearningState, date: string): DailyStats {
  return state.dailyStats[date] ??= { date, studySeconds: 0, lessonsCompleted: 0, vocabularyReviewed: 0, exercisesCompleted: 0, correctExercises: 0, tasksCompleted: 0 };
}

export function addStudyTime(state: UserLearningState, lessonId: string, durationSeconds: number, now: string, id: string, sectionId: string | null = null): StudySession | null {
  if (durationSeconds <= 0) return null;
  const session: StudySession = { id, lessonId, sectionId, startedAt: new Date(new Date(now).getTime() - durationSeconds * 1000).toISOString(), endedAt: now, durationSeconds, activityType: "lesson", completed: true };
  state.studySessions.push(session);
  ensureDailyStats(state, now.slice(0, 10)).studySeconds += durationSeconds;
  const progress = state.lessonProgress[lessonId];
  if (progress) progress.totalStudySeconds += durationSeconds;
  return session;
}

export function calculateStreak(state: UserLearningState, date: string): number {
  let streak = 0;
  const cursor = new Date(`${date}T00:00:00.000Z`);
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if ((state.dailyStats[key]?.studySeconds ?? 0) <= 0) return streak;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
}

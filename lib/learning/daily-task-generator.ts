import { learningCatalog } from "./catalog.ts";
import type { DailyTask, UserLearningState } from "./types.ts";

const taskId = (date: string, type: DailyTask["taskType"], entityId: string) => `${date}:${type}:${entityId}`;

export function generateTasks(state: UserLearningState, date: string, now: string): DailyTask[] {
  const generated: DailyTask[] = [];
  const nextLesson = learningCatalog.lessons.find((lesson) => state.lessonProgress[lesson.id]?.status !== "completed");
  if (nextLesson) generated.push({ id: taskId(date, "lesson", nextLesson.id), taskDate: date, taskType: "lesson", entityId: nextLesson.id, title: `${nextLesson.titleFr} ${nextLesson.titleZh}`, status: "pending", priority: 100, estimatedMinutes: 20, generatedReason: state.lessonProgress[nextLesson.id] ? "继续上次学习" : "按教材顺序学习下一课", completedAt: null });

  const dueVocabulary = Object.values(state.vocabularyProgress).filter((item) => item.nextReviewAt && item.nextReviewAt.slice(0, 10) <= date);
  for (const item of dueVocabulary) generated.push({ id: taskId(date, "vocabulary_review", item.vocabularyId), taskDate: date, taskType: "vocabulary_review", entityId: item.vocabularyId, title: "复习教材词汇", status: "pending", priority: 70, estimatedMinutes: 2, generatedReason: "已到计划复习时间", completedAt: null });

  for (const item of Object.values(state.mistakes).filter((mistake) => mistake.status !== "mastered" && mistake.nextReviewAt && mistake.nextReviewAt.slice(0, 10) <= date)) generated.push({ id: taskId(date, "mistake_review", item.exerciseId), taskDate: date, taskType: "mistake_review", entityId: item.exerciseId, title: "重新练习错题", status: "pending", priority: 90, estimatedMinutes: 5, generatedReason: "错题已到复习时间", completedAt: null });

  for (const task of generated) state.dailyTasks[task.id] ??= task;
  state.updatedAt = now;
  return Object.values(state.dailyTasks).filter((task) => task.taskDate === date).sort((a, b) => b.priority - a.priority);
}

import { MASTERY_REVIEW_INTERVAL_DAYS, MISTAKE_REVIEW_INTERVAL_DAYS } from "./config.ts";
import type { MasteryLevel, VocabularyStatus } from "./types.ts";

export function addDays(timestamp: string, days: number): string {
  const date = new Date(timestamp);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

export function scheduleVocabulary(masteryLevel: MasteryLevel, isCorrect: boolean, now: string) {
  const effectiveLevel: MasteryLevel = isCorrect ? masteryLevel : 1;
  const intervalDays = MASTERY_REVIEW_INTERVAL_DAYS[effectiveLevel];
  const status: VocabularyStatus = effectiveLevel >= 5 ? "mastered" : effectiveLevel >= 3 ? "reviewing" : "learning";
  return { masteryLevel: effectiveLevel, intervalDays, nextReviewAt: addDays(now, intervalDays), status };
}

export function nextMistakeReview(now: string): string {
  return addDays(now, MISTAKE_REVIEW_INTERVAL_DAYS);
}

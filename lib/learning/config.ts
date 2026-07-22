import type { MasteryLevel } from "./types.ts";

export const LEARNING_STORAGE_KEY = "french-learning-os:learning-state:v1";

export const MASTERY_REVIEW_INTERVAL_DAYS: Record<MasteryLevel, number> = {
  0: 0,
  1: 1,
  2: 1,
  3: 3,
  4: 7,
  5: 21,
};

export const MISTAKE_REVIEW_INTERVAL_DAYS = 1;
export const MISTAKE_MASTERY_CORRECT_STREAK = 2;
export const DEFAULT_EASE_FACTOR = 2.5;
export const LOCAL_WRITE_DEBOUNCE_MS = 250;

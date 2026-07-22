import type { LearningRepository } from "./repository.ts";

/**
 * Future cloud adapter contract. It will scope every query by auth.uid() and
 * reuse the same LearningRepository interface as the browser implementation.
 */
export type SupabaseLearningRepository = LearningRepository;

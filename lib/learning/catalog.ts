import { sourceBlocks, trialLessons } from "../../content/textbooks/bonjour-francais-1/trial-lessons.ts";

export interface LearningVocabulary {
  id: string;
  lessonId: string;
  term: string;
  meaningZh: string;
  sourceBlockId: string;
}

export interface LearningExercise {
  id: string;
  lessonId: string;
  title: string;
  sourceBlockId: string;
}

export interface LearningLesson {
  id: string;
  titleFr: string;
  titleZh: string;
  order: number;
  vocabularyIds: string[];
  exerciseIds: string[];
}

function stableToken(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const vocabulary: LearningVocabulary[] = sourceBlocks
  .filter((block) => block.blockType === "vocabulary" && block.lessonId)
  .flatMap((block) =>
    block.originalText.split("；").map((entry, index) => {
      const match = entry.trim().match(/^(\S+)\s+(.+)$/u);
      const term = match?.[1] ?? entry.trim();
      const meaningZh = match?.[2] ?? "";
      return {
        id: `${block.lessonId}:vocabulary:${stableToken(term) || index + 1}`,
        lessonId: block.lessonId!,
        term,
        meaningZh,
        sourceBlockId: block.id,
      };
    }),
  );

const exercises: LearningExercise[] = sourceBlocks
  .filter((block) => block.blockType === "exercises" && block.lessonId)
  .map((block) => ({
    id: block.id,
    lessonId: block.lessonId!,
    title: block.originalText,
    sourceBlockId: block.id,
  }));

const lessons: LearningLesson[] = trialLessons.map((lesson) => ({
  id: lesson.id,
  titleFr: lesson.titleFr,
  titleZh: lesson.titleZh,
  order: lesson.number,
  vocabularyIds: vocabulary.filter((item) => item.lessonId === lesson.id).map((item) => item.id),
  exerciseIds: exercises.filter((item) => item.lessonId === lesson.id).map((item) => item.id),
}));

export const learningCatalog = { lessons, vocabulary, exercises } as const;

export function getLessonVocabulary(lessonId: string): LearningVocabulary[] {
  return vocabulary.filter((item) => item.lessonId === lessonId);
}

export function getLessonExercises(lessonId: string): LearningExercise[] {
  return exercises.filter((item) => item.lessonId === lessonId);
}

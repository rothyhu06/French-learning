import { sourceBlocks, trialLessons } from "../../content/textbooks/bonjour-francais-1/trial-lessons.ts";

export interface LearningVocabulary {
  id: string;
  lessonId: string;
  term: string;
  meaningZh: string;
  sourceBlockId: string;
  partOfSpeech: "nom" | "verbe" | "adjectif" | "adverbe" | "pronom" | "préposition" | "article" | "interjection" | "locution" | null;
  gender: "masculine" | "feminine" | "variable" | null;
  plural: string | null;
  printedPageNumber: number | null;
}

export interface LearningExercise {
  id: string;
  lessonId: string;
  title: string;
  sourceBlockId: string;
  exerciseType: "closed" | "audio" | "image" | "open" | "manual";
  evaluationMode: "automatic" | "manual";
  acceptedAnswers: string[];
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
      const rawMeaning = match?.[2] ?? "";
      const morphology = rawMeaning.match(/^((?:n\.[mf]\.|n\.|v\.[it]\.(?:,\s*v\.t\.dir\.)?|adv\.|adj\.|prép\.|pron\.[a-z.]+|art\.[a-zé.]+|interj\.|loc\.adv\.))\s+(.+)$/u);
      const label = morphology?.[1] ?? "";
      const meaningZh = morphology?.[2] ?? rawMeaning;
      const partOfSpeech: LearningVocabulary["partOfSpeech"] = label.startsWith("n.") ? "nom" : label.startsWith("v.") ? "verbe" : label === "adj." ? "adjectif" : label === "adv." ? "adverbe" : label.startsWith("pron.") ? "pronom" : label === "prép." ? "préposition" : label.startsWith("art.") ? "article" : label === "interj." ? "interjection" : label === "loc.adv." ? "locution" : null;
      const gender: LearningVocabulary["gender"] = /\(e\)|\(ère\)/u.test(term) || label === "n." ? "variable" : label === "n.m." ? "masculine" : label === "n.f." ? "feminine" : null;
      return {
        id: `${block.lessonId}:vocabulary:${stableToken(term) || index + 1}`,
        lessonId: block.lessonId!,
        term,
        meaningZh,
        sourceBlockId: block.id,
        partOfSpeech,
        gender,
        plural: null,
        printedPageNumber: block.printedPageNumber,
      };
    }),
  );

const exerciseMetadata: Record<string, Pick<LearningExercise, "exerciseType" | "evaluationMode" | "acceptedAnswers">> = {
  "l3-exercise-presentations": { exerciseType: "closed", evaluationMode: "automatic", acceptedAnswers: ["c,d,a,b"] },
  "l3-exercise-paroles": { exerciseType: "closed", evaluationMode: "automatic", acceptedAnswers: ["un,une,une,un,une,une"] },
  "l3-audio-bingo": { exerciseType: "image", evaluationMode: "manual", acceptedAnswers: [] },
  "l3-audio-hotel": { exerciseType: "audio", evaluationMode: "manual", acceptedAnswers: [] },
  "l4-correspondent-exercise": { exerciseType: "manual", evaluationMode: "manual", acceptedAnswers: [] },
  "l4-writing-email": { exerciseType: "open", evaluationMode: "manual", acceptedAnswers: [] },
};

const exerciseBlockIds = new Set([...sourceBlocks.filter((block) => block.blockType === "exercises").map((block) => block.id), ...Object.keys(exerciseMetadata)]);
const exercises: LearningExercise[] = sourceBlocks
  .filter((block) => exerciseBlockIds.has(block.id) && block.lessonId)
  .map((block) => ({
    id: block.id,
    lessonId: block.lessonId!,
    title: block.originalText,
    sourceBlockId: block.id,
    ...(exerciseMetadata[block.id] ?? { exerciseType: "manual" as const, evaluationMode: "manual" as const, acceptedAnswers: [] }),
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

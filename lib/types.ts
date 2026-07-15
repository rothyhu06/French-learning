export type LessonStatus = "completed" | "current" | "locked";
export type ContentKind = "dialogue" | "vocabulary" | "grammar" | "examples" | "listening" | "exercises" | "culture";

export interface LessonSection {
  id: string;
  kind: ContentKind;
  title: string;
  summary: string;
  duration: number;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  objectives: string[];
  status: LessonStatus;
  progress: number;
  duration: number;
  sections: LessonSection[];
  source: { book: string; pages: string };
}

export interface Chapter {
  id: string;
  level: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface VocabularyItem {
  id: string;
  french: string;
  chinese: string;
  partOfSpeech: string;
  gender?: "m." | "f.";
  plural?: string;
  ipa?: string;
  lessonId: string;
  source: string;
  example: string;
  exampleChinese: string;
  favorite: boolean;
  mastery: 0 | 1 | 2 | 3 | 4 | 5;
  lastReviewed?: string;
  nextReview?: string;
}

export interface Mistake {
  id: string;
  prompt: string;
  answer: string;
  userAnswer: string;
  lessonId: string;
  category: string;
  errorCount: number;
  lastError: string;
  remastered: boolean;
}

"use client";

import { useLearningStore } from "@/lib/learning/store";

export function LessonPositionButton({ lessonId, sectionId, sourceBlockId }: { lessonId: string; sectionId: string; sourceBlockId: string }) {
  const { loading, updateLessonPosition } = useLearningStore();
  return <button className="position-button" disabled={loading} onClick={() => void updateLessonPosition(lessonId, sectionId, sourceBlockId)}>记为当前学习位置</button>;
}

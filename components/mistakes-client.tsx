"use client";

import Link from "next/link";
import { learningCatalog } from "@/lib/learning/catalog";
import { useLearningStore } from "@/lib/learning/store";

export function MistakesClient() {
  const { hydrated, loading, state, recordExerciseResult } = useLearningStore();
  if (!hydrated || !state) return <div className="learning-loading">正在读取错题记录…</div>;
  const mistakes = Object.values(state.mistakes);
  return <><div className="local-data-notice"><strong>掌握规则</strong><span>答错后进入错题本；重新练习连续答对 2 次后标记为已掌握。</span></div>{mistakes.length === 0 && <div className="search-empty"><strong>尚无错题</strong><p>可以先对已核对的教材练习进行自评，不会由系统虚构标准答案。</p></div>}<div className="mistake-list">{mistakes.map((mistake) => { const exercise = learningCatalog.exercises.find((item) => item.id === mistake.exerciseId); return <article className="content-card" key={mistake.exerciseId}><small>{mistake.lessonId.toUpperCase()} · {mistake.status === "mastered" ? "已掌握" : "待复习"}</small><h2>{exercise?.title ?? mistake.exerciseId}</h2><p>错误 {mistake.wrongCount} 次 · 连续答对 {mistake.consecutiveCorrectCount}/2 · {mistake.nextReviewAt ? `下次复习 ${mistake.nextReviewAt.slice(0,10)}` : "已解决"}</p><div className="review-actions"><button disabled={loading} onClick={() => void recordExerciseResult(mistake.exerciseId, mistake.lessonId, "self-assessed-wrong", false)}>答错</button><button disabled={loading} onClick={() => void recordExerciseResult(mistake.exerciseId, mistake.lessonId, "self-assessed-correct", true)}>答对</button><Link href={`/courses/${mistake.lessonId}?sourceBlockId=${mistake.exerciseId}`}>重新练习</Link></div></article>; })}</div><section className="practice-section"><h2>教材练习自评</h2><p>完成教材原题后，按实际结果记录；当前不生成或猜测教材答案。</p><div className="mistake-list">{learningCatalog.exercises.map((exercise) => <article className="content-card" key={exercise.id}><small>{exercise.lessonId.toUpperCase()}</small><p>{exercise.title}</p><div className="review-actions"><button disabled={loading} onClick={() => void recordExerciseResult(exercise.id, exercise.lessonId, "self-assessed-wrong", false)}>答错，加入错题本</button><button disabled={loading} onClick={() => void recordExerciseResult(exercise.id, exercise.lessonId, "self-assessed-correct", true)}>答对</button></div></article>)}</div></section></>;
}

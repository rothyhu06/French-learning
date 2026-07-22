"use client";

import Link from "next/link";
import { useRef } from "react";
import { useLearningStore } from "@/lib/learning/store";

const formatTime = (seconds: number) => `${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒`;
const formatDate = (value: string | null) => value ? new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "尚未学习";

export function LessonLearningControls({ lessonId }: { lessonId: string }) {
  const { hydrated, loading, state, startLesson, completeLesson } = useLearningStore();
  const sessionStartedAt = useRef<number | null>(null);
  if (!hydrated || !state) return <section className="lesson-learning-panel learning-loading">正在读取课程进度…</section>;
  const progress = state.lessonProgress[lessonId];
  const begin = async () => { sessionStartedAt.current = Date.now(); await startLesson(lessonId); };
  const finish = async () => {
    if (!window.confirm("确认已完成本课？系统将安排词汇复习和下一项任务。")) return;
    const seconds = sessionStartedAt.current ? Math.max(1, Math.round((Date.now() - sessionStartedAt.current) / 1000)) : 0;
    await completeLesson(lessonId, seconds);
    sessionStartedAt.current = null;
  };
  const resumeHref = progress?.lastSourceBlockId ? `/courses/${lessonId}?sourceBlockId=${progress.lastSourceBlockId}` : `/courses/${lessonId}`;
  return <section className="lesson-learning-panel">
    <div><span className={`learning-status ${progress?.status ?? "not_started"}`}>{progress?.status === "completed" ? "已完成" : progress?.status === "in_progress" ? "学习中" : "未开始"}</span><strong>当前学习进度 {progress?.progressPercent ?? 0}%</strong><small>本课学习时长：{formatTime(progress?.totalStudySeconds ?? 0)} · 最近学习时间：{formatDate(progress?.lastStudiedAt ?? null)}</small></div>
    <div className="lesson-control-actions">{progress?.lastSourceBlockId && <Link href={resumeHref} className="secondary-button">返回上次位置</Link>}<button className="secondary-button" disabled={loading} onClick={() => void begin()}>{progress ? "继续学习" : "开始学习"}</button><button className="primary-button" disabled={loading} onClick={() => void finish()}>标记完成</button></div>
  </section>;
}

"use client";

import { learningCatalog } from "@/lib/learning/catalog";
import { useLearningStore } from "@/lib/learning/store";
import { DataBackupPanel } from "./data-backup-panel";

export function ProgressClient() {
  const { hydrated, dashboard, state } = useLearningStore();
  if (!hydrated || !dashboard || !state) return <div className="learning-loading">正在汇总学习进度…</div>;
  const completion = Math.round((dashboard.completedLessons / learningCatalog.lessons.length) * 100);
  return <><div className="local-data-notice"><strong>本地学习档案</strong><span>刷新和重新打开浏览器后仍会保留；目前不支持跨设备同步。</span></div><section className="progress-hero"><div><span>《你好！法语 1》试导入课程</span><h2>{completion}% 已完成</h2><p>{dashboard.completedLessons} / {learningCatalog.lessons.length} 个 Lesson · 连续学习 {dashboard.streakDays} 天</p><div className="wide-progress"><i style={{width:`${completion}%`}}/></div></div></section><section className="metrics-grid"><article><div><small>累计学习</small><strong>{Math.round(state.studySessions.reduce((sum, item) => sum + item.durationSeconds, 0) / 60)}<em>分钟</em></strong></div></article><article><div><small>已掌握词汇</small><strong>{dashboard.masteredVocabulary}<em>个</em></strong></div></article><article><div><small>练习次数</small><strong>{state.exerciseAttempts.length}<em>次</em></strong></div></article><article><div><small>已解决错题</small><strong>{Object.values(state.mistakes).filter((item) => item.status === "mastered").length}<em>题</em></strong></div></article></section><DataBackupPanel/></>;
}

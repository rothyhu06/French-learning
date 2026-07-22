"use client";

import Link from "next/link";
import { learningCatalog } from "@/lib/learning/catalog";
import { useLearningStore } from "@/lib/learning/store";

const minutes = (seconds: number) => Math.max(0, Math.round(seconds / 60));

export function DashboardClient() {
  const { hydrated, loading, dashboard, state, completeTask } = useLearningStore();
  if (!hydrated) return <div className="learning-loading" role="status">正在读取本浏览器的学习记录…</div>;
  if (!dashboard || !state) return <div className="learning-loading">学习数据暂时无法读取，请刷新重试。</div>;
  const action = dashboard.continueAction;
  const continueHref = action?.type === "lesson" ? `/courses/${action.entityId}?${new URLSearchParams({ ...(action.sectionId ? { sectionId: action.sectionId } : {}), ...(action.sourceBlockId ? { sourceBlockId: action.sourceBlockId } : {}) })}` : action?.type === "vocabulary_review" ? "/vocabulary?filter=due" : "/mistakes";
  const tasks = Object.values(state.dailyTasks).filter((task) => task.taskDate === new Date().toISOString().slice(0, 10)).sort((a, b) => b.priority - a.priority);
  const recent = learningCatalog.lessons.find((lesson) => lesson.id === dashboard.recentLessonId);
  return <div className="page dashboard learning-dashboard">
    <div className="local-data-notice"><strong>浏览器本地模式</strong><span>当前数据仅保存在本浏览器，暂不支持跨设备同步。可在“学习进度”中导出备份。</span></div>
    <section className="welcome"><div><p className="eyebrow">TODAY · LEARNING LOOP</p><h1>Bonjour</h1><p>{recent ? `最近学习：${recent.titleFr} ${recent.titleZh}` : "从真实教材 Leçon 1 开始今天的学习。"}</p></div></section>
    <section className="hero-card"><div className="hero-copy"><span className="pill blue">继续学习</span><h2>{action ? (recent?.titleFr ?? "今日复习") : "今日任务已完成"}</h2><p>{action?.sectionId ? `返回上次位置：${action.sectionId}` : "系统会根据课程进度、词汇和错题自动安排。"}</p>{action ? <Link href={continueHref} className="primary-button">继续学习 →</Link> : <Link href="/courses" className="primary-button">浏览教材课程 →</Link>}</div><div className="hero-visual"><span>今日进度</span><strong>{tasks.filter((task) => task.status === "completed").length}/{tasks.length}</strong><small>项任务完成</small></div></section>
    <section className="metrics-grid learning-metrics">
      <article><div><small>连续学习</small><strong>{dashboard.streakDays}<em>天</em></strong><span>保持教材学习节奏</span></div></article>
      <article><div><small>今日学习时长</small><strong>{minutes(dashboard.todayStudySeconds)}<em>分钟</em></strong><span>自动累计课程活动</span></div></article>
      <article><div><small>待复习词汇</small><strong>{dashboard.dueVocabulary}<em>个</em></strong><span>按掌握度安排</span></div></article>
      <article><div><small>待复习错题</small><strong>{dashboard.dueMistakes}<em>题</em></strong><span>连续答对 2 次掌握</span></div></article>
    </section>
    <div className="dashboard-columns"><section><div className="section-heading"><div><p className="eyebrow">TODAY</p><h2>今日任务</h2></div></div><div className="task-list">{tasks.length ? tasks.map((task) => <div key={task.id}><span>{task.title}<small>{task.generatedReason} · 约 {task.estimatedMinutes} 分钟</small></span>{task.status === "completed" ? <b className="done-label">已完成</b> : <button disabled={loading} onClick={() => void completeTask(task.id)}>完成</button>}</div>) : <div><span>今日没有待办任务</span></div>}</div></section><aside><div className="section-heading"><div><p className="eyebrow">OVERVIEW</p><h2>学习统计</h2></div></div><div className="review-card stats-list"><p>当前教材完成进度：{dashboard.completedLessons} / {learningCatalog.lessons.length} 课</p><p>已收藏词汇：{dashboard.favoriteVocabulary}</p><p>已掌握词汇：{dashboard.masteredVocabulary}</p><Link href="/progress" className="secondary-button">查看学习进度</Link></div></aside></div>
  </div>;
}

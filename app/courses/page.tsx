import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Icon } from "@/components/icons";
import { chapters } from "@/lib/mock-data";

export default function CoursesPage() { return <AppShell active="/courses"><div className="page">
  <div className="page-title"><div><p className="eyebrow">TEXTBOOK</p><h1>教材课程</h1><p>课程结构严格对应教材章节，学习记录会自动同步。</p></div><div className="source-badge"><span>主教材</span><strong>《你好！法语 1》</strong><small>239 页 · 已同步</small></div></div>
  <div className="course-overview"><div><span>A1</span><div><h2>初级法语</h2><p>当前阶段 · 2 / 12 Lessons 完成</p></div></div><div className="wide-progress"><i style={{width:"18%"}}/></div><strong>18%</strong></div>
  <div className="chapters">{chapters.map((chapter, ci)=><section key={chapter.id} className="chapter-card"><header><div className="chapter-number">{String(ci+1).padStart(2,"0")}</div><div><span>{chapter.level} · CHAPITRE {ci+1}</span><h2>{chapter.title}</h2><p>{chapter.description}</p></div><button aria-label="展开章节">⌃</button></header><div className="lesson-list">{chapter.lessons.map(lesson=><Link key={lesson.id} href={`/courses/${lesson.id}`} className={`lesson-row ${lesson.status}`}><span className="lesson-status"><Icon name={lesson.status === "completed" ? "check" : lesson.status === "current" ? "play" : ""}/></span><div><small>LEÇON {lesson.number}</small><strong>{lesson.title}</strong><span>{lesson.subtitle}</span></div><div className="lesson-sections"><span>正文</span><span>词汇</span><span>语法</span><span>练习</span></div><div className="lesson-tail">{lesson.status === "completed" ? <span className="complete-text">已完成</span> : lesson.status === "current" ? <><span>{lesson.progress}%</span><div className="row-progress"><i style={{width:`${lesson.progress}%`}}/></div></> : <span>未开始</span>}<Icon name="chevron"/></div></Link>)}</div></section>)}</div>
</div></AppShell> }

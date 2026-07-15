import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Icon } from "@/components/icons";
import { chapters } from "@/lib/mock-data";

const labels: Record<string,string> = { dialogue:"教材正文", vocabulary:"新单词", grammar:"语法", examples:"重点表达", listening:"听力", exercises:"练习", culture:"文化补充" };
export default async function LessonPage({params}:{params:Promise<{lessonId:string}>}) { const {lessonId}=await params; const lesson=chapters.flatMap(c=>c.lessons).find(l=>l.id===lessonId); if(!lesson) notFound(); return <AppShell active="/courses"><div className="page lesson-page">
  <div className="breadcrumbs"><Link href="/courses">教材课程</Link><span>›</span><span>Lesson {lesson.number}</span></div>
  <section className="lesson-header"><div><p className="eyebrow">A1 · LEÇON {lesson.number}</p><h1>{lesson.title}</h1><h2>{lesson.subtitle}</h2><p>{lesson.source.book} · {lesson.source.pages}</p></div><div className="lesson-completion"><strong>{lesson.progress}%</strong><span>本课进度</span><div className="wide-progress"><i style={{width:`${lesson.progress}%`}}/></div></div></section>
  <div className="lesson-layout"><aside className="lesson-nav"><span>本课内容</span>{lesson.sections.map((s,i)=><a key={s.id} href={`#${s.id}`} className={i===0?"active":""}><i>{String(i+1).padStart(2,"0")}</i>{labels[s.kind]}<small>{s.duration}m</small></a>)}</aside>
  <div className="lesson-content"><section className="objective-card"><div className="metric-icon blue"><Icon name="target"/></div><div><span>学习目标</span><h3>完成本课后，你将能够：</h3><ul>{lesson.objectives.map(o=><li key={o}><Icon name="check"/>{o}</li>)}</ul></div></section>
  <section id={lesson.sections[0].id} className="content-card dialogue"><header><div><span className="section-number">01</span><div><small>MANUEL</small><h2>教材正文</h2></div></div><button><Icon name="sound"/> 播放音频</button></header><div className="dialogue-lines"><div><b>Camille</b><p>Bonjour ! Je m’appelle Camille. Et vous ?</p><span>你好！我叫卡米耶。您呢？</span></div><div><b>Wang Li</b><p>Bonjour, je m’appelle Wang Li. Je suis chinoise.</p><span>你好，我叫王丽。我是中国人。</span></div><div><b>Camille</b><p>Enchantée ! Vous êtes étudiante ?</p><span>很高兴认识你！你是大学生吗？</span></div><div><b>Wang Li</b><p>Oui, je suis étudiante à Paris.</p><span>是的，我是巴黎的一名大学生。</span></div></div><div className="source-note">教材内容示例 · 正式内容将在教材解析与校对后同步</div></section>
  {lesson.sections.slice(1).map((s,i)=><section id={s.id} key={s.id} className="content-card section-preview"><span className="section-number">{String(i+2).padStart(2,"0")}</span><div><small>{s.kind.toUpperCase()}</small><h2>{s.title}</h2><p>{s.summary}</p></div><span>{s.duration} 分钟</span><Icon name="chevron"/></section>)}
  <button className="complete-lesson"><Icon name="check"/> 完成本课</button></div></div>
</div></AppShell> }

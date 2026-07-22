import { AppShell } from "@/components/app-shell";
import { ProgressClient } from "@/components/progress-client";
export default function ProgressPage(){return <AppShell active="/progress"><div className="page"><div className="page-title"><div><p className="eyebrow">PROGRESS</p><h1>学习进度</h1><p>课程、词汇、练习与每日统计的浏览器本地档案。</p></div></div><ProgressClient/></div></AppShell>}

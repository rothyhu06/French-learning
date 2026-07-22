import { AppShell } from "@/components/app-shell";
import { VocabularyClient } from "@/components/vocabulary-client";
export default function VocabularyPage(){return <AppShell active="/vocabulary"><div className="page"><div className="page-title"><div><p className="eyebrow">VERIFIED VOCABULARY</p><h1>教材词汇</h1><p>Leçon 1–2 已核对词汇；学习状态与教材内容分开保存。</p></div></div><VocabularyClient/></div></AppShell>}

import { AppShell } from "@/components/app-shell";
import { MistakesClient } from "@/components/mistakes-client";
export default function MistakesPage(){return <AppShell active="/mistakes"><div className="page"><div className="page-title"><div><p className="eyebrow">MISTAKES</p><h1>错题本</h1><p>记录教材练习中的错误，并安排重新练习。</p></div></div><MistakesClient/></div></AppShell>}

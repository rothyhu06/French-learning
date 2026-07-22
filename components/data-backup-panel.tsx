"use client";

import { useRef, useState } from "react";
import { useLearningStore } from "@/lib/learning/store";
import type { ImportPreview } from "@/lib/learning/repository";

export function DataBackupPanel() {
  const { exportData, previewImport, importData, clearData } = useLearningStore();
  const input = useRef<HTMLInputElement>(null); const [serialized, setSerialized] = useState(""); const [preview, setPreview] = useState<ImportPreview | null>(null);
  const download = async () => { const data = await exportData(); if (!data) return; const url = URL.createObjectURL(new Blob([data], { type: "application/json" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `french-learning-backup-${new Date().toISOString().slice(0,10)}.json`; anchor.click(); URL.revokeObjectURL(url); };
  const pick = async (file?: File) => { if (!file) return; const text = await file.text(); setSerialized(text); setPreview(await previewImport(text)); };
  const clear = async () => { if (window.confirm("确定清空本地学习数据吗？此操作无法撤销，建议先导出备份。") && window.confirm("再次确认：清空所有课程进度、收藏、错题和统计？")) await clearData(); };
  return <section className="backup-panel content-card"><div><p className="eyebrow">LOCAL BACKUP</p><h2>学习数据备份</h2><p>当前数据仅保存在本浏览器。导出 JSON 可用于手动迁移；导入前会校验 schemaVersion。</p></div><div className="backup-actions"><button className="secondary-button" onClick={() => void download()}>导出 JSON</button><button className="secondary-button" onClick={() => input.current?.click()}>导入 JSON</button><input ref={input} hidden type="file" accept="application/json,.json" onChange={(event) => void pick(event.target.files?.[0])}/><button className="danger-button" onClick={() => void clear()}>清空本地学习数据</button></div>{preview && <div className="import-preview"><strong>数据摘要</strong><p>schema v{preview.schemaVersion} · {preview.lessonsWithProgress} 课 · {preview.vocabularyItems} 个词汇 · {preview.mistakes} 道错题 · {preview.studySessions} 次学习</p><div><button onClick={() => void importData(serialized, "merge")}>合并</button><button onClick={() => window.confirm("覆盖将替换当前所有学习记录，确认继续？") && void importData(serialized, "replace")}>覆盖</button></div></div>}</section>;
}

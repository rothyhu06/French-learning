import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (name) => readFile(new URL(`../components/${name}`, import.meta.url), "utf8");

test("vocabulary and mistake clients expose review actions", async () => {
  const vocabulary = await read("vocabulary-client.tsx");
  const mistakes = await read("mistakes-client.tsx");
  for (const label of ["收藏", "掌握度", "认识", "不认识"]) assert.match(vocabulary, new RegExp(label));
  for (const label of ["重新练习", "答对", "答错", "连续答对 2 次"]) assert.match(mistakes, new RegExp(label));
  assert.doesNotMatch(vocabulary + mistakes, /localStorage/);
});

test("backup panel previews imports and confirms destructive actions", async () => {
  const source = await read("data-backup-panel.tsx");
  for (const label of ["导出 JSON", "导入 JSON", "数据摘要", "覆盖", "合并", "清空本地学习数据", "当前数据仅保存在本浏览器"]) assert.match(source, new RegExp(label));
  assert.match(source, /confirm/);
  assert.doesNotMatch(source, /localStorage/);
});

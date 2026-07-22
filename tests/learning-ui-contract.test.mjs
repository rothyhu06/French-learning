import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("dashboard exposes the complete browser-local learning loop", async () => {
  const source = await read("../components/dashboard-client.tsx");
  for (const label of ["继续学习", "今日任务", "待复习词汇", "待复习错题", "连续学习", "今日学习时长", "已收藏词汇", "已掌握词汇"]) assert.match(source, new RegExp(label));
  assert.match(source, /数据仅保存在本浏览器/);
  assert.doesNotMatch(source, /localStorage/);
});

test("lesson controls include resume, completion confirmation and progress", async () => {
  const source = await read("../components/lesson-learning-controls.tsx");
  for (const label of ["开始学习", "继续学习", "标记完成", "返回上次位置", "本课学习时长", "最近学习时间"]) assert.match(source, new RegExp(label));
  assert.match(source, /confirm/);
  assert.doesNotMatch(source, /localStorage/);
});

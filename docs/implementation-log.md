# 教材真实内容实施记录

## 2026-07-20 - 取证与范围确认

- 确认教材文件存在：扫描版 PDF，239 个 PDF 页面，未加密，约 544 MB。
- 前 35 页无可提取文字层，因此不采用 PDF 文本直接导入。
- 视觉确认教材层级为 Unité、Leçon、Savoir-faire、Évaluation、Annexes。
- 视觉确认前部存在重复编排页，需独立页码映射，不能按固定偏移推算。
- 本阶段限定目录、Unité 0、Unité 1、Leçon 1、Leçon 2。

## 2026-07-20 - 页码映射与目录核对

- 建立 `textbook_pages` 对应的本地页码数据：PDF 索引 0–34，共 35 页。
- 核对出开篇 0–11 索引为三组重复编排页；保留 12 条记录，其中 8 条标记为重复并指向首次出现记录。
- 在本阶段连续教材页中确认映射公式：教材印刷页 5–27 对应 PDF 索引 12–34。
- 将真实目录固化为 TypeScript：21 个导航节点、49 个 Leçon/Savoir-faire 学习节点。

## 2026-07-20 - 数据建模与试导入

- 新增非破坏性迁移：`textbook_pages`、`source_blocks`、`content_source_links`、`textbook_search_index`。
- `chapters` 仅承载 Unité、Évaluation、Annexes 等导航节点；`lessons` 承载 Leçon 与 Savoir-faire，避免重复维护。
- Leçon 1、Leçon 2 按页面板块拆分，共形成 99 个 verified 内容块（含完整目录索引块）。
- 生成 469 行幂等 SQL 试导入文件；因当前只有 publishable key，迁移与种子尚未写入远端数据库，需在 Supabase SQL Editor 执行。

## 2026-07-20 - 教材模式与有限搜索

- 教材模式只覆盖 Leçon 1–2 的 8 个已批准页面；页面预渲染到 Git 忽略的 `.private` 缓存，由受控 API 返回。
- 全局搜索默认只查询 verified 内容，支持大小写、法语重音兼容、混合中法文本和教材印刷页码查询。
- 学习模式与教材模式使用 URL 中的 `lessonId`、`sectionId`、`sourceBlockId`、`pdfPageIndex` 保持刷新后定位。
- 当前 99 个内容块尚无可靠 `source_bbox`，因此教材模式仅定位到页面，不伪造矩形高亮。

## 2026-07-20 - 验证

- 单元测试：9/9 通过。
- TypeScript 严格检查、ESLint、生产构建通过。
- 浏览器验证：教材 JPEG 受控接口返回 200；页码搜索跳转到 Leçon 2 / PDF 索引 31；390×844 视口无横向溢出。

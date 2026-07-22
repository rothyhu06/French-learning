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

## 2026-07-22 - 浏览器本地学习闭环 MVP

- 新增 `UserLearningState` v1 及 Lesson、词汇、练习、错题、学习会话、每日任务和每日统计模型。
- 新增存储无关的 `LearningRepository`，当前由 `LocalLearningRepository` 实现；只有 Repository 工厂访问浏览器存储。
- 存储键为 `french-learning-os:learning-state:v1`，包含 schemaVersion、容错解析、版本拒绝、合并/覆盖导入与清空能力。
- 新增 `LearningService`、`ReviewScheduler`、`DailyTaskGenerator`、`StudySessionTracker`，统一编排 Lesson 完成后的进度、时长、词汇队列、任务与统计更新。
- Dashboard 改为 hydration-safe 的真实学习数据面板；Lesson 增加开始、继续、完成、时长、最近学习和返回上次内容块。
- 单词页面支持搜索、筛选、收藏、掌握度和复习；错题页面支持教材练习自评和连续两次答对掌握规则。
- 学习进度页面新增 JSON 导出、导入摘要、合并、覆盖和二次确认清空。
- 当前学习数据与教材正文、PDF 页面、搜索索引完全分离；Supabase 适配器保留相同接口，下一阶段按 `auth.uid()` 实现。
- 自动验证：30/30 测试通过，TypeScript、ESLint 和 Next.js 生产构建通过。
- 当前会话的浏览器安全策略阻止 localhost 自动交互，因此本轮没有重复执行浏览器端 390×844 视觉验收；响应式规则已实现，部署后仍需进行一次真机/浏览器复核。

### 未来 Supabase 迁移约定

首次登录时分别读取本地与云端状态，并向用户提供“本地覆盖云端”“云端覆盖本地”“合并”三种选择。合并规则复用 Repository 的稳定实体 ID 与时间戳；云端成功写入后仍保留本地缓存。所有远端表必须以 `auth.uid()` 隔离，不创建共享固定用户，也不绕过 `auth.users` 外键。

## 2026-07-22 - Leçon 3–4 教材内容扩展

- 对 PDF 索引 35–42（PDF 页码 36–43、教材印刷页 28–35）进行 8 页小范围视觉核对；未执行整书 OCR。
- 确认 Leçon 3 `Ça va bien ? / 你好吗？` 与 Leçon 4 `Correspondants / 寻找笔友` 均属于 Unité 1 `Rencontres`，页面无重复、错位或固定偏移异常。
- Leçon 3：9 个 Section、20 个 verified 块、32 条词汇、4 个语法块、3 个对话块、4 个结构化练习。
- Leçon 4：8 个 Section、16 个 verified 块、1 个 pending_review 块、34 条词汇、6 个课文材料块、2 个结构化练习。
- 新增内容类型：`text`、`image_based_exercise`、`answerable_question`、`page_instruction`、`audio_reference`、`writing`；通过非破坏性枚举迁移复用现有 `lesson_sections`。
- 词汇目录开始保留词性、阴阳性、复数占位和教材页码；练习明确区分 automatic / manual 与 closed / audio / image / open。
- Leçon 3 的两项封闭题可在线提交；听力、图片、配对和开放写作题不伪造答案，只能手动完成。
- 教材搜索扩展到 Leçon 1–4，新增 36 个正式 verified 检索块；Leçon 4 第 35 页长篇文化内容仅保留定位与摘要，状态为 pending_review，不进入正式搜索。
- 私有教材页缓存范围从 8 页扩展到 16 页；Leçon 3–4 页面与索引 35、42 的受控接口均返回 200。
- 学习目录由 `learningCatalog.lessons` 动态排序；测试确认 Lesson 2 → 3 → 4，不在服务中写死 ID。
- 自动验证：42 项测试通过，TypeScript、ESLint 和生产构建通过。

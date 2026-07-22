# 🇫🇷 French Learning OS

> A textbook-grounded French learning system for structured, long-term study.
> 一套围绕真实教材构建、适合长期使用的法语学习系统。

[🌐 在线体验 Live Demo](https://french-learning-zeta.vercel.app) · [📚 教材目录](https://french-learning-zeta.vercel.app/courses) · [🔍 教材搜索](https://french-learning-zeta.vercel.app/search)

French Learning OS 不是普通课程网站，也不是让 AI 随机生成内容的聊天机器人。它尝试把教材、学习管理、检索、复习与 AI 辅助整合到同一个学习空间中。

核心原则只有三条：

- **教材决定学什么**：课程结构、词汇、语法和练习必须对应真实教材。
- **系统管理怎么学**：安排学习任务、记录进度、管理词汇与错题。
- **AI 负责辅助学习**：在当前 Lesson、语法和词汇范围内讲解、陪练与反馈，而不是取代教材。

## Why this project?

PDF 教材内容可靠，却不方便检索、导航和长期记录；通用 AI 灵活，却容易脱离课程体系；传统学习网站又很难适配个人教材。

French Learning OS 希望把三者的优势组合起来：

| Textbook 教材 | Learning System 学习系统 | AI Tutor AI 老师 |
| --- | --- | --- |
| 决定课程边界 | 管理任务与进度 | 解释与陪练 |
| 提供原始语境 | 组织词汇与错题 | 根据当前 Lesson 反馈 |
| 保证内容可追溯 | 安排复习 | 避免超纲授课 |

最终目标是形成类似 **Duolingo + Notion + Anki + AI Tutor** 的个人法语学习工作台，并逐步扩展至 CEFR A2、B1 和 B2。

## Current textbook scope｜当前教材范围

当前版本以《你好！法语 1》为唯一课程主线，不再使用虚构演示课程。

已经完成：

- 识别 239 页扫描版 PDF，并确认其没有可靠文字层
- 提取并核对完整教材目录
- 建立 PDF 物理页码与教材印刷页码映射
- 保留并标记开篇重复编排页面
- 建立 Unité 0 与 Unité 1 的目录、页码关系
- 人工核对并录入 **Leçon 1–4**
- Leçon 3–4 新增 36 个 verified 内容块与 1 个 pending_review 内容块
- 教材检索覆盖 Leçon 1–4；长篇文化原文仍遵守最小必要引用原则

> 当前教材索引只覆盖已完成核对的目录、Unité 0、Unité 1 和 Leçon 1–4，并非整本教材。

## Features｜核心能力

### 📖 Real textbook navigation｜真实教材目录

- 按教材原有的 Unité、Leçon、Savoir-faire、Évaluation 和 Annexes 展示
- 支持多层级折叠导航
- 显示教材印刷页码与 PDF 页码
- 未完成内容解析的课程会明确标记，不生成替代内容

### 🧭 Learning mode｜学习模式

Lesson 页面根据教材实际内容动态展示：

- 学习目标
- 对话与课文
- 词汇与重点表达
- 语法
- 发音与交际
- 练习与注释

教材没有的板块不会显示空模块。每个内容块都保留页面、来源、提取方式与核对状态。

### 📚 Textbook mode｜教材模式

- 从本机私有缓存按页读取教材页面
- 自动定位当前 Lesson 对应页码
- 支持上一页、下一页、缩放和页码跳转
- 同时显示教材印刷页码与 PDF 页码
- 原始 PDF 不进入 `public` 目录，也不提供公开下载地址

当前可以精确定位到教材页面；基于 `source_bbox` 的原文矩形高亮仍在后续计划中。

### 🔍 Textbook search｜教材检索

第一版搜索覆盖已经人工核对的内容，支持：

- 法语单词、短语和完整句子
- 中文释义与中文课程描述
- 对话、语法、例句与练习
- Unit / Lesson 标题
- 教材印刷页码
- 法语重音符号与大小写兼容，例如 `etre` 可以匹配 `être`

搜索结果可以跳转到结构化学习内容，或定位到对应教材页面。URL 会保存 Lesson、Section、内容块与 PDF 页索引，刷新后仍能保持位置。

### 🧠 Learning systems｜学习系统

当前版本已经形成浏览器本地学习闭环：

- Dashboard 自动生成今日课程、词汇复习与错题复习任务
- Lesson 支持开始、继续、保存上次位置、累计时长、完成与重新学习
- 完成 Lesson 后自动将本课词汇加入复习队列，并安排下一课
- 单词支持收藏、0–5 掌握度与可解释的间隔复习
- 教材练习支持自评；答错进入错题本，连续答对两次后标记为掌握
- 学习状态经统一 Repository 保存到当前浏览器，刷新或重新打开后保留
- 支持 JSON 导出、导入预览、合并、覆盖与二次确认清空

> 当前学习数据仅保存在当前浏览器与当前网站域名下，暂不支持跨设备同步。教材正文、PDF 页面和搜索索引不会写入浏览器学习状态。

### 🤖 AI Tutor｜AI 法语老师（计划中）

未来将提供语法、口语、写作、翻译和考试老师。AI 必须知道用户当前的 Lesson、语法、词汇和 CEFR 水平，并限制在教材范围内辅助学习。

## Traceability｜教材内容溯源

网站内容与教材原文通过统一来源模型关联：

```text
Textbook
  ├── Textbook Page
  │     └── Source Block
  ├── Unit / Lesson / Section
  └── Structured Content
          ↕ content_source_links
      Source Block
```

核心数据包括：

- `textbook_pages`：PDF 索引、印刷页码、重复页与所属课程
- `source_blocks`：教材原始片段、语言、内容类型和核对状态
- `content_source_links`：结构化内容与教材来源的多对多关联
- `textbook_search_index`：标准化文本、无重音文本与混合语言索引

视觉或 AI 辅助提取的内容不会自动视为准确内容；只有经过核对的 `verified` 内容默认进入正式搜索结果。

## Tech stack｜技术栈

- Next.js / App Router
- React
- TypeScript（strict）
- Tailwind CSS
- Zustand
- Supabase / PostgreSQL
- Next.js Node.js runtime / Vercel
- Web Speech API（计划中）

## Project status｜开发状态

| 模块 | 状态 |
| --- | --- |
| 项目架构与基础 UI | ✅ 已完成 |
| 真实教材完整目录 | ✅ 已核对 |
| 页码映射与重复页处理 | ✅ 已完成试验范围 |
| Leçon 1–4 结构化录入 | ✅ 已完成 |
| 教材模式 | ✅ 基础版本可用 |
| 有限范围教材搜索 | ✅ 基础版本可用 |
| 搜索跳转与页级定位 | ✅ 已完成 |
| Dashboard 与每日任务 | ✅ 浏览器本地版本可用 |
| Lesson 进度与学习历史 | ✅ 浏览器本地版本可用 |
| 词汇收藏与间隔复习 | ✅ 浏览器本地版本可用 |
| 错题本与重新练习 | ✅ 浏览器本地版本可用 |
| JSON 数据备份与迁移 | ✅ 合并 / 覆盖可用 |
| PDF 坐标级高亮 | ⏳ 待补充 bbox |
| Supabase 远端迁移与种子执行 | ⏳ SQL 已准备 |
| Supabase Auth 与跨设备同步 | ⏳ 下一阶段 |
| AI Tutor 与语音训练 | ⏳ 计划中 |
| 剩余 Lesson 批量导入 | ⏳ 等待分批核对 |

## Local development｜本地运行

要求 Node.js `>= 22.13.0`。

```bash
npm install
cp .env.example .env.local
npm run textbook:prepare
npm run dev
```

`.env.local` 至少需要配置：

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
TEXTBOOK_BONJOUR_FRANCAIS_1_PATH=/absolute/path/to/你好！法语1.pdf
PDFTOPPM_BIN=/absolute/path/to/pdftoppm
```

`npm run textbook:prepare` 只预渲染当前批准范围内的教材页面，并写入被 Git 忽略的 `.private` 目录。

常用命令：

```bash
npm test                         # 运行数据、迁移和路由测试
npm run lint                     # ESLint
npx tsc --noEmit                 # TypeScript 严格检查
npm run build                    # 生产构建
npm run textbook:seed:generate   # 重新生成试导入 SQL
```

Supabase SQL 位于：

- `supabase/migrations/202607150001_initial_learning_schema.sql`
- `supabase/migrations/202607200001_textbook_grounding.sql`
- `supabase/seed/bonjour-francais-1-trial.sql`

## Roadmap｜路线图

1. 对 Leçon 1–4 进行逐题、逐选项复核，并补充可靠 bbox
2. 执行 Supabase 迁移和试导入，验证真实查询链路
3. 按已验证流程分批录入 Leçon 5–10
4. 接入 Supabase Auth，以 `auth.uid()` 隔离数据，并提供本地/云端覆盖或合并迁移
5. 加入教材受限的 AI Tutor 与 Web Speech API
6. 扩展至《你好！法语 2》及 A2–B2 教材

## Privacy and copyright｜隐私与版权

本项目用于个人学习与技术研究。

- 教材原始 PDF 和预渲染页面不会提交到仓库或公开存储桶
- 仓库只保留课程索引、数据模型，以及当前试验范围内用于核对和检索的有限教材片段
- 教材版权归原作者及出版社所有
- 使用者应自行合法取得教材，并避免公开传播教材文件或大段原文
- 用户笔记、收藏、错题、学习进度与 AI 内容将与教材来源数据分开保存

---

**French Learning OS** aims to make textbook-based French learning searchable, traceable and sustainable—without allowing AI to replace the curriculum.

让教材决定方向，让系统管理过程，让 AI 真正成为老师。

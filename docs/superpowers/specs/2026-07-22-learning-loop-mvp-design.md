# Learning Loop MVP Design

## Goal

在不接入 Supabase Auth 的前提下，让用户完成一节课后，浏览器能够持久记住学习进度、学习时长、词汇复习、错题与每日任务，并在下一次打开网站时给出明确的继续学习入口。

## Architecture

学习数据分为四层：`types` 定义版本化状态；`LearningRepository` 统一存取；`LocalLearningRepository` 负责 localStorage、迁移与容错；`LearningService`、`ReviewScheduler`、`DailyTaskGenerator` 和 `StudySessionTracker` 编排业务规则。页面组件只通过 Zustand actions 调用业务层，不直接访问 localStorage。

Zustand store 是客户端状态入口，使用显式 hydration。Repository 仍是唯一持久化边界；store 不使用 Zustand persist 中间件，避免绕过 Repository。写入使用 Repository 内部节流队列，关键动作（完成 Lesson、答题、导入）立即 flush。

## Data model

根对象 `UserLearningState` 使用 `schemaVersion: 1` 和固定本地存储键 `french-learning-os:learning-state:v1`。它包含 lessonProgress、vocabularyProgress、exerciseAttempts、mistakes、studySessions、dailyTasks 和 dailyStats 的记录集合，仅保存用户行为，不复制教材正文与搜索索引。

词汇条目的稳定 ID 来源于已核对词汇块的解析结果；练习使用当前教材练习块 ID。后续教材扩展只要提供相同的 catalog 接口，就能自动加入任务生成器。

## Learning loop

开始 Lesson 会创建进度与 session；移动到内容块会更新最近位置和进度；完成 Lesson 会结束 session、更新统计、完成关联任务、把本课词汇加入复习队列并生成下一批每日任务。完成后仍可重新学习，`completionCount` 累加。

词汇复习间隔由配置控制：掌握度 1/答错为 1 天，2 为 1 天，3 为 3 天，4 为 7 天，5 为 21 天。错题次日复习，连续答对两次标记 mastered；再次答错恢复 unresolved。

## Daily tasks and Dashboard

每日任务以 `taskDate + taskType + entityId` 形成确定性 ID，重复调用不会重复生成。优先级依次为到期错题、到期词汇、进行中的 Lesson、下一课。Dashboard 在 hydration 后展示继续学习、任务、到期复习、教材进度、连续天数、当日时长、最近 Lesson、收藏与掌握词汇数，并明确提示数据仅保存在当前浏览器。

## Backup and resilience

导出产生带 schemaVersion 的 JSON。导入先解析并返回摘要，再由用户选择 merge 或 replace。合并按最新时间戳与业务主键去重。损坏 JSON、错误字段与未知版本不会使页面崩溃；Repository 回退为空状态并返回统一错误对象。清空数据必须二次确认。

## Future Supabase migration

保留 `SupabaseLearningRepository` 类型占位。未来登录时同一接口分别读取本地和云端状态，由迁移协调器提供 local-to-cloud、cloud-to-local 和 merge；云端实现使用 auth.uid() 隔离，成功后仍保留本地缓存。

## Validation

核心规则使用 Node 单元测试覆盖迁移、损坏数据、Lesson 完成编排、复习间隔、错题连续正确、任务幂等、导入导出一致性。浏览器验证刷新持久化、返回上次位置、Dashboard 联动、导入导出与移动端布局。最后运行 TypeScript、ESLint 和 Next.js build。

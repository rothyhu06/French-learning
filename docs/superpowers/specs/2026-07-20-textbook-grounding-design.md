# 《你好！法语 1》教材溯源与试导入设计

## 范围

仅处理教材目录、Unité 0、Unité 1、Leçon 1 `Bienvenue !` 和 Leçon 2 `Qui est-ce ?`。不执行整书 OCR，不建立未经核对的全书索引。

## 来源原则

扫描 PDF 是唯一课程事实来源。所有结构化内容必须关联教材页面和原文块。视觉提取结果默认 `pending` 或 `pending_review`，只有人工核对后才标记 `verified`。页面不展示模型补写内容。

## 数据边界

- `textbook_pages` 管理 PDF 零基索引、PDF 页码、印刷页码、重复页及课程归属。
- `chapters` 仅管理 Unité、Évaluation、Annexes 等导航节点，支持父子层级。
- `lessons` 管理 Leçon 和 Savoir-faire；不在 `chapters` 重复保存。
- `lesson_sections` 管理实际出现的板块。
- `source_blocks` 保存分块原文和可选坐标。
- `content_source_links` 统一关联课程实体与原文块。
- `textbook_search_index` 保存标准化检索字段，正式结果默认只读取 `verified`。
- 教材原始文件不进入公开目录或公开存储；用户学习数据与教材内容分开。

## 页面与定位

目录按教材真实层级渲染。Lesson 支持学习模式与教材模式；教材模式通过受控接口按页渲染。跳转状态写入 URL：学习模式使用 `sectionId` 和 `sourceBlockId`，教材模式使用 `mode=textbook`、`pdfPageIndex` 和 `sourceBlockId`。有 bbox 时高亮区域，无 bbox 时定位页面。

## 搜索

搜索覆盖已核对目录、Unité 0 目录节点、Leçon 1 和 Leçon 2。支持大小写、法语重音兼容和中法混合检索。页面必须显示覆盖范围和未覆盖提示，不生成推测结果。

## 验证

验证页码映射中的重复页不被合并、目录标题和页码与扫描页一致、空板块不渲染、前后课导航正确、URL 刷新保持定位、私有教材接口不暴露文件路径，以及 TypeScript、ESLint、构建和响应式布局通过。

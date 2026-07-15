import type { Chapter, Mistake, VocabularyItem } from "./types";

const lessonSections = [
  { id: "s1", kind: "dialogue" as const, title: "教材正文", summary: "初次见面的对话与理解", duration: 8 },
  { id: "s2", kind: "vocabulary" as const, title: "新单词", summary: "问候、姓名与国籍", duration: 10 },
  { id: "s3", kind: "grammar" as const, title: "语法", summary: "主语人称代词与 être", duration: 12 },
  { id: "s4", kind: "examples" as const, title: "重点表达", summary: "自我介绍的常用句型", duration: 8 },
  { id: "s5", kind: "listening" as const, title: "听力", summary: "辨认姓名与国籍", duration: 6 },
  { id: "s6", kind: "exercises" as const, title: "练习", summary: "教材理解与巩固练习", duration: 10 },
  { id: "s7", kind: "culture" as const, title: "文化补充", summary: "法国人的见面礼仪", duration: 4 },
];

export const chapters: Chapter[] = [
  {
    id: "a1-foundation",
    level: "A1",
    title: "你好！法语 1",
    description: "从第一次见面开始，建立法语基础表达。",
    lessons: [
      { id: "lesson-1", number: 1, title: "Bonjour !", subtitle: "你好！", objectives: ["能够问候并告别", "能够询问和说出姓名", "初步使用动词 être"], status: "completed", progress: 100, duration: 46, sections: lessonSections, source: { book: "《你好！法语 1》", pages: "P. 10–17" } },
      { id: "lesson-2", number: 2, title: "Je m’appelle…", subtitle: "我叫……", objectives: ["完成简单的自我介绍", "询问对方的国籍", "使用主语人称代词"], status: "current", progress: 42, duration: 52, sections: lessonSections.map((s, i) => ({ ...s, id: `l2-${i}` })), source: { book: "《你好！法语 1》", pages: "P. 18–25" } },
      { id: "lesson-3", number: 3, title: "Vous êtes français ?", subtitle: "您是法国人吗？", objectives: ["询问职业和国籍", "肯定与否定回答", "区分 tu 和 vous"], status: "locked", progress: 0, duration: 50, sections: lessonSections.map((s, i) => ({ ...s, id: `l3-${i}` })), source: { book: "《你好！法语 1》", pages: "P. 26–33" } },
      { id: "lesson-4", number: 4, title: "C’est où ?", subtitle: "在哪里？", objectives: ["询问地点", "理解简单方位", "使用 c’est"], status: "locked", progress: 0, duration: 48, sections: lessonSections.map((s, i) => ({ ...s, id: `l4-${i}` })), source: { book: "《你好！法语 1》", pages: "P. 34–41" } },
    ],
  },
  {
    id: "a1-daily",
    level: "A1",
    title: "日常生活",
    description: "谈论时间、家庭、活动与日常安排。",
    lessons: Array.from({ length: 4 }, (_, i) => ({ id: `lesson-${i + 5}`, number: i + 5, title: ["Quelle heure est-il ?", "Ma famille", "On va au café ?", "Une journée ordinaire"][i], subtitle: ["几点了？", "我的家庭", "去咖啡馆吗？", "普通的一天"][i], objectives: ["理解本课核心对话", "掌握教材重点词汇", "完成课后练习"], status: "locked" as const, progress: 0, duration: 50, sections: lessonSections.map((s, j) => ({ ...s, id: `l${i + 5}-${j}` })), source: { book: "《你好！法语 1》", pages: `P. ${42 + i * 8}–${49 + i * 8}` } })),
  },
];

export const vocabulary: VocabularyItem[] = [
  { id: "v1", french: "bonjour", chinese: "你好；早上好", partOfSpeech: "感叹词", ipa: "/bɔ̃.ʒuʁ/", lessonId: "lesson-1", source: "《你好！法语 1》P.10", example: "Bonjour, je m’appelle Léa.", exampleChinese: "你好，我叫莱娅。", favorite: true, mastery: 5, lastReviewed: "今天", nextReview: "7月22日" },
  { id: "v2", french: "s’appeler", chinese: "名叫；称为", partOfSpeech: "代词式动词", ipa: "/sa.ple/", lessonId: "lesson-2", source: "《你好！法语 1》P.18", example: "Comment vous appelez-vous ?", exampleChinese: "您叫什么名字？", favorite: true, mastery: 3, lastReviewed: "昨天", nextReview: "7月17日" },
  { id: "v3", french: "français", chinese: "法国的；法语", partOfSpeech: "形容词 / 名词", gender: "m.", plural: "français", ipa: "/fʁɑ̃.sɛ/", lessonId: "lesson-2", source: "《你好！法语 1》P.21", example: "Vous êtes français ?", exampleChinese: "您是法国人吗？", favorite: false, mastery: 2, lastReviewed: "7月13日", nextReview: "今天" },
  { id: "v4", french: "étudiant", chinese: "大学生", partOfSpeech: "名词", gender: "m.", plural: "étudiants", ipa: "/e.ty.djɑ̃/", lessonId: "lesson-2", source: "《你好！法语 1》P.22", example: "Je suis étudiant à Paris.", exampleChinese: "我是巴黎的一名大学生。", favorite: false, mastery: 1, nextReview: "今天" },
  { id: "v5", french: "enchanté", chinese: "很高兴认识你", partOfSpeech: "形容词", gender: "m.", ipa: "/ɑ̃.ʃɑ̃.te/", lessonId: "lesson-1", source: "《你好！法语 1》P.12", example: "Enchanté, monsieur Martin.", exampleChinese: "很高兴认识您，马丁先生。", favorite: true, mastery: 4, lastReviewed: "7月12日", nextReview: "7月19日" },
  { id: "v6", french: "merci", chinese: "谢谢", partOfSpeech: "感叹词", ipa: "/mɛʁ.si/", lessonId: "lesson-1", source: "《你好！法语 1》P.14", example: "Merci beaucoup !", exampleChinese: "非常感谢！", favorite: false, mastery: 5, lastReviewed: "7月10日", nextReview: "7月25日" },
];

export const mistakes: Mistake[] = [
  { id: "m1", prompt: "用 être 的正确形式填空：Vous ___ français ?", answer: "êtes", userAnswer: "est", lessonId: "lesson-2", category: "动词变位", errorCount: 3, lastError: "今天 09:24", remastered: false },
  { id: "m2", prompt: "将“我叫苏菲”翻译成法语。", answer: "Je m’appelle Sophie.", userAnswer: "Je suis Sophie.", lessonId: "lesson-2", category: "重点表达", errorCount: 2, lastError: "昨天", remastered: false },
  { id: "m3", prompt: "选择正式场合的问候语。", answer: "Bonjour, monsieur.", userAnswer: "Salut !", lessonId: "lesson-1", category: "语用", errorCount: 1, lastError: "7月11日", remastered: true },
];

export const currentLesson = chapters[0].lessons[1];

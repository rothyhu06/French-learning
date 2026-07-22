import { TEXTBOOK_ID } from "./page-map.ts";
import type { DirectoryNode, TextbookLesson } from "./types.ts";

const pdfIndex=(printed:number)=>printed+7;
type UnitDef=[string,string,string,number,number];
const units:UnitDef[]=[
  ["unit-0","Phonétique","语音",5,18],["unit-1","Rencontres","相遇",19,36],["unit-2","Portraits","画像",37,54],
  ["unit-3","Ça se trouve où ?","在哪儿呢？",55,72],["unit-4","Au rythme du temps","跟随时间的节奏",75,92],
  ["unit-5","La vie de tous les jours","日常生活",93,110],["unit-6","Vivre avec les autres","与人相处",111,128],
  ["unit-7","Un peu, beaucoup, passionnément…","一点儿，非常，特别……",131,148],
  ["unit-8","Tout le monde en parle…","大家都在说这事儿",149,166],["unit-9","On verra bien !","走着瞧吧！",167,184],
];

export const directoryNodes:DirectoryNode[]=[
  {id:"front-matter",textbookId:TEXTBOOK_ID,parentId:null,nodeType:"front_matter",originalNumber:"开篇",titleFr:"Avant-propos et sommaire",titleZh:"出版说明、序言与目录",sourceOrder:1,startPrintedPageNumber:1,endPrintedPageNumber:4,startPdfPageIndex:0,endPdfPageIndex:11,dataSource:"《你好！法语 1》目录及开篇扫描页",contentParsed:true},
  ...units.map((u,i)=>({id:u[0],textbookId:TEXTBOOK_ID,parentId:null,nodeType:"unite" as const,originalNumber:`Unité ${i}`,titleFr:u[1],titleZh:u[2],sourceOrder:10+i*10,startPrintedPageNumber:u[3],endPrintedPageNumber:u[4],startPdfPageIndex:pdfIndex(u[3]),endPdfPageIndex:pdfIndex(u[4]),dataSource:"《你好！法语 1》目录（教材第 3–4 页）",contentParsed:i<=1})),
  {id:"evaluation-1",textbookId:TEXTBOOK_ID,parentId:null,nodeType:"evaluation",originalNumber:"Évaluation 1",titleFr:"DILF A1.1 / DELF A1",titleZh:"仿真模拟 1",sourceOrder:49,startPrintedPageNumber:73,endPrintedPageNumber:74,startPdfPageIndex:pdfIndex(73),endPdfPageIndex:pdfIndex(74),dataSource:"目录第 3 页",contentParsed:false},
  {id:"evaluation-2",textbookId:TEXTBOOK_ID,parentId:null,nodeType:"evaluation",originalNumber:"Évaluation 2",titleFr:"DELF A1",titleZh:"仿真模拟 2",sourceOrder:79,startPrintedPageNumber:129,endPrintedPageNumber:130,startPdfPageIndex:pdfIndex(129),endPdfPageIndex:pdfIndex(130),dataSource:"目录第 4 页",contentParsed:false},
  {id:"evaluation-3",textbookId:TEXTBOOK_ID,parentId:null,nodeType:"evaluation",originalNumber:"Évaluation 3",titleFr:"DELF A1",titleZh:"仿真模拟 3",sourceOrder:109,startPrintedPageNumber:185,endPrintedPageNumber:186,startPdfPageIndex:pdfIndex(185),endPdfPageIndex:pdfIndex(186),dataSource:"目录第 4 页",contentParsed:false},
  {id:"annexes",textbookId:TEXTBOOK_ID,parentId:null,nodeType:"annexes",originalNumber:"Annexes",titleFr:"Annexes",titleZh:"附录",sourceOrder:120,startPrintedPageNumber:187,endPrintedPageNumber:null,startPdfPageIndex:pdfIndex(187),endPdfPageIndex:null,dataSource:"目录第 4 页",contentParsed:false},
  ...[["annex-vocab","Vocabulaire thématique","主题词汇表",187],["annex-transcriptions","Transcriptions","听力文本",192],["annex-grammar","Mémento grammatical","语法概要",199],["annex-conjugation","Tableau de conjugaison","动词变位表",210],["annex-lexique","Lexique trilingue","总词汇表",213],["annex-contents","Tableau des contenus","学习内容提要",225]].map((a,i)=>({id:a[0] as string,textbookId:TEXTBOOK_ID,parentId:"annexes",nodeType:"subsection" as const,originalNumber:String(i+1),titleFr:a[1] as string,titleZh:a[2] as string,sourceOrder:121+i,startPrintedPageNumber:a[3] as number,endPrintedPageNumber:i<5?([191,198,209,212,224][i]):null,startPdfPageIndex:pdfIndex(a[3] as number),endPdfPageIndex:i<5?pdfIndex([191,198,209,212,224][i]):null,dataSource:"目录第 4 页",contentParsed:false})),
];

type LessonDef=[string,string,string,number];
const lessonDefs:LessonDef[]=[
  ["Leçon 0-1","","",6],["Leçon 0-2","","",10],["Leçon 0-3","","",13],["Leçon 0-4","","",16],
  ["Leçon 1","Bienvenue !","欢迎！",20],["Leçon 2","Qui est-ce ?","这是谁？",24],["Leçon 3","Ça va bien ?","你好吗？",28],["Leçon 4","Correspondants","寻找笔友",32],
  ["Leçon 5","Trouvez l'objet","找出物品",38],["Leçon 6","Portrait-robot","模拟画像",42],["Leçon 7","Shopping","购物",46],["Leçon 8","Le coin des artistes","艺术家之角",50],
  ["Leçon 9","Appartement à louer","有租公寓",56],["Leçon 10","C'est par où ?","从哪儿走？",60],["Leçon 11","Bon voyage !","旅途愉快！",64],["Leçon 12","Marseille","马赛",68],
  ["Leçon 13","Un aller simple","单程车票",76],["Leçon 14","À Londres","在伦敦",80],["Leçon 15","Le dimanche matin","周日的上午",84],["Leçon 16","Une journée avec Laure Manaudou","和洛儿·马纳多共度的一天",88],
  ["Leçon 17","On fait des crêpes ?","咱们做可丽饼吧？",94],["Leçon 18","Il est comment ?","它是什么样的？",98],["Leçon 19","Chère Léa...","亲爱的蕾娅……",102],["Leçon 20","Les fêtes","节日",106],
  ["Leçon 21","C'est interdit !","这是被禁止的！",112],["Leçon 22","Petites annonces","启事",116],["Leçon 23","Qu'est-ce qu'on lui offre ?","我们送她什么呢？",120],["Leçon 24","Le candidat idéal...","理想的应聘者",124],
  ["Leçon 25","Enquête","街头调查",132],["Leçon 26","Quitter Paris","离开巴黎",136],["Leçon 27","Vivement les vacances !","假期快来吧！",140],["Leçon 28","Les Français en vacances","法国人过假期",144],
  ["Leçon 29","Enfant de la ville","城里的孩子",150],["Leçon 30","Fait divers","社会杂闻",154],["Leçon 31","Ma première histoire d'amour","我的初恋故事",158],["Leçon 32","La 2CV","两马力车",162],
  ["Leçon 33","Beau fixe","持续晴天",168],["Leçon 34","Projets d'avenir","未来计划",172],["Leçon 35","Envie de changement","作出改变的意愿",176],["Leçon 36","Le pain, mangez-en !","面包，吃吧！",180],
];
const savoir=[["unit-1",36],["unit-2",54],["unit-3",72],["unit-4",92],["unit-5",110],["unit-6",128],["unit-7",148],["unit-8",166],["unit-9",184]] as const;
const parentFor=(printed:number)=>units.find(u=>printed>=u[3]&&printed<=u[4])?.[0]??"unit-0";
const nextBoundary=(start:number)=>{ const starts=[...lessonDefs.map(l=>l[3]),...savoir.map(s=>s[1]),73,75,93,111,129,131,149,167,185,187].sort((a,b)=>a-b); return (starts.find(n=>n>start)??start+4)-1; };
export const lessons:TextbookLesson[]=[
  ...lessonDefs.map((l,i)=>({id:l[0].toLowerCase().replace("leçon ","lesson-").replace("-","-").replace(/\s/g,""),textbookId:TEXTBOOK_ID,chapterId:parentFor(l[3]),kind:"lesson" as const,originalNumber:l[0],titleFr:l[1]||l[0],titleZh:l[2]||null,sourceOrder:11+i,startPrintedPageNumber:l[3],endPrintedPageNumber:nextBoundary(l[3]),startPdfPageIndex:pdfIndex(l[3]),endPdfPageIndex:pdfIndex(nextBoundary(l[3])),contentParsed:["Leçon 1","Leçon 2","Leçon 3","Leçon 4"].includes(l[0])})),
  ...savoir.map((s,i)=>({id:`savoir-faire-${i+1}`,textbookId:TEXTBOOK_ID,chapterId:s[0],kind:"savoir_faire" as const,originalNumber:"Savoir-faire",titleFr:"Savoir-faire",titleZh:"学以致用",sourceOrder:50+i*10,startPrintedPageNumber:s[1],endPrintedPageNumber:s[1],startPdfPageIndex:pdfIndex(s[1]),endPdfPageIndex:pdfIndex(s[1]),contentParsed:false})),
];

directoryNodes.forEach((node,index)=>{ node.sourceOrder=index+1; });
lessons.forEach((lesson,index)=>{ lesson.sourceOrder=directoryNodes.length+index+1; });

export const textbookDirectory={textbook:{id:TEXTBOOK_ID,title:"你好！法语 1",sourceType:"scanned_pdf",pageCount:239},nodes:directoryNodes,lessons};

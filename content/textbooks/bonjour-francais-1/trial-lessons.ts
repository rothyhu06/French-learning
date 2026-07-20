import { TEXTBOOK_ID } from "./page-map.ts";
import { directoryNodes, lessons } from "./directory.ts";
import type { SourceBlock, SourceBlockType } from "./types.ts";

export interface TrialSection { id:string; lessonId:string; type:SourceBlockType; titleFr:string; titleZh:string; sourceBlockIds:string[]; }
export interface TrialLesson { id:string; number:number; unitId:string; titleFr:string; titleZh:string; startPdfPageIndex:number; endPdfPageIndex:number; startPrintedPageNumber:number; endPrintedPageNumber:number; sections:TrialSection[]; }

const block=(id:string,lessonId:string|null,sectionId:string|null,pdfPageIndex:number,printedPageNumber:number,blockType:SourceBlockType,originalText:string,language:SourceBlock["language"],sourceOrder:number,verificationStatus:SourceBlock["verificationStatus"]="verified",sourceBbox:SourceBlock["sourceBbox"]=null):SourceBlock=>({id,textbookId:TEXTBOOK_ID,textbookPageId:`bf1-page-${pdfPageIndex}`,lessonId,sectionId,pdfPageIndex,printedPageNumber,sourceBbox,blockType,originalText,language,sourceOrder,extractionMethod:"manual",verificationStatus,verifiedAt:verificationStatus==="verified"?"2026-07-20T00:00:00.000Z":null,notes:null});

const directorySourceBlocks: SourceBlock[] = [...directoryNodes, ...lessons].map((item, index) => {
  const contentStartPage = item.startPrintedPageNumber ?? 3;
  const tocPrintedPage = contentStartPage >= 111 ? 4 : 3;
  return block(
    `directory-${item.id}`,
    "kind" in item ? item.id : null,
    null,
    tocPrintedPage - 3,
    tocPrintedPage,
    "page_heading",
    `${item.originalNumber} ${item.titleFr}${item.titleZh ? ` ${item.titleZh}` : ""}`,
    "mixed",
    1000 + index,
  );
});

export const sourceBlocks:SourceBlock[]=[
  ...directorySourceBlocks,
  block("u1-objectives","lesson-1",null,26,19,"learning_objectives","Vous allez apprendre à… saluer ; demander et dire le nom et le prénom, l’âge, les coordonnées, la profession ; exprimer des goûts ; compter. Pour… vous présenter et présenter une personne ; faire connaissance avec quelqu’un ; demander des nouvelles ; chercher un(e) correspondant(e). 本单元将学习以下内容：打招呼；就姓名、年龄、联系方式及职业提问和回答；表达喜好；计数。以便学会：自我介绍和介绍他人；与某人相识；打听某人的消息；找笔友。","mixed",1),
  block("l1-heading","lesson-1","l1-dialogue",27,20,"page_heading","Leçon 1 — Bienvenue ! 欢迎！","mixed",2),
  block("l1-dialogue-a","lesson-1","l1-dialogue",27,20,"dialogue","— Bonjour, monsieur. Vous vous appelez… ?\n— Doucet. Yves Doucet. Et voici ma femme, Alice.\n— Bonjour, madame.","fr",3),
  block("l1-dialogue-b","lesson-1","l1-dialogue",27,20,"dialogue","— Bonjour. Je suis Alice Doucet. Vous êtes madame Falco ?\n— Bonjour. Oui, je m’appelle Nicole Falco. Aldo, mon mari.\n— Arnaud ?\n— Non. Aldo. Il s’appelle Aldo.","fr",4),
  block("l1-notes","lesson-1","l1-notes",27,20,"notes","vous 还是 tu？；et elle, c’est Nicole, elle est française.","mixed",5),
  block("l1-vocab","lesson-1","l1-vocabulary",27,20,"vocabulary","appeler(s’) 名叫；bienvenue 欢迎；bonjour 您好，早上好；ce 这；elle 她；et 和；être 是；étudiant(e) 大学生；femme 女人、妻子；français(e) 法国的、法国人；il 他；italien(ne) 意大利的、意大利人；je 我；ma 我的；madame 夫人；mari 丈夫；mon 我的；monsieur 先生；nationalité 国籍；nom 姓氏；non 不；oui 对，是的；prénom 名字；qui 谁；tu 你；voici 这是；vous 您、你们","mixed",6),
  block("l1-dialogue-cd","lesson-1","l1-dialogue",28,21,"dialogue","— Qui est-ce ? — C’est Aldo. Aldo Falco. — Aldo ? Il est italien ? — Oui, et elle, c’est Nicole, elle est française.\n— Tu t’appelles Giacomo ! Tu es italien ? — Oui, oui. Je suis italien.","fr",7),
  block("l1-discovery","lesson-1","l1-discovery",28,21,"discovery","DÉCOUVREZ — Club Océan. Écoutez et associez les dialogues et les dessins.","mixed",8),
  block("l1-grammar-conjugation","lesson-1","l1-grammar",28,21,"grammar","La conjugaison des verbes 动词变位。être : je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont. s’appeler : je m’appelle, tu t’appelles, il/elle s’appelle, nous nous appelons, vous vous appelez, ils/elles s’appellent.","mixed",9),
  block("l1-grammar-gender","lesson-1","l1-grammar",29,22,"grammar","Le genre : le masculin et le féminin 阴性和阳性。","mixed",10),
  block("l1-grammar-question","lesson-1","l1-grammar",29,22,"grammar","L’interrogation 疑问句；L’interrogatif qui 疑问词 qui. Exemples : Vous êtes italien ? Est-ce que vous êtes italien ? Êtes-vous italien ? Qui est-ce ?","mixed",11),
  block("l1-expressions","lesson-1","l1-expressions",29,22,"expressions","Savoir dire — Saluer : Bonjour. Bonjour, monsieur. Bonjour, madame Doucet. Se présenter : Je suis Alice Doucet. Je m’appelle Nicole Falco. Je suis français(e). Demander et dire le prénom et le nom : Qui est-ce ? C’est Aldo Falco.","mixed",12),
  block("l1-exercises","lesson-1","l1-exercises",30,23,"exercises","Entraînez-vous : Qui est-ce ? Complétez les phrases avec le verbe être au présent et je, il, elle ou vous. Jeu : trouvez le mot et complétez. Homme ou femme ?","mixed",13),
  block("l1-speaking","lesson-1","l1-speaking",30,23,"speaking","COMMUNIQUEZ — À vous ! Saluez votre voisin(e) et présentez-vous. Montrez un(e) étudiant(e) et demandez à votre voisin(e).","mixed",14),
  block("l1-pronunciation","lesson-1","l1-pronunciation",30,23,"pronunciation","PRONONCEZ — C’est une question ? Écoutez et dites si vous entendez une affirmation ou une question.","mixed",15),

  block("l2-heading","lesson-2","l2-dialogue",31,24,"page_heading","Leçon 2 — Qui est-ce ? 这是谁？","mixed",20),
  block("l2-dialogue","lesson-2","l2-dialogue",31,24,"dialogue","— Qui est-ce ?\n— C’est Naoko, non ?\n— Naoko ?\n— Oui, Naoko Yamada. Elle est étudiante.\n— Elle est sympa ?\n— Oui. Elle est dans le cours de français, elle est japonaise.\n— Elle habite en France ou au Japon ?\n— Elle habite en Suisse, à Genève.","fr",21),
  block("l2-notes","lesson-2","l2-notes",31,24,"notes","Elle est étudiante. 她是大学生。；C’est Naoko, non ? 这是直子，不是吗？","mixed",22),
  block("l2-vocab","lesson-2","l2-vocabulary",31,24,"vocabulary","à 在、向、到；assistant(e) 助理；belge 比利时的；Belg(e) 比利时人；café 咖啡；chinois(e) 中国的、中国人；cours 课；dans 在……里；directeur(trice) 经理；en 在；espagnol(e) 西班牙的、西班牙人；français 法语；France 法国；Genève 日内瓦；habiter 居住；Japon 日本；japonais(e) 日本的、日本人；ou 或；professeur 教师；rendez-vous 约会；secrétaire 秘书；s’il vous plaît 请；Suisse 瑞士；sympa 讨人喜欢的；téléphone 电话；thé 茶","mixed",23),
  block("l2-discovery","lesson-2","l2-discovery",32,25,"discovery","DÉCOUVREZ — À l’institut 在学院。Écoutez le dialogue 1 (p. 24) et dites si c’est vrai ou faux. Regardez le badge et rejouez le dialogue 1. Écoutez le dialogue 2 et associez les personnes aux professions.","mixed",24),
  block("l2-grammar-article","lesson-2","l2-grammar",32,25,"grammar","L’article défini (1) 定冠词（1）：le (l’), la (l’).","mixed",25),
  block("l2-grammar-nouns","lesson-2","l2-grammar",32,25,"grammar","La forme féminine des noms 名词的阴性形式。Cas général : + e, étudiant → étudiante. Cas particuliers : directeur → directrice ; danseur → danseuse ; boulanger → boulangère ; juif → juive ; informaticien → informaticienne.","mixed",26),
  block("l2-grammar-adjectives","lesson-2","l2-grammar",33,26,"grammar","La forme féminine des adjectifs 形容词的阴性形式：japonais → japonaise ; italien → italienne ; américain → américaine ; neuf → neuve ; cher → chère ; heureux → heureuse.","mixed",27),
  block("l2-grammar-countries","lesson-2","l2-grammar",33,26,"grammar","Préposition + nom de pays 介词 + 国别名词：en France, en Italie, au Japon, au Canada, aux États-Unis. Préposition + nom de ville 介词 + 城市名：à Paris, à Rome, à Tokyo.","mixed",28),
  block("l2-expressions","lesson-2","l2-expressions",33,26,"expressions","Savoir dire — Identifier une personne : Qui est-ce ? C’est Mario/Claudia. Il/Elle s’appelle… Il/Elle est français(e). Il/Elle est photographe. Il/Elle est étudiant(e). Il/Elle habite à Paris, en France.","mixed",29),
  block("l2-exercises","lesson-2","l2-exercises",33,26,"exercises","Entraînez-vous — Homme ou femme ? Écoutez et dites si la phrase est au masculin ou au féminin.","mixed",30),
  block("l2-cards","lesson-2","l2-exercises",34,27,"exercises","Cartes de visite 名片；Pays et nationalités 国家与国籍。Complétez les phrases avec en ou au. Mettez les phrases au masculin.","mixed",31),
  block("l2-speaking","lesson-2","l2-speaking",34,27,"speaking","COMMUNIQUEZ — Au téléphone 打电话；À vous ! Demandez à votre voisin(e)…","mixed",32),
  block("l2-pronunciation","lesson-2","l2-pronunciation",34,27,"pronunciation","PRONONCEZ — Les syllabes 音节。Écoutez et lisez. Détachez les syllabes puis prononcez normalement.","mixed",33),
];

const sections=(lessonId:string):TrialSection[]=>sourceBlocks.filter(b=>b.lessonId===lessonId).reduce<TrialSection[]>((acc,b)=>{ if(!b.sectionId||acc.some(s=>s.id===b.sectionId)) return acc; const labels:Record<SourceBlockType,[string,string]>={learning_objectives:["Objectifs","学习目标"],dialogue:["Dialogues","对话"],notes:["Notes","注释"],vocabulary:["Vocabulaire","词汇"],discovery:["Découvrez","初识"],grammar:["Grammaire","语法"],expressions:["Savoir dire","学会说"],exercises:["Entraînez-vous","练习"],speaking:["Communiquez","交际"],pronunciation:["Prononcez","发音"],culture:["Culture","文化"],page_heading:["Leçon","课程"]}; const [titleFr,titleZh]=labels[b.blockType]; acc.push({id:b.sectionId,lessonId,type:b.blockType,titleFr,titleZh,sourceBlockIds:sourceBlocks.filter(x=>x.sectionId===b.sectionId).map(x=>x.id)}); return acc; },[]);

export const trialLessons:TrialLesson[]=[
  {id:"lesson-1",number:1,unitId:"unit-1",titleFr:"Bienvenue !",titleZh:"欢迎！",startPdfPageIndex:27,endPdfPageIndex:30,startPrintedPageNumber:20,endPrintedPageNumber:23,sections:sections("lesson-1")},
  {id:"lesson-2",number:2,unitId:"unit-1",titleFr:"Qui est-ce ?",titleZh:"这是谁？",startPdfPageIndex:31,endPdfPageIndex:34,startPrintedPageNumber:24,endPrintedPageNumber:27,sections:sections("lesson-2")},
];

export function getTrialLesson(id:string){return trialLessons.find(lesson=>lesson.id===id);}
export function getSourceBlock(id:string){return sourceBlocks.find(block=>block.id===id);}

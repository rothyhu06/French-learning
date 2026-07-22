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

  block("l3-heading","lesson-3","l3-dialogue",35,28,"page_heading","Leçon 3 — Ça va bien ? 你好吗？","mixed",40),
  block("l3-dialogue-a","lesson-3","l3-dialogue",35,28,"dialogue","David — Salut, Céline, tu vas bien ?\nCéline — Oui, ça va bien. Et toi ?\nDavid — Je vais bien, merci… J’habite à Montréal, maintenant, avec ma femme.\nCéline — Au Canada ?\nDavid — Oui, oui, au Canada.\nCéline — Ah ! C’est bien. Et quelle est ton adresse ?\nDavid — Mon adresse ? Alors, c’est : David Delage… 35, rue Notre-Dame, à Montréal.\nCéline — Et tu as une adresse e-mail ?\nDavid — Oui, c’est : ddelage@hotmail.com.","fr",41),
  block("l3-dialogue-b","lesson-3","l3-dialogue",35,28,"dialogue","— Comment va ton ami espagnol ?\n— Luis ? Il va bien. Il est à Paris avec son fils. Il parle français maintenant.\n— Tu as son adresse ?","fr",42),
  block("l3-notes","lesson-3","l3-notes",35,28,"notes","salut：用于熟悉的人之间表示“你好”或“再见”；Tu vas bien ? / Ça va bien ? 用于询问近况；@ 读作 l’arobase，也称 le a commercial；.com 读作 point com。","mixed",43),
  block("l3-vocab","lesson-3","l3-vocabulary",35,28,"vocabulary","adresse n.f. 地址，住址；âge n.m. 年龄，年纪；aller v.i. 去，走，处于……的健康状况，运转，进行，进展；alors adv. 那么，在这种情况下；ami(e) n. 朋友；avec prép. 和……一起；avoir v.t. 有，拥有，具有，带有；bébé n.m. 婴儿，孩子，宝宝；bien adv. 好；ça pron.dém. 这个，那个；Canada n.m. 加拿大；comment adv.interr. 如何，怎么，怎样；e-mail n.m. 电子邮件；fille n.f. 女孩，姑娘，女儿；fils [fis] n.m. 儿子；garçon n.m. 男孩，小伙子；journée n.f. 一天，一昼夜，白天；maintenant adv. 现在，目前；merci interj. 谢谢；Montréal 蒙特利尔（加拿大）；Notre-Dame n.f.inv. 圣母院；Paris 巴黎（法国）；parler v.i., v.t.dir. 说话，讲话，交谈，讲（某种语言）；quel(le) adj.interr. 什么样的，哪一类的；rue n.f. 街，街道，马路；salut interj. 你好，再见；son adj.poss. 他的，她的，它的；toi pron.pers. 你；ton adj.poss. 你的；un(e) art.indéf. 一个，某一；votre adj.poss. 你们的，您的；vous pron.pers. 您，你们。","mixed",44),
  block("l3-discovery","lesson-3","l3-discovery",36,29,"discovery","DÉCOUVREZ — Qui a la parole ? Écoutez les deux dialogues et répondez. À qui dites-vous… ? Lisez et transformez le dialogue entre David et Céline. Utilisez le vous de politesse. Jouez avec votre voisin(e).","mixed",45),
  block("l3-audio-dialogues","lesson-3","l3-discovery",36,29,"audio_reference","Audio pistes 21–22：两段对话听力，用于识别说话者、对象和问候语。","mixed",46),
  block("l3-grammar-verbs","lesson-3","l3-grammar",36,29,"grammar","Les verbes aller et avoir au présent 动词 aller 与 avoir 的现在时变位。aller : je vais, tu vas, il/elle va, nous allons, vous allez, ils/elles vont. avoir : j’ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont.","mixed",47),
  block("l3-grammar-possessive","lesson-3","l3-grammar",36,29,"grammar","L’adjectif possessif (1) 主有形容词（1）：mon / ma / mes；ton / ta / tes；son / sa / ses；votre / vos。元音或哑音 h 开头的单数阴性名词前使用 mon、ton、son：mon école, ton amie, son histoire.","mixed",48),
  block("l3-grammar-indefinite","lesson-3","l3-grammar",37,30,"grammar","L’article indéfini (1) 不定冠词（1）：un（阳性），une（阴性）。Exemples : C’est un livre. C’est un professeur.","mixed",49),
  block("l3-grammar-quel","lesson-3","l3-grammar",37,30,"grammar","L’interrogatif quel 疑问形容词 quel：quel / quelle / quels / quelles。Exemples : Quel est votre nom ? Quelle est ton adresse ? Quel professeur tu préfères ? Quelle voiture tu cherches ?","mixed",50),
  block("l3-expressions","lesson-3","l3-expressions",37,30,"expressions","Savoir dire — Demander des nouvelles : Comment allez-vous ? Ça va, merci. Et vous ? Tu vas bien ? Ça va. Et toi ? Demander l’âge, l’adresse, le numéro de téléphone : Il a quel âge maintenant ? Quelle est ton adresse ? Quel est son numéro de téléphone / adresse e-mail ?","mixed",51),
  block("l3-exercise-presentations","lesson-3","l3-exercises",37,30,"answerable_question","Entraînez-vous 2 — Présentations. Complétez les questions avec quel ou quelle puis associez : 1 … est votre nom ? 2 … est votre âge ? 3 … est votre adresse ? 4 … est votre numéro de téléphone ? Réponses proposées : a J’habite 20, rue de Bourgogne, à Paris. b C’est le 01 26 32 41 60. c Je m’appelle Thurame. d J’ai 25 ans.","mixed",52),
  block("l3-exercise-paroles","lesson-3","l3-exercises",37,30,"answerable_question","Entraînez-vous 3 — Paroles. Complétez avec un ou une : photographe, adresse, étudiante, ami, amie, Italienne.","mixed",53),
  block("l3-audio-bingo","lesson-3","l3-exercises",37,30,"image_based_exercise","Entraînez-vous 4 — Bingo ! Audio piste 23. Écoutez et répétez les nombres de 21 à 62, puis dites si le nombre entendu est sur la grille. 图片表格题，需配合音频，暂不自动判分。","mixed",54),
  block("l3-audio-hotel","lesson-3","l3-speaking",38,31,"audio_reference","COMMUNIQUEZ 5 — Ma clé, s’il vous plaît. Audio piste 24. Écoutez le dialogue. Notez le numéro de la chambre et le numéro de téléphone de l’hôtel. 听力题，未提供音频时手动标记完成。","mixed",55),
  block("l3-speaking-vous","lesson-3","l3-speaking",38,31,"speaking","COMMUNIQUEZ 6 — À vous ! Demandez à votre voisin(e) son âge, sa profession, son adresse et son numéro de téléphone. Demandez comment il/elle va. Choisissez tu ou vous.","mixed",56),
  block("l3-pronunciation","lesson-3","l3-pronunciation",38,31,"pronunciation","PRONONCEZ — L’accent tonique 重音。Il est sur la dernière syllabe des groupes de mots. Écoutez les phrases et répétez. Exemple : Paul Dufaut // a une adresse e-mail. Audio piste 25.","mixed",57),
  block("l3-transcription","lesson-3","l3-dialogue",38,31,"dialogue","Dialogue 2 — Bonjour, monsieur Legrand. Comment allez-vous ? — Ça va, ça va, merci. Et vous, madame Lebon ? — Oh ! oui, moi, je vais bien. — Et votre bébé ? Il va bien ? — Ça va, ça va. — C’est un garçon ou une fille ? — Ah ! un garçon. — Et il a quel âge maintenant ? — Il a un an… — Eh bien, bonne journée, madame Lebon. — Vous aussi, monsieur Legrand, au revoir.","fr",58),

  block("l4-heading","lesson-4","l4-text",39,32,"page_heading","Leçon 4 — Correspondants 寻找笔友","mixed",60),
  block("l4-profile-diouf","lesson-4","l4-text",39,32,"text","Salut ! Je m’appelle Diouf. J’ai 29 ans. J’habite à Dakar au Sénégal. Je vais souvent au cinéma. Je cherche un correspondant en France ou au Canada. Mon e-mail : diouf29@webzine.com","fr",61),
  block("l4-profile-antoine","lesson-4","l4-text",39,32,"text","Je m’appelle Antoine. J’ai 25 ans et j’habite à Bruxelles, en Belgique. Je suis étudiant. J’aime la lecture, la nature et la musique classique. Mon e-mail : antoine.leconte@webzine.com","fr",62),
  block("l4-profile-marion","lesson-4","l4-text",40,33,"text","Moi, c’est Marion. Je suis québécoise. J’ai 18 ans et j’habite à Montréal. J’aime le sport : le volley-ball, le golf… Je cherche une amie en Europe. Mon e-mail : marion@webzine.net","fr",63),
  block("l4-profile-pauline","lesson-4","l4-text",40,33,"text","Bonjour, je m’appelle Pauline et j’ai 31 ans. Je suis guyanaise ; j’habite à Cayenne. Je suis secrétaire. Je cherche une correspondante de 30 à 40 ans. Je parle français, anglais et espagnol. J’aime beaucoup la danse. Mon e-mail : pauline31@webzine.fr","fr",64),
  block("l4-profile-sandro","lesson-4","l4-text",40,33,"text","Je m’appelle Sandro et j’habite en Suisse, à Lausanne. J’ai 22 ans. Je suis boulanger. J’aime la photo. Mon e-mail : sandro.carre@webzine.ch","fr",65),
  block("l4-notes","lesson-4","l4-notes",39,32,"notes","Belgique、Suisse、Sénégal、Guyane 与 Québec / Canada 的冠词和用法；photo 是 photographie 的缩写；de… à… 表示时间起止或空间距离的两端。","mixed",66),
  block("l4-vocab","lesson-4","l4-vocabulary",40,33,"vocabulary","aimer v.t. 爱，热爱；an n.m. 年，岁；aussi adv. 也；beaucoup adv. 很，非常，很多；Belgique n.f. 比利时；boulanger(ère) n. 面包师，面包商；Bruxelles 布鲁塞尔（比利时）；Cayenne 卡宴（法属圭亚那的首府）；chercher v.t. 找，寻找，寻觅；cinéma n.m. 电影，电影艺术，电影院；classique adj. 古典的；correspondance n.f. 通信，通信联系，书信，信件；correspondant(e) n. 通信者，有信件来往者；Dakar 达喀尔（塞内加尔）；danse n.f. 舞蹈；de prép. 从，自；espagnol n.m. 西班牙语；Europe n.f. 欧洲；golf n.m. 高尔夫球运动；guyanais(e) n. 圭亚那的；Lausanne 洛桑（瑞士）；lecture n.f. 阅读；moi pron.pers. 我；monde n.m. 世界；musique n.f. 音乐，乐曲；nature n.f. 自然界，大自然；photo n.f. 摄影，照片；québécois(e) adj. 魁北克的；Sénégal n.m. 塞内加尔；sœur n.f. 姐妹；souvent adv. 经常，常常；sport n.m. 运动，体育运动，运动项目；un peu loc.adv. 一点儿，一下，少许，稍微；volley-ball n.m. 排球，排球运动。","mixed",67),
  block("l4-discovery","lesson-4","l4-discovery",41,34,"discovery","DÉCOUVREZ 1 — Qui parle français dans le monde ? Lisez les 5 messages. Dites pourquoi Diouf, Antoine, Marion, Pauline et Sandro parlent français. Continuez l’exercice comme dans l’exemple.","mixed",68),
  block("l4-correspondent-exercise","lesson-4","l4-exercises",41,34,"exercises","Je cherche un(e) correspondant(e). Relisez les messages. Trouvez un(e) correspondant(e) pour Aïcha, Sabine, Luc et Émilie. 配对题依赖前页五份个人资料，保留材料关系，暂由用户手动核对。","mixed",69),
  block("l4-speaking","lesson-4","l4-speaking",41,34,"speaking","COMMUNIQUEZ 3 — Et vous ? Antoine aime la lecture, la nature et la musique classique. Marion, le sport. Diouf, le cinéma. Et vous ?","mixed",70),
  block("l4-writing-email","lesson-4","l4-writing",41,34,"writing","COMMUNIQUEZ 4 — Votre e-mail en français. Lisez l’e-mail de Marco. Comme Marco, écrivez un e-mail à un(e) correspondant(e). 开放写作题，不设置标准答案。","mixed",71),
  block("l4-email-marco","lesson-4","l4-writing",41,34,"text","Bonjour Sandro, Je m’appelle Marco et j’ai dix-neuf ans. J’habite au Brésil. Mon père est dentiste et ma mère est professeur. J’ai un frère et une sœur. Mon frère s’appelle Ricardo, il a vingt-six ans et il est professeur de sport. Ma sœur, Julia, a vingt-trois ans. Elle est étudiante en France. Moi aussi, je suis étudiant, à São Paulo. J’aime beaucoup la lecture, le football et le rap. Je parle portugais, espagnol, anglais et français (un peu). À bientôt ! Marco","fr",72),
  block("l4-culture-a","lesson-4","l4-culture",41,34,"culture","APERÇU CULTUREL — La Francophonie 法语国家和地区。法语是联合国六种工作语言之一，并在欧洲、非洲、美洲、亚洲和大洋洲的多个国家和地区使用。","mixed",73),
  block("l4-culture-b","lesson-4","l4-culture",42,35,"culture","La Francophonie（续）。页面介绍法语在非洲、美洲、亚洲及大洋洲的分布，并提到 2010 年 10 月 23 日在 Montreux 举行的第 13 届法语国家组织首脑峰会。长篇文化原文仅保留页级定位与待核对摘要。","mixed",74,"pending_review",null),
  block("l4-video-reference","lesson-4","l4-culture",42,35,"audio_reference","VIDÉO — Reportage : Paris 巴黎。视频材料标记，未包含可在网页自动判定的题目。","mixed",75),
];

const sections=(lessonId:string):TrialSection[]=>sourceBlocks.filter(b=>b.lessonId===lessonId).reduce<TrialSection[]>((acc,b)=>{ if(!b.sectionId||acc.some(s=>s.id===b.sectionId)) return acc; const labels:Record<SourceBlockType,[string,string]>={learning_objectives:["Objectifs","学习目标"],dialogue:["Dialogues","对话"],text:["Textes","课文"],notes:["Notes","注释"],vocabulary:["Vocabulaire","词汇"],discovery:["Découvrez","初识"],grammar:["Grammaire","语法"],expressions:["Savoir dire","学会说"],exercises:["Entraînez-vous","练习"],image_based_exercise:["Activité visuelle","图片练习"],answerable_question:["Questions","可作答练习"],page_instruction:["Consignes","说明"],audio_reference:["Audio","音频"],speaking:["Communiquez","交际"],writing:["Écrivez","写作"],pronunciation:["Prononcez","发音"],culture:["Culture","文化"],page_heading:["Leçon","课程"]}; const [titleFr,titleZh]=labels[b.blockType]; acc.push({id:b.sectionId,lessonId,type:b.blockType,titleFr,titleZh,sourceBlockIds:sourceBlocks.filter(x=>x.sectionId===b.sectionId).map(x=>x.id)}); return acc; },[]);

export const trialLessons:TrialLesson[]=[
  {id:"lesson-1",number:1,unitId:"unit-1",titleFr:"Bienvenue !",titleZh:"欢迎！",startPdfPageIndex:27,endPdfPageIndex:30,startPrintedPageNumber:20,endPrintedPageNumber:23,sections:sections("lesson-1")},
  {id:"lesson-2",number:2,unitId:"unit-1",titleFr:"Qui est-ce ?",titleZh:"这是谁？",startPdfPageIndex:31,endPdfPageIndex:34,startPrintedPageNumber:24,endPrintedPageNumber:27,sections:sections("lesson-2")},
  {id:"lesson-3",number:3,unitId:"unit-1",titleFr:"Ça va bien ?",titleZh:"你好吗？",startPdfPageIndex:35,endPdfPageIndex:38,startPrintedPageNumber:28,endPrintedPageNumber:31,sections:sections("lesson-3")},
  {id:"lesson-4",number:4,unitId:"unit-1",titleFr:"Correspondants",titleZh:"寻找笔友",startPdfPageIndex:39,endPdfPageIndex:42,startPrintedPageNumber:32,endPrintedPageNumber:35,sections:sections("lesson-4")},
];

export function getTrialLesson(id:string){return trialLessons.find(lesson=>lesson.id===id);}
export function getSourceBlock(id:string){return sourceBlocks.find(block=>block.id===id);}

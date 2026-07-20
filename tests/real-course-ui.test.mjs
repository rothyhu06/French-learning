import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("course UI is grounded and exposes search plus textbook mode",async()=>{
  const files=await Promise.all(["../app/courses/page.tsx","../app/courses/[lessonId]/page.tsx","../components/app-shell.tsx","../components/lesson-view.tsx","../content/textbooks/bonjour-francais-1/directory.ts"].map(path=>readFile(new URL(path,import.meta.url),"utf8")));
  const source=files.join("\n");
  for(const text of ["Rencontres","Bienvenue !","教材模式","/search"]){assert.ok(source.includes(text),`missing ${text}`);}
  for(const fictional of ["Je m’appelle…","C’est où ?"]){assert.equal(source.includes(fictional),false,`fictional content remains: ${fictional}`);}
});

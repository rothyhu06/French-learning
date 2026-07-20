import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const migrationUrl=new URL("../supabase/migrations/202607200001_textbook_grounding.sql",import.meta.url);

test("grounding migration adds compatible hierarchy and source tables", async()=>{
  const sql=await readFile(migrationUrl,"utf8");
  for(const fragment of ["create table if not exists public.textbook_pages","add column if not exists parent_id","add column if not exists node_type","create table if not exists public.source_blocks","create table if not exists public.content_source_links","create table if not exists public.textbook_search_index","pdf_page_index","source_bbox","verification_status"]){ assert.ok(sql.toLowerCase().includes(fragment),`missing ${fragment}`); }
  assert.equal(/drop\s+table|drop\s+column/i.test(sql),false,"migration must be non-destructive");
});

test("search and source link constraints cover approved entity types",async()=>{
  const sql=await readFile(migrationUrl,"utf8");
  for(const type of ["lesson","lesson_section","vocabulary","grammar","exercise","dialogue","expression","culture"]){ assert.ok(sql.includes(`'${type}'`),`missing entity type ${type}`); }
  assert.ok(sql.includes("verification_status = 'verified'"));
});

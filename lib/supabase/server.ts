import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { getSupabaseConfig } from "./config";

export function createSupabaseServerClient(cookieHeader = "") {
  const { url, anonKey } = getSupabaseConfig();
  const cookieMap = new Map(cookieHeader.split(";").map(part => { const [name,...rest]=part.trim().split("="); return [name,rest.join("=")]; }).filter(([name])=>name));
  return createServerClient<Database>(url, anonKey, { cookies: { getAll(){ return [...cookieMap].map(([name,value])=>({name,value})); }, setAll(){ /* Server components cannot persist response cookies. */ } } });
}

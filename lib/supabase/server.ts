import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { getSupabaseConfig } from "./config";

export function createSupabaseServerClient(cookieHeader = "") {
  const { url, anonKey } = getSupabaseConfig();
  const cookiePairs: Array<[string,string]> = cookieHeader.split(";").map(part => { const [name,...rest]=part.trim().split("="); return [name,rest.join("=")] as [string,string]; }).filter(([name])=>Boolean(name));
  const cookieMap = new Map<string,string>(cookiePairs);
  return createServerClient<Database>(url, anonKey, { cookies: { getAll(){ return [...cookieMap].map(([name,value])=>({name,value})); }, setAll(){ /* Server components cannot persist response cookies. */ } } });
}

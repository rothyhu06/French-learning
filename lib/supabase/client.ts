import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { getSupabaseConfig } from "./config";

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;
export function getSupabaseBrowserClient() {
  if (!client) { const { url, anonKey } = getSupabaseConfig(); client = createBrowserClient<Database>(url, anonKey); }
  return client;
}

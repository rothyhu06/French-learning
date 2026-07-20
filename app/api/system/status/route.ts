import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET() {
  return Response.json({ ok:true, database:{ provider:"supabase", configured:isSupabaseConfigured, mode:isSupabaseConfigured?"persistent":"local-static" }, phase:"textbook-grounding-trial", timestamp:new Date().toISOString() });
}

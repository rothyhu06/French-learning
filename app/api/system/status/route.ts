import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET() {
  return Response.json({ ok:true, database:{ provider:"supabase", configured:isSupabaseConfigured, mode:isSupabaseConfigured?"persistent":"demo-fallback" }, phase:2, timestamp:new Date().toISOString() });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { parseMaybeJsonOrEncrypted } from "@/lib/credentials/parse";

// Server-side Supabase client
function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(supabaseUrl, serviceKey)
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const connectorId = u.searchParams.get("connectorId")!;
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("credentials")
    .select("type,payload,payload_encrypted,format")
    .eq("connector_id", connectorId)
    .eq("type","kintone_config")
    .single();

  if (error) return NextResponse.json({ error }, { status: 400 });

  let parsed = null, parseErr = null;
  try {
    parsed = parseMaybeJsonOrEncrypted(data.payload ?? null, data.payload_encrypted ?? null);
    if (parsed?.client_secret) parsed.client_secret = "***";
  } catch (e: any) { parseErr = String(e.message || e); }

  return NextResponse.json({
    format: data.format || "auto-detect",
    payload_preview: typeof data.payload === "string" ? data.payload.slice(0, 120) : typeof data.payload,
    enc_preview: typeof data.payload_encrypted === "string" ? data.payload_encrypted.slice(0, 60) : typeof data.payload_encrypted,
    parsed, parseErr
  });
}

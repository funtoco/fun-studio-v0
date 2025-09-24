export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

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
    .select("id, type, format, payload, payload_encrypted")
    .eq("connector_id", connectorId);

  if (error) return NextResponse.json({ error }, { status: 400 });

  // Return only keys/structure, no secrets
  const safeData = data?.map(row => ({
    id: row.id,
    type: row.type,
    format: row.format,
    hasPayload: !!row.payload,
    hasPayloadEncrypted: !!row.payload_encrypted,
    payloadLength: row.payload?.length || 0,
    payloadEncryptedLength: row.payload_encrypted?.length || 0
  }));

  return NextResponse.json({
    connectorId,
    credentials: safeData
  });
}

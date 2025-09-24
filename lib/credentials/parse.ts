import { decryptJson } from "@/lib/crypto/secretStore";

function tryJson(s: string) {
  try { return JSON.parse(s); } catch { return null; }
}

function tryBase64Json(s: string) {
  try {
    const t = Buffer.from(s, "base64").toString("utf8");
    return tryJson(t);
  } catch { return null; }
}

function stripQuotes(s: string) {
  return s.replace(/^"+|"+$/g, "").trim();
}

export function parseMaybeJsonOrEncrypted(raw: unknown, rawEncrypted?: string) {
  // 1) kalau Supabase sudah kasih JSONB → ambil saja
  if (raw && typeof raw === "object") return raw as any;

  // 2) kalau text di 'payload'
  if (typeof raw === "string") {
    let s = raw.trim();

    // 2a) JSON langsung
    const j1 = tryJson(s);
    if (j1 && typeof j1 === "object") return j1;

    // 2b) JSON double-encoded (string di dalam string)
    // contoh: "\"{\\\"domain\\\":...}\""
    let twice = tryJson(s);
    if (typeof twice === "string") {
      const j2 = tryJson(twice);
      if (j2 && typeof j2 === "object") return j2;
    }

    // 2c) base64 JSON (kadang dibungkus tanda kutip)
    s = stripQuotes(s);
    const jb64 = tryBase64Json(s);
    if (jb64) return jb64;
  }

  // 3) kalau 'payload_encrypted' tipe bytea diekspor sebagai "\\x...."
  if (typeof rawEncrypted === "string" && rawEncrypted.startsWith("\\x")) {
    const bytes = Buffer.from(rawEncrypted.slice(2), "hex");
    // kadang bytea itu bukan cipher, tapi berisi teks base64 JSON
    const asUtf8 = bytes.toString("utf8");
    const jb64 = tryBase64Json(stripQuotes(asUtf8));
    if (jb64) return jb64;

    // terakhir: memang encrypted → decrypt
    const j = decryptJson(bytes);
    if (j && typeof j === "object") return j;
  }

  throw new Error("not valid JSON or encrypted format");
}

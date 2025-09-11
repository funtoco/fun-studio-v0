import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase環境変数が設定されていません。")
      console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl)
      console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "設定済み" : "未設定")
      
      // フォールバック用のダミークライアントを作成
      supabaseClient = createBrowserClient(
        "https://dummy.supabase.co",
        "dummy-key"
      )
    } else {
      supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
    }
  }
  return supabaseClient
}

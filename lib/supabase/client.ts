import { createBrowserClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

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

// Create Supabase client with service role key for admin operations
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase configuration: URL or Service Role Key is not set.')
    throw new Error("Admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables")
  }

  // Detect if this is a new API key format (sb_secret_...)
  const isNewApiKeyFormat = serviceRoleKey.startsWith('sb_secret_')
  
  if (isNewApiKeyFormat) {
    // New API key format - configure for server-side use only
    // Note: Secret keys cannot be used in browsers per Supabase docs
    return createSupabaseClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`
        }
      }
    })
  } else {
    // JWT format - use standard configuration (recommended for local development)
    return createSupabaseClient(supabaseUrl, serviceRoleKey)
  }
}

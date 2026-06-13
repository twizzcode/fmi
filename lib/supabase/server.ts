import { createClient } from "@supabase/supabase-js"

import { getSupabaseServerConfig } from "@/lib/supabase/config"

export function createSupabaseAdminClient() {
  const config = getSupabaseServerConfig()

  if (!config) {
    throw new Error(
      "Supabase Storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY."
    )
  }

  return createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

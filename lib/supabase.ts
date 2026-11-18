import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export const SITE_CACHE_TAG = "site-content";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  global: {
    // Cached by Next's Data Cache; purged by revalidateTag(SITE_CACHE_TAG) on admin saves
    fetch: (url, options = {}) => fetch(url, { ...options, next: { revalidate: 3600, tags: [SITE_CACHE_TAG] } }),
  },
});

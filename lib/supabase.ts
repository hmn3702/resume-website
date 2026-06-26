import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder";

/**
 * Public browser client — uses anon key + RLS.
 * Safe to import in both Server Components and Client Components.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Admin browser client — same anon key but exported separately so it's
 * easy to swap for a service-role key later if needed.
 * Use this in admin client components (mutations).
 */
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseAnonKey);

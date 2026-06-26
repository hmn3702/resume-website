import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. " +
      "Copy .env.local.example to .env.local and fill in your keys."
  );
}

/** Browser / server-component client (uses anon key + RLS) */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

import { createClient } from "@supabase/supabase-js";

/**
 * Klien Supabase (publik/anon).
 * URL & anon key aman dipakai di client — proteksi data diatur lewat RLS di Supabase.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export const supabaseReady = Boolean(supabaseUrl && supabaseAnonKey);

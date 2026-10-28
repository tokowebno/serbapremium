import { createClient } from "@supabase/supabase-js";

/**
 * Klien Supabase (publik/anon).
 * URL & anon key aman dipakai di client â€” proteksi data diatur lewat RLS di Supabase.
 */
const defaultUrl = "https://mxkgyxiwbavoxiqeivom.supabase.co";
const defaultKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14a2d5eGl3YmF2b3hpcWVpdm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzk3NDAsImV4cCI6MjEwMzkxNTc0MH0.Z3aEBO_gFP--fO5eXXsuad2Vk7cETxwfseHdq92zydg";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || defaultUrl;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export const supabaseReady = Boolean(supabaseUrl && supabaseAnonKey);
/**
 * Supabase Client - CDN-based initialization
 * The @supabase/supabase-js library is loaded via CDN in index.html
 * and exposes a global `supabase` object.
 */

// Access the global supabase object loaded via CDN
declare global {
  interface Window {
    supabase: {
      createClient: (url: string, key: string) => any;
    };
  }
}

const SUPABASE_URL = 'https://lwdgrndzgkgrkwjradkm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZGdybmR6Z2tncmt3anJhZGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMjc1NjQsImV4cCI6MjA5NDcwMzU2NH0.hZnhhkzR2HEZJzSDuXTbdwXMsevR3vA_h0VPHp54gT4';

const { createClient } = window.supabase;
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

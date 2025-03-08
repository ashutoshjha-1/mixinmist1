
import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase-types';

const SUPABASE_URL = "https://zevuqoiqmlkudholotmp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpldnVxb2lxbWxrdWRob2xvdG1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MTI0ODUsImV4cCI6MjA1MTQ4ODQ4NX0.LGSla9lrsF2ccfnOqPtP6f-VPo1f94lpq9SxaYGAqcs";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

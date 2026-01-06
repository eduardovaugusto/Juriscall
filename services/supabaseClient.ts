
import { createClient } from '@supabase/supabase-js';

// No Vercel, estas chaves serão lidas das Environment Variables configuradas no dashboard.
// Os valores abaixo são mantidos como fallback caso não existam no ambiente.
const supabaseUrl = process.env.SUPABASE_URL || 'https://bkfqefavhzjfehizqvdy.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrZnFlZmF2aHpqZmVoaXpxdmR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NzY4ODYsImV4cCI6MjA4MzI1Mjg4Nn0.zra96a3EQvwi5Qy3_8fdbjdBhmcWBwj_geUkP1qverg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

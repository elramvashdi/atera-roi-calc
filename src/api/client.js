import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project credentials
const supabaseUrl = 'https://khgbkhkpgdbjzcybvolv.supabase.co';
const supabaseAnonKey = 'sb_publishable_yOE5Evu0IHhjCtRc1h3tYw_Zoi7urrW';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
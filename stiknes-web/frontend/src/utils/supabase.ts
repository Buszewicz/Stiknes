import { createClient } from '@supabase/supabase-js';
import { APP_CONSTANTS } from './constants';

const supabaseUrl = APP_CONSTANTS.SUPABASE_URL;
const supabaseAnonKey = APP_CONSTANTS.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
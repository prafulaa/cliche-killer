import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321'; // Default for local dev/test
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key';

export const supabase = createClient(supabaseUrl, supabaseKey);

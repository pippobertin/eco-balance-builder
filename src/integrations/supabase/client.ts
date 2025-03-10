
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvjgziihekwjyzihjihx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2amd6aWloZWt3anl6aWhqaWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MDU4MzIsImV4cCI6MjA1NzE4MTgzMn0.rrTCmkxGFX7mEZemMqWVoOMdPTJsptPGCZr37dyhG14';

export const supabase = createClient(supabaseUrl, supabaseKey);


// This file re-exports all Supabase client functionality from the new structure
import { supabase } from './core/supabaseClient';
import { withRetry } from './utils/retryUtils';
import { debounce } from './utils/debounceUtils';
import { handleSupabaseError } from './utils/errorUtils';

export { 
  supabase, 
  withRetry, 
  debounce, 
  handleSupabaseError 
};

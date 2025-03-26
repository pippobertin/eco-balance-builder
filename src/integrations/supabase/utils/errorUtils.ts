
import { PostgrestError } from '@supabase/supabase-js';
import { toast } from 'sonner';

/**
 * Handles Supabase errors in a consistent way
 * @param error The Supabase error object
 * @param defaultMessage Default message to show if error doesn't have a message
 * @returns Whether the error was handled
 */
export const handleSupabaseError = (
  error: PostgrestError | null | unknown,
  defaultMessage = 'Si è verificato un errore'
): boolean => {
  if (!error) return false;

  let errorMessage = defaultMessage;

  if (typeof error === 'object' && error !== null) {
    // Check if it's a PostgrestError
    const postgrestError = error as PostgrestError;
    if (postgrestError.message) {
      errorMessage = postgrestError.message;
      
      // Special handling for specific error codes
      if (postgrestError.code === 'PGRST116') {
        // Not found error, usually expected
        return false;
      }
      
      if (postgrestError.code === '23505') {
        errorMessage = 'Questo record esiste già nel database';
      }
    }
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  console.error('Supabase error:', error);
  toast.error(errorMessage);
  return true;
};

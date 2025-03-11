
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvjgziihekwjyzihjihx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2amd6aWloZWt3anl6aWhqaWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MDU4MzIsImV4cCI6MjA1NzE4MTgzMn0.rrTCmkxGFX7mEZemMqWVoOMdPTJsptPGCZr37dyhG14';

// Create a function to retry Supabase operations on network failures
const withRetry = async (operation, maxRetries = 5, initialDelay = 1000) => {
  let retries = 0;
  let lastError;
  
  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Operation failed (attempt ${retries + 1}/${maxRetries}):`, error.message || error);
      lastError = error;
      
      // Check if it's a network error or if we should retry regardless
      const isNetworkError = 
        error.message === 'Failed to fetch' || 
        error.code === 'NETWORK_ERROR' ||
        error.message?.includes('network') ||
        error.message?.includes('connection');
      
      if (!isNetworkError && retries >= 2) {
        // Only retry non-network errors twice
        throw error;
      }
      
      retries++;
      
      if (retries >= maxRetries) {
        console.error('Max retries reached, giving up');
        throw lastError;
      }
      
      // Exponential backoff with jitter
      const delay = initialDelay * Math.pow(1.5, retries) * (0.9 + Math.random() * 0.2);
      console.log(`Retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

export const supabase = createClient(supabaseUrl, supabaseKey);

// Export the retry utility for use in other files
export { withRetry };


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvjgziihekwjyzihjihx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2amd6aWloZWt3anl6aWhqaWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MDU4MzIsImV4cCI6MjA1NzE4MTgzMn0.rrTCmkxGFX7mEZemMqWVoOMdPTJsptPGCZr37dyhG14';

// Create a function to retry Supabase operations on network failures
const withRetry = async (operation, maxRetries = 3, delay = 1000) => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      if (error.message === 'Failed to fetch' && retries < maxRetries - 1) {
        console.log(`Network error, retrying operation (${retries + 1}/${maxRetries})...`);
        retries++;
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

export const supabase = createClient(supabaseUrl, supabaseKey);

// Export the retry utility for use in other files
export { withRetry };

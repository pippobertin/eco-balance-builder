
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvjgziihekwjyzihjihx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2amd6aWloZWt3anl6aWhqaWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MDU4MzIsImV4cCI6MjA1NzE4MTgzMn0.rrTCmkxGFX7mEZemMqWVoOMdPTJsptPGCZr37dyhG14';

// Track ongoing requests to prevent simultaneous identical requests
const ongoingRequests = new Map();

// Create and export the Supabase client directly
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: (...args) => {
      // Add a custom timeout to fetch requests
      const [input, init = {}] = args;
      
      // Generate a request key based on the URL and method
      const requestKey = typeof input === 'string' 
        ? `${init.method || 'GET'}-${input}` 
        : `${init.method || 'GET'}-${input.url}`;
      
      // If an identical request is already in progress, return a promise that resolves
      // when the original request completes
      if (ongoingRequests.has(requestKey)) {
        console.log(`Request ${requestKey} already in progress, waiting for completion`);
        return ongoingRequests.get(requestKey);
      }
      
      // Create a new fetch promise with timeout
      const fetchPromise = fetch(input, {
        ...init,
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });
      
      // Store the promise in the ongoing requests map
      ongoingRequests.set(requestKey, fetchPromise);
      
      // When the promise resolves or rejects, remove it from the map
      fetchPromise.finally(() => {
        ongoingRequests.delete(requestKey);
      });
      
      return fetchPromise;
    },
  },
});

// Improved retry logic with better error handling
// Added request deduplication to prevent multiple identical requests
export const withRetry = async (operation, maxRetries = 3, initialDelay = 500) => {
  let retries = 0;
  let lastError;
  
  // Generate a unique key for this operation to identify it
  const operationKey = operation.toString().slice(0, 50);
  
  while (retries < maxRetries) {
    try {
      console.log(`Executing operation ${operationKey} (attempt ${retries + 1}/${maxRetries})`);
      return await operation();
    } catch (error) {
      // Add more detailed error logging
      console.error(`Operation ${operationKey} failed (attempt ${retries + 1}/${maxRetries}):`, error.message || error);
      lastError = error;
      
      // Check if it's a network error or if we should retry regardless
      const isNetworkError = 
        error.message === 'Failed to fetch' || 
        error.code === 'NETWORK_ERROR' ||
        error.message?.includes('network') ||
        error.message?.includes('connection') ||
        error.code === 'TIMEOUT' ||
        error.name === 'AbortError';
      
      if (!isNetworkError && retries >= 1) {
        // Only retry non-network errors once
        throw error;
      }
      
      retries++;
      
      if (retries >= maxRetries) {
        console.error(`Max retries reached for operation ${operationKey}, giving up`);
        throw lastError;
      }
      
      // Exponential backoff with jitter
      const delay = initialDelay * Math.pow(1.5, retries) * (0.9 + Math.random() * 0.2);
      console.log(`Retrying operation ${operationKey} in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

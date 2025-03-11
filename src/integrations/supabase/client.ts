
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
        return ongoingRequests.get(requestKey).then(async response => {
          // Must clone the response so multiple readers can consume it
          return response.clone();
        });
      }
      
      // Create a new fetch promise with timeout
      const fetchPromise = new Promise((resolve, reject) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          reject(new Error('Request timeout after 15 seconds'));
        }, 15000);
        
        fetch(input, {
          ...init,
          signal: controller.signal,
        })
        .then(response => {
          clearTimeout(timeoutId);
          resolve(response);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
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
export const withRetry = async (operation, maxRetries = 3, initialDelay = 500) => {
  let retries = 0;
  let lastError;
  
  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      const isNetworkError = 
        error.message === 'Failed to fetch' || 
        error.code === 'NETWORK_ERROR' ||
        error.message?.includes('network') ||
        error.message?.includes('connection') ||
        error.message?.includes('body stream already read') ||
        error.code === 'TIMEOUT' ||
        error.name === 'AbortError';
      
      // Always retry network errors, but only retry other errors once
      if (!isNetworkError && retries >= 1) {
        throw error;
      }
      
      retries++;
      
      if (retries >= maxRetries) {
        console.error(`Max retries reached, giving up`);
        throw lastError;
      }
      
      const delay = initialDelay * Math.pow(1.5, retries) * (0.9 + Math.random() * 0.2);
      console.log(`Retrying operation in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Create a utility to debounce function calls
export const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

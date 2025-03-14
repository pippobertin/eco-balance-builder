
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
      let requestKey;
      if (typeof input === 'string') {
        requestKey = `${init.method || 'GET'}-${input}`;
      } else {
        requestKey = `${init.method || 'GET'}-${input.url}`;
      }
      
      // Add body to the request key if it exists (for POST/PUT/PATCH requests)
      if (init.body) {
        try {
          // If body is JSON, add it to the key
          const bodyStr = typeof init.body === 'string' ? init.body : JSON.stringify(init.body);
          requestKey += `-${bodyStr}`;
        } catch (e) {
          // If body can't be stringified, use a hash of it
          requestKey += `-${String(init.body).length}`;
        }
      }
      
      // Hash the request key if it's too long to avoid memory leaks
      if (requestKey.length > 512) {
        requestKey = requestKey.substring(0, 100) + '-' + requestKey.length;
      }
      
      // If an identical request is already in progress, return a promise that resolves
      // when the original request completes
      if (ongoingRequests.has(requestKey)) {
        console.log(`Request ${requestKey.substring(0, 30)}... already in progress, waiting for completion`);
        return ongoingRequests.get(requestKey).then(response => {
          // Create a new response object by cloning all the properties
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          });
        });
      }
      
      // Create a new fetch promise with timeout
      const fetchPromise = new Promise((resolve, reject) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          reject(new Error('Request timeout after 8 seconds'));
        }, 8000); // Reduced from 10s to 8s
        
        fetch(input, {
          ...init,
          signal: controller.signal,
        })
        .then(response => {
          clearTimeout(timeoutId);
          // Store a clone of the response to reuse if needed
          const clonedResponse = response.clone();
          resolve(clonedResponse);
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
        setTimeout(() => {
          ongoingRequests.delete(requestKey);
        }, 100); // Small delay to ensure all cloning operations are complete
      });
      
      return fetchPromise;
    },
  },
});

// Improved retry logic with better error handling
export const withRetry = async (operation, maxRetries = 2, initialDelay = 300) => {
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
        error.message?.includes('clone') ||
        error.message?.includes('Response body is already used') ||
        error.message?.includes('timeout') ||
        error.code === 'TIMEOUT' ||
        error.name === 'AbortError';
      
      // Always retry network errors, but only retry other errors once
      if (!isNetworkError && retries >= 1) {
        throw error;
      }
      
      retries++;
      
      if (retries >= maxRetries) {
        console.error(`Max retries (${maxRetries}) reached, giving up`);
        throw lastError;
      }
      
      const delay = initialDelay * Math.pow(1.5, retries) * (0.9 + Math.random() * 0.2);
      console.log(`Retrying operation in ${Math.round(delay)}ms... (attempt ${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Create a utility to debounce function calls with immediate option
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function(...args) {
    const context = this;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

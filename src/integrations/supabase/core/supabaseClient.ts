
import { createClient } from '@supabase/supabase-js';
import { ongoingRequests } from '../utils/requestCache';

const supabaseUrl = 'https://xvjgziihekwjyzihjihx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2amd6aWloZWt3anl6aWhqaWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MDU4MzIsImV4cCI6MjA1NzE4MTgzMn0.rrTCmkxGFX7mEZemMqWVoOMdPTJsptPGCZr37dyhG14';

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

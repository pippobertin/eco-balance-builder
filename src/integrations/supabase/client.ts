
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

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

// Improved retry logic with exponential backoff and better error handling
export const withRetry = async (operation, maxRetries = 3, initialDelay = 500) => {
  let retries = 0;
  let lastError;
  let retryDelay = initialDelay;
  
  // Check if Supabase is reporting service issues
  let isServiceIssue = false;
  
  while (retries <= maxRetries) {
    try {
      if (retries > 0) {
        console.log(`Tentativo ${retries}/${maxRetries} dopo ${Math.round(retryDelay)}ms...`);
      }
      
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Log all errors for debugging
      console.error(`Errore durante l'operazione (tentativo ${retries}/${maxRetries}):`, error);
      
      // Check if this is likely a service issue
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
      
      const isServerError = 
        error.status >= 500 || 
        error.code === 'PGRST116' || // Postgres REST API error
        error.message?.includes('too many connections') ||
        error.message?.includes('database connection') ||
        error.message?.includes('rate limit');
      
      // Mark as service issue if we see a pattern
      if ((isNetworkError || isServerError) && retries >= 1) {
        isServiceIssue = true;
      }
      
      // Only retry:
      // 1. Network errors (connectivity issues)
      // 2. Server errors (500s)
      // 3. Rate limiting issues
      // Don't retry client errors (400s) except specific cases
      if (!isNetworkError && !isServerError && !error.message?.includes('rate limit')) {
        const statusCode = error.status || (error.error?.status) || 0;
        // Don't retry 4xx errors except 408 (timeout), 429 (rate limit)
        if (statusCode >= 400 && statusCode < 500 && statusCode !== 408 && statusCode !== 429) {
          console.log(`Errore client (${statusCode}), non verrà ritentato:`, error.message);
          throw error;
        }
      }
      
      retries++;
      
      if (retries > maxRetries) {
        // If this appears to be a service issue, show a helpful toast message
        if (isServiceIssue) {
          toast({
            title: "Problemi di connessione con Supabase",
            description: "Supabase sta attualmente riscontrando problemi. Riprova più tardi.",
            variant: "destructive",
            duration: 5000
          });
          console.error("Problema del servizio Supabase rilevato dopo più tentativi");
        }
        
        console.error(`Numero massimo di tentativi (${maxRetries}) raggiunto, operazione fallita`);
        throw lastError;
      }
      
      // Exponential backoff with jitter
      retryDelay = initialDelay * Math.pow(1.5, retries) * (0.9 + Math.random() * 0.2);
      console.log(`Nuovo tentativo tra ${Math.round(retryDelay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
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

// Utility to handle common Supabase errors and show appropriate user notifications
export const handleSupabaseError = (error, customMessage = "Si è verificato un errore") => {
  console.error("Supabase error:", error);
  
  // Extract error message
  let errorMessage = customMessage;
  
  if (error.message) {
    errorMessage = error.message;
  } else if (error.error?.message) {
    errorMessage = error.error.message;
  }
  
  // Format error message for user display
  if (errorMessage.includes("network") || errorMessage.includes("connection") || 
      errorMessage.includes("Failed to fetch") || errorMessage.includes("timeout")) {
    toast({
      title: "Errore di connessione",
      description: "Verifica la tua connessione internet e riprova.",
      variant: "destructive"
    });
  } else if (errorMessage.includes("rate limit") || errorMessage.includes("too many requests")) {
    toast({
      title: "Troppe richieste",
      description: "Hai effettuato troppe richieste. Attendi qualche momento e riprova.",
      variant: "destructive"
    });
  } else if (error.status >= 500 || errorMessage.includes("server error")) {
    toast({
      title: "Errore del server",
      description: "Supabase sta riscontrando problemi. Riprova più tardi.",
      variant: "destructive"
    });
  } else {
    // Generic error
    toast({
      title: "Si è verificato un errore",
      description: errorMessage.substring(0, 100), // Limit message length
      variant: "destructive"
    });
  }
  
  return error;
};

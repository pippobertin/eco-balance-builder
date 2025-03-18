
import { toast } from '@/hooks/use-toast';

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

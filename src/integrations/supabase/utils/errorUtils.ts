
import { toast } from '@/hooks/use-toast';

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

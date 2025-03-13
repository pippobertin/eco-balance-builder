
import { useToast } from '@/hooks/use-toast';

/**
 * Handle errors that occur during issue processing
 */
export const handleProcessingError = (
  error: unknown,
  tabId: string, 
  updatingRef: React.MutableRefObject<boolean>,
  toast: ReturnType<typeof useToast>['toast']
) => {
  console.error(`useThemeProcessing [${tabId}]: Error in theme processing:`, error);
  updatingRef.current = false;
  toast({
    title: "Errore nell'elaborazione",
    description: "Si è verificato un errore durante l'elaborazione dei temi. Riprova o ricarica la pagina.",
    variant: "destructive"
  });
};

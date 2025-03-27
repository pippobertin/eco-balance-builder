
import { useState } from 'react';
import { toast } from 'sonner';

interface UseSaveIndicatorProps {
  saveOperation: () => Promise<boolean | void>;
  setLastSaved?: React.Dispatch<React.SetStateAction<Date | null>>;
}

export const useSaveIndicator = ({ 
  saveOperation, 
  setLastSaved 
}: UseSaveIndicatorProps) => {
  const [isSaving, setIsSaving] = useState(false);
  
  const saveWithFeedback = async (): Promise<boolean> => {
    setIsSaving(true);
    
    try {
      const result = await saveOperation();
      const success = result !== false;
      
      // Update last saved timestamp if provided
      if (success && setLastSaved) {
        const now = new Date();
        setLastSaved(now);
      }
      
      // Show success toast
      if (success) {
        toast.success("Salvato con successo");
      }
      
      return success;
    } catch (error) {
      console.error("Error saving data:", error);
      
      // Show error toast
      toast.error("Errore durante il salvataggio", {
        description: "Si è verificato un errore durante il salvataggio dei dati"
      });
      
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  return { saveWithFeedback, isSaving };
};

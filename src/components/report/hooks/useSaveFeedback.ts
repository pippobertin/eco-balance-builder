
import { useState } from 'react';
import { toast } from 'sonner';

interface UseSaveFeedbackProps {
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>;
  saveOperation: () => Promise<void>;
}

export const useSaveFeedback = ({ setLastSaved, saveOperation }: UseSaveFeedbackProps) => {
  const [isSaving, setIsSaving] = useState(false);
  
  const saveWithFeedback = async (): Promise<boolean> => {
    setIsSaving(true);
    
    try {
      await saveOperation();
      
      // Update last saved timestamp
      const now = new Date();
      setLastSaved(now);
      
      // Show success toast
      toast.success("Salvato con successo");
      
      return true;
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

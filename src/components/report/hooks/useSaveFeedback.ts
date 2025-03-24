
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export type SaveFeedbackProps = {
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>;
  saveOperation: () => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
};

export const useSaveFeedback = ({
  setLastSaved,
  saveOperation,
  successMessage = 'Dati salvati con successo',
  errorMessage = 'Errore durante il salvataggio'
}: SaveFeedbackProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const saveWithFeedback = useCallback(async () => {
    if (isSaving) return;
    
    setIsSaving(true);

    try {
      await saveOperation();
      
      // Update last saved timestamp
      setLastSaved(new Date());
      
      // Show success toast
      toast.success(successMessage);
    } catch (error) {
      console.error('Error in save operation:', error);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }, [saveOperation, setLastSaved, successMessage, errorMessage, isSaving]);

  return { saveWithFeedback, isSaving };
};
